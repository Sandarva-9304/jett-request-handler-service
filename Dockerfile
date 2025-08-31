# ---------- Build Stage ----------
FROM node:20-slim AS builder

WORKDIR /app

# Copy manifest files
COPY package*.json tsconfig.json ./

# Install all deps (dev included for build)
RUN npm install

# Copy source
COPY src ./src

# Build TypeScript -> dist
RUN npm run build

# ---------- Runtime Stage ----------
FROM node:20-slim

WORKDIR /app

# Copy only package.json for prod deps
COPY package*.json ./

# Install only production dependencies
RUN npm install --production

# Copy built JS from builder
COPY --from=builder /app/dist ./dist

# Expose the port (optional, for documentation)
EXPOSE 7860

# Start request handler service
CMD ["node", "dist/index.js"]
