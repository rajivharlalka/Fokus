export type FlightStatus =
  | 'scheduled'
  | 'boarding'
  | 'active'
  | 'landed'
  | 'cancelled'
  | 'delayed';

export interface AirportInfo {
  airport: string;
  iata: string;
  city?: string;
  scheduled: string;
  estimated?: string;
  actual?: string | null;
  terminal: string;
  gate: string;
  delayMinutes?: number;
  latitude?: number;
  longitude?: number;
}

export interface Flight {
  flightNumber: string;
  airline: string;
  status: FlightStatus;
  departure: AirportInfo;
  arrival: AirportInfo;
  aircraft: {
    registration: string;
    type: string;
  };
  live?: {
    latitude: number;
    longitude: number;
    altitude: number;
    speed: number;
    direction: number;
  } | null;
  progress?: number;
  source?: 'live' | 'mock';
  stage?: TimelineStage;
}

export type TimelineStage =
  | 'scheduled'
  | 'boarding'
  | 'departed'
  | 'enroute'
  | 'landed'
  | 'cancelled';

export interface WeatherInfo {
  tempC: number;
  tempF: number;
  condition: string;
  windKph: number;
  humidity: number;
  icon: string;
}

export interface AirportCoords {
  iata: string;
  name: string;
  city: string;
  lat: number;
  lon: number;
}

export const AIRPORTS: Record<string, AirportCoords> = {
  SFO: { iata: 'SFO', name: 'San Francisco International', city: 'San Francisco', lat: 37.6213, lon: -122.379 },
  JFK: { iata: 'JFK', name: 'John F Kennedy International', city: 'New York', lat: 40.6413, lon: -73.7781 },
  LAX: { iata: 'LAX', name: 'Los Angeles International', city: 'Los Angeles', lat: 33.9425, lon: -118.408 },
  ORD: { iata: 'ORD', name: "O'Hare International", city: 'Chicago', lat: 41.9742, lon: -87.9073 },
  LHR: { iata: 'LHR', name: 'London Heathrow', city: 'London', lat: 51.47, lon: -0.4543 },
  DXB: { iata: 'DXB', name: 'Dubai International', city: 'Dubai', lat: 25.2532, lon: 55.3657 },
  NRT: { iata: 'NRT', name: 'Narita International', city: 'Tokyo', lat: 35.772, lon: 140.3929 },
  ATL: { iata: 'ATL', name: 'Hartsfield-Jackson Atlanta', city: 'Atlanta', lat: 33.6407, lon: -84.4277 },
  SEA: { iata: 'SEA', name: 'Seattle-Tacoma International', city: 'Seattle', lat: 47.4502, lon: -122.3088 },
  MIA: { iata: 'MIA', name: 'Miami International', city: 'Miami', lat: 25.7959, lon: -80.287 },
  HNL: { iata: 'HNL', name: 'Daniel K. Inouye International', city: 'Honolulu', lat: 21.3187, lon: -157.9225 },
  JNB: { iata: 'JNB', name: 'O.R. Tambo International', city: 'Johannesburg', lat: -26.1392, lon: 28.246 },
  DAL: { iata: 'DAL', name: 'Dallas Love Field', city: 'Dallas', lat: 32.8471, lon: -96.8518 },
  TEB: { iata: 'TEB', name: 'Teterboro', city: 'Teterboro', lat: 40.8501, lon: -74.0608 },
  BOS: { iata: 'BOS', name: 'Logan International', city: 'Boston', lat: 42.3656, lon: -71.0096 },
  EWR: { iata: 'EWR', name: 'Newark Liberty International', city: 'Newark', lat: 40.6895, lon: -74.1745 },
  IAH: { iata: 'IAH', name: 'George Bush Intercontinental', city: 'Houston', lat: 29.9902, lon: -95.3368 },
  DEN: { iata: 'DEN', name: 'Denver International', city: 'Denver', lat: 39.8561, lon: -104.6737 },
};

/** Labels match real AviationStack routes for these flight numbers */
export const POPULAR_ROUTES = [
  { code: 'AA100', from: 'JFK', to: 'LHR', label: 'New York to London' },
  { code: 'BA178', from: 'JFK', to: 'LHR', label: 'New York to London' },
  { code: 'UA300', from: 'SFO', to: 'HNL', label: 'San Francisco to Honolulu' },
  { code: 'DL200', from: 'ATL', to: 'JNB', label: 'Atlanta to Johannesburg' },
  { code: 'EK201', from: 'JFK', to: 'DXB', label: 'New York to Dubai' },
  { code: 'NH9', from: 'SFO', to: 'NRT', label: 'San Francisco to Tokyo' },
];
