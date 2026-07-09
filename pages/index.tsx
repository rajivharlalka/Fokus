import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '@/components/Layout';
import FlightCard from '@/components/FlightCard';
import type { Flight } from '@/lib/types';
import { getMockFlight } from '@/lib/flightApi';
import { getTrackedFlights, removeTrackedFlight, saveTrackedFlights } from '@/lib/storage';

export default function Home() {
  const [tracked, setTracked] = useState<Flight[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Always refresh tracked list from storage; seed empty installs with live-aligned demos
    let flights = getTrackedFlights();
    if (flights.length === 0) {
      flights = [getMockFlight('BA178'), getMockFlight('AA100')];
      saveTrackedFlights(flights);
    }
    setTracked(flights);
  }, []);

  const handleRemove = (flightNumber: string) => {
    removeTrackedFlight(flightNumber);
    setTracked(getTrackedFlights());
  };

  return (
    <>
      <Head>
        <title>Fokus — Flight Tracker</title>
        <meta name="description" content="Track flights end to end — gates, delays, weather, and live progress." />
        <meta name="theme-color" content="#0B1F33" />
        <link rel="manifest" href="/manifest.json" />
      </Head>

      <Layout transparent>
        {/* Hero — one composition */}
        <section className="sky-atmosphere text-white px-4 pt-6 pb-16 relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-30 pointer-events-none"
            style={{
              backgroundImage:
                'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.08) 0 1px, transparent 1px), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.06) 0 1px, transparent 1px)',
              backgroundSize: '48px 48px',
            }}
          />
          <div className="relative max-w-3xl mx-auto">
            <p className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight mb-3">
              Fokus
            </p>
            <p className="text-white/80 text-base sm:text-lg max-w-md mb-8 leading-relaxed">
              Follow every flight from gate to landing — delays, weather, and live progress in one place.
            </p>
            <Link
              href="/search"
              className="inline-flex items-center gap-2 bg-white text-sky-deep font-semibold px-6 py-3.5 rounded-xl hover:bg-sky-mist transition shadow-lg"
            >
              Search a flight
              <span aria-hidden>→</span>
            </Link>

            {/* Atmospheric flight path visual */}
            <div className="mt-12 opacity-90">
              <svg viewBox="0 0 320 60" className="w-full max-w-sm" fill="none" aria-hidden>
                <path
                  d="M10 45 C 80 45, 100 15, 160 20 S 250 50, 310 18"
                  stroke="rgba(255,255,255,0.35)"
                  strokeWidth="1.5"
                  strokeDasharray="4 6"
                  className="route-line-animate"
                />
                <circle cx="10" cy="45" r="3" fill="#F0B429" />
                <circle cx="310" cy="18" r="3" fill="#14B8A6" />
                <text x="20" y="58" fill="rgba(255,255,255,0.5)" fontSize="10" fontFamily="DM Sans">
                  DEP
                </text>
                <text x="290" y="12" fill="rgba(255,255,255,0.5)" fontSize="10" fontFamily="DM Sans">
                  ARR
                </text>
              </svg>
            </div>
          </div>
        </section>

        <section className="px-4 -mt-6 pb-12 relative z-10">
          <div className="flex items-end justify-between mb-4">
            <h2 className="font-display text-xl font-bold">Your flights</h2>
            {mounted && tracked.length > 0 && (
              <span className="text-xs text-muted">{tracked.length} tracked</span>
            )}
          </div>

          {!mounted ? (
            <div className="surface rounded-2xl p-8 text-center text-muted text-sm">Loading…</div>
          ) : tracked.length === 0 ? (
            <div className="surface rounded-2xl p-10 text-center">
              <p className="font-display text-lg font-bold mb-2">No flights yet</p>
              <p className="text-sm text-muted mb-5">
                Search a flight number to start tracking your journey.
              </p>
              <Link
                href="/search"
                className="inline-block text-sm font-semibold px-4 py-2 rounded-lg"
                style={{ background: 'var(--accent)', color: '#fff' }}
              >
                Find a flight
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {tracked.map((flight, i) => (
                <FlightCard
                  key={flight.flightNumber}
                  flight={flight}
                  index={i}
                  onRemove={handleRemove}
                />
              ))}
            </div>
          )}
        </section>
      </Layout>
    </>
  );
}
