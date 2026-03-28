#!/bin/bash
set -e

TAG="${1:-inventory-frontend:latest}"
PORT="${2:-80}"

echo "Running Docker container from image: $TAG on port $PORT"
docker run -d -p "$PORT:80" --name inventory-frontend "$TAG"

echo "Container started! Access the application at http://localhost:$PORT"
