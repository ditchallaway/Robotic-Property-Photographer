import { useEffect, useRef } from 'react';

export default function PhotoAgent({ viewer, Cesium }) {
    const isRunning = useRef(false);

    // Helper: Filter street labels visible in camera frustum
    function filterVisibleLabels(viewer, allLabels, camera) {
        if (!allLabels || allLabels.length === 0) return [];

        const frustum = camera.frustum;
        const cullingVolume = frustum.computeCullingVolume(
            camera.positionWC,
            camera.directionWC,
            camera.upWC
        );

        return allLabels.filter(label => {
            const position = Cesium.Cartesian3.fromDegrees(
                parseFloat(label.longitude),
                parseFloat(label.latitude),
                0
            );

            // 1. Check if in camera frustum
            const visibility = cullingVolume.computeVisibility(
                new Cesium.BoundingSphere(position, 1.0)
            );
            if (visibility === Cesium.Intersect.OUTSIDE) return false;

            // 2. Distance check (readable threshold - e.g. 500m)
            const distance = Cesium.Cartesian3.distance(position, camera.positionWC);
            if (distance > 500) return false;

            // 3. Behind-camera check (screen space projection)
            const screenPos = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
                viewer.scene, position
            );
            // If undefined, it's behind the camera or off-screen
            if (!screenPos) return false;

            // 4. Check if strictly within viewport bounds (0,0 to width,height)
            const { width, height } = viewer.scene.canvas;
            if (screenPos.x < 0 || screenPos.x > width || screenPos.y < 0 || screenPos.y > height) {
                return false;
            }

            return true;
        });
    }

    // New Helper: Check if the frame is valid (not blank/black)
    const checkFrameValidity = (viewer) => {
        const gl = viewer.scene.context._gl;
        const width = gl.drawingBufferWidth;
        const height = gl.drawingBufferHeight;

        // Read a 5x5 pixel sample from the center
        const sampleSize = 5;
        const pixels = new Uint8Array(sampleSize * sampleSize * 4);
        const x = Math.floor((width - sampleSize) / 2);
        const y = Math.floor((height - sampleSize) / 2);

        gl.readPixels(x, y, sampleSize, sampleSize, gl.RGBA, gl.UNSIGNED_BYTE, pixels);

        let nonBlackCount = 0;
        for (let i = 0; i < pixels.length; i += 4) {
            // Check if pixel is NOT (0,0,0,255) typically
            // Also check for transparency just in case
            const r = pixels[i];
            const g = pixels[i + 1];
            const b = pixels[i + 2];
            const a = pixels[i + 3];

            if (a === 0) continue; // Transparent
            if (r > 10 || g > 10 || b > 10) { // Slight tolerance for "not black"
                nonBlackCount++;
            }
        }

        // If more than 50% of sampled pixels are non-black, we consider it valid-ish
        return nonBlackCount > (pixels.length / 4) * 0.5;
    };


    const runMission = async () => {
        if (!viewer || isRunning.current) return;
        const data = window.__MISSION_DATA__;
        if (!data) return;
        isRunning.current = true;

        // 1. Ingest: Convert Geometry to Entities (Section 5)
        const coords = data.geometry.coordinates[0].flat();
        const positions = Cesium.Cartesian3.fromDegreesArray(coords);

        // Visual Upgrade: Yellow Boundary
        viewer.entities.add({
            polyline: {
                positions: positions,
                width: 5, // Thicker for visibility
                clampToGround: true,
                material: Cesium.Color.YELLOW // As requested
            }
        });

        // Create BoundingSphere for Auto-Framing (Section 6)
        const boundingSphere = Cesium.BoundingSphere.fromPoints(positions);
        // Fix: Sample terrain height for accurate centroid/label placement
        const centroidCarto = Cesium.Cartographic.fromDegrees(data.centroid[0], data.centroid[1]);
        const terrainHeight = viewer.scene.globe.getHeight(centroidCarto);
        const effectiveHeight = (terrainHeight !== undefined) ? terrainHeight : data.centroid_elevation;

        // Define origin using the BEST available height
        const origin = Cesium.Cartesian3.fromDegrees(data.centroid[0], data.centroid[1], effectiveHeight);

        // Update BoundingSphere center to use this effective height for better framing
        boundingSphere.center = origin;

        const shotList = [
            // Fix: Restore Birds-Eye View (Nadir) per user request
            { name: 'nadir', heading: 0, pitch: -90 },
            { name: 'north', heading: 0, pitch: -24 },
            { name: 'east', heading: 90, pitch: -24 },
            { name: 'south', heading: 180, pitch: -24 },
            { name: 'west', heading: 270, pitch: -24 }
        ];

        // Pillar 1: Set FOV to 100 degrees per user rule
        viewer.camera.frustum.fov = Cesium.Math.toRadians(100);

        for (const shot of shotList) {
            // Pillar 1: Auto-Framing with range 0.0
            viewer.camera.flyToBoundingSphere(boundingSphere, {
                offset: new Cesium.HeadingPitchRange(
                    Cesium.Math.toRadians(shot.heading),
                    Cesium.Math.toRadians(shot.pitch),
                    boundingSphere.radius * 2.0 // Back up to 2.0x radius (vs ~1.3x auto-fit)
                ),
                duration: 0 // Headless instant jump
            });

            // Section 7: Force Max Detail
            viewer.scene.globe.maximumScreenSpaceError = 1.0;

            // Quality Control Loop
            let attempts = 0;
            const MAX_ATTEMPTS = 5;
            let captured = false;

            while (attempts < MAX_ATTEMPTS && !captured) {
                // Wait for loading
                await new Promise(r => setTimeout(r, 500 + (attempts * 500))); // Backoff

                // Wait for tiles to load
                await new Promise(resolve => {
                    let stableCycles = 0;
                    const check = setInterval(() => {
                        if (viewer.scene.globe.tilesLoaded) {
                            stableCycles++;
                            if (stableCycles > 2) { clearInterval(check); resolve(); }
                        } else {
                            stableCycles = 0;
                        }
                    }, 200);
                    // Safety timeout for this check
                    setTimeout(() => { clearInterval(check); resolve(); }, 10000);
                });

                // Render Check
                viewer.scene.render();
                const isValid = checkFrameValidity(viewer);

                if (isValid) {
                    captured = true;
                    console.log(`[BROWSER] QC Passed for ${shot.name}`);
                } else {
                    console.warn(`[BROWSER] QC Failed for ${shot.name} (Attempt ${attempts + 1}/${MAX_ATTEMPTS}). Retrying...`);
                    attempts++;
                    viewer.scene.requestRender();
                }
            }

            if (!captured) {
                console.error(`[BROWSER] CRITICAL: Failed to generate valid frame for ${shot.name} after ${MAX_ATTEMPTS} attempts.`);
            }

            // Pillar 4: Sidecar Ground-Plane Export
            try {
                // Origin and ENU frame are already defined above using effectiveHeight
                const enu = Cesium.Transforms.eastNorthUpToFixedFrame(origin);
                const invEnu = Cesium.Matrix4.inverse(enu, new Cesium.Matrix4());

                const camera = viewer.camera;
                const rotEnu = Cesium.Matrix4.getMatrix3(enu, new Cesium.Matrix3());
                const invRotEnu = Cesium.Matrix3.transpose(rotEnu, new Cesium.Matrix3());

                const boundary_3d = data.geometry.coordinates[0].map(coord => {
                    const world = Cesium.Cartesian3.fromDegrees(coord[0], coord[1], coord[2] || 0);
                    const local = Cesium.Matrix4.multiplyByPoint(invEnu, world, new Cesium.Cartesian3());
                    return [local.x, local.y, local.z];
                });

                const camPosLocal = Cesium.Matrix4.multiplyByPoint(invEnu, camera.positionWC, new Cesium.Cartesian3());
                const camDirLocal = Cesium.Matrix3.multiplyByVector(invRotEnu, camera.directionWC, new Cesium.Cartesian3());
                const camUpLocal = Cesium.Matrix3.multiplyByVector(invRotEnu, camera.upWC, new Cesium.Cartesian3());
                const camRightLocal = Cesium.Matrix3.multiplyByVector(invRotEnu, camera.rightWC, new Cesium.Cartesian3());

                const sidecar = {
                    viewName: shot.name,
                    metadata: {
                        coordinate_system: "ENU (East-North-Up)",
                        up_axis: "Z",
                        units: "meters",
                        acres: data.acres || "N/A",  // Real acreage from n8n
                        customer_id: data.customer_id,
                        order_id: data.order_id,
                        origin_wgs84: {
                            longitude: data.centroid[0],
                            latitude: data.centroid[1],
                            elevation_meters: data.centroid_elevation
                        },
                        cesium_version: Cesium.VERSION
                    },
                    origin: { x: origin.x, y: origin.y, z: origin.z },
                    enu_axes: {
                        east: { x: enu[0], y: enu[1], z: enu[2] },
                        north: { x: enu[4], y: enu[5], z: enu[6] },
                        up: { x: enu[8], y: enu[9], z: enu[10] }
                    },
                    boundary_3d,
                    labels: filterVisibleLabels(viewer, data.streetLabels || [], camera).map(lbl => {
                        // Transform label WGS84 -> World -> Local ENU position
                        // Fix: Sample terrain height for labels too
                        const lblCarto = Cesium.Cartographic.fromDegrees(lbl.longitude, lbl.latitude);
                        const lblHeight = viewer.scene.globe.getHeight(lblCarto);
                        const effectiveLblHeight = (lblHeight !== undefined) ? lblHeight : 0;

                        const posWorld = Cesium.Cartesian3.fromDegrees(lbl.longitude, lbl.latitude, effectiveLblHeight);
                        const posLocal = Cesium.Matrix4.multiplyByPoint(invEnu, posWorld, new Cesium.Cartesian3());

                        // Visual Upgrade: Geometos font for Sidecar consumers (if they use it)
                        // This JSON is for downstream, but we also style entities in-viewer if we were rendering them directly.
                        // Since this code *exports* data for n8n/Post-processing, the font choice here is metadata.
                        // However, if we draw labels IN Cesium for the screenshot:
                        return {
                            text: lbl.label_text || lbl.street_name,
                            style: "Geometos",
                            anchor_3d: [posLocal.x, posLocal.y, posLocal.z]
                        };
                    }),
                    camera: {
                        world: {
                            position: { x: camera.positionWC.x, y: camera.positionWC.y, z: camera.positionWC.z },
                            direction: { x: camera.directionWC.x, y: camera.directionWC.y, z: camera.directionWC.z },
                            up: { x: camera.upWC.x, y: camera.upWC.y, z: camera.upWC.z },
                            right: { x: camera.rightWC.x, y: camera.rightWC.y, z: camera.rightWC.z }
                        },
                        local_enu: {
                            position: { x: camPosLocal.x, y: camPosLocal.y, z: camPosLocal.z },
                            direction: { x: camDirLocal.x, y: camDirLocal.y, z: camDirLocal.z },
                            up: { x: camUpLocal.x, y: camUpLocal.y, z: camUpLocal.z },
                            right: { x: camRightLocal.x, y: camRightLocal.y, z: camRightLocal.z }
                        }
                    },
                    matrices: {
                        view: Array.from(camera.viewMatrix),
                        projection: Array.from(camera.frustum.projectionMatrix)
                    },
                    viewport: {
                        width: viewer.scene.canvas.width,
                        height: viewer.scene.canvas.height
                    }
                };

                // Emit SIDECAR_DATA as separate console arguments for Puppeteer msg.args()
                // Explicitly stringify and parse to ensure clean serialization
                const serializedSidecar = JSON.parse(JSON.stringify(sidecar));
                console.log('SIDECAR_DATA', shot.name, serializedSidecar);
            } catch (err) {
                console.error('Sidecar Error:', err);
            }

            console.log(`CAPTURE_FRAME:${shot.name}`);
            await new Promise(r => setTimeout(r, 1000)); // Buffer for Puppeteer screenshot
        }

        console.log("MISSION_COMPLETE");
    };

    useEffect(() => { runMission(); }, [viewer]);
    return null;
}