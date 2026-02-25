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
            let hierarchy = null;
            const allPositions = [];

            if (data.geometry && data.geometry.coordinates) {
                const rings = data.geometry.coordinates;
                const outerPositions = Cesium.Cartesian3.fromDegreesArray(rings[0].flat());
                allPositions.push(...outerPositions);

                const holes = [];
                for (let i = 1; i < rings.length; i++) {
                    const innerPositions = Cesium.Cartesian3.fromDegreesArray(rings[i].flat());
                    allPositions.push(...innerPositions);
                    holes.push(new Cesium.PolygonHierarchy(innerPositions));
                }
                hierarchy = new Cesium.PolygonHierarchy(outerPositions, holes);
                console.log(`[BROWSER] Boundary parsed: 1 outer ring, ${holes.length} holes, total vertices: ${allPositions.length}`);
            }

            const tileset = findTileset(viewer);
            console.log(`[BROWSER] 3D Tileset found: ${!!tileset}`);

            // Boundary entity (hidden initially)
            const boundaryEntity = viewer.entities.add({
                polygon: {
                    hierarchy: hierarchy,
                    // Use a translucent yellow fill and opaque outline. 
                    // Note: Cesium polygon outlines on terrain can be finicky, but a fill works inherently with holes.
                    material: Cesium.Color.YELLOW.withAlpha(0.2),
                    outline: true,
                    outlineColor: Cesium.Color.YELLOW,
                    outlineWidth: 5
                },
                show: false
            });

            // Street labels (hidden initially)
            const labelCollection = viewer.scene.primitives.add(
                new Cesium.LabelCollection()
            );
            const billboardCollection = viewer.scene.primitives.add(
                new Cesium.BillboardCollection()
            );

            // Helper to rasterize text so we can rotate it as a billboard (standard Labels don't rotate)
            function createTextCanvas(text) {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                ctx.font = 'bold 64px sans-serif';
                const metrics = ctx.measureText(text);
                // add padding
                canvas.width = metrics.width + 40;
                canvas.height = 100;

                // re-apply after resizing
                ctx.font = 'bold 64px sans-serif';
                ctx.fillStyle = 'white';
                ctx.strokeStyle = 'black';
                ctx.lineWidth = 8;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                const cx = canvas.width / 2;
                const cy = canvas.height / 2;
                ctx.strokeText(text, cx, cy);
                ctx.fillText(text, cx, cy);
                return canvas;
            }

            const roads = data.roads || [];
            const labelEntries = [];
            for (const road of roads) {
                if (!road.geometry || road.geometry.length < 2) continue;
                const midIdx = Math.floor(road.geometry.length / 2);
                const [lon, lat] = road.geometry[midIdx];

                // Calculate road angle for "sticker" alignment in Nadir
                const p1 = road.geometry[Math.max(0, midIdx - 1)];
                const p2 = road.geometry[Math.min(road.geometry.length - 1, midIdx + 1)];
                const dx = (p2[0] - p1[0]) * Math.cos(p1[1] * Math.PI / 180);
                const dy = p2[1] - p1[1];
                let angle = Math.atan2(dy, dx);

                // Keep text readable (never completely upside-down)
                if (angle > Math.PI / 2) angle -= Math.PI;
                else if (angle < -Math.PI / 2) angle += Math.PI;

                // Billboard rotation is counter-clockwise and 0 is right (East). Our calc uses 0 as right (dx=East).
                // However, Cesium billboard rotation is visually mapped in screen space. 

                const label = billboardCollection.add({
                    position: Cesium.Cartesian3.fromDegrees(lon, lat, 50),
                    image: createTextCanvas(road.name),
                    disableDepthTestDistance: Number.POSITIVE_INFINITY,
                    show: false
                });
                label.roadAngle = angle;
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
            const boundingSphere = Cesium.BoundingSphere.fromPoints(allPositions);
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

                // ── OPAQUE MAP SETUP ───────────────────────────────────────
                if (tileset) tileset.show = true;
                viewer.scene.globe.show = true;
                if (viewer.scene.skyBox) viewer.scene.skyBox.show = true;
                if (viewer.scene.sun) viewer.scene.sun.show = true;
                if (viewer.scene.moon) viewer.scene.moon.show = true;
                if (viewer.scene.skyAtmosphere) viewer.scene.skyAtmosphere.show = true;
                viewer.scene.backgroundColor = Cesium.Color.BLACK;

                // Wait for tiles if any opaque pass is required so they are loaded
                if (capabilities.some(c => ['base', 'boundary'].includes(c))) {
                    await waitForTiles(viewer);
                }

                // ── PASS 1: Map Background (opaque, no boundaries/labels) ──
                if (capabilities.includes('base')) {
                    boundaryEntity.show = false;
                    labelEntries.forEach(l => l.show = false);
                    if (acreageLabel) acreageLabel.show = false;

                    viewer.scene.render();
                    await new Promise(r => setTimeout(r, 500));
                    viewer.scene.render();
                    console.log(`[BROWSER] Capturing map pass...`);
                    await window.capturePass(shot.name, 'map');
                }

                // ── PASS 2: Boundary (opaque, map + boundary) ──────────────
                if (capabilities.includes('boundary')) {
                    boundaryEntity.show = true;
                    labelEntries.forEach(l => l.show = false);
                    if (acreageLabel) acreageLabel.show = false;

                    viewer.scene.render();
                    await new Promise(r => setTimeout(r, 500));
                    viewer.scene.render();
                    console.log(`[BROWSER] Capturing boundary pass...`);
                    await window.capturePass(shot.name, 'boundary');
                    boundaryEntity.show = false;
                }

                // ── TRANSPARENT OVERLAY PASSES (Labels & Acreage) ──────────
                if (capabilities.some(c => ['labels', 'acreage'].includes(c))) {
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

                    // ── PASS 3: Street Labels ──────────────────────────────
                    if (capabilities.includes('labels')) {
                        labelEntries.forEach(l => {
                            l.show = true;
                            // Only apply "painted sticker" rotation for nadir shots
                            l.rotation = (shot.name === 'nadir') ? l.roadAngle : 0;
                        });
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