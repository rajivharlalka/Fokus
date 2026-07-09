export interface Flight {
  flightNumber: string;
  airline: string;
  status: 'scheduled' | 'active' | 'landed' | 'cancelled' | 'delayed';
  departure: {
    airport: string;
    iata: string;
    scheduled: string;
    estimated?: string;
    actual?: string | null;
    terminal: string;
    gate: string;
  };
  arrival: {
    airport: string;
    iata: string;
    scheduled: string;
    estimated?: string;
    actual?: string | null;
    terminal: string;
    gate: string;
  };
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
}

export const getMockFlight = (flightNumber: string): Flight => {
  const now = new Date();
  const departure = new Date(now.getTime() + 2 * 60 * 60 * 1000);
  const arrival = new Date(departure.getTime() + 5 * 60 * 60 * 1000);

  const flights: Record<string, Flight> = {
    AA100: {
      flightNumber: 'AA100',
      airline: 'American Airlines',
      status: 'scheduled',
      departure: {
        airport: 'San Francisco International Airport',
        iata: 'SFO',
        scheduled: departure.toISOString(),
        terminal: '2',
        gate: 'A12',
      },
      arrival: {
        airport: 'John F Kennedy International Airport',
        iata: 'JFK',
        scheduled: arrival.toISOString(),
        terminal: '4',
        gate: 'B23',
      },
      aircraft: {
        registration: 'N12345',
        type: 'Boeing 737-800',
      },
      live: {
        latitude: 37.7749,
        longitude: -122.4194,
        altitude: 35000,
        speed: 450,
        direction: 90,
      },
    },
    DL200: {
      flightNumber: 'DL200',
      airline: 'Delta Air Lines',
      status: 'active',
      departure: {
        airport: 'Los Angeles International Airport',
        iata: 'LAX',
        scheduled: new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString(),
        terminal: 'B',
        gate: '47',
      },
      arrival: {
        airport: "O'Hare International Airport",
        iata: 'ORD',
        scheduled: new Date(now.getTime() + 3 * 60 * 60 * 1000).toISOString(),
        terminal: '1',
        gate: 'C18',
      },
      aircraft: {
        registration: 'N67890',
        type: 'Airbus A320',
      },
      live: {
        latitude: 34.0522,
        longitude: -118.2437,
        altitude: 38000,
        speed: 480,
        direction: 75,
      },
    },
    UA300: {
      flightNumber: 'UA300',
      airline: 'United Airlines',
      status: 'delayed',
      departure: {
        airport: "O'Hare International Airport",
        iata: 'ORD',
        scheduled: new Date(now.getTime() + 4 * 60 * 60 * 1000).toISOString(),
        terminal: '1',
        gate: 'B6',
      },
      arrival: {
        airport: 'London Heathrow Airport',
        iata: 'LHR',
        scheduled: new Date(now.getTime() + 12 * 60 * 60 * 1000).toISOString(),
        terminal: '2',
        gate: 'A10',
      },
      aircraft: {
        registration: 'N11223',
        type: 'Boeing 787-9 Dreamliner',
      },
    },
  };

  return (
    flights[flightNumber] || {
      flightNumber: flightNumber,
      airline: 'Demo Airlines',
      status: 'scheduled',
      departure: {
        airport: 'San Francisco International Airport',
        iata: 'SFO',
        scheduled: departure.toISOString(),
        terminal: '2',
        gate: 'A12',
      },
      arrival: {
        airport: 'John F Kennedy International Airport',
        iata: 'JFK',
        scheduled: arrival.toISOString(),
        terminal: '4',
        gate: 'B23',
      },
      aircraft: {
        registration: 'N99999',
        type: 'Boeing 737-800',
      },
    }
  );
};

export const searchFlight = async (flightNumber: string): Promise<Flight> => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500));
  return getMockFlight(flightNumber.toUpperCase());
};
