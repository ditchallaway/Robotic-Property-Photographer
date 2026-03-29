FROM node:18-bullseye as builder

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

# Final stage
FROM node:18-bullseye-slim

# Install Chromium & dependencies
RUN apt-get update && apt-get install -y \
    chromium-browser \
    libxss1 \
    libappindicator1 \
    libindicator7 \
    fonts-liberation \
    xdg-utils \
    ca-certificates \
    libnss3 \
    libgbm1 \
    libpango-1.0-0 \
    libpango-gobject-0 \
    libxrandr2 \
    libxcomposite1 \
    && rm -rf /var/lib/apt/lists/*

# Install tini for PID 1 signal handling
RUN apt-get update && apt-get install -y tini && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy built dependencies from builder
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./

# Copy source code
COPY src ./src

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Use tini as PID 1 to properly handle signals
ENTRYPOINT ["/usr/bin/tini", "--"]

CMD ["node", "src/index.js"]
