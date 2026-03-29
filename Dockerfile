FROM node:20-bookworm-slim

# System dependencies (Chromium + WebGL)
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
    libgles2 \
    xdg-utils \
    ca-certificates \
    dumb-init \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Puppeteer config
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
ENV NODE_ENV=development
ENV CHROME_DISABLE_GPU_SANDBOX=1
ENV NODE_OPTIONS="--max-old-space-size=1024"

WORKDIR /app

# Dependencies
COPY package.json package-lock.json* ./
RUN npm install --legacy-peer-deps

# Copy project
COPY . .

# Pre-populate Cesium assets
RUN node scripts/copy-assets.cjs

ENTRYPOINT ["dumb-init", "--"]
CMD ["npm", "run", "dev"]
