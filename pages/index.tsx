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
    // Render cached flights immediately, then refresh them from the live API.
    let flights = getTrackedFlights();
    if (flights.length === 0) {
      flights = [getMockFlight('BA178'), getMockFlight('AA100')];
      saveTrackedFlights(flights);
    }
    setTracked(flights);

    let cancelled = false;
    Promise.all(
      flights.map(async (flight) => {
        try {
          const res = await fetch(`/api/flight/${encodeURIComponent(flight.flightNumber)}`);
          return res.ok ? ((await res.json()) as Flight) : flight;
        } catch {
          return flight;
        }
      })
    ).then((fresh) => {
      if (cancelled) return;
      setTracked(fresh);
      saveTrackedFlights(fresh);
    });

    return () => {
      cancelled = true;
    };
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
        <meta name="theme-color" content="#101828" />
        <link rel="manifest" href="/manifest.json" />
      </Head>

      <Layout transparent>
        {/* Hero — one composition */}
        <section className="sky-atmosphere text-white px-4 pt-24 pb-20 relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-30 pointer-events-none"
            style={{
              backgroundImage:
                'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.08) 0 1px, transparent 1px), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.06) 0 1px, transparent 1px)',
              backgroundSize: '48px 48px',
            }}
          />
          <div className="relative max-w-3xl mx-auto">
            <p className="text-[11px] font-bold tracking-[0.18em] uppercase text-white/55 mb-3">
              Your trip, in focus
            </p>
            <p className="font-display text-4xl sm:text-5xl font-extrabold tracking-[-0.04em] mb-3 max-w-xl">
              Know what happens next.
            </p>
            <p className="text-white/70 text-base max-w-md mb-8 leading-relaxed">
              Live gates, delays, weather and arrival details—without the airport noise.
            </p>
            <Link
              href="/search"
              className="inline-flex items-center gap-3 bg-white text-sky-deep font-bold px-6 py-3.5 rounded-full hover:bg-sky-mist transition shadow-lg"
            >
              Search a flight
              <span aria-hidden>→</span>
            </Link>

            {/* Atmospheric flight path visual */}
            <div className="mt-10 opacity-90">
              <svg viewBox="0 0 320 60" className="w-full max-w-sm" fill="none" aria-hidden>
                <path
                  d="M10 45 C 80 45, 100 15, 160 20 S 250 50, 310 18"
                  stroke="rgba(255,255,255,0.35)"
                  strokeWidth="1.5"
                  strokeDasharray="4 6"
                  className="route-line-animate"
                />
                <circle cx="10" cy="45" r="3" fill="#F0B429" />
                <circle cx="310" cy="18" r="3" fill="#84ADFF" />
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

        <section className="px-4 -mt-7 pb-12 relative z-10">
          <div className="flex items-end justify-between mb-4">
            <div>
              <div className="eyebrow mb-1">Upcoming</div>
              <h2 className="font-display text-2xl font-bold tracking-tight">Your flights</h2>
            </div>
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
