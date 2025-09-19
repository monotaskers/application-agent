#!/bin/bash

# Navigate to the agent directory
cd "$(dirname "$0")/../agent" || exit 1

# Load environment variables from .env file in project root if it exists
if [ -f ../.env ]; then
    echo "Loading environment variables from .env file..."
    set -a  # Export all variables
    source ../.env
    set +a  # Stop exporting
else
    echo "Warning: No .env file found. Make sure OPENAI_API_KEY is set."
fi

# Activate the virtual environment
source .venv/bin/activate

# Run the agent
.venv/bin/python agent.py
