# Use Node.js LTS (Long Term Support) version
FROM node:22-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the TypeScript code
RUN npm run build

# --- Production Stage ---
FROM node:22-alpine

WORKDIR /app

# Copy package files for production dependency installation
COPY package*.json ./

# Install only production dependencies
RUN npm install --only=production

# Copy built files from builder stage
COPY --from=builder /app/dist ./dist
# Copy env file if needed, though usually envs are passed via docker-compose
# COPY .env .env

# Expose the port (matches server.ts)
EXPOSE 5000

# Start the server
CMD ["node", "dist/server.js"]
