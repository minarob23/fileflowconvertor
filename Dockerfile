# Use Node.js 20 as base image
FROM node:20-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libreoffice \
    libreoffice-writer \
    libreoffice-calc \
    libreoffice-impress \
    python3 \
    python3-pip \
    python3-dev \
    poppler-utils \
    default-jre \
    default-jdk \
    build-essential \
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
RUN pip3 install --no-cache-dir --upgrade pip && \
    pip3 install --no-cache-dir -r server/requirements.txt --break-system-packages

# Copy application files
COPY . .

# Build the application
RUN npm run build

# Create necessary directories
RUN mkdir -p uploads converted

# Make startup script executable
RUN chmod +x start.sh

# Expose port
EXPOSE 5000

# Set environment variables
ENV PORT=5000
ENV NODE_ENV=production
ENV PYTHONUNBUFFERED=1

# Start the application
CMD ["bash", "start.sh"]
