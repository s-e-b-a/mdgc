#!/bin/bash
set -e

TAG="${1:-inventory-frontend:latest}"

echo "Building Docker image with tag: $TAG"
docker build -t "$TAG" .

echo "Docker image built successfully: $TAG"
