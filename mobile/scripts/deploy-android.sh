#!/bin/bash

# Android Deployment Script for Quadrant Todo
# This script builds and submits the Android app to Google Play Store

set -e

echo "======================================"
echo "Android Play Store Deployment Script"
echo "======================================"
echo ""

# Check if EAS CLI is installed
if ! command -v eas &> /dev/null; then
    echo "❌ EAS CLI is not installed. Installing..."
    npm install -g eas-cli
fi

# Login to Expo account
echo "📱 Logging into Expo account..."
eas login

# Configure project if not already configured
echo "⚙️  Configuring EAS project..."
eas build:configure

# Build for Android (production AAB for Play Store)
echo "🔨 Building Android app bundle for production..."
eas build --platform android --profile production-aab --non-interactive

echo ""
echo "✅ Android build completed!"
echo ""
echo "Next steps:"
echo "1. Download the .aab file from Expo dashboard"
echo "2. Or run: eas submit --platform android --profile production"
echo ""
echo "To submit automatically:"
echo "  eas submit --platform android --latest"
echo ""
