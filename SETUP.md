# Quick Setup Guide

Get the Flight Tracker app running in under 5 minutes!

## Prerequisites Check

```bash
# Check Node.js (need v14+)
node --version

# Check npm
npm --version

# Install Expo CLI globally (if not installed)
npm install -g expo-cli
```

## Installation Steps

### 1. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- React Native
- Expo
- React Navigation
- React Native Maps
- Axios
- And more...

### 2. Start the Development Server

```bash
npm start
```

or

```bash
expo start
```

This will:
- Start Metro bundler
- Open Expo DevTools in your browser
- Show a QR code for testing on physical devices

### 3. Run on iOS

**Option A: iOS Simulator** (Requires macOS + Xcode)
```bash
npm run ios
```

**Option B: Physical iPhone**
1. Install **Expo Go** app from App Store
2. Scan the QR code with Camera app
3. App will open in Expo Go

**Option C: Web Preview** (Limited functionality)
```bash
npm run web
```

## Testing the App

### Without API Key (Default - Mock Data)

The app works out of the box with mock flight data:

1. Tap "Search Flights"
2. Search for: **AA100**, **DL200**, or **UA300**
3. View flight details
4. Enable flight tracking

### With Real Flight Data (Optional)

#### Using OpenSky Network (Free)

1. Open `src/services/flightApi.js`
2. Ensure `this.useOpenSky = true` (default)
3. No API key needed!
4. Provides real-time aircraft positions

#### Using AviationStack (Recommended)

1. Sign up at https://aviationstack.com/
2. Get your free API key (100 requests/month)
3. Open `src/services/flightApi.js`
4. Update:
```javascript
const AVIATION_STACK_API_KEY = 'your_api_key_here';
this.useOpenSky = false;
```
5. Restart the app

## Common Issues & Fixes

### Issue: "Module not found"
```bash
# Clear cache and reinstall
rm -rf node_modules
npm install
expo start -c
```

### Issue: "Maps not showing"
- Maps require a physical device or simulator
- Web preview has limited map support
- Ensure internet connection is active

### Issue: "Notifications not working"
- Notifications only work on physical devices
- iOS Simulator cannot receive push notifications
- Grant notification permissions when prompted

### Issue: Metro bundler port already in use
```bash
# Kill the process on port 19000
lsof -ti:19000 | xargs kill -9

# Or use a different port
expo start --port 19001
```

### Issue: Xcode build fails
```bash
# Clean Xcode cache
cd ios
rm -rf Pods
pod install
cd ..
expo start -c
```

## Customization Quick Start

### Change App Name

Edit `app.json`:
```json
{
  "expo": {
    "name": "Your App Name",
    "slug": "your-app-slug"
  }
}
```

### Change Colors

Edit the styles in screen files or create a theme:

```javascript
// Common colors used in the app
const PRIMARY_COLOR = '#1a73e8';  // Blue
const SUCCESS_COLOR = '#4CAF50';  // Green
const WARNING_COLOR = '#FF9800';  // Orange
const ERROR_COLOR = '#F44336';    // Red
```

### Add Custom Flights

Edit `src/screens/SearchScreen.js`:

```javascript
const [recentSearches, setRecentSearches] = useState([
  'YOUR_FLIGHT_1',
  'YOUR_FLIGHT_2',
  'YOUR_FLIGHT_3',
]);
```

## Next Steps

1. **Test the app** with mock data
2. **Sign up for AviationStack** for real flight data
3. **Customize the design** to match your preferences
4. **Add features** like favorites, history, etc.
5. **Build for production** when ready

## Build for Production

### iOS App Store

```bash
# Configure in app.json
{
  "ios": {
    "bundleIdentifier": "com.yourcompany.flighttracker"
  }
}

# Build
expo build:ios
```

Follow Expo's guide: https://docs.expo.dev/distribution/app-stores/

## Resources

- **Expo Documentation**: https://docs.expo.dev
- **React Native Docs**: https://reactnative.dev
- **React Navigation**: https://reactnavigation.org
- **AviationStack API**: https://aviationstack.com/documentation
- **OpenSky API**: https://opensky-network.org/apidoc/

## Getting Help

- Check the main [README.md](README.md) for detailed documentation
- Search Expo forums: https://forums.expo.dev
- Check GitHub issues for common problems
- Read React Native troubleshooting guide

---

**Ready to fly?** 🛫

Run `npm start` and start tracking flights!
