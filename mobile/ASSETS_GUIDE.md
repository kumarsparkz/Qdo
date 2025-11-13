# App Assets Guide

This guide explains the required assets for Quadrant Todo mobile app deployment.

## Required Assets

### 1. App Icon (`assets/icon.png`)

**Specifications**:
- **Size**: 1024×1024 pixels
- **Format**: PNG
- **Background**: Should be included (no transparency for iOS)
- **Usage**: Main app icon shown on home screen

**Design Tips**:
- Use simple, recognizable design
- Ensure it looks good at small sizes
- Test on both light and dark backgrounds
- Consider using a 4-quadrant design that represents the app's purpose

### 2. Splash Screen (`assets/splash.png`)

**Specifications**:
- **Size**: 1242×2688 pixels (iPhone 14 Pro Max size)
- **Format**: PNG
- **Background**: White (#ffffff)
- **Usage**: Shown when app is launching

**Design Tips**:
- Keep it simple and clean
- Use brand colors
- Center important elements
- Consider showing app icon or logo

### 3. Adaptive Icon (`assets/adaptive-icon.png`)

**Specifications** (Android only):
- **Size**: 1024×1024 pixels
- **Format**: PNG
- **Safe Zone**: Keep important content in center 66% (684×684px)
- **Usage**: Android adaptive icon system

**Design Tips**:
- Design will be masked into different shapes
- Avoid putting important elements near edges
- Test with different shape masks

### 4. Favicon (`assets/favicon.png`)

**Specifications** (Web only):
- **Size**: 48×48 pixels
- **Format**: PNG
- **Usage**: Browser tab icon

## iOS App Store Assets

Required for App Store listing (not in repository):

### Screenshots

1. **6.5" Display** (iPhone 14 Pro Max)
   - Size: 1284×2778 pixels
   - Required: 3-10 screenshots
   - Capture: Use iOS Simulator

2. **5.5" Display** (iPhone 8 Plus)
   - Size: 1242×2208 pixels
   - Required: 3-10 screenshots
   - Capture: Use iOS Simulator

**Tips for Screenshots**:
- Show key features
- Use real content (not lorem ipsum)
- Highlight the 4-quadrant interface
- Show task management features
- Include drag-and-drop functionality

## Android Play Store Assets

Required for Play Store listing (not in repository):

### Screenshots

1. **Phone Screenshots**
   - Min: 320px on shortest side
   - Max: 3840px on longest side
   - Required: 2-8 screenshots
   - Capture: Use Android Emulator

2. **7" Tablet** (Optional)
   - Same size requirements
   - 1-8 screenshots

3. **10" Tablet** (Optional)
   - Same size requirements
   - 1-8 screenshots

### Feature Graphic

**Specifications**:
- **Size**: 1024×500 pixels
- **Format**: PNG or JPEG
- **Usage**: Featured in Play Store

**Design Tips**:
- Include app name and tagline
- Show app screenshot or key features
- Use brand colors
- Keep text readable at small sizes

### Promo Video (Optional)

- **Length**: 30 seconds to 2 minutes
- **Format**: YouTube URL
- **Content**: Demo of key features

## Asset Creation Tools

### Recommended Tools

1. **Figma** (Free for individuals)
   - Great for icon and UI design
   - Export at multiple sizes
   - https://figma.com

2. **Canva** (Free with paid options)
   - Templates for app store assets
   - Easy screenshot annotation
   - https://canva.com

3. **GIMP** (Free)
   - Open-source image editor
   - Good for photo editing
   - https://gimp.org

4. **Sketch** (Mac only, paid)
   - Professional design tool
   - iOS icon templates
   - https://sketch.com

### Screenshot Tools

1. **iOS Simulator** (Mac)
   ```bash
   # Take screenshot
   Cmd + S
   ```

2. **Android Emulator**
   ```bash
   # Take screenshot
   Screenshot button in toolbar
   ```

3. **Device Screenshot**
   - Use actual device for best quality
   - iOS: Volume Up + Side button
   - Android: Volume Down + Power button

## Asset Checklist

### Before Building

- [ ] App icon created (1024×1024px)
- [ ] Splash screen created (1242×2688px)
- [ ] Adaptive icon created (1024×1024px)
- [ ] Favicon created (48×48px)
- [ ] All assets placed in `mobile/assets/` directory

### Before iOS Submission

- [ ] 6.5" iPhone screenshots (3-10)
- [ ] 5.5" iPhone screenshots (3-10)
- [ ] iPad screenshots (optional)
- [ ] Preview video (optional)
- [ ] Screenshots show actual app content
- [ ] Text is readable in all screenshots

### Before Android Submission

- [ ] Phone screenshots (2-8)
- [ ] Tablet screenshots (optional)
- [ ] Feature graphic (1024×500px)
- [ ] App icon uploaded (512×512px)
- [ ] Promo video uploaded (optional)

## Current Assets Status

Check the `mobile/assets/` directory for existing assets:

```bash
ls -la mobile/assets/
```

If any assets are missing, create them using the specifications above.

## Testing Assets

### Test App Icon

1. **iOS**:
   ```bash
   cd mobile
   npm run ios
   # Check home screen icon
   ```

2. **Android**:
   ```bash
   cd mobile
   npm run android
   # Check home screen icon
   ```

### Test Splash Screen

Run the app and observe the splash screen during launch.

## Asset Updates

When updating assets:

1. Replace files in `mobile/assets/`
2. Clear cache:
   ```bash
   cd mobile
   rm -rf .expo
   npm start -- --clear
   ```
3. Test on both platforms
4. Rebuild for production:
   ```bash
   eas build --platform all --profile production
   ```

## Need Help?

- **Expo Asset Documentation**: https://docs.expo.dev/develop/user-interface/assets/
- **iOS HIG**: https://developer.apple.com/design/human-interface-guidelines/app-icons
- **Material Design**: https://m3.material.io/styles/icons/applying-icons
- **App Store Screenshots Guide**: https://developer.apple.com/app-store/product-page/

---

**Last Updated**: November 2025
