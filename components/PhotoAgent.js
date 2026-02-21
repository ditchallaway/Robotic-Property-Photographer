import { useEffect, useRef } from 'react';

export default function PhotoAgent({ viewer, Cesium }) {
    const isRunning = useRef(false);

    // Wait until globe tiles are fully loaded (with timeout safety)
    const waitForTiles = (viewer) => new Promise(resolve => {
        let stableCycles = 0;
        const check = setInterval(() => {
            if (viewer.scene.globe.tilesLoaded) {
                stableCycles++;
                if (stableCycles > 2) { clearInterval(check); resolve(); }
            } else {
                stableCycles = 0;
            }
        }, 200);
        setTimeout(() => { clearInterval(check); resolve(); }, 10000);
    });

    // Find the 3D tileset primitive (Google Photorealistic Tiles)
    const findTileset = (viewer) => {
        for (let i = 0; i < viewer.scene.primitives.length; i++) {
            const p = viewer.scene.primitives.get(i);
            if (p instanceof Cesium.Cesium3DTileset) return p;
        }
        return null;
    };

    const MAGENTA = new Cesium.Color(1.0, 0.0, 1.0, 1.0);

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
                    font: '24px sans-serif',
                    fillColor: Cesium.Color.WHITE,
                    outlineColor: Cesium.Color.BLACK,
                    outlineWidth: 3,
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
                    font: 'bold 32px sans-serif',
                    fillColor: Cesium.Color.WHITE,
                    outlineColor: Cesium.Color.BLACK,
                    outlineWidth: 4,
                    style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                    verticalOrigin: Cesium.VerticalOrigin.CENTER,
                    horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
                    disableDepthTestDistance: Number.POSITIVE_INFINITY,
                    show: false
                })
                : null;
            console.log(`[BROWSER] Acreage label: ${acreageLabel ? data.acreageAnchor.text : 'none'}`);

            // ── Camera Setup ───────────────────────────────────────────
            const centroidCarto = Cesium.Cartographic.fromDegrees(data.centroid[0], data.centroid[1]);
            const terrainHeight = viewer.scene.globe.getHeight(centroidCarto);
            const effectiveHeight = (terrainHeight !== undefined && terrainHeight !== null)
                ? terrainHeight
                : (data.centroid_elevation || 0);
            const origin = Cesium.Cartesian3.fromDegrees(
                data.centroid[0], data.centroid[1], effectiveHeight
            );
            const boundingSphere = Cesium.BoundingSphere.fromPoints(positions);
            boundingSphere.center = origin;

            viewer.camera.frustum.fov = Cesium.Math.toRadians(100);
            viewer.scene.globe.maximumScreenSpaceError = 1.0;
            console.log(`[BROWSER] Camera FOV=100deg, SSE=1.0, height=${effectiveHeight.toFixed(1)}m`);

            const shotList = [
                { name: 'nadir', heading: 0, pitch: -90 },
                { name: 'north', heading: 0, pitch: -24 },
                { name: 'east', heading: 90, pitch: -24 },
                { name: 'south', heading: 180, pitch: -24 },
                { name: 'west', heading: 270, pitch: -24 }
            ];

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

                // ── SWITCH TO CHROMA BACKGROUND ────────────────────────
                // Hide 3D tiles + sky, set ENTIRE background to magenta
                if (tileset) tileset.show = false;
                viewer.scene.globe.show = false; // hide globe entirely
                if (viewer.scene.skyBox) viewer.scene.skyBox.show = false;
                if (viewer.scene.sun) viewer.scene.sun.show = false;
                if (viewer.scene.moon) viewer.scene.moon.show = false;
                if (viewer.scene.skyAtmosphere) viewer.scene.skyAtmosphere.show = false;
                viewer.scene.backgroundColor = MAGENTA;
                viewer.scene.render();
                await new Promise(r => setTimeout(r, 300));

                // ── PASS 2: Boundary ───────────────────────────────────
                boundaryEntity.show = true;
                viewer.scene.render();
                await new Promise(r => setTimeout(r, 300));
                viewer.scene.render();
                console.log(`[BROWSER] Capturing boundary pass...`);
                await window.capturePass(shot.name, 'boundary');
                boundaryEntity.show = false;

                // ── PASS 3: Street Labels ──────────────────────────────
                labelEntries.forEach(l => l.show = true);
                viewer.scene.render();
                await new Promise(r => setTimeout(r, 300));
                viewer.scene.render();
                console.log(`[BROWSER] Capturing labels pass...`);
                await window.capturePass(shot.name, 'labels');
                labelEntries.forEach(l => l.show = false);

                // ── PASS 4: Acreage Text ───────────────────────────────
                if (acreageLabel) {
                    acreageLabel.show = true;
                    viewer.scene.render();
                    await new Promise(r => setTimeout(r, 300));
                    viewer.scene.render();
                }
                console.log(`[BROWSER] Capturing acreage pass...`);
                await window.capturePass(shot.name, 'acreage');
                if (acreageLabel) acreageLabel.show = false;

                // ── Compose this shot's PSD ─────────────────────────────
                console.log(`[BROWSER] Composing PSD for ${shot.name}...`);
                await window.composeShot(shot.name);

                // ── RESTORE for next shot ──────────────────────────────
                if (tileset) tileset.show = true;
                viewer.scene.globe.show = true;
                if (viewer.scene.skyBox) viewer.scene.skyBox.show = true;
                if (viewer.scene.sun) viewer.scene.sun.show = true;
                if (viewer.scene.moon) viewer.scene.moon.show = true;
                if (viewer.scene.skyAtmosphere) viewer.scene.skyAtmosphere.show = true;
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