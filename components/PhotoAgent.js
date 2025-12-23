import { generateViewpoints } from '../lib/cameraLogic';
import { useState, useEffect } from 'react';

export default function PhotoAgent({ viewer, Cesium }) {
    const VERSION = "1.3.0-inverse"; // Fixed-Parameter Inverse Scaling

    // Debug state
    const [currentViewpoint, setCurrentViewpoint] = useState('Idle');
    const [cameraData, setCameraData] = useState({
        lat: 0,
        lon: 0,
        height: 0,
        heading: 0,
        pitch: 0,
        roll: 0
    });
    const [terrainParams, setTerrainParams] = useState({
        acreage: 0,
        groundElevation: 0,
        scaleFactor: 0,
        relativeHeight: 0,
        absoluteAltitude: 0,
        stepBack: 0
    });

    // Update camera position in real-time
    useEffect(() => {
        if (!viewer || !Cesium) return;

        const interval = setInterval(() => {
            const camera = viewer.camera;
            const position = camera.positionCartographic;

            setCameraData({
                lat: Cesium.Math.toDegrees(position.latitude),
                lon: Cesium.Math.toDegrees(position.longitude),
                height: position.height,
                heading: Cesium.Math.toDegrees(camera.heading),
                pitch: Cesium.Math.toDegrees(camera.pitch),
                roll: Cesium.Math.toDegrees(camera.roll)
            });
        }, 100); // Update 10x per second

        return () => clearInterval(interval);
    }, [viewer, Cesium]);

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

        // Terrain-Aware Test Case: 33.12-acre vacant land parcel in Bonner County
        const START_LAT = 48.26473122909758;
        const START_LNG = -116.6662005004795;
        const ACREAGE = 33.12;
        const GROUND_ELEVATION = 687.0; // Ground elevation in meters (Terrain Baseline)

        // Calculate terrain-aware parameters (Inverse-Scale)
        const scaleFactor = Math.sqrt(ACREAGE);
        const relativeHeight = 1200 - scaleFactor * 20; // Inverse scale: 1200 - (S × 20)
        const absoluteAltitude = GROUND_ELEVATION + relativeHeight;
        const stepBack = 0.03 / scaleFactor; // Inverse relationship: 0.03 / S

        // Update debug display
        setTerrainParams({
            acreage: ACREAGE,
            groundElevation: GROUND_ELEVATION,
            scaleFactor,
            relativeHeight,
            absoluteAltitude,
            stepBack
        });

        console.log(`Property: ${ACREAGE} acres at ${GROUND_ELEVATION}m elevation`);
        console.log(`Scale Factor (S): ${scaleFactor.toFixed(2)}`);
        console.log(`Relative Height (H): ${relativeHeight.toFixed(0)}m above ground`);
        console.log(`Absolute Altitude (A): ${absoluteAltitude.toFixed(0)}m (${GROUND_ELEVATION}m + ${relativeHeight.toFixed(0)}m)`);
        console.log(`Step-Back Distance (D): ${stepBack.toFixed(4)}°`);

        const viewpoints = generateViewpoints(START_LAT, START_LNG, ACREAGE, GROUND_ELEVATION);

        for (const vp of viewpoints) {
            console.log(`Moving to ${vp.name}...`);
            setCurrentViewpoint(`Moving to ${vp.name}`);

            // Explicit FOV Setting per Spec
            viewer.camera.frustum.fov = vp.fov;

            // Direct flight to static viewpoint with completion callback
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
            setCurrentViewpoint(`${vp.name} - Loading Tiles`);

            // Pillar 2: Fidelity
            // Force maximum fidelity
            viewer.scene.globe.maximumScreenSpaceError = 1.0;

            await waitForTiles(viewer);

            console.log(`${vp.name} Ready.`);
            setCurrentViewpoint(`${vp.name} - Ready`);

            // Simulate a "shutter" pause
            await new Promise(r => setTimeout(r, 1000));
        }

        console.log("Sequence Complete.");
        setCurrentViewpoint('Sequence Complete');
    };

    return (
        <>
            {/* Control Button */}
            <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 100 }}>
                <button
                    onClick={runSequence}
                    style={{
                        padding: '12px 24px',
                        fontSize: '16px',
                        cursor: 'pointer',
                        background: 'white',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        fontWeight: 'bold'
                    }}
                >
                    Start Sequence
                </button>
            </div>

            {/* Debug Overlay */}
            <div style={{
                position: 'absolute',
                top: 20,
                right: 20,
                zIndex: 100,
                background: 'rgba(0, 0, 0, 0.8)',
                color: '#00ff00',
                padding: '16px',
                borderRadius: '8px',
                fontFamily: 'monospace',
                fontSize: '12px',
                minWidth: '300px',
                border: '2px solid #00ff00'
            }}>
                <div style={{ marginBottom: '12px', borderBottom: '1px solid #00ff00', paddingBottom: '8px' }}>
                    <strong style={{ color: '#fff' }}>🤖 Robotic Photographer v{VERSION}</strong>
                </div>

                <div style={{ marginBottom: '12px' }}>
                    <div style={{ color: '#fff', marginBottom: '4px' }}>Status:</div>
                    <div style={{ color: '#ffff00' }}>{currentViewpoint}</div>
                </div>

                <div style={{ marginBottom: '12px', borderBottom: '1px solid #444', paddingBottom: '8px' }}>
                    <div style={{ color: '#fff', marginBottom: '4px' }}>Camera Position:</div>
                    <div>Lat: {cameraData.lat.toFixed(6)}°</div>
                    <div>Lon: {cameraData.lon.toFixed(6)}°</div>
                    <div>Alt: {cameraData.height.toFixed(1)}m</div>
                </div>

                <div style={{ marginBottom: '12px', borderBottom: '1px solid #444', paddingBottom: '8px' }}>
                    <div style={{ color: '#fff', marginBottom: '4px' }}>Camera Orientation:</div>
                    <div>Pan: {((cameraData.heading + 360) % 360).toFixed(1)}°</div>
                    <div>Tilt: {(-cameraData.pitch).toFixed(1)}°</div>
                    <div>Roll: 360.0°</div>
                </div>

                {terrainParams.acreage > 0 && (
                    <div style={{ borderTop: '2px solid #00ff00', paddingTop: '8px' }}>
                        <div style={{ color: '#fff', marginBottom: '4px' }}>Terrain-Aware Params:</div>
                        <div>Acreage: {terrainParams.acreage} ac</div>
                        <div>Ground Elev: {terrainParams.groundElevation.toFixed(0)}m</div>
                        <div style={{ color: '#ffaa00' }}>Scale (S): {terrainParams.scaleFactor.toFixed(2)}</div>
                        <div style={{ color: '#ffaa00' }}>Rel. Height (H): {terrainParams.relativeHeight.toFixed(0)}m</div>
                        <div style={{ color: '#ff00ff', fontWeight: 'bold' }}>Abs. Alt (A): {terrainParams.absoluteAltitude.toFixed(0)}m</div>
                        <div>Step-Back (D): {terrainParams.stepBack.toFixed(4)}°</div>
                    </div>
                )}
            </div>
        </>
    );
}
