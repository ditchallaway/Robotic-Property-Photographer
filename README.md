# Robotic Property Photographer - Drone Scale Engine

A robotic 3D photography engine built on Next.js and CesiumJS, designed for consistent framing and high-fidelity captures of vacant land properties across variable topography.

## 🚀 Core Tech Stack
- **Engine**: Next.js + Raw CesiumJS
- **Data**: Google Photorealistic 3D Tiles
- **Runtime**: Node.js 20 (Alpine Linux)
- **Infrastructure**: Docker Desktop / Ubuntu VPS

## 🏗️ Architecture Pillars

### Pillar 1: Terrain-Aware Inverse Scaling (v1.3.0-inverse)
The engine moves away from satellite-scale framing to professional **Drone-Scale** perspectives. It utilizes a fixed-parameter inverse-scaling algorithm to ensure properties from 2.4 to 870 acres are framed perfectly without changing the Field of View or Tilt.

**The Formula:**
- **Relative Height ($H$):** $1200 - (\sqrt{gisacre} \times 20)$
- **Absolute Altitude ($A$):** $GroundElevation + H$
- **Step-Back Distance ($D$):** $0.03 / \sqrt{gisacre}$

### Pillar 2: High-Fidelity Capture Sequence
Executes a 5-point perspective sequence with deterministic camera control:
1. **Nadir (Birds-Eye)**: Directly overhead (Tilt: 90°)
2. **North View**: South of centroid looking North (Tilt: 66°)
3. **South View**: North of centroid looking South (Tilt: 66°)
4. **East View**: West of centroid looking East (Tilt: 66°)
5. **West View**: East of centroid looking West (Tilt: 66°)

### Pillar 3: Real-Time Debug Telemetry
A Matrix-style green terminal overlay provides complete transparency during the mission:
- **Status Tracking**: Live updates on camera flight and tile loading.
- **Camera Telemetry**: Lat/Lon, Absolute Altitude, and Normalized Orientation (Pan/Tilt/Roll).
- **Logic Validation**: Displays calculated Scale Factor (S), Relative Height (H), and Step-Back (D).

## 🛠️ Orientation Specification
To ensure consistent data emission, all orientation values use the following normalized convention:
- **Pan**: Normalized Heading [0, 360)
- **Tilt**: Negation of Pitch (e.g., 66° for a downward look)
- **Roll**: Constant at 360.0°

## 📂 Project Structure
- `/lib/cameraLogic.js`: The "Brain" - contains the coordinate and scaling math.
- `/components/PhotoAgent.js`: The "Pilot" - handles sequencing, tile waiting, and debug display.
- `/public/cesium/`: Cesium library assets managed by the Docker build process.

## 🏁 Getting Started

1. **Environment**: Create a `.env` file with your `GOOGLE_API_KEY`.
2. **Launch**:
   ```bash
   docker-compose up --build
   ```
3. **Access**: Visit [http://localhost:3000](http://localhost:3000) and click **"Start Sequence"**.
