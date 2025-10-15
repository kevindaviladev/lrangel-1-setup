#!/bin/bash

# Script to update profileID in environment files
# Usage: ./update-profile-id.sh <profile_id>

# Check if argument is provided
if [ -z "$1" ]; then
    echo "Error: Please provide a profile ID"
    echo "Usage: ./update-profile-id.sh <profile_id>"
    exit 1
fi

PROFILE_ID=$1

# Validate that input is a number
if ! [[ "$PROFILE_ID" =~ ^[0-9]+$ ]]; then
    echo "Error: Profile ID must be a number"
    exit 1
fi

# Define file paths
ENV_PROD="src/environments/environment.ts"
ENV_DEV="src/environments/environment.development.ts"

# Check if files exist
if [ ! -f "$ENV_PROD" ]; then
    echo "Error: $ENV_PROD not found"
    exit 1
fi

if [ ! -f "$ENV_DEV" ]; then
    echo "Error: $ENV_DEV not found"
    exit 1
fi

# Backup files (optional but recommended)
cp "$ENV_PROD" "$ENV_PROD.backup"
cp "$ENV_DEV" "$ENV_DEV.backup"

# Update profileID in both files using sed
# This will replace the line containing "profileID:" with the new value
sed -i '' "s/profileID: [0-9]*/profileID: $PROFILE_ID/" "$ENV_PROD"
sed -i '' "s/profileID: [0-9]*/profileID: $PROFILE_ID/" "$ENV_DEV"

echo "✓ Successfully updated profileID to $PROFILE_ID in:"
echo "  - $ENV_PROD"
echo "  - $ENV_DEV"
echo ""
echo "Backup files created:"
echo "  - $ENV_PROD.backup"
echo "  - $ENV_DEV.backup"

