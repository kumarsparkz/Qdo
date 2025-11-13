#!/bin/bash

# iOS Deployment Script for Quadrant Todo
# This script builds and submits the iOS app to the App Store

set -e

echo "======================================"
echo "iOS App Store Deployment Script"
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

# Build for iOS (production)
echo "🔨 Building iOS app for production..."
eas build --platform ios --profile production --non-interactive

echo ""
echo "✅ iOS build completed!"
echo ""
echo "Next steps:"
echo "1. Download the .ipa file from Expo dashboard"
echo "2. Or run: eas submit --platform ios --profile production"
echo ""
echo "To submit automatically:"
echo "  eas submit --platform ios --latest"
echo ""
