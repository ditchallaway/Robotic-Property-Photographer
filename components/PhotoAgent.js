import { useEffect, useRef } from 'react';

export default function PhotoAgent({ viewer, Cesium }) {
    const isRunning = useRef(false);

    // Wait until globe tiles and any 3D tilesets are fully loaded (with timeout safety)
    const waitForTiles = (viewer) => new Promise(resolve => {
        let stableCycles = 0;
        let lastLog = Date.now();
        console.log('[BROWSER] waitForTiles: Waiting 500ms before checking to allow tile requests to queue...');

        let timeoutTimer;

        setTimeout(() => {
            const check = setInterval(() => {
                const tileset = findTileset(viewer);
                // Cesium3DTileset uses tilesLoaded/allTilesLoaded. Globe uses tilesLoaded.
                const tilesetLoaded = tileset
                    ? (tileset.tilesLoaded === true || tileset.allTilesLoaded === true)
                    : true;

                const globeLoaded = viewer.scene.globe.tilesLoaded === true;
                const allLoaded = tilesetLoaded && globeLoaded;

                // Console.log every 2 seconds to avoid spam but give feedback
                if (Date.now() - lastLog > 2000) {
                    console.log(`[BROWSER] waitForTiles status: tileset=${!!tileset}, tilesetLoaded=${tilesetLoaded}, globeLoaded=${globeLoaded}, stableCycles=${stableCycles}`);
                    lastLog = Date.now();
                }

                if (allLoaded) {
                    stableCycles++;
                    if (stableCycles >= 3) { // Ensure multiple frames of complete loading
                        console.log('[BROWSER] waitForTiles: Tiles completely loaded.');
                        clearInterval(check);
                        clearTimeout(timeoutTimer);
                        resolve();
                    }
                } else {
                    stableCycles = 0;
                }
            }, 300);

            timeoutTimer = setTimeout(() => {
                console.warn('[BROWSER] waitForTiles: TIMEOUT REACHED (90s). Capturing anyway.');
                clearInterval(check);
                resolve();
            }, 90000);
        }, 500); // Small initial delay so Cesium realizes the camera moved and starts requesting new tiles
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

            // Boundary polylines — using PolylineCollection primitive so they render
            // in the transparent pass (entity clampToGround polylines need the globe visible).
            const boundaryLineCollection = viewer.scene.primitives.add(new Cesium.PolylineCollection());
            const boundaryPolylines = [];
            const boundaryAlt = (data.centroid_elevation || 0) + 5;
            if (data.geometry && data.geometry.coordinates) {
                const rings = data.geometry.coordinates;
                for (let i = 0; i < rings.length; i++) {
                    const positions = [];
                    for (const coord of rings[i]) {
                        positions.push(Cesium.Cartesian3.fromDegrees(coord[0], coord[1], boundaryAlt));
                    }
                    const polyline = boundaryLineCollection.add({
                        positions,
                        width: 8,
                        material: Cesium.Material.fromType('Color', { color: Cesium.Color.YELLOW }),
                        show: false
                    });
                    boundaryPolylines.push(polyline);
                }
            }
            console.log(`[BROWSER] Created ${boundaryPolylines.length} boundary rings as PolylineCollection primitives`);

            // Street labels (hidden initially)
            const labelCollection = viewer.scene.primitives.add(
                new Cesium.LabelCollection()
            );
            const billboardCollection = viewer.scene.primitives.add(
                new Cesium.BillboardCollection()
            );

            // Helper to rasterize text so we can rotate it as a billboard (standard Labels don't rotate)
            function createTextCanvas(text, isAcreage = false) {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                const fontStr = isAcreage ? 'bold 96px sans-serif' : 'bold 64px sans-serif';
                ctx.font = fontStr;
                const metrics = ctx.measureText(text);
                // add padding
                canvas.width = metrics.width + 40;
                canvas.height = isAcreage ? 150 : 100;

                // re-apply after resizing
                ctx.font = fontStr;
                ctx.fillStyle = isAcreage ? 'yellow' : 'white';
                ctx.strokeStyle = 'black';
                ctx.lineWidth = 10;
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
                if (!road.name) continue;
                const lon = road.anchorLon;
                const lat = road.anchorLat;

                const label = billboardCollection.add({
                    position: Cesium.Cartesian3.fromDegrees(lon, lat, (data.centroid_elevation || 0) + 20),
                    image: createTextCanvas(road.name, false),
                    disableDepthTestDistance: Number.POSITIVE_INFINITY,
                    show: false
                });
                label.roadAngle = road.angle;
                labelEntries.push(label);
            }
            console.log(`[BROWSER] Created ${labelEntries.length} street labels`);

            // ── Acreage label ──────────────────────────────────────────────
            let acreageLabel = null;
            if (data.acreageAnchor) {
                const { lon, lat, text, rotation } = data.acreageAnchor;
                acreageLabel = billboardCollection.add({
                    position: Cesium.Cartesian3.fromDegrees(lon, lat, (data.centroid_elevation || 0) + 20),
                    image: createTextCanvas(text, true),
                    disableDepthTestDistance: Number.POSITIVE_INFINITY,
                    show: false
                });
                acreageLabel.roadAngle = rotation;
            }
            console.log(`[BROWSER] Acreage label setup completed.`);

            // ── Camera Setup ───────────────────────────────────────────
            // WGS84 globe without a terrain provider returns 0. Google 3D Tiles require the actual terrain bounds.
            const effectiveHeight = data.centroid_elevation || 0;
            const origin = Cesium.Cartesian3.fromDegrees(
                data.centroid[0], data.centroid[1], effectiveHeight
            );
            const boundingSphere = Cesium.BoundingSphere.fromPoints(allPositions);
            boundingSphere.center = origin;
            // Enforce minimum radius to avoid Frustum clipping labels/boundaries on very small parcels
            if (boundingSphere.radius < 50) {
                boundingSphere.radius = 50;
            }

            viewer.camera.frustum.fov = Cesium.Math.toRadians(100);

            // Set maximum screen space error to 1.0 per user instruction for maximum quality
            viewer.scene.globe.maximumScreenSpaceError = 1.0;
            console.log(`[BROWSER] Camera FOV=100deg, SSE=1.0, height=${effectiveHeight.toFixed(1)}m`);

            let shotList = [
                { name: 'nadir', heading: 0, pitch: -90 },
                { name: 'cardinal', heading: 0, pitch: -24 },
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

                // Only wait for tiles when the base (opaque satellite) pass is needed.
                // Boundary/labels/acreage are transparent passes that hide the tileset, so waiting is both
                // unnecessary and harmful — the tileset never reports tilesLoaded while hidden.
                if (capabilities.includes('base')) {
                    await waitForTiles(viewer);
                }

                // ── PASS 1: Map Background (opaque, no boundaries/labels) ──
                if (capabilities.includes('base')) {
                    boundaryPolylines.forEach(p => p.show = false);
                    labelEntries.forEach(l => l.show = false);
                    if (acreageLabel) acreageLabel.show = false;

                    viewer.scene.render();
                    await new Promise(r => setTimeout(r, 500));
                    viewer.scene.render();
                    console.log(`[BROWSER] Capturing map pass...`);
                    await window.capturePass(shot.name, 'map');
                }

                // ── TRANSPARENT OVERLAY PASSES (Boundary, Labels & Acreage) ──────────
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

                    // ── PASS 2: Boundary (Transparent) ─────────────────────
                    if (capabilities.includes('boundary')) {
                        boundaryPolylines.forEach(p => p.show = true);
                        viewer.scene.render();
                        await new Promise(r => setTimeout(r, 300));
                        viewer.scene.render();
                        console.log(`[BROWSER] Capturing boundary pass...`);
                        await window.capturePass(shot.name, 'boundary');
                        boundaryPolylines.forEach(p => p.show = false);
                    }

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
                            acreageLabel.rotation = (shot.name === 'nadir') ? acreageLabel.roadAngle : 0;
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
            console.log('MISSION_ERROR');
        }
    };

    useEffect(() => {
        console.log(`[BROWSER] PhotoAgent mounted. viewer=${!!viewer}`);
        runMission();
    }, [viewer]);

    return null;
}