import { useEffect, useRef, useState } from 'react';

export default function CesiumViewer({ onViewerReady }) {
    const containerRef = useRef(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (typeof window !== 'undefined') {
            const initCesium = async () => {
                const Cesium = (await import('cesium'));

                if (containerRef.current) {
                    // Initialize raw viewer
                    const viewer = new Cesium.Viewer(containerRef.current, {
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
                        // Optimize for static rendering
                        requestRenderMode: true,
                        maximumRenderTimeChange: Infinity,
                    });

                    // Remove default credit to clean up UI (optional, but good for "Pro" look)
                    // viewer.cesiumWidget.creditContainer.style.display = 'none';

                    // Load Google Photorealistic 3D Tiles
                    if (process.env.NEXT_PUBLIC_GOOGLE_API_KEY) {
                        try {
                            const tileset = await Cesium.Cesium3DTileset.fromUrl(
                                "https://tile.googleapis.com/v1/3dtiles/root.json?key=" + process.env.NEXT_PUBLIC_GOOGLE_API_KEY
                            );
                            viewer.scene.primitives.add(tileset);

                            // Fly to a nice default start view (optional, but confirms 3D is working)
                            // Transamerica Pyramid, SF
                            viewer.camera.setView({
                                destination: Cesium.Cartesian3.fromDegrees(-122.4028, 37.7952, 600),
                                orientation: {
                                    heading: 0,
                                    pitch: -0.5,
                                    roll: 0
                                }
                            });

                        } catch (error) {
                            console.error("Failed to load Google 3D Tiles:", error);
                        }
                    }

                    if (onViewerReady) {
                        onViewerReady(viewer);
                    }
                }
            }
            initCesium();
        }
    }, []);

    if (!mounted) return null;

    return (
        <div
            ref={containerRef}
            style={{ width: '100%', height: '100vh' }}
        />
    );
}
