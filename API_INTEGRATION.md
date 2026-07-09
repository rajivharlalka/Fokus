# Flight API Integration Guide

This document explains how to integrate different flight data APIs with the Flight Tracker app.

## Supported APIs

### 1. OpenSky Network (Default - Free)

**Status**: ✅ Implemented  
**Cost**: Free  
**API Key Required**: No  
**Rate Limit**: Fair use policy  
**Documentation**: https://opensky-network.org/apidoc/

#### Features
- Real-time aircraft positions
- Global coverage
- No registration required
- Community-driven data

#### Setup
Already configured by default. No additional setup needed!

```javascript
// In src/services/flightApi.js
this.useOpenSky = true; // Default
```

#### Limitations
- No flight number search (uses mock data as fallback)
- Limited historical data
- No gate information
- Rate limiting on heavy usage

---

### 2. AviationStack (Recommended)

**Status**: ✅ Implemented  
**Cost**: Free tier (100 requests/month), Paid plans available  
**API Key Required**: Yes  
**Rate Limit**: Based on plan  
**Documentation**: https://aviationstack.com/documentation

#### Features
- Comprehensive flight data
- Flight schedules
- Historical data
- Airport information
- Real-time updates
- Gate and terminal info

#### Setup

1. **Sign up** at https://aviationstack.com/product

2. **Get your API key** from the dashboard

3. **Configure the app**:

```javascript
// In src/services/flightApi.js
const AVIATION_STACK_API_KEY = 'your_api_key_here';
this.useOpenSky = false; // Switch to AviationStack
```

4. **Restart the app**

#### Pricing
- **Free**: 100 requests/month
- **Basic**: $9.99/month - 10,000 requests
- **Professional**: $49.99/month - 100,000 requests
- **Enterprise**: Custom pricing

#### Example API Call

```javascript
// Search flight by IATA code
GET http://api.aviationstack.com/v1/flights?access_key=YOUR_KEY&flight_iata=AA100

// Response
{
  "data": [{
    "flight_date": "2024-01-15",
    "flight_status": "scheduled",
    "departure": {
      "airport": "San Francisco International",
      "iata": "SFO",
      "scheduled": "2024-01-15T10:00:00+00:00",
      "terminal": "2",
      "gate": "A12"
    },
    "arrival": {
      "airport": "John F Kennedy International",
      "iata": "JFK",
      "scheduled": "2024-01-15T18:30:00+00:00",
      "terminal": "4",
      "gate": "B23"
    },
    "airline": {
      "name": "American Airlines"
    },
    "flight": {
      "iata": "AA100"
    }
  }]
}
```

---

### 3. FlightAware AeroAPI

**Status**: 🔄 Ready to implement  
**Cost**: Paid (various plans)  
**API Key Required**: Yes  
**Documentation**: https://www.flightaware.com/commercial/aeroapi/

#### Features
- Industry-leading accuracy
- Comprehensive flight tracking
- Predictive flight arrival times
- Weather data integration
- Push notifications support

#### Setup (Not yet implemented)

1. Sign up at FlightAware
2. Subscribe to a plan
3. Add integration to `src/services/flightApi.js`

```javascript
// Example implementation
const FLIGHTAWARE_API_KEY = 'your_api_key';
const FLIGHTAWARE_BASE_URL = 'https://aeroapi.flightaware.com/aeroapi';

async searchFlightAware(flightNumber) {
  const response = await axios.get(
    `${FLIGHTAWARE_BASE_URL}/flights/${flightNumber}`,
    {
      headers: {
        'x-apikey': FLIGHTAWARE_API_KEY
      }
    }
  );
  return response.data;
}
```

---

### 4. FlightStats (Cirium)

**Status**: 📋 Not implemented  
**Cost**: Paid (enterprise)  
**API Key Required**: Yes  
**Documentation**: https://www.cirium.com/

#### Features
- Enterprise-grade data
- Global coverage
- Historical data
- Airport delays
- Fleet tracking

---

### 5. RapidAPI Flight Data

**Status**: 📋 Not implemented  
**Cost**: Freemium  
**API Key Required**: Yes  
**Documentation**: https://rapidapi.com/

RapidAPI hosts multiple flight APIs including:
- Flight Data API
- Skyscanner Flight Search
- Amadeus Flight APIs

---

## Implementation Guide

### Adding a New API Provider

1. **Create API client** in `src/services/flightApi.js`:

```javascript
class FlightAPI {
  constructor() {
    this.provider = 'aviationstack'; // or 'opensky', 'flightaware'
  }

  async searchByFlightNumber(flightNumber) {
    switch(this.provider) {
      case 'aviationstack':
        return this.searchAviationStack(flightNumber);
      case 'opensky':
        return this.searchOpenSky(flightNumber);
      case 'flightaware':
        return this.searchFlightAware(flightNumber);
      default:
        return this.getMockFlightData(flightNumber);
    }
  }

  async searchYourAPI(flightNumber) {
    // Implement your API call
    const response = await axios.get('YOUR_API_ENDPOINT', {
      params: { flight: flightNumber },
      headers: { 'Authorization': 'Bearer YOUR_KEY' }
    });
    
    // Format data to match app structure
    return this.formatYourAPIData(response.data);
  }

  formatYourAPIData(data) {
    // Convert API response to app format
    return {
      flightNumber: data.flightCode,
      airline: data.airlineName,
      status: data.flightStatus,
      departure: {
        airport: data.origin.name,
        iata: data.origin.code,
        scheduled: data.departureTime,
        // ... more fields
      },
      arrival: {
        // ... similar structure
      },
      aircraft: {
        // ... aircraft info
      }
    };
  }
}
```

2. **Update environment config**:

```javascript
// .env.example
YOUR_API_KEY=your_key_here
```

3. **Add API selection** in settings (future feature)

---

## Data Format Standard

All APIs should return data in this format:

```javascript
{
  flightNumber: string,        // e.g., "AA100"
  airline: string,             // e.g., "American Airlines"
  status: string,              // "scheduled", "active", "landed", "cancelled", "delayed"
  
  departure: {
    airport: string,           // Full name
    iata: string,              // 3-letter code
    scheduled: string,         // ISO 8601 datetime
    estimated: string,         // ISO 8601 datetime
    actual: string | null,     // ISO 8601 datetime
    terminal: string,          // Terminal number/letter
    gate: string               // Gate number/letter
  },
  
  arrival: {
    // Same structure as departure
  },
  
  aircraft: {
    registration: string,      // e.g., "N12345"
    iata: string              // e.g., "Boeing 737-800"
  },
  
  live: {                      // Optional - for active flights
    latitude: number,
    longitude: number,
    altitude: number,          // feet
    speed: number,             // knots
    direction: number          // degrees
  } | null
}
```

---

## Error Handling

### Rate Limiting

```javascript
async searchWithRetry(flightNumber, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await this.searchByFlightNumber(flightNumber);
    } catch (error) {
      if (error.response?.status === 429) {
        // Rate limited - wait and retry
        await this.sleep(2000 * (i + 1));
        continue;
      }
      throw error;
    }
  }
  // Fallback to mock data
  return this.getMockFlightData(flightNumber);
}
```

### API Failure Fallback

The app automatically falls back to mock data if:
- API key is invalid
- Network error occurs
- Rate limit is exceeded
- API is down

```javascript
try {
  const flight = await flightApi.searchByFlightNumber('AA100');
} catch (error) {
  // App automatically returns mock data
  console.log('Using mock data due to API error');
}
```

---

## Best Practices

### 1. Caching

Implement caching to reduce API calls:

```javascript
// Simple in-memory cache
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

async getCachedFlight(flightNumber) {
  const cached = cache.get(flightNumber);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  
  const fresh = await this.searchByFlightNumber(flightNumber);
  cache.set(flightNumber, { data: fresh, timestamp: Date.now() });
  return fresh;
}
```

### 2. Request Optimization

```javascript
// Batch requests when possible
async searchMultipleFlights(flightNumbers) {
  // Use Promise.all for parallel requests
  return Promise.all(
    flightNumbers.map(num => this.searchByFlightNumber(num))
  );
}
```

### 3. Environment Variables

Use environment variables for API keys:

```javascript
import Constants from 'expo-constants';

const API_KEY = Constants.manifest?.extra?.aviationStackKey || 
                process.env.AVIATION_STACK_API_KEY;
```

### 4. User Feedback

Show loading states and error messages:

```javascript
try {
  setLoading(true);
  const flight = await flightApi.searchByFlightNumber(number);
  setFlight(flight);
} catch (error) {
  Alert.alert('Error', 'Unable to fetch flight data. Please try again.');
} finally {
  setLoading(false);
}
```

---

## Testing APIs

### Test with Mock Data

```javascript
// In flightApi.js
this.useMockData = true; // Force mock data for testing
```

### Test with OpenSky (Free)

```javascript
this.useOpenSky = true;
// Test by searching nearby aircraft
await flightApi.getFlightsInArea({
  lamin: 37.0, lomin: -123.0,
  lamax: 38.0, lomax: -122.0
});
```

### Test with AviationStack

```javascript
// Small test script
const testFlight = async () => {
  const result = await flightApi.searchByFlightNumber('AA100');
  console.log('Flight data:', result);
};
```

---

## API Comparison Table

| Feature | OpenSky | AviationStack | FlightAware | Mock Data |
|---------|---------|---------------|-------------|-----------|
| Cost | Free | Free tier | Paid | Free |
| API Key | No | Yes | Yes | No |
| Flight Search | ❌ | ✅ | ✅ | ✅ |
| Live Position | ✅ | Limited | ✅ | ✅ |
| Gate Info | ❌ | ✅ | ✅ | ✅ |
| Historical | Limited | ✅ | ✅ | ❌ |
| Rate Limit | Fair use | 100/month | Based on plan | Unlimited |

---

## Getting Help

- **AviationStack Support**: support@aviationstack.com
- **OpenSky Community**: https://opensky-network.org/community
- **FlightAware**: https://flightaware.com/commercial/aeroapi/support

---

**Current Implementation**: OpenSky (default) + AviationStack (optional) with Mock Data fallback
