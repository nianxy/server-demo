#!/bin/bash

source ./.env

if [ ! -z "$ECR_HOST" ]; then
  echo "With ECR: $ECR_HOST"
  ECR_REGION=$(echo $ECR_HOST | cut -d '.' -f4)
  TAG_NAME="$ECR_HOST/nianxy/demo-server"
else
  TAG_NAME="nianxy/demo-server"
fi

# Get version from package.json
VERSION=$(node -p "require('./package.json').version")

# Build Docker image with latest tag
docker build -t $TAG_NAME:latest .

# Build Docker image with version tag
docker tag $TAG_NAME:latest $TAG_NAME:v${VERSION}

echo ""
echo "Build completed!"
echo "Images:"
echo "  $TAG_NAME:latest"
echo "  $TAG_NAME:v${VERSION}"
echo ""
echo "To run the container:"
echo "  docker run --rm --name demo-server \\"
echo "    -p 3000:3000 \\"
echo "    --env-file .env \\"
echo "    $TAG_NAME:latest"
echo ""

if [ ! -z "$ECR_HOST" ]; then
  echo "If you want to push the image to AWS ECR, run:"
  echo "  aws ecr get-login-password --region $ECR_REGION | docker login --username AWS --password-stdin $ECR_HOST"
  echo "  docker push $TAG_NAME:latest"
  echo "  docker push $TAG_NAME:v${VERSION}"
  echo ""
fi