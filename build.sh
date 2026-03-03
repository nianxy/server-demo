#!/bin/bash

# Build Docker image
docker build -t nianxy/demo-server:latest .

echo ""
echo "Build completed!"
echo "Image: nianxy/demo-server:latest"
echo ""
echo "To run the container:"
echo "  docker run --rm --name demo-server \\"
echo "    -p 3000:3000 \\"
echo "    --env-file .env \\"
echo "    nianxy/demo-server:latest"
