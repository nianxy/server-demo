#!/bin/bash

# Load environment variables from .env file
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
    echo "Loaded environment variables from .env"
else
    echo "Warning: .env file not found, using default environment variables"
fi

# Run database migrations
echo "Running database migrations..."
npm run migrate

# Start the server
echo "Starting server..."
npm start
