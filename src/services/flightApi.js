import axios from 'axios';

// Configuration for flight data API
// You'll need to get API keys from:
// - AviationStack: https://aviationstack.com/
// - FlightAware: https://www.flightaware.com/commercial/aeroapi/
// - AeroDataBox: https://www.aerodatabox.com/

const AVIATION_STACK_API_KEY = 'YOUR_AVIATION_STACK_API_KEY';
const AVIATION_STACK_BASE_URL = 'http://api.aviationstack.com/v1';

// Alternative: OpenSky Network (free, no API key required)
const OPENSKY_BASE_URL = 'https://opensky-network.org/api';

class FlightAPI {
  constructor() {
    this.useOpenSky = true; // Use free OpenSky API by default
  }

  /**
   * Search for flights by flight number
   */
  async searchByFlightNumber(flightNumber) {
    try {
      if (this.useOpenSky) {
        // OpenSky doesn't support direct flight number search
        // Return mock data for demonstration
        return this.getMockFlightData(flightNumber);
      }

      const response = await axios.get(`${AVIATION_STACK_BASE_URL}/flights`, {
        params: {
          access_key: AVIATION_STACK_API_KEY,
          flight_iata: flightNumber,
        },
      });

      return this.formatFlightData(response.data.data[0]);
    } catch (error) {
      console.error('Error fetching flight data:', error);
      // Return mock data as fallback
      return this.getMockFlightData(flightNumber);
    }
  }

  /**
   * Get real-time flights in a geographic area
   */
  async getFlightsInArea(bounds) {
    try {
      const { lamin, lamax, lomin, lomax } = bounds;
      const response = await axios.get(
        `${OPENSKY_BASE_URL}/states/all`,
        {
          params: {
            lamin,
            lomin,
            lamax,
            lomax,
          },
        }
      );

      if (response.data && response.data.states) {
        return response.data.states.map(this.formatOpenSkyData);
      }

      return [];
    } catch (error) {
      console.error('Error fetching area flights:', error);
      return [];
    }
  }

  /**
   * Track specific flight by callsign
   */
  async trackFlight(callsign) {
    try {
      const response = await axios.get(
        `${OPENSKY_BASE_URL}/tracks/all`,
        {
          params: {
            icao24: callsign.toLowerCase(),
            time: Math.floor(Date.now() / 1000),
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error tracking flight:', error);
      return null;
    }
  }

  /**
   * Format OpenSky data to our app format
   */
  formatOpenSkyData(state) {
    return {
      callsign: state[1]?.trim() || 'Unknown',
      origin_country: state[2] || 'Unknown',
      longitude: state[5],
      latitude: state[6],
      altitude: state[7],
      velocity: state[9],
      heading: state[10],
      vertical_rate: state[11],
      on_ground: state[8],
      last_contact: new Date(state[4] * 1000),
    };
  }

  /**
   * Format Aviation Stack data
   */
  formatFlightData(flight) {
    if (!flight) return null;

    return {
      flightNumber: flight.flight?.iata || flight.flight?.icao || 'N/A',
      airline: flight.airline?.name || 'Unknown Airline',
      status: flight.flight_status || 'unknown',
      departure: {
        airport: flight.departure?.airport || 'Unknown',
        iata: flight.departure?.iata || 'N/A',
        scheduled: flight.departure?.scheduled || null,
        estimated: flight.departure?.estimated || null,
        actual: flight.departure?.actual || null,
        terminal: flight.departure?.terminal || 'N/A',
        gate: flight.departure?.gate || 'N/A',
      },
      arrival: {
        airport: flight.arrival?.airport || 'Unknown',
        iata: flight.arrival?.iata || 'N/A',
        scheduled: flight.arrival?.scheduled || null,
        estimated: flight.arrival?.estimated || null,
        actual: flight.arrival?.actual || null,
        terminal: flight.arrival?.terminal || 'N/A',
        gate: flight.arrival?.gate || 'N/A',
      },
      aircraft: {
        registration: flight.aircraft?.registration || 'N/A',
        iata: flight.aircraft?.iata || 'N/A',
      },
      live: flight.live || null,
    };
  }

  /**
   * Mock data for demonstration purposes
   */
  getMockFlightData(flightNumber) {
    const now = new Date();
    const departure = new Date(now.getTime() + 2 * 60 * 60 * 1000);
    const arrival = new Date(departure.getTime() + 5 * 60 * 60 * 1000);

    return {
      flightNumber: flightNumber,
      airline: 'Demo Airlines',
      status: 'scheduled',
      departure: {
        airport: 'San Francisco International Airport',
        iata: 'SFO',
        scheduled: departure.toISOString(),
        estimated: departure.toISOString(),
        actual: null,
        terminal: '2',
        gate: 'A12',
      },
      arrival: {
        airport: 'John F. Kennedy International Airport',
        iata: 'JFK',
        scheduled: arrival.toISOString(),
        estimated: arrival.toISOString(),
        actual: null,
        terminal: '4',
        gate: 'B23',
      },
      aircraft: {
        registration: 'N12345',
        iata: 'Boeing 737-800',
      },
      live: {
        latitude: 37.7749,
        longitude: -122.4194,
        altitude: 35000,
        speed: 450,
        direction: 90,
      },
    };
  }

  /**
   * Get popular routes and recent flights
   */
  async getPopularFlights() {
    return [
      'AA100',
      'DL200',
      'UA300',
      'SW400',
      'BA500',
      'LH600',
    ];
  }
}

export default new FlightAPI();
