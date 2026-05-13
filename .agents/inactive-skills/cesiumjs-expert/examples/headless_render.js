/**
 * Headless CesiumJS Rendering Pattern
 *
 * This example shows the standard initialization and flight sequence 
 * recommended for a Puppeteer + SwiftShader environment.
 */
import * as Cesium from "cesium";

async function renderPropertySnapshot(containerId, boundaryGeoJson) {
  const viewer = new Cesium.Viewer(containerId, {
    infoBox: false,
    selectionIndicator: false,
    baseLayerPicker: false,
    geocoder: false,
    homeButton: false,
    sceneModePicker: false,
    navigationHelpButton: false,
    shouldAnimate: false,
    animation: false,
    timeline: false,
    fullscreenButton: false,
    vrButton: false,
    // Avoid Bing/Ion auth issues in some headless setups
    imageryProvider: new Cesium.OpenStreetMapImageryProvider({
      url: "https://a.tile.openstreetmap.org/"
    })
  });

  // 1. Initial Optimization
  viewer.scene.globe.enableLighting = false;
  viewer.scene.shadowMap.enabled = false;

  // 2. Load Boundary
  const dataSource = await Cesium.GeoJsonDataSource.load(boundaryGeoJson, {
    stroke: Cesium.Color.YELLOW,
    fill: Cesium.Color.YELLOW.withAlpha(0.3),
    strokeWidth: 3
  });
  await viewer.dataSources.add(dataSource);

  // 3. Robust Flight
  return new Promise((resolve) => {
    viewer.flyTo(dataSource, {
      duration: 0,
      complete: async () => {
        // Essential wait for headless stability
        let timeout = false;
        const timer = setTimeout(() => { timeout = true; }, 30000);

        while (!viewer.scene.globe.tilesLoaded && !timeout) {
          await new Promise(r => setTimeout(r, 100));
        }
        
        clearTimeout(timer);
        resolve("Ready");
      }
    });
  });
}
