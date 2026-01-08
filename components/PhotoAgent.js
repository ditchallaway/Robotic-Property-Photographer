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
            await new Promise(r => setTimeout(r, 2000));

            await new Promise(resolve => {
                let stableCycles = 0;
                const check = setInterval(() => {
                    if (viewer.scene.globe.tilesLoaded) {
                        stableCycles++;
                        if (stableCycles > 2) { // Require 1 second of stability
                            clearInterval(check);
                            resolve();
                        }
                    } else {
                        stableCycles = 0; // Reset if loading resumes
                    }
                }, 500);
            });

            // Brief settle for the preserveDrawingBuffer
            await new Promise(r => setTimeout(r, 500));

            console.log(`CAPTURE_FRAME:${shot.name}`);
            await new Promise(r => setTimeout(r, 1000)); // Buffer for Puppeteer screenshot
        }

        console.log("MISSION_COMPLETE");
    };

    useEffect(() => { runMission(); }, [viewer]);
    return null;
}