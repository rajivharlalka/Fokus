import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { searchFlight } from '@/lib/flightApi';

export default function Search() {
  const router = useRouter();
  const [flightNumber, setFlightNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!flightNumber.trim()) {
      setError('Please enter a flight number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await searchFlight(flightNumber.trim());
      router.push(`/flight/${flightNumber.trim().toUpperCase()}`);
    } catch (err) {
      setError('Failed to find flight. Please try again.');
      setLoading(false);
    }
  };

  const quickSearch = (number: string) => {
    setFlightNumber(number);
    router.push(`/flight/${number}`);
  };

  return (
    <>
      <Head>
        <title>Search Flights - Flight Tracker</title>
      </Head>

      <main className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-primary text-white p-4 shadow-md">
          <div className="max-w-4xl mx-auto flex items-center">
            <Link href="/" className="text-white text-base font-semibold">
              ← Back
            </Link>
            <h1 className="flex-1 text-xl font-bold text-center mr-16">
              Search Flights
            </h1>
          </div>
        </header>

        <div className="max-w-4xl mx-auto p-4">
          {/* Search Form */}
          <div className="bg-white rounded-2xl p-6 shadow-md mb-6">
            <label className="block text-base font-semibold text-gray-800 mb-2">
              Flight Number
            </label>
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                value={flightNumber}
                onChange={(e) => setFlightNumber(e.target.value)}
                placeholder="e.g., AA100, DL200, UA300"
                className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl text-base focus:outline-none focus:border-primary"
                autoCapitalize="characters"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50"
              >
                {loading ? '...' : '🔍'}
              </button>
            </form>
            {error && <p className="text-error text-sm mt-2">{error}</p>}
          </div>

          {/* Search Tips */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-3">Search Tips</h2>
            
            <div className="bg-white rounded-xl p-4 shadow-sm mb-3 flex gap-3">
              <span className="text-3xl">💡</span>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">
                  Flight Number Format
                </h3>
                <p className="text-sm text-gray-600">
                  Enter airline code + flight number (e.g., AA100, DL200)
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm flex gap-3">
              <span className="text-3xl">🌍</span>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">
                  International Flights
                </h3>
                <p className="text-sm text-gray-600">
                  Works with all major airlines worldwide
                </p>
              </div>
            </div>
          </div>

          {/* Popular Flights */}
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-3">
              Popular Routes
            </h2>

            <button
              onClick={() => quickSearch('AA100')}
              className="block w-full bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow mb-3 text-left"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-lg font-bold text-primary">AA100</span>
                <span className="text-gray-400">→</span>
              </div>
              <div className="text-xl font-bold text-gray-800 mb-1">
                SFO • JFK
              </div>
              <div className="text-sm text-gray-600">
                San Francisco to New York
              </div>
            </button>

            <button
              onClick={() => quickSearch('DL200')}
              className="block w-full bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow mb-3 text-left"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-lg font-bold text-primary">DL200</span>
                <span className="text-gray-400">→</span>
              </div>
              <div className="text-xl font-bold text-gray-800 mb-1">
                LAX • ORD
              </div>
              <div className="text-sm text-gray-600">
                Los Angeles to Chicago
              </div>
            </button>

            <button
              onClick={() => quickSearch('UA300')}
              className="block w-full bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow text-left"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-lg font-bold text-primary">UA300</span>
                <span className="text-gray-400">→</span>
              </div>
              <div className="text-xl font-bold text-gray-800 mb-1">
                ORD • LHR
              </div>
              <div className="text-sm text-gray-600">
                Chicago to London
              </div>
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
