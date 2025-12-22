import { useState } from 'react';
import CesiumViewer from '../components/CesiumViewer';
import PhotoAgent from '../components/PhotoAgent';

export default function Home() {
    const [viewer, setViewer] = useState(null);
    const [cesium, setCesium] = useState(null);

    const handleViewerReady = (viewerInstance, cesiumInstance) => {
        setViewer(viewerInstance);
        setCesium(cesiumInstance);
    };

    return (
        <main style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative' }}>
            <CesiumViewer onViewerReady={handleViewerReady} />
            {viewer && cesium && <PhotoAgent viewer={viewer} Cesium={cesium} />}
        </main>
    );
}
