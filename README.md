# Flight Tracker iOS App

A comprehensive flight tracking application built with React Native and Expo, similar to Flighty. Track your flights end-to-end with real-time updates, notifications, and detailed flight information.

## Features

✈️ **Flight Search & Tracking**
- Search flights by flight number
- Real-time flight status updates
- Track multiple flights simultaneously

📍 **Live Flight Data**
- Current position on map
- Altitude, speed, and heading
- Estimated arrival times

🔔 **Smart Notifications**
- Gate change alerts
- Departure and arrival updates
- Delay notifications
- Boarding reminders

🗺️ **Interactive Map**
- View flight path
- Current aircraft position
- Airport locations

## Tech Stack

- **React Native** - Cross-platform mobile framework
- **Expo** - Development platform for React Native
- **React Navigation** - Navigation library
- **React Native Maps** - Interactive map component
- **Expo Notifications** - Push notification support
- **Axios** - HTTP client for API requests

## Installation

### Prerequisites

- Node.js (v14 or newer)
- npm or yarn
- Expo CLI
- iOS Simulator (Xcode) or physical iOS device
- Expo Go app (for testing on physical device)

### Setup

1. **Install dependencies**
```bash
npm install
# or
yarn install
```

2. **Configure Flight Data API** (Optional)

The app uses mock data by default. To get real flight data, sign up for one of these APIs:

- [AviationStack](https://aviationstack.com/) - Free tier available
- [FlightAware AeroAPI](https://www.flightaware.com/commercial/aeroapi/)
- [OpenSky Network](https://opensky-network.org/) - Free, no API key required

Update `src/services/flightApi.js` with your API key:

```javascript
const AVIATION_STACK_API_KEY = 'your_api_key_here';
```

3. **Start the development server**
```bash
npm start
# or
expo start
```

4. **Run on iOS**
```bash
npm run ios
# or
expo start --ios
```

## Project Structure

```
flight-tracker/
├── App.js                          # Main app entry point
├── app.json                        # Expo configuration
├── package.json                    # Dependencies
├── src/
│   ├── screens/
│   │   ├── HomeScreen.js          # Home screen with tracked flights
│   │   ├── SearchScreen.js        # Flight search interface
│   │   └── FlightDetailsScreen.js # Detailed flight information
│   ├── services/
│   │   ├── flightApi.js           # Flight data API integration
│   │   └── notificationService.js # Push notification handling
│   ├── utils/
│   │   └── dateUtils.js           # Date formatting utilities
│   └── components/                # Reusable components (to be added)
└── assets/                         # Images and static assets
```

## Usage

### Search for a Flight

1. Tap "Search Flights" on the home screen
2. Enter a flight number (e.g., AA100, DL200)
3. Tap search or press enter
4. View detailed flight information

### Track a Flight

1. Search for and open a flight
2. Tap the "+ Track Flight" button
3. Receive notifications for important updates
4. View tracked flights on the home screen

### View Flight Details

- **Status**: Current flight status (Scheduled, In Flight, Landed, etc.)
- **Timeline**: Departure and arrival times with gate information
- **Map**: Visual representation of flight position
- **Aircraft**: Aircraft type and registration
- **Live Data**: Altitude, speed, heading, and coordinates

## API Integration

### Current APIs

The app supports multiple flight data providers:

1. **OpenSky Network** (Default - Free)
   - No API key required
   - Real-time aircraft positions
   - Global coverage

2. **AviationStack** (Recommended for production)
   - Comprehensive flight data
   - Historical and real-time information
   - Free tier: 100 requests/month

3. **Mock Data** (Fallback)
   - Demonstration purposes
   - No internet required

### Adding Real Flight Data

To switch from mock data to real APIs:

1. Sign up for an API provider
2. Get your API key
3. Update `src/services/flightApi.js`:

```javascript
const AVIATION_STACK_API_KEY = 'YOUR_API_KEY';
this.useOpenSky = false; // Set to true for OpenSky, false for AviationStack
```

## Building for Production

### iOS App Store

1. **Configure app identifiers**

Update `app.json`:
```json
{
  "expo": {
    "ios": {
      "bundleIdentifier": "com.yourcompany.flighttracker"
    }
  }
}
```

2. **Build the app**
```bash
expo build:ios
```

3. **Submit to App Store**
Follow [Expo's deployment guide](https://docs.expo.dev/distribution/app-stores/)

## Customization

### App Icon and Splash Screen

1. Replace `assets/icon.png` with your app icon (1024x1024)
2. Replace `assets/splash.png` with your splash screen
3. Run `expo start` to regenerate assets

### Theme Colors

Update colors in individual screen styles or create a central theme file:

```javascript
const colors = {
  primary: '#1a73e8',
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
};
```

## Troubleshooting

### Common Issues

**Maps not displaying**
- Ensure you have internet connection
- Check that location permissions are granted

**Notifications not working**
- Grant notification permissions in iOS Settings
- Test on a physical device (notifications don't work in simulator)

**API errors**
- Verify your API key is correct
- Check API rate limits
- Use mock data as fallback

## Future Enhancements

- [ ] Save favorite flights
- [ ] Flight history
- [ ] Airport information
- [ ] Weather at destination
- [ ] Baggage claim information
- [ ] Share flight status
- [ ] Apple Watch companion app
- [ ] Widget support
- [ ] Dark mode

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for your own applications.

## Support

For issues and questions:
- Open an issue on GitHub
- Check Expo documentation: https://docs.expo.dev
- React Native documentation: https://reactnative.dev

---

Built with ❤️ using React Native and Expo
