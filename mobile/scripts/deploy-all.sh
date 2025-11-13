#!/bin/bash

# Deploy to Both iOS App Store and Android Play Store
# This script builds and submits to both platforms

set -e

echo "=========================================="
echo "Quadrant Todo - Full Deployment Script"
echo "=========================================="
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

echo ""
echo "Starting builds for both platforms..."
echo ""

# Build for both platforms
echo "🔨 Building for iOS and Android..."
eas build --platform all --profile production --non-interactive

echo ""
echo "✅ Builds completed for both platforms!"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Next Steps:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1. Check build status:"
echo "   eas build:list"
echo ""
echo "2. Submit to stores (after builds complete):"
echo "   eas submit --platform ios --latest"
echo "   eas submit --platform android --latest"
echo ""
echo "3. Or submit to both:"
echo "   eas submit --platform all --latest"
echo ""
echo "4. Monitor in EAS dashboard:"
echo "   https://expo.dev"
echo ""
