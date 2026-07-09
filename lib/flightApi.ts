import type { Flight, WeatherInfo } from './types';
import { AIRPORTS, POPULAR_ROUTES } from './types';
import { getDelayMinutes, getFlightProgress, getTimelineStage, normalizeStatus } from './utils';

function withCoords(flight: Flight): Flight {
  const dep = AIRPORTS[flight.departure.iata];
  const arr = AIRPORTS[flight.arrival.iata];
  return {
    ...flight,
    departure: {
      ...flight.departure,
      city: dep?.city || flight.departure.city,
      latitude: dep?.lat,
      longitude: dep?.lon,
      delayMinutes: getDelayMinutes(flight.departure.scheduled, flight.departure.estimated),
    },
    arrival: {
      ...flight.arrival,
      city: arr?.city || flight.arrival.city,
      latitude: arr?.lat,
      longitude: arr?.lon,
      delayMinutes: getDelayMinutes(flight.arrival.scheduled, flight.arrival.estimated),
    },
    stage: getTimelineStage(flight),
    progress: getFlightProgress(flight),
  };
}

export const getMockFlight = (flightNumber: string): Flight => {
  const now = new Date();
  const code = flightNumber.toUpperCase().trim();

  const catalog: Record<string, Flight> = {
    AA100: withCoords({
      flightNumber: 'AA100',
      airline: 'American Airlines',
      status: 'scheduled',
      source: 'mock',
      departure: {
        airport: AIRPORTS.SFO.name,
        iata: 'SFO',
        city: 'San Francisco',
        scheduled: new Date(now.getTime() + 2.5 * 60 * 60 * 1000).toISOString(),
        estimated: new Date(now.getTime() + 2.5 * 60 * 60 * 1000).toISOString(),
        terminal: '2',
        gate: 'A12',
      },
      arrival: {
        airport: AIRPORTS.JFK.name,
        iata: 'JFK',
        city: 'New York',
        scheduled: new Date(now.getTime() + 8 * 60 * 60 * 1000).toISOString(),
        estimated: new Date(now.getTime() + 8 * 60 * 60 * 1000).toISOString(),
        terminal: '8',
        gate: 'B23',
      },
      aircraft: { registration: 'N12345', type: 'Boeing 737-800' },
    }),
    DL200: withCoords({
      flightNumber: 'DL200',
      airline: 'Delta Air Lines',
      status: 'active',
      source: 'mock',
      progress: 42,
      departure: {
        airport: AIRPORTS.LAX.name,
        iata: 'LAX',
        city: 'Los Angeles',
        scheduled: new Date(now.getTime() - 1.5 * 60 * 60 * 1000).toISOString(),
        estimated: new Date(now.getTime() - 1.5 * 60 * 60 * 1000).toISOString(),
        actual: new Date(now.getTime() - 1.4 * 60 * 60 * 1000).toISOString(),
        terminal: 'B',
        gate: '47',
      },
      arrival: {
        airport: AIRPORTS.ORD.name,
        iata: 'ORD',
        city: 'Chicago',
        scheduled: new Date(now.getTime() + 2.5 * 60 * 60 * 1000).toISOString(),
        estimated: new Date(now.getTime() + 2.3 * 60 * 60 * 1000).toISOString(),
        terminal: '1',
        gate: 'C18',
      },
      aircraft: { registration: 'N67890', type: 'Airbus A320' },
      live: {
        latitude: 36.8,
        longitude: -105.2,
        altitude: 38000,
        speed: 480,
        direction: 75,
      },
    }),
    UA300: withCoords({
      flightNumber: 'UA300',
      airline: 'United Airlines',
      status: 'delayed',
      source: 'mock',
      departure: {
        airport: AIRPORTS.ORD.name,
        iata: 'ORD',
        city: 'Chicago',
        scheduled: new Date(now.getTime() + 3 * 60 * 60 * 1000).toISOString(),
        estimated: new Date(now.getTime() + 3.75 * 60 * 60 * 1000).toISOString(),
        terminal: '1',
        gate: 'B6',
      },
      arrival: {
        airport: AIRPORTS.LHR.name,
        iata: 'LHR',
        city: 'London',
        scheduled: new Date(now.getTime() + 11 * 60 * 60 * 1000).toISOString(),
        estimated: new Date(now.getTime() + 11.75 * 60 * 60 * 1000).toISOString(),
        terminal: '2',
        gate: 'A10',
      },
      aircraft: { registration: 'N11223', type: 'Boeing 787-9 Dreamliner' },
    }),
    BA178: withCoords({
      flightNumber: 'BA178',
      airline: 'British Airways',
      status: 'boarding',
      source: 'mock',
      departure: {
        airport: AIRPORTS.JFK.name,
        iata: 'JFK',
        city: 'New York',
        scheduled: new Date(now.getTime() + 35 * 60 * 1000).toISOString(),
        estimated: new Date(now.getTime() + 35 * 60 * 1000).toISOString(),
        terminal: '7',
        gate: '4',
      },
      arrival: {
        airport: AIRPORTS.LHR.name,
        iata: 'LHR',
        city: 'London',
        scheduled: new Date(now.getTime() + 7.5 * 60 * 60 * 1000).toISOString(),
        estimated: new Date(now.getTime() + 7.5 * 60 * 60 * 1000).toISOString(),
        terminal: '5',
        gate: 'A12',
      },
      aircraft: { registration: 'G-ZBJA', type: 'Boeing 787-10' },
    }),
    EK201: withCoords({
      flightNumber: 'EK201',
      airline: 'Emirates',
      status: 'scheduled',
      source: 'mock',
      departure: {
        airport: AIRPORTS.JFK.name,
        iata: 'JFK',
        city: 'New York',
        scheduled: new Date(now.getTime() + 6 * 60 * 60 * 1000).toISOString(),
        estimated: new Date(now.getTime() + 6 * 60 * 60 * 1000).toISOString(),
        terminal: '4',
        gate: 'B32',
      },
      arrival: {
        airport: AIRPORTS.DXB.name,
        iata: 'DXB',
        city: 'Dubai',
        scheduled: new Date(now.getTime() + 18 * 60 * 60 * 1000).toISOString(),
        estimated: new Date(now.getTime() + 18 * 60 * 60 * 1000).toISOString(),
        terminal: '3',
        gate: 'C8',
      },
      aircraft: { registration: 'A6-EUA', type: 'Airbus A380' },
    }),
    NH9: withCoords({
      flightNumber: 'NH9',
      airline: 'All Nippon Airways',
      status: 'active',
      source: 'mock',
      progress: 68,
      departure: {
        airport: AIRPORTS.SFO.name,
        iata: 'SFO',
        city: 'San Francisco',
        scheduled: new Date(now.getTime() - 6 * 60 * 60 * 1000).toISOString(),
        actual: new Date(now.getTime() - 5.8 * 60 * 60 * 1000).toISOString(),
        terminal: 'I',
        gate: 'G94',
      },
      arrival: {
        airport: AIRPORTS.NRT.name,
        iata: 'NRT',
        city: 'Tokyo',
        scheduled: new Date(now.getTime() + 4 * 60 * 60 * 1000).toISOString(),
        estimated: new Date(now.getTime() + 3.7 * 60 * 60 * 1000).toISOString(),
        terminal: '1',
        gate: '44',
      },
      aircraft: { registration: 'JA873A', type: 'Boeing 787-9' },
      live: {
        latitude: 45.2,
        longitude: -155.4,
        altitude: 39000,
        speed: 510,
        direction: 285,
      },
    }),
  };

  if (catalog[code]) return catalog[code];

  const popular = POPULAR_ROUTES.find((r) => r.code === code);
  const from = popular ? AIRPORTS[popular.from] : AIRPORTS.SFO;
  const to = popular ? AIRPORTS[popular.to] : AIRPORTS.JFK;

  return withCoords({
    flightNumber: code || 'XX000',
    airline: 'Demo Airlines',
    status: 'scheduled',
    source: 'mock',
    departure: {
      airport: from.name,
      iata: from.iata,
      city: from.city,
      scheduled: new Date(now.getTime() + 3 * 60 * 60 * 1000).toISOString(),
      estimated: new Date(now.getTime() + 3 * 60 * 60 * 1000).toISOString(),
      terminal: '1',
      gate: 'A1',
    },
    arrival: {
      airport: to.name,
      iata: to.iata,
      city: to.city,
      scheduled: new Date(now.getTime() + 8 * 60 * 60 * 1000).toISOString(),
      estimated: new Date(now.getTime() + 8 * 60 * 60 * 1000).toISOString(),
      terminal: '2',
      gate: 'B2',
    },
    aircraft: { registration: 'N00000', type: 'Boeing 737-800' },
  });
};

function mapAviationStackFlight(raw: any): Flight | null {
  if (!raw) return null;
  const flightNumber = raw.flight?.iata || raw.flight?.icao || raw.flight?.number;
  if (!flightNumber) return null;

  const status = normalizeStatus(raw.flight_status);
  const flight: Flight = {
    flightNumber: String(flightNumber).toUpperCase(),
    airline: raw.airline?.name || 'Unknown Airline',
    status,
    source: 'live',
    departure: {
      airport: raw.departure?.airport || 'Unknown',
      iata: (raw.departure?.iata || 'XXX').toUpperCase(),
      scheduled: raw.departure?.scheduled,
      estimated: raw.departure?.estimated || raw.departure?.scheduled,
      actual: raw.departure?.actual,
      terminal: raw.departure?.terminal || '—',
      gate: raw.departure?.gate || '—',
    },
    arrival: {
      airport: raw.arrival?.airport || 'Unknown',
      iata: (raw.arrival?.iata || 'XXX').toUpperCase(),
      scheduled: raw.arrival?.scheduled,
      estimated: raw.arrival?.estimated || raw.arrival?.scheduled,
      actual: raw.arrival?.actual,
      terminal: raw.arrival?.terminal || '—',
      gate: raw.arrival?.gate || '—',
    },
    aircraft: {
      registration: raw.aircraft?.registration || '—',
      type: raw.aircraft?.iata || raw.aircraft?.icao || '—',
    },
    live: raw.live
      ? {
          latitude: raw.live.latitude,
          longitude: raw.live.longitude,
          altitude: raw.live.altitude,
          speed: raw.live.speed_horizontal,
          direction: raw.live.direction,
        }
      : null,
  };

  return withCoords(flight);
}

export async function searchFlight(flightNumber: string): Promise<Flight> {
  const code = flightNumber.toUpperCase().trim();
  const apiKey = process.env.AVIATIONSTACK_API_KEY || process.env.NEXT_PUBLIC_AVIATIONSTACK_API_KEY;

  if (apiKey) {
    try {
      // Free tier uses HTTP; paid plans support HTTPS
      const base = process.env.AVIATIONSTACK_USE_HTTPS === 'true'
        ? 'https://api.aviationstack.com/v1'
        : 'http://api.aviationstack.com/v1';
      const url = `${base}/flights?access_key=${apiKey}&flight_iata=${encodeURIComponent(code)}&limit=1`;
      const res = await fetch(url);
      if (res.ok) {
        const json = await res.json();
        if (json?.error) {
          console.error('AviationStack API error:', json.error);
        } else {
          const mapped = mapAviationStackFlight(json?.data?.[0]);
          if (mapped) return mapped;
        }
      }
    } catch (error) {
      console.error('AviationStack error, falling back to mock:', error);
    }
  }

  // Simulate network for mock path
  await new Promise((r) => setTimeout(r, 350));
  return getMockFlight(code);
}

export async function fetchWeather(lat: number, lon: number): Promise<WeatherInfo | null> {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    const current = data.current;
    if (!current) return null;

    const code = current.weather_code as number;
    const condition = weatherCodeToText(code);
    const tempC = Math.round(current.temperature_2m);
    return {
      tempC,
      tempF: Math.round((tempC * 9) / 5 + 32),
      condition,
      windKph: Math.round(current.wind_speed_10m),
      humidity: current.relative_humidity_2m,
      icon: weatherCodeToIcon(code),
    };
  } catch {
    return null;
  }
}

function weatherCodeToText(code: number): string {
  if (code === 0) return 'Clear';
  if (code <= 3) return 'Partly cloudy';
  if (code <= 48) return 'Foggy';
  if (code <= 57) return 'Drizzle';
  if (code <= 67) return 'Rain';
  if (code <= 77) return 'Snow';
  if (code <= 82) return 'Showers';
  if (code <= 99) return 'Thunderstorm';
  return 'Unknown';
}

function weatherCodeToIcon(code: number): string {
  if (code === 0) return '☀️';
  if (code <= 3) return '⛅';
  if (code <= 48) return '🌫️';
  if (code <= 67) return '🌧️';
  if (code <= 77) return '❄️';
  if (code <= 82) return '🌦️';
  if (code <= 99) return '⛈️';
  return '🌤️';
}
