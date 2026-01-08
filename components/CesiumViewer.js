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
                    window.CESIUM_BASE_URL = '/cesium';
                    const Cesium = await import('cesium');

                    if (isDestroyed || !containerRef.current) return;

                    // Initialize Viewer with all UI disabled for clean snapshots
                    // We set imageryProvider to false to bypass Ion requirements
                    viewer = new Cesium.Viewer(containerRef.current, {
                        imageryProvider: false,
                        baseLayerPicker: false,
                        geocoder: false,
                        homeButton: false,
                        infoBox: false,
                        navigationHelpButton: false,
                        sceneModePicker: false,
                        selectionIndicator: false,
                        timeline: false,
                        animation: false,
                        fullscreenButton: false,
                        scene3DOnly: true,
                        contextOptions: {
                            webgl: {
                                preserveDrawingBuffer: true
                            }
                        }
                    });

                    // Ensure the globe is visible to act as the base for Google Tiles
                    viewer.scene.globe.show = true;
                    viewer.scene.globe.baseColor = Cesium.Color.fromCssColorString('#111111');

                    if (viewer.creditContainer) {
                        viewer.creditContainer.style.display = 'none';
                    }

                    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
                    if (apiKey) {
                        const tileset = await Cesium.Cesium3DTileset.fromUrl(
                            `https://tile.googleapis.com/v1/3dtiles/root.json?key=${apiKey}`
                        );

                        viewer.scene.primitives.add(tileset);

                        if (!isDestroyed && onViewerReady) {
                            onViewerReady(viewer, Cesium);
                        }
                    }
                } catch (err) {
                    // Silently handle or log to a proper service in production
                }
            };
            initCesium();
        }

        return () => {
            isDestroyed = true;
            if (viewer && !viewer.isDestroyed()) {
                viewer.destroy();
            }
        };
    }, [mounted]);

    if (!mounted) return null;

    return (
        <div
            ref={containerRef}
            style={{
                width: '100%',
                height: '100vh',
                backgroundColor: '#000',
                overflow: 'hidden'
            }}
        />
    );
}