#!/bin/sh
set -eu

IMAGE_NAME=${IMAGE_NAME:-pharmalingo-backend}
CONTAINER_NAME=${CONTAINER_NAME:-pharmalingo-backend-dev}
PORT=${PORT:-8000}
ENV_FILE=${ENV_FILE:-.env}

if [ ! -f "$ENV_FILE" ]; then
  echo "Missing $ENV_FILE. Copy .env.example to .env first."
  exit 1
fi

cleanup() {
  docker rm -f "$CONTAINER_NAME" >/dev/null 2>&1 || true
}

trap cleanup EXIT

docker build -t "$IMAGE_NAME" .
docker run -d --name "$CONTAINER_NAME" -p "$PORT:8000" --env-file "$ENV_FILE" "$IMAGE_NAME" >/dev/null

echo "Waiting for backend on http://localhost:$PORT/health ..."

for _ in 1 2 3 4 5 6 7 8 9 10; do
  if curl -fsS "http://localhost:$PORT/health" >/dev/null; then
    curl -s "http://localhost:$PORT/health"
    echo
    echo "Backend is ready."
    exit 0
  fi
  sleep 1
done

echo "Backend did not become ready in time."
exit 1
