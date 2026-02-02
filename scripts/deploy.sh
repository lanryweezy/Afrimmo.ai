#!/bin/bash

# Production Deployment Script

set -e  # Exit immediately if a command exits with a non-zero status

echo "Starting production deployment..."

# Check if we're in the correct directory
if [ ! -f "package.json" ]; then
  echo "Error: package.json not found. Please run this script from the project root."
  exit 1
fi

# Validate environment
echo "Validating environment..."
if [ -z "$VITE_GEMINI_API_KEY" ]; then
  echo "Warning: VITE_GEMINI_API_KEY is not set. The application may not work correctly."
fi

# Install dependencies
echo "Installing dependencies..."
npm ci

# Run validation checks
echo "Running validation checks..."
npm run validate

# Build the application
echo "Building application..."
npm run build:prod

# Verify build
if [ ! -d "dist" ] || [ -z "$(ls -A dist)" ]; then
  echo "Error: Build failed - dist directory is empty or does not exist."
  exit 1
fi

echo "Build completed successfully!"

# Optional: Run production server for verification
echo "Previewing build locally..."
npm run preview:prod &

PREVIEW_PID=$!
sleep 5  # Wait for server to start

# Test if server is responding
if curl -f http://localhost:3000/ > /dev/null 2>&1; then
  echo "Preview server is responding correctly."
else
  echo "Warning: Preview server may not be responding correctly."
fi

# Kill the preview server
kill $PREVIEW_PID

echo "Deployment preparation complete!"
echo "Files are ready in the 'dist' directory."
echo ""
echo "Next steps:"
echo "- Upload contents of 'dist' directory to your web server"
echo "- Ensure your server serves index.html for 404s (for client-side routing)"
echo "- Configure SSL/TLS certificates"
echo "- Set up monitoring and error reporting"