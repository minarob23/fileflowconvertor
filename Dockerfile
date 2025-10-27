# Use Node.js 20 as base image
FROM node:20-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libreoffice \
    python3 \
    python3-pip \
    poppler-utils \
    default-jre \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy Python requirements
COPY server/requirements.txt ./server/

# Install Python dependencies
RUN pip3 install --no-cache-dir -r server/requirements.txt --break-system-packages

# Copy application files
COPY . .

# Build the application
RUN npm run build

# Create necessary directories
RUN mkdir -p uploads converted

# Expose port
EXPOSE 5000

# Set environment variable
ENV PORT=5000
ENV NODE_ENV=production

# Start the application
CMD ["npm", "run", "start"]
