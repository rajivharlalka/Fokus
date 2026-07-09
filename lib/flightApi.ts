import type { Flight, WeatherInfo } from './types';
import { AIRPORTS, POPULAR_ROUTES } from './types';
import { getDelayMinutes, getFlightProgress, getTimelineStage, normalizeStatus } from './utils';

function withCoords(flight: Flight): Flight {
  const dep = AIRPORTS[flight.departure.iata];
  const arr = AIRPORTS[flight.arrival.iata];
  const enriched: Flight = {
    ...flight,
    departure: {
      ...flight.departure,
      // Prefer live airport name; fill city/coords from catalog when known
      city: flight.departure.city || dep?.city,
      latitude: flight.departure.latitude ?? dep?.lat,
      longitude: flight.departure.longitude ?? dep?.lon,
      delayMinutes: getDelayMinutes(flight.departure.scheduled, flight.departure.estimated),
    },
    arrival: {
      ...flight.arrival,
      city: flight.arrival.city || arr?.city,
      latitude: flight.arrival.latitude ?? arr?.lat,
      longitude: flight.arrival.longitude ?? arr?.lon,
      delayMinutes: getDelayMinutes(flight.arrival.scheduled, flight.arrival.estimated),
    },
  };
  enriched.stage = getTimelineStage(enriched);
  enriched.progress = getFlightProgress(enriched);
  return enriched;
}

export const getMockFlight = (flightNumber: string): Flight => {
  const now = new Date();
  const code = flightNumber.toUpperCase().trim();

  // Mock catalog mirrors common real routes for offline/demo use
  const catalog: Record<string, Flight> = {
    AA100: withCoords({
      flightNumber: 'AA100',
      airline: 'American Airlines',
      status: 'scheduled',
      source: 'mock',
      departure: {
        airport: AIRPORTS.JFK.name,
        iata: 'JFK',
        city: 'New York',
        scheduled: new Date(now.getTime() + 2.5 * 60 * 60 * 1000).toISOString(),
        estimated: new Date(now.getTime() + 2.5 * 60 * 60 * 1000).toISOString(),
        terminal: '8',
        gate: 'A12',
      },
      arrival: {
        airport: AIRPORTS.LHR.name,
        iata: 'LHR',
        city: 'London',
        scheduled: new Date(now.getTime() + 9.5 * 60 * 60 * 1000).toISOString(),
        estimated: new Date(now.getTime() + 9.5 * 60 * 60 * 1000).toISOString(),
        terminal: '3',
        gate: 'B23',
      },
      aircraft: { registration: 'N12345', type: 'Boeing 777-300ER' },
    }),
    DL200: withCoords({
      flightNumber: 'DL200',
      airline: 'Delta Air Lines',
      status: 'active',
      source: 'mock',
      progress: 55,
      departure: {
        airport: AIRPORTS.ATL.name,
        iata: 'ATL',
        city: 'Atlanta',
        scheduled: new Date(now.getTime() - 8 * 60 * 60 * 1000).toISOString(),
        estimated: new Date(now.getTime() - 8 * 60 * 60 * 1000).toISOString(),
        actual: new Date(now.getTime() - 7.8 * 60 * 60 * 1000).toISOString(),
        terminal: 'I',
        gate: 'E12',
      },
      arrival: {
        airport: AIRPORTS.JNB.name,
        iata: 'JNB',
        city: 'Johannesburg',
        scheduled: new Date(now.getTime() + 6 * 60 * 60 * 1000).toISOString(),
        estimated: new Date(now.getTime() + 5.5 * 60 * 60 * 1000).toISOString(),
        terminal: 'A',
        gate: 'A6',
      },
      aircraft: { registration: 'N860DA', type: 'Airbus A350-900' },
      live: {
        latitude: 5.2,
        longitude: -20.4,
        altitude: 39000,
        speed: 510,
        direction: 110,
      },
    }),
    UA300: withCoords({
      flightNumber: 'UA300',
      airline: 'United Airlines',
      status: 'scheduled',
      source: 'mock',
      departure: {
        airport: AIRPORTS.SFO.name,
        iata: 'SFO',
        city: 'San Francisco',
        scheduled: new Date(now.getTime() + 3 * 60 * 60 * 1000).toISOString(),
        estimated: new Date(now.getTime() + 3 * 60 * 60 * 1000).toISOString(),
        terminal: '3',
        gate: 'F6',
      },
      arrival: {
        airport: AIRPORTS.HNL.name,
        iata: 'HNL',
        city: 'Honolulu',
        scheduled: new Date(now.getTime() + 8.5 * 60 * 60 * 1000).toISOString(),
        estimated: new Date(now.getTime() + 8.5 * 60 * 60 * 1000).toISOString(),
        terminal: '2',
        gate: 'C4',
      },
      aircraft: { registration: 'N29961', type: 'Boeing 777-200' },
    }),
    BA178: withCoords({
      flightNumber: 'BA178',
      airline: 'British Airways',
      status: 'active',
      source: 'mock',
      progress: 40,
      departure: {
        airport: AIRPORTS.JFK.name,
        iata: 'JFK',
        city: 'New York',
        scheduled: new Date(now.getTime() - 3 * 60 * 60 * 1000).toISOString(),
        estimated: new Date(now.getTime() - 3 * 60 * 60 * 1000).toISOString(),
        actual: new Date(now.getTime() - 2.9 * 60 * 60 * 1000).toISOString(),
        terminal: '7',
        gate: '4',
      },
      arrival: {
        airport: AIRPORTS.LHR.name,
        iata: 'LHR',
        city: 'London',
        scheduled: new Date(now.getTime() + 4 * 60 * 60 * 1000).toISOString(),
        estimated: new Date(now.getTime() + 4 * 60 * 60 * 1000).toISOString(),
        terminal: '5',
        gate: 'A12',
      },
      aircraft: { registration: 'G-ZBJA', type: 'Boeing 787-10' },
      live: {
        latitude: 48.5,
        longitude: -40.2,
        altitude: 37000,
        speed: 490,
        direction: 70,
      },
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
  const from = popular ? AIRPORTS[popular.from] : AIRPORTS.JFK;
  const to = popular ? AIRPORTS[popular.to] : AIRPORTS.LHR;

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
  const depIata = (raw.departure?.iata || '').toUpperCase();
  const arrIata = (raw.arrival?.iata || '').toUpperCase();
  const depMeta = AIRPORTS[depIata];
  const arrMeta = AIRPORTS[arrIata];

  const flight: Flight = {
    flightNumber: String(flightNumber).toUpperCase(),
    airline: raw.airline?.name || 'Unknown Airline',
    status,
    source: 'live',
    departure: {
      airport: raw.departure?.airport || depMeta?.name || 'Unknown',
      iata: depIata || 'XXX',
      city: depMeta?.city,
      scheduled: raw.departure?.scheduled,
      estimated: raw.departure?.estimated || raw.departure?.scheduled,
      actual: raw.departure?.actual,
      terminal: raw.departure?.terminal || '—',
      gate: raw.departure?.gate || '—',
    },
    arrival: {
      airport: raw.arrival?.airport || arrMeta?.name || 'Unknown',
      iata: arrIata || 'XXX',
      city: arrMeta?.city,
      scheduled: raw.arrival?.scheduled,
      estimated: raw.arrival?.estimated || raw.arrival?.scheduled,
      actual: raw.arrival?.actual,
      terminal: raw.arrival?.terminal || '—',
      gate: raw.arrival?.gate || '—',
    },
    aircraft: {
      registration: raw.aircraft?.registration || '—',
      type: raw.aircraft?.iata || raw.aircraft?.icao || raw.aircraft?.registration || '—',
      modeS: raw.aircraft?.icao24?.toUpperCase(),
      source:
        raw.aircraft?.registration || raw.aircraft?.iata || raw.aircraft?.icao
          ? 'aviationstack'
          : 'unavailable',
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

async function enrichAircraft(flight: Flight): Promise<Flight> {
  const identifier =
    flight.aircraft.registration !== '—'
      ? flight.aircraft.registration
      : flight.aircraft.modeS;

  if (!identifier) return flight;

  try {
    const res = await fetch(
      `https://api.adsbdb.com/v0/aircraft/${encodeURIComponent(identifier)}`,
      { next: { revalidate: 86400 } } as RequestInit
    );
    if (!res.ok) return flight;

    const json = await res.json();
    const aircraft = json?.response?.aircraft;
    if (!aircraft) return flight;

    return {
      ...flight,
      aircraft: {
        registration: aircraft.registration || flight.aircraft.registration,
        type:
          [aircraft.manufacturer, aircraft.type].filter(Boolean).join(' ') ||
          aircraft.icao_type ||
          flight.aircraft.type,
        manufacturer: aircraft.manufacturer,
        modeS: aircraft.mode_s || flight.aircraft.modeS,
        owner: aircraft.registered_owner,
        photoUrl: aircraft.url_photo,
        photoThumbnailUrl: aircraft.url_photo_thumbnail,
        source: 'adsbdb',
      },
    };
  } catch (error) {
    console.error('ADSBdb aircraft lookup error:', error);
    return flight;
  }
}

/** Prefer today's active/scheduled flight over yesterday's landed one */
function pickBestFlight(rows: any[]): any | null {
  if (!rows?.length) return null;

  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;

  const scored = rows.map((row) => {
    const status = (row.flight_status || '').toLowerCase();
    const dep = row.departure?.scheduled ? Date.parse(row.departure.scheduled) : NaN;
    const arr = row.arrival?.scheduled ? Date.parse(row.arrival.scheduled) : NaN;
    let score = 0;

    if (status === 'active') score += 100;
    else if (status === 'scheduled') score += 80;
    else if (status === 'landed') score += 20;
    else if (status === 'cancelled') score -= 50;

    // Prefer flights whose departure is near "now" (today / upcoming)
    if (!Number.isNaN(dep)) {
      const delta = Math.abs(dep - now);
      if (delta < dayMs) score += 40;
      else if (delta < 2 * dayMs) score += 10;
      // Prefer future or very recent departures over old ones
      if (dep > now - 6 * 60 * 60 * 1000) score += 15;
    }

    // Prefer flights still in progress (arrival in the future)
    if (!Number.isNaN(arr) && arr > now) score += 25;

    return { row, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored[0]?.row || null;
}

export async function searchFlight(flightNumber: string): Promise<Flight> {
  const code = flightNumber.toUpperCase().trim();
  const apiKey = process.env.AVIATIONSTACK_API_KEY || process.env.NEXT_PUBLIC_AVIATIONSTACK_API_KEY;

  if (apiKey) {
    try {
      // HTTPS works on current AviationStack plans; allow override to HTTP if needed
      const useHttp = process.env.AVIATIONSTACK_USE_HTTP === 'true';
      const base = useHttp
        ? 'http://api.aviationstack.com/v1'
        : 'https://api.aviationstack.com/v1';
      // Fetch several results and pick the most relevant (not always [0], which can be yesterday)
      const url = `${base}/flights?access_key=${apiKey}&flight_iata=${encodeURIComponent(code)}&limit=10`;
      const res = await fetch(url);
      if (res.ok) {
        const json = await res.json();
        if (json?.error) {
          console.error('AviationStack API error:', json.error);
        } else {
          const best = pickBestFlight(json?.data || []);
          const mapped = mapAviationStackFlight(best);
          if (mapped) return enrichAircraft(mapped);
        }
      } else {
        console.error('AviationStack HTTP status:', res.status);
      }
    } catch (error) {
      console.error('AviationStack error, falling back to mock:', error);
    }
  }

  await new Promise((r) => setTimeout(r, 200));
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
