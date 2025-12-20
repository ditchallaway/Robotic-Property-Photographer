# Robotic Property Photographer - Milestone 1

## Core Stack
**Runtime**: Node.js 20 (Alpine Linux)

**Infrastructure**: Docker Desktop (Windows Host) / Ubuntu VPS (Target)

**Engine**: Next.js + Raw CesiumJS

**Data**: Google Photorealistic 3D Tiles

## 🚀 Getting Started
**API Key**: Create a `.env` file in the root and add: `GOOGLE_API_KEY=your_key_here`

**Build & Run**:
```bash
docker-compose up --build
```
**Access**: Open http://localhost:3000

## 🏗️ Architecture Pillars
**Pillar 1: Asset Migration**
The Dockerfile physically copies Cesium Workers from `node_modules` to `/public/cesium` during the build phase. This solves the 404/304 worker loading errors.

**Pillar 2: High-Fidelity Snapshots**
The PhotoAgent uses `tileLoadProgressEvent` to ensure 3D tiles are fully rendered before capturing.

**Pillar 3: 5-Angle Sequence**
Automated camera logic for North, East, South, West, and Nadir views using Radian-based orientation.

## 📁 Key Directories
- `/public/cesium/`: Auto-populated Cesium assets (do not edit manually).
- `/lib/cameraLogic.js`: Coordinate and angle math.
- `/components/`: 3D Viewer and Photography Agent.
