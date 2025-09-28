# Use Node.js 18 LTS
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY server/package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY server/ ./

# Create data directory for JSON files
RUN mkdir -p data

# Expose port
EXPOSE $PORT

# Start the application
CMD ["npm", "start"]