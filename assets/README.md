# Assets Folder

This folder contains image assets for the Flight Tracker app.

## Required Assets

Before building the app for production, replace the placeholder images with actual assets:

### App Icon (`icon.png`)
- **Size**: 1024x1024 pixels
- **Format**: PNG with transparency
- **Usage**: App icon on iOS home screen
- **Design**: Should represent flight/aviation theme

### Splash Screen (`splash.png`)
- **Size**: 1242x2436 pixels (or larger)
- **Format**: PNG
- **Usage**: Displayed while app is loading
- **Background**: Matches the color in app.json (#1a73e8)

### Adaptive Icon (`adaptive-icon.png`)
- **Size**: 1024x1024 pixels
- **Format**: PNG with transparency
- **Usage**: Android adaptive icon
- **Note**: Keep important content in center 66% area

### Favicon (`favicon.png`)
- **Size**: 48x48 pixels (or larger)
- **Format**: PNG
- **Usage**: Web version favicon

### Notification Icon (`notification-icon.png`)
- **Size**: 96x96 pixels
- **Format**: PNG with transparency
- **Usage**: Push notification icon (Android)
- **Note**: Should be white icon on transparent background

## Design Guidelines

### Color Palette
- Primary: #1a73e8 (Blue)
- Success: #4CAF50 (Green)
- Warning: #FF9800 (Orange)
- Error: #F44336 (Red)

### Icon Design
Consider using:
- Airplane silhouette
- Flight path arrow
- Globe with plane
- Minimal and modern design

## Generating Assets

You can use these tools to generate app assets:

1. **Expo Asset Generator**: Built into Expo
2. **App Icon Generator**: https://appicon.co
3. **Figma**: Design custom icons
4. **Adobe Illustrator/Photoshop**: Professional design tools

## Quick Start

To quickly get started with proper assets:

1. Create a 1024x1024 icon with your design
2. Use an online tool like [MakeAppIcon](https://makeappicon.com/) to generate all sizes
3. Replace the placeholder files in this folder
4. Run `expo start` to apply changes
