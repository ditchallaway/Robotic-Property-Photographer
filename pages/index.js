import { useState, useEffect } from 'react';
import CesiumViewer from '../components/CesiumViewer';
import PhotoAgent from '../components/PhotoAgent';

export default function Home() {
    const [viewer, setViewer] = useState(null);
    const [cesium, setCesium] = useState(null);
    const [renderParams, setRenderParams] = useState(null);

    useEffect(() => {
        // 1. Get simple params from URL
        const params = new URLSearchParams(window.location.search);

        // 2. Get complex params (GeoJSON/Style) injected by Puppeteer
        // @ts-ignore
        const injectedData = window.__RENDER_DATA__ || {};

        setRenderParams({
            lat: parseFloat(params.get('lat') || '48.2647'),
            lon: parseFloat(params.get('lon') || '-116.6662'),
            acreage: parseFloat(params.get('acreage') || '1.0'),
            geojson: injectedData.geojson || null,
            style: injectedData.style || { stroke: '#ffff00', width: 3 }
        });
    }, []);

    const handleViewerReady = (viewerInstance, cesiumInstance) => {
        setViewer(viewerInstance);
        setCesium(cesiumInstance);
    };

    return (
        <main style={{
            width: '100vw',
            height: '100vh',
            overflow: 'hidden',
            margin: 0,
            padding: 0,
            backgroundColor: '#000'
        }}>
            <CesiumViewer onViewerReady={handleViewerReady} />

            {/* Only load the Pilot once the engine AND the params are ready */}
            {viewer && cesium && renderParams && (
                <PhotoAgent
                    viewer={viewer}
                    Cesium={cesium}
                    config={renderParams}
                />
            )}
        </main>
    );
}