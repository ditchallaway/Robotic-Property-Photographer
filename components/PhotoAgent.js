import { useEffect, useRef } from 'react';

export default function PhotoAgent({ viewer, Cesium }) {
    const isRunning = useRef(false);

    const runMission = async () => {
        if (!viewer || isRunning.current) return;
        const data = window.__MISSION_DATA__;
        if (!data) return;
        isRunning.current = true;

        // 1. Ingest: Convert Geometry to Entities (Section 5)
        const coords = data.geometry.coordinates[0].flat();
        const positions = Cesium.Cartesian3.fromDegreesArray(coords);

        viewer.entities.add({
            polyline: {
                positions: positions,
                width: 3,
                clampToGround: true,
                material: Cesium.Color.YELLOW
            }
        });

        // Create BoundingSphere for Auto-Framing (Section 6)
        const boundingSphere = Cesium.BoundingSphere.fromPoints(positions);
        boundingSphere.center = Cesium.Cartesian3.fromDegrees(data.centroid[0], data.centroid[1], data.centroid_elevation);

        const shotList = [
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

            // Wait for tilesLoaded === true (Section 7)
            // Fix: Add initial delay to ensure requests have started (Cold Start Fix)
            await new Promise(r => setTimeout(r, 500));

            await new Promise(resolve => {
                let stableCycles = 0;
                let totalWait = 0;
                const check = setInterval(() => {
                    const loaded = viewer.scene.globe.tilesLoaded;
                    totalWait += 500;
                    console.log(`[BROWSER] Stability Check (${shot.name}): tilesLoaded=${loaded}, stableCycles=${stableCycles}, wait=${totalWait}ms`);
                    if (loaded) {
                        stableCycles++;
                        if (stableCycles > 2) {
                            clearInterval(check);
                            resolve();
                        }
                    } else {
                        stableCycles = 0;
                    }

                    // Safety Cap: 60 seconds per view
                    if (totalWait > 60000) {
                        console.warn(`[BROWSER] Safety Timeout reached for ${shot.name}. Capturing anyway.`);
                        clearInterval(check);
                        resolve();
                    }
                }, 500);
            });

            // Brief settle for the preserveDrawingBuffer
            await new Promise(r => setTimeout(r, 500));

            // Pillar 4: Sidecar Ground-Plane Export
            try {
                const origin = Cesium.Cartesian3.fromDegrees(data.centroid[0], data.centroid[1], data.centroid_elevation);
                const enu = Cesium.Transforms.eastNorthUpToFixedFrame(origin);
                const invEnu = Cesium.Matrix4.inverse(enu, new Cesium.Matrix4());

                const boundary_2d = data.geometry.coordinates[0].map(coord => {
                    const world = Cesium.Cartesian3.fromDegrees(coord[0], coord[1]);
                    const local = Cesium.Matrix4.multiplyByPoint(invEnu, world, new Cesium.Cartesian3());
                    return [local.x, local.y];
                });

                const camera = viewer.camera;
                const sidecar = {
                    viewName: shot.name,
                    origin: { x: origin.x, y: origin.y, z: origin.z },
                    enu_axes: {
                        east: { x: enu[0], y: enu[1], z: enu[2] },
                        north: { x: enu[4], y: enu[5], z: enu[6] },
                        up: { x: enu[8], y: enu[9], z: enu[10] }
                    },
                    boundary_2d,
                    camera: {
                        position: { x: camera.positionWC.x, y: camera.positionWC.y, z: camera.positionWC.z },
                        direction: { x: camera.directionWC.x, y: camera.directionWC.y, z: camera.directionWC.z },
                        up: { x: camera.upWC.x, y: camera.upWC.y, z: camera.upWC.z },
                        right: { x: camera.rightWC.x, y: camera.rightWC.y, z: camera.rightWC.z }
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