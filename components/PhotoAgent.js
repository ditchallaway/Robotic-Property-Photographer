import { generateViewpoints } from '../lib/cameraLogic';
import * as Cesium from 'cesium';

export default function PhotoAgent({ viewer }) {

    // Pillar 2: High-Fidelity Wait Logic
    const waitForTiles = (viewer) => new Promise(resolve => {
        const globe = viewer.scene.globe;
        if (globe.tilesLoaded) {
            resolve();
            return;
        }

        const removeListener = globe.tileLoadProgressEvent.addEventListener(q => {
            if (q === 0) {
                removeListener();
                resolve();
            }
        });
    });

    const runSequence = async () => {
        if (!viewer) return;

        console.log("Starting Sequence...");

        // Example Coordinate (San Francisco / Transamerica Pyramid approx)
        // User can change this or we can make it an input later.
        const START_LAT = 37.7952;
        const START_LNG = -122.4028;

        const viewpoints = generateViewpoints(START_LAT, START_LNG);

        for (const vp of viewpoints) {
            console.log(`Moving to ${vp.name}...`);

            // Explicit FOV Setting per Spec
            viewer.camera.frustum.fov = vp.fov;

            // FlyTo
            viewer.camera.flyTo({
                destination: Cesium.Cartesian3.fromDegrees(vp.longitude, vp.latitude, vp.height),
                orientation: {
                    heading: vp.heading,
                    pitch: vp.pitch,
                    roll: vp.roll
                },
                duration: 2.0 // Smooth flight
            });

            // Wait for flight to complete logic? 
            // flyTo is async but doesn't return promise in all versions the same way, 
            // complete callback is reliable.
            await new Promise(resolve => {
                viewer.camera.flyTo({
                    destination: Cesium.Cartesian3.fromDegrees(vp.longitude, vp.latitude, vp.height),
                    orientation: {
                        heading: vp.heading,
                        pitch: vp.pitch,
                        roll: vp.roll
                    },
                    duration: 2.0,
                    complete: resolve
                });
            });

            console.log(`Arrived at ${vp.name}. Waiting for tiles...`);

            // Pillar 2: Fidelity
            // Force maximum fidelity
            viewer.scene.globe.maximumScreenSpaceError = 1.0;

            await waitForTiles(viewer);

            console.log(`${vp.name} Ready.`);

            // Simulate a "shutter" pause
            await new Promise(r => setTimeout(r, 1000));
        }

        console.log("Sequence Complete.");
    };

    return (
        <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 100 }}>
            <button
                onClick={runSequence}
                style={{
                    padding: '12px 24px',
                    fontSize: '16px',
                    cursor: 'pointer',
                    background: 'white',
                    border: '1px solid #ccc',
                    borderRadius: '4px'
                }}
            >
                Start Sequence
            </button>
        </div>
    );
}
