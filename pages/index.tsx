import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Flight, getMockFlight } from '@/lib/flightApi';
import { formatFlightTime, getStatusColor, getStatusText } from '@/lib/utils';

export default function Home() {
  const [trackedFlights, setTrackedFlights] = useState<Flight[]>([]);

  useEffect(() => {
    // Load tracked flights from localStorage
    const stored = localStorage.getItem('trackedFlights');
    if (stored) {
      setTrackedFlights(JSON.parse(stored));
    } else {
      // Add some example flights
      const examples = [getMockFlight('AA100'), getMockFlight('DL200')];
      setTrackedFlights(examples);
      localStorage.setItem('trackedFlights', JSON.stringify(examples));
    }
  }, []);

  return (
    <>
      <Head>
        <title>Flight Tracker - Track Your Flights</title>
        <meta name="description" content="Track flights in real-time" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-primary text-white p-4 shadow-md">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold">✈️ Flight Tracker</h1>
          </div>
        </header>

        <div className="max-w-4xl mx-auto p-4">
          {/* Search Button */}
          <Link
            href="/search"
            className="block bg-primary text-white text-center text-lg font-semibold py-4 px-6 rounded-xl shadow-lg hover:bg-blue-600 transition-colors mb-6"
          >
            🔍 Search Flights
          </Link>

          {/* Tracked Flights Section */}
          <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-800">Tracked Flights</h2>
          </div>

          {trackedFlights.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">✈️</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                No Tracked Flights
              </h3>
              <p className="text-gray-600">
                Search for a flight to start tracking
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {trackedFlights.map((flight, index) => (
                <Link
                  key={index}
                  href={`/flight/${flight.flightNumber}`}
                  className="block bg-white rounded-2xl p-4 shadow-md hover:shadow-lg transition-shadow"
                >
                  {/* Flight Header */}
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-bold text-gray-800">
                      {flight.flightNumber}
                    </h3>
                    <span
                      className="px-3 py-1 rounded-full text-white text-xs font-bold"
                      style={{ backgroundColor: getStatusColor(flight.status) }}
                    >
                      {getStatusText(flight.status)}
                    </span>
                  </div>

                  {/* Route */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex-1">
                      <div className="text-3xl font-bold text-gray-800">
                        {flight.departure.iata}
                      </div>
                      <div className="text-base font-semibold text-gray-800 mt-1">
                        {formatFlightTime(flight.departure.scheduled)}
                      </div>
                    </div>

                    <div className="flex items-center px-4">
                      <div className="w-5 h-0.5 bg-primary"></div>
                      <span className="text-xl mx-1">✈️</span>
                      <div className="w-5 h-0.5 bg-primary"></div>
                    </div>

                    <div className="flex-1 text-right">
                      <div className="text-3xl font-bold text-gray-800">
                        {flight.arrival.iata}
                      </div>
                      <div className="text-base font-semibold text-gray-800 mt-1">
                        {formatFlightTime(flight.arrival.scheduled)}
                      </div>
                    </div>
                  </div>

                  {/* Airline */}
                  <div className="text-sm text-gray-600 text-center">
                    {flight.airline}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
