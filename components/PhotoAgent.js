import { useEffect, useRef } from 'react';

export default function PhotoAgent({ viewer, Cesium }) {
    const isRunning = useRef(false);

    // Wait until globe tiles and any 3D tilesets are fully loaded (with timeout safety)
    const waitForTiles = (viewer) => new Promise(resolve => {
        let stableCycles = 0;
        let lastLog = Date.now();
        console.log('[BROWSER] waitForTiles: Starting tile load wait loop...');

        const check = setInterval(() => {
            const tileset = findTileset(viewer);
            // Cesium3DTileset has `tilesLoaded` boolean
            const tilesetLoaded = tileset ? (tileset.tilesLoaded === true || tileset.allTilesLoaded === true || tileset.tilesLoaded === undefined) : true;

            // If the tileset is present, we only care that the tileset is loaded.
            // If not present, we fall back to checking if the globe is loaded.
            const allLoaded = tileset ? tilesetLoaded : (viewer.scene.globe.tilesLoaded !== false);

            // Console.log every 2 seconds to avoid spam but give feedback
            if (Date.now() - lastLog > 2000) {
                console.log(`[BROWSER] waitForTiles status: tilesetLoaded=${tilesetLoaded}, allLoaded=${allLoaded}, stableCycles=${stableCycles}`);
                lastLog = Date.now();
            }

            if (allLoaded) {
                stableCycles++;
                if (stableCycles > 3) {
                    console.log('[BROWSER] waitForTiles: Tiles completely loaded.');
                    clearInterval(check);
                    resolve();
                }
            } else {
                stableCycles = 0;
            }
        }, 300);

        setTimeout(() => {
            console.warn('[BROWSER] waitForTiles: TIMEOUT REACHED (30s). Capturing anyway.');
            clearInterval(check);
            resolve();
        }, 30000);
    });

    // Find the 3D tileset primitive (Google Photorealistic Tiles)
    const findTileset = (viewer) => {
        for (let i = 0; i < viewer.scene.primitives.length; i++) {
            const p = viewer.scene.primitives.get(i);
            if (p instanceof Cesium.Cesium3DTileset) return p;
        }
        return null;
    };

    const TRANSPARENT = new Cesium.Color(0.0, 0.0, 0.0, 0.0);

    const runMission = async () => {
        if (!viewer || isRunning.current) return;
        const data = window.__MISSION_DATA__;
        if (!data) {
            console.log('[BROWSER] No __MISSION_DATA__ found, aborting mission');
            return;
        }
        isRunning.current = true;
        console.log('[BROWSER] ===== MISSION START =====');

        try {
            // ── Setup ──────────────────────────────────────────────────
            const coords = data.geometry.coordinates[0].flat();
            const positions = Cesium.Cartesian3.fromDegreesArray(coords);
            console.log(`[BROWSER] Boundary: ${positions.length} vertices`);

            const tileset = findTileset(viewer);
            console.log(`[BROWSER] 3D Tileset found: ${!!tileset}`);

            // Boundary entity (hidden initially)
            const boundaryEntity = viewer.entities.add({
                polyline: {
                    positions,
                    width: 5,
                    clampToGround: true,
                    material: Cesium.Color.YELLOW
                },
                show: false
            });

            // Street labels (hidden initially)
            const labelCollection = viewer.scene.primitives.add(
                new Cesium.LabelCollection()
            );
            const roads = data.roads || [];
            const labelEntries = [];
            for (const road of roads) {
                if (!road.geometry || road.geometry.length < 2) continue;
                const midIdx = Math.floor(road.geometry.length / 2);
                const [lon, lat] = road.geometry[midIdx];
                const label = labelCollection.add({
                    position: Cesium.Cartesian3.fromDegrees(lon, lat, 50),
                    text: road.name,
                    font: '64px sans-serif',
                    fillColor: Cesium.Color.WHITE,
                    outlineColor: Cesium.Color.BLACK,
                    outlineWidth: 8,
                    style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                    verticalOrigin: Cesium.VerticalOrigin.CENTER,
                    horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                    disableDepthTestDistance: Number.POSITIVE_INFINITY,
                    show: false
                });
                labelEntries.push(label);
            }
            console.log(`[BROWSER] Created ${labelEntries.length} street labels`);

            // Acreage label (hidden initially)
            const acreageLabel = data.acreageAnchor
                ? labelCollection.add({
                    position: Cesium.Cartesian3.fromDegrees(
                        data.acreageAnchor.lon,
                        data.acreageAnchor.lat,
                        50
                    ),
                    text: data.acreageAnchor.text,
                    font: 'bold 96px sans-serif',
                    fillColor: Cesium.Color.WHITE,
                    outlineColor: Cesium.Color.BLACK,
                    outlineWidth: 10,
                    style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                    verticalOrigin: Cesium.VerticalOrigin.CENTER,
                    horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                    disableDepthTestDistance: Number.POSITIVE_INFINITY,
                    show: false
                })
                : null;
            console.log(`[BROWSER] Acreage label: ${acreageLabel ? data.acreageAnchor.text : 'none'}`);

            // ── Camera Setup ───────────────────────────────────────────
            // WGS84 globe without a terrain provider returns 0. Google 3D Tiles require the actual terrain bounds.
            const effectiveHeight = data.centroid_elevation || 0;
            const origin = Cesium.Cartesian3.fromDegrees(
                data.centroid[0], data.centroid[1], effectiveHeight
            );
            const boundingSphere = Cesium.BoundingSphere.fromPoints(positions);
            boundingSphere.center = origin;

            viewer.camera.frustum.fov = Cesium.Math.toRadians(100);
            // Default SSE is 16.0. 1.0 crashes headless CPU-based swiftshader rendering due to aggressive tile refinement.
            viewer.scene.globe.maximumScreenSpaceError = 8.0;
            console.log(`[BROWSER] Camera FOV=100deg, SSE=8.0, height=${effectiveHeight.toFixed(1)}m`);

            let shotList = [
                { name: 'nadir', heading: 0, pitch: -90 },
                { name: 'north', heading: 0, pitch: -24 },
                { name: 'east', heading: 90, pitch: -24 },
                { name: 'south', heading: 180, pitch: -24 },
                { name: 'west', heading: 270, pitch: -24 }
            ];

            if (data.shots && Array.isArray(data.shots) && data.shots.length > 0) {
                shotList = shotList.filter(s => data.shots.includes(s.name));
            }

            const capabilities = (data.capabilities && Array.isArray(data.capabilities) && data.capabilities.length > 0)
                ? data.capabilities
                : ['base', 'boundary', 'labels', 'acreage'];

            // ── Multi-Pass Capture Loop ────────────────────────────────
            for (const shot of shotList) {
                console.log(`[BROWSER] === Shot: ${shot.name} ===`);

                // Position camera
                viewer.camera.flyToBoundingSphere(boundingSphere, {
                    offset: new Cesium.HeadingPitchRange(
                        Cesium.Math.toRadians(shot.heading),
                        Cesium.Math.toRadians(shot.pitch),
                        boundingSphere.radius * 2.0
                    ),
                    duration: 0
                });

                // ── PASS 1: Map Background (opaque, full scene) ────────
                if (capabilities.includes('base')) {
                    if (tileset) tileset.show = true;
                    viewer.scene.globe.show = true;
                    boundaryEntity.show = false;
                    labelEntries.forEach(l => l.show = false);
                    if (acreageLabel) acreageLabel.show = false;
                    // Normal sky/atmosphere for the base map
                    if (viewer.scene.skyBox) viewer.scene.skyBox.show = true;
                    if (viewer.scene.sun) viewer.scene.sun.show = true;
                    if (viewer.scene.moon) viewer.scene.moon.show = true;
                    if (viewer.scene.skyAtmosphere) viewer.scene.skyAtmosphere.show = true;
                    viewer.scene.backgroundColor = Cesium.Color.BLACK;

                    await waitForTiles(viewer);
                    viewer.scene.render();
                    await new Promise(r => setTimeout(r, 500));
                    viewer.scene.render();
                    console.log(`[BROWSER] Capturing map pass...`);
                    await window.capturePass(shot.name, 'map');
                }

                // ── OVERLAY PASSES (Transparent) ───────────────────────────
                if (capabilities.some(c => ['boundary', 'labels', 'acreage'].includes(c))) {
                    // Hide 3D tiles + sky, set ENTIRE background to transparent
                    if (tileset) tileset.show = false;

                    // Set globe baseColor to transparent (used when imagery layers are hidden)
                    viewer.scene.globe.show = true;
                    const oldBaseColor = viewer.scene.globe.baseColor;
                    viewer.scene.globe.baseColor = TRANSPARENT;

                    if (viewer.scene.skyBox) viewer.scene.skyBox.show = false;
                    if (viewer.scene.sun) viewer.scene.sun.show = false;
                    if (viewer.scene.moon) viewer.scene.moon.show = false;
                    if (viewer.scene.skyAtmosphere) viewer.scene.skyAtmosphere.show = false;
                    viewer.scene.globe.enableLighting = false;
                    viewer.scene.globe.showGroundAtmosphere = false;
                    viewer.scene.highDynamicRange = false;
                    viewer.scene.backgroundColor = TRANSPARENT;
                    viewer.scene.render();
                    await new Promise(r => setTimeout(r, 300));

                    // ── PASS 2: Boundary ───────────────────────────────────
                    if (capabilities.includes('boundary')) {
                        boundaryEntity.show = true;
                        viewer.scene.render();
                        await new Promise(r => setTimeout(r, 300));
                        viewer.scene.render();
                        console.log(`[BROWSER] Capturing boundary pass...`);
                        await window.capturePass(shot.name, 'boundary');
                        boundaryEntity.show = false;
                    }

                    // ── PASS 3: Street Labels ──────────────────────────────
                    if (capabilities.includes('labels')) {
                        labelEntries.forEach(l => l.show = true);
                        viewer.scene.render();
                        await new Promise(r => setTimeout(r, 300));
                        viewer.scene.render();
                        console.log(`[BROWSER] Capturing labels pass...`);
                        await window.capturePass(shot.name, 'labels');
                        labelEntries.forEach(l => l.show = false);
                    }

                    // ── PASS 4: Acreage Text ───────────────────────────────
                    if (capabilities.includes('acreage')) {
                        if (acreageLabel) {
                            acreageLabel.show = true;
                            viewer.scene.render();
                            await new Promise(r => setTimeout(r, 300));
                            viewer.scene.render();
                        }
                        console.log(`[BROWSER] Capturing acreage pass...`);
                        await window.capturePass(shot.name, 'acreage');
                        if (acreageLabel) acreageLabel.show = false;
                    }

                    // ── RESTORE GLOBE COLOR ────────────────────────────────
                    viewer.scene.globe.baseColor = oldBaseColor;
                }

                // ── Compose this shot's PSD ─────────────────────────────
                console.log(`[BROWSER] Composing PSD for ${shot.name}...`);
                await window.composeShot(shot.name);

                // ── RESTORE for next shot (if we messed with it) ───────

                if (tileset) tileset.show = true;
                viewer.scene.globe.show = true;
                if (viewer.scene.skyBox) viewer.scene.skyBox.show = true;
                if (viewer.scene.sun) viewer.scene.sun.show = true;
                if (viewer.scene.moon) viewer.scene.moon.show = true;
                if (viewer.scene.skyAtmosphere) viewer.scene.skyAtmosphere.show = true;
                viewer.scene.globe.enableLighting = true;
                viewer.scene.globe.showGroundAtmosphere = true;
                viewer.scene.highDynamicRange = true;
                viewer.scene.backgroundColor = Cesium.Color.BLACK;
            }

            console.log('[BROWSER] ===== MISSION COMPLETE =====');
            console.log('MISSION_COMPLETE');
        } catch (err) {
            console.error(`[BROWSER] MISSION ERROR: ${err.message}`);
            console.error(err.stack);
            console.log('MISSION_COMPLETE');
        }
    };

    useEffect(() => {
        console.log(`[BROWSER] PhotoAgent mounted. viewer=${!!viewer}`);
        runMission();
    }, [viewer]);

    return null;
}