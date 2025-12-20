FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json* ./

# Step 1: Install dependencies
RUN npm install

COPY . .

# Step 2: Physical asset migration
# Force directory creation and physical asset migration from node_modules to public
# Pillar 1: Self-Healing Pathing
RUN mkdir -p public/cesium && \
    cp -R node_modules/cesium/Build/Cesium/Workers public/cesium/ && \
    cp -R node_modules/cesium/Build/Cesium/Assets public/cesium/ && \
    cp -R node_modules/cesium/Build/Cesium/Widgets public/cesium/ && \
    cp -R node_modules/cesium/Build/Cesium/ThirdParty public/cesium/

# Step 3: Start dev server
CMD ["npm", "run", "dev"]
