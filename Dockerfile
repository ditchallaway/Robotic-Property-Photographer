FROM node:20-bookworm-slim

# -----------------------------
# System dependencies (Chromium + WebGL)
# -----------------------------
RUN apt-get update && apt-get install -y \
    chromium \
    chromium-driver \
    fonts-liberation \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdrm2 \
    libgbm1 \
    libgtk-3-0 \
    libnss3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    mesa-utils \
    libgl1 \
    libegl1 \
    xdg-utils \
    ca-certificates \
    dumb-init \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# -----------------------------
# Puppeteer hard guarantees
# -----------------------------
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
ENV NODE_ENV=production

# Prevent shared memory crashes
ENV CHROME_DISABLE_GPU_SANDBOX=1

WORKDIR /app

# -----------------------------
# Node deps
# -----------------------------
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

COPY . .

# -----------------------------
# Cesium physical asset migration
# -----------------------------
RUN mkdir -p public/cesium && \
    cp -R node_modules/cesium/Build/Cesium/Workers public/cesium/ && \
    cp -R node_modules/cesium/Build/Cesium/Assets public/cesium/ && \
    cp -R node_modules/cesium/Build/Cesium/Widgets public/cesium/ && \
    cp -R node_modules/cesium/Build/Cesium/ThirdParty public/cesium/

# -----------------------------
# Runtime safety
# -----------------------------
ENTRYPOINT ["dumb-init", "--"]

CMD ["npm", "run", "dev"]
