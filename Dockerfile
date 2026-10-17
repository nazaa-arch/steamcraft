# Production Dockerfile for STEAM-Craft Platform
FROM node:24-alpine

# Set environment
ENV NODE_ENV=production
ENV PORT=3000
WORKDIR /app

# Copy application files
COPY package*.json ./
RUN npm install --omit=dev

COPY . .

# Expose server port
EXPOSE 3000

# Start production server
CMD ["node", "server.js"]
