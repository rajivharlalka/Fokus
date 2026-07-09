import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Flight, getMockFlight } from '@/lib/flightApi';
import {
  formatFlightTime,
  formatFlightDate,
  getTimeUntilFlight,
  getFlightDuration,
  getStatusColor,
  getStatusText,
} from '@/lib/utils';

export default function FlightDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [flight, setFlight] = useState<Flight | null>(null);
  const [isTracking, setIsTracking] = useState(false);

  useEffect(() => {
    if (id && typeof id === 'string') {
      const flightData = getMockFlight(id);
      setFlight(flightData);

      // Check if already tracking
      const stored = localStorage.getItem('trackedFlights');
      if (stored) {
        const tracked = JSON.parse(stored);
        setIsTracking(tracked.some((f: Flight) => f.flightNumber === id));
      }
    }
  }, [id]);

  const handleTrack = () => {
    if (!flight) return;

    const stored = localStorage.getItem('trackedFlights');
    const tracked = stored ? JSON.parse(stored) : [];

    if (isTracking) {
      // Remove from tracking
      const filtered = tracked.filter(
        (f: Flight) => f.flightNumber !== flight.flightNumber
      );
      localStorage.setItem('trackedFlights', JSON.stringify(filtered));
      setIsTracking(false);
      alert('Flight tracking disabled');
    } else {
      // Add to tracking
      const exists = tracked.some(
        (f: Flight) => f.flightNumber === flight.flightNumber
      );
      if (!exists) {
        tracked.unshift(flight);
        localStorage.setItem('trackedFlights', JSON.stringify(tracked));
      }
      setIsTracking(true);
      alert('Flight tracking enabled! Check the home screen.');
    }
  };

  if (!flight) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-2">✈️</div>
          <p className="text-gray-600">Loading flight details...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{flight.flightNumber} - Flight Details</title>
      </Head>

      <main className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-primary text-white p-4 shadow-md">
          <div className="max-w-4xl mx-auto flex items-center">
            <Link href="/" className="text-white text-base font-semibold">
              ← Back
            </Link>
            <h1 className="flex-1 text-xl font-bold text-center mr-16">
              Flight Details
            </h1>
          </div>
        </header>

        <div className="max-w-4xl mx-auto p-4">
          {/* Flight Header */}
          <div className="bg-white rounded-t-2xl p-6 shadow-md">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-3xl font-bold text-gray-800">
                  {flight.flightNumber}
                </h2>
                <p className="text-base text-gray-600 mt-1">{flight.airline}</p>
              </div>
              <span
                className="px-4 py-2 rounded-full text-white text-sm font-bold"
                style={{ backgroundColor: getStatusColor(flight.status) }}
              >
                {getStatusText(flight.status)}
              </span>
            </div>

            <button
              onClick={handleTrack}
              className={`w-full py-4 rounded-xl font-semibold text-white transition-colors ${
                isTracking
                  ? 'bg-success hover:bg-green-600'
                  : 'bg-primary hover:bg-blue-600'
              }`}
            >
              {isTracking ? '✓ Tracking Enabled' : '+ Track This Flight'}
            </button>
          </div>

          {/* Flight Progress */}
          <div className="bg-white p-6 shadow-md border-t border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-3">
              Flight Progress
            </h3>
            <div className="mb-2">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full"
                  style={{ width: '40%' }}
                ></div>
              </div>
            </div>
            <p className="text-sm text-gray-600 text-center">
              {getTimeUntilFlight(flight.departure.scheduled)}
            </p>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-b-2xl p-6 shadow-md mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Flight Timeline
            </h3>

            {/* Departure */}
            <div className="flex gap-4 mb-6">
              <div className="flex flex-col items-center">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: getStatusColor(flight.status) }}
                ></div>
                <div className="w-0.5 h-16 bg-gray-300 my-1"></div>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="text-2xl font-bold text-gray-800">
                    {flight.departure.iata}
                  </h4>
                  <span className="text-lg font-semibold text-primary">
                    {formatFlightTime(flight.departure.scheduled)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-1">
                  {flight.departure.airport}
                </p>
                <p className="text-xs text-gray-500 mb-2">
                  {formatFlightDate(flight.departure.scheduled)}
                </p>
                <div className="flex gap-2">
                  <span className="px-2 py-1 bg-gray-100 text-xs text-gray-700 rounded">
                    Terminal {flight.departure.terminal}
                  </span>
                  <span className="px-2 py-1 bg-gray-100 text-xs text-gray-700 rounded">
                    Gate {flight.departure.gate}
                  </span>
                </div>
              </div>
            </div>

            {/* Arrival */}
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-4 h-4 rounded-full bg-gray-300"></div>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="text-2xl font-bold text-gray-800">
                    {flight.arrival.iata}
                  </h4>
                  <span className="text-lg font-semibold text-primary">
                    {formatFlightTime(flight.arrival.scheduled)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-1">
                  {flight.arrival.airport}
                </p>
                <p className="text-xs text-gray-500 mb-2">
                  {formatFlightDate(flight.arrival.scheduled)}
                </p>
                <div className="flex gap-2">
                  <span className="px-2 py-1 bg-gray-100 text-xs text-gray-700 rounded">
                    Terminal {flight.arrival.terminal}
                  </span>
                  <span className="px-2 py-1 bg-gray-100 text-xs text-gray-700 rounded">
                    Gate {flight.arrival.gate}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
              <span className="text-sm text-gray-600">Flight Duration</span>
              <span className="text-base font-semibold text-gray-800">
                {getFlightDuration(
                  flight.departure.scheduled,
                  flight.arrival.scheduled
                )}
              </span>
            </div>
          </div>

          {/* Aircraft Info */}
          <div className="bg-white rounded-2xl p-6 shadow-md mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Aircraft Information
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between py-3 border-b border-gray-100">
                <span className="text-sm text-gray-600">Aircraft Type</span>
                <span className="text-sm font-semibold text-gray-800">
                  {flight.aircraft.type}
                </span>
              </div>
              <div className="flex justify-between py-3">
                <span className="text-sm text-gray-600">Registration</span>
                <span className="text-sm font-semibold text-gray-800">
                  {flight.aircraft.registration}
                </span>
              </div>
            </div>
          </div>

          {/* Live Data */}
          {flight.live && (
            <div className="bg-white rounded-2xl p-6 shadow-md mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Live Data
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Altitude</p>
                  <p className="text-base font-semibold text-gray-800">
                    {flight.live.altitude.toLocaleString()} ft
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Speed</p>
                  <p className="text-base font-semibold text-gray-800">
                    {flight.live.speed} kts
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Heading</p>
                  <p className="text-base font-semibold text-gray-800">
                    {flight.live.direction}°
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Coordinates</p>
                  <p className="text-base font-semibold text-gray-800">
                    {flight.live.latitude.toFixed(2)}, {flight.live.longitude.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Notification Info */}
          {isTracking && (
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex gap-3">
              <span className="text-3xl">🔔</span>
              <div>
                <h4 className="font-semibold text-blue-900 mb-1">
                  Tracking Enabled
                </h4>
                <p className="text-sm text-blue-800">
                  This flight is now on your home screen for easy tracking.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
