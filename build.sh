#!/bin/bash

# Get version from package.json
VERSION=$(node -p "require('./package.json').version")

# Build Docker image with latest tag
docker build -t nianxy/demo-server:latest .

# Build Docker image with version tag
docker tag nianxy/demo-server:latest nianxy/demo-server:v${VERSION}

echo ""
echo "Build completed!"
echo "Images:"
echo "  nianxy/demo-server:latest"
echo "  nianxy/demo-server:v${VERSION}"
echo ""
echo "To run the container:"
echo "  docker run --rm --name demo-server \\"
echo "    -p 3000:3000 \\"
echo "    --env-file .env \\"
echo "    nianxy/demo-server:latest"
