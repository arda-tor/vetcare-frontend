# Build stage
FROM node:18-alpine as build-stage

WORKDIR /app

# Accept build arguments (K8s compatible)
ARG VITE_API_BASE_URL=/api
ARG NODE_ENV=production

# Set environment variables from build args
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV NODE_ENV=$NODE_ENV

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies for build)
RUN npm ci --include=dev

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Install a simple static file server
RUN npm install -g serve

# Copy built application
COPY --from=build-stage /app/dist ./dist

# Create a simple health endpoint script
RUN echo '#!/bin/sh' > health-check.sh && \
    echo 'curl -f http://localhost:8080/ || exit 1' >> health-check.sh && \
    chmod +x health-check.sh

# Install curl for health checks
RUN apk add --no-cache curl

# Expose port 8080 (K8s friendly port)
EXPOSE 8080

# Add health check (K8s compatible)
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD ./health-check.sh

# Start the static file server
CMD ["serve", "-s", "dist", "-l", "8080"]