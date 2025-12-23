import { useEffect, useRef, useState } from 'react';

export default function CesiumViewer({ onViewerReady }) {
    const containerRef = useRef(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        let viewer = null;
        let isDestroyed = false;

        if (typeof window !== 'undefined') {
            const initCesium = async () => {
                try {
                    // Set base URL for Cesium assets BEFORE import
                    window.CESIUM_BASE_URL = '/cesium';

                    console.log("CesiumViewer: Starting init...");
                    const Cesium = (await import('cesium'));
                    console.log("CesiumViewer: Cesium imported.");

                    if (isDestroyed) {
                        console.log("CesiumViewer: Component destroyed before Viewer creation.");
                        return;
                    }

                    if (containerRef.current) {
                        console.log("CesiumViewer: Creating Viewer instance...");
                        // Initialize raw viewer
                        viewer = new Cesium.Viewer(containerRef.current, {
                            animation: false,
                            baseLayerPicker: false,
                            fullscreenButton: false,
                            vrButton: false,
                            geocoder: false,
                            homeButton: false,
                            infoBox: false,
                            sceneModePicker: false,
                            selectionIndicator: false,
                            timeline: false,
                            navigationHelpButton: false,
                            navigationInstructionsInitiallyVisible: false,
                        });
                        console.log("CesiumViewer: Viewer created.");

                        // Remove default credit to clean up UI (optional, but good for "Pro" look)
                        // viewer.cesiumWidget.creditContainer.style.display = 'none';

                        // Load Google Photorealistic 3D Tiles
                        if (process.env.NEXT_PUBLIC_GOOGLE_API_KEY) {
                            try {
                                console.log("CesiumViewer: Loading Google 3D Tiles...");
                                const tileset = await Cesium.Cesium3DTileset.fromUrl(
                                    "https://tile.googleapis.com/v1/3dtiles/root.json?key=" + process.env.NEXT_PUBLIC_GOOGLE_API_KEY
                                );
                                if (!isDestroyed) {
                                    viewer.scene.primitives.add(tileset);
                                    console.log("CesiumViewer: Tileset added.");

                                    // Fly to test parcel centroid
                                    // 33.12-acre vacant land
                                    viewer.camera.setView({
                                        destination: Cesium.Cartesian3.fromDegrees(-116.6662005004795, 48.26473122909758, 4000),
                                        orientation: {
                                            heading: 0,
                                            pitch: -0.5,
                                            roll: 0
                                        }
                                    });
                                }
                            } catch (error) {
                                console.error("Failed to load Google 3D Tiles:", error);
                            }
                        } else {
                            console.warn("CesiumViewer: No Google API Key found!");
                        }

                        if (onViewerReady && !isDestroyed) {
                            onViewerReady(viewer, Cesium);
                        }
                    } else {
                        console.error("CesiumViewer: No container ref!");
                    }
                } catch (err) {
                    console.error("CesiumViewer: Fatal Init Error:", err);
                }
            }
            initCesium();
        }

        return () => {
            isDestroyed = true;
            if (viewer) {
                viewer.destroy();
            }
        };
    }, [mounted]);

    if (!mounted) return null;

    return (
        <div
            ref={containerRef}
            style={{ width: '100%', height: '100vh' }}
        />
    );
}
