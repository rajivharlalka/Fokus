import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import FlightTimeline from '@/components/FlightTimeline';
import FlightMap from '@/components/FlightMap';
import WeatherCard from '@/components/WeatherCard';
import StatusBanner from '@/components/StatusBanner';
import type { Flight, WeatherInfo } from '@/lib/types';
import {
  formatFlightTime,
  getFlightDuration,
  getFlightProgress,
  getStatusColor,
  getStatusText,
  getTimeUntilFlight,
} from '@/lib/utils';
import { addRecentSearch, isFlightTracked, toggleTrackedFlight } from '@/lib/storage';

export default function FlightDetailsPage() {
  const router = useRouter();
  const { id } = router.query;
  const [flight, setFlight] = useState<Flight | null>(null);
  const [tracking, setTracking] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [depWeather, setDepWeather] = useState<WeatherInfo | null>(null);
  const [arrWeather, setArrWeather] = useState<WeatherInfo | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [shareMsg, setShareMsg] = useState('');

  useEffect(() => {
    if (!id || typeof id !== 'string') return;

    let cancelled = false;
    (async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`/api/flight/${encodeURIComponent(id)}`);
        if (!res.ok) throw new Error('Flight not found');
        const data: Flight = await res.json();
        if (cancelled) return;
        setFlight(data);
        setTracking(isFlightTracked(data.flightNumber));
        addRecentSearch(data.flightNumber);
      } catch {
        if (!cancelled) setError('Could not load this flight.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    if (!flight) return;
    const { departure, arrival } = flight;
    if (departure.latitude == null || arrival.latitude == null) return;

    let cancelled = false;
    setWeatherLoading(true);
    (async () => {
      try {
        const [depRes, arrRes] = await Promise.all([
          fetch(`/api/weather?lat=${departure.latitude}&lon=${departure.longitude}`),
          fetch(`/api/weather?lat=${arrival.latitude}&lon=${arrival.longitude}`),
        ]);
        const dep = depRes.ok ? await depRes.json() : null;
        const arr = arrRes.ok ? await arrRes.json() : null;
        if (!cancelled) {
          setDepWeather(dep);
          setArrWeather(arr);
        }
      } catch {
        // ignore
      } finally {
        if (!cancelled) setWeatherLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [flight]);

  const handleTrack = () => {
    if (!flight) return;
    const nowTracking = toggleTrackedFlight(flight);
    setTracking(nowTracking);
  };

  const handleShare = async () => {
    if (!flight || typeof window === 'undefined') return;
    const url = window.location.href;
    const text = `${flight.flightNumber} ${flight.departure.iata} → ${flight.arrival.iata}`;

    try {
      if (navigator.share) {
        await navigator.share({ title: flight.flightNumber, text, url });
      } else {
        await navigator.clipboard.writeText(url);
        setShareMsg('Link copied');
        setTimeout(() => setShareMsg(''), 2000);
      }
    } catch {
      // user cancelled share
    }
  };

  if (loading) {
    return (
      <Layout title="Flight" backHref="/">
        <div className="px-4 py-20 text-center text-muted text-sm">Loading flight…</div>
      </Layout>
    );
  }

  if (error || !flight) {
    return (
      <Layout title="Flight" backHref="/search">
        <div className="px-4 py-20 text-center">
          <p className="font-display text-xl font-bold mb-2">Flight not found</p>
          <p className="text-sm text-muted">{error || 'Try another flight number.'}</p>
        </div>
      </Layout>
    );
  }

  const progress = getFlightProgress(flight);
  const statusColor = getStatusColor(flight.status);

  return (
    <>
      <Head>
        <title>
          {flight.flightNumber} · {flight.departure.iata}→{flight.arrival.iata} — Fokus
        </title>
      </Head>

      <Layout title={flight.flightNumber} backHref="/">
        <div className="px-4 py-6 pb-20 space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="font-display text-3xl font-extrabold tracking-tight">
                {flight.flightNumber}
              </h1>
              <p className="text-muted text-sm mt-1">{flight.airline}</p>
              {flight.source === 'live' && (
                <span className="inline-block mt-2 text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: 'var(--border)', color: 'var(--accent)' }}>
                  Live data
                </span>
              )}
            </div>
            <span
              className={`px-3 py-1.5 rounded-full text-xs font-bold text-white ${
                flight.status === 'active' ? 'status-live' : ''
              }`}
              style={{ backgroundColor: statusColor }}
            >
              {getStatusText(flight.status)}
            </span>
          </div>

          {/* Big route */}
          <div className="surface rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-display text-4xl font-bold">{flight.departure.iata}</div>
                <div className="text-xs text-muted mt-1">{flight.departure.city}</div>
                <div className="text-sm font-semibold mt-2">
                  {formatFlightTime(flight.departure.estimated || flight.departure.scheduled)}
                </div>
              </div>
              <div className="flex-1 px-4 text-center">
                <div className="text-xs text-muted mb-1">
                  {getFlightDuration(flight.departure.scheduled, flight.arrival.scheduled)}
                </div>
                <div className="h-px relative" style={{ background: 'var(--border)' }}>
                  <div
                    className="absolute top-1/2 left-0 -translate-y-1/2 h-0.5 route-line-animate"
                    style={{
                      width: '100%',
                      background: 'linear-gradient(90deg, var(--accent), var(--accent-soft))',
                    }}
                  />
                </div>
                <div className="text-xs text-muted mt-1">
                  {getTimeUntilFlight(flight.departure.estimated || flight.departure.scheduled)}
                </div>
              </div>
              <div className="text-right">
                <div className="font-display text-4xl font-bold">{flight.arrival.iata}</div>
                <div className="text-xs text-muted mt-1">{flight.arrival.city}</div>
                <div className="text-sm font-semibold mt-2">
                  {formatFlightTime(flight.arrival.estimated || flight.arrival.scheduled)}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={handleTrack}
              className="flex-1 py-3.5 rounded-xl font-semibold text-white transition"
              style={{ background: tracking ? 'var(--success)' : 'var(--accent)' }}
            >
              {tracking ? '✓ Tracking' : '+ Track flight'}
            </button>
            <button
              onClick={handleShare}
              className="px-4 py-3.5 rounded-xl font-semibold surface"
            >
              {shareMsg || 'Share'}
            </button>
          </div>

          <StatusBanner
            status={flight.status}
            progress={progress}
            label={
              flight.status === 'active'
                ? 'In the air'
                : flight.status === 'delayed'
                ? 'Delayed — updated ETA'
                : getStatusText(flight.status)
            }
          />

          <FlightMap flight={flight} />

          <FlightTimeline flight={flight} />

          {/* Weather */}
          <section>
            <h3 className="font-display font-bold text-lg mb-3">Airport weather</h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <WeatherCard
                title="Departure"
                iata={flight.departure.iata}
                weather={depWeather}
                loading={weatherLoading}
              />
              <WeatherCard
                title="Arrival"
                iata={flight.arrival.iata}
                weather={arrWeather}
                loading={weatherLoading}
              />
            </div>
          </section>

          {/* Aircraft */}
          <section className="surface rounded-2xl p-5">
            <h3 className="font-display font-bold text-lg mb-4">Aircraft</h3>
            <div className="space-y-3">
              <Row label="Type" value={flight.aircraft.type} />
              <Row label="Registration" value={flight.aircraft.registration} />
            </div>
          </section>

          {/* Live telemetry */}
          {flight.live && (
            <section className="surface rounded-2xl p-5">
              <h3 className="font-display font-bold text-lg mb-4">Live position</h3>
              <div className="grid grid-cols-2 gap-4">
                <Metric label="Altitude" value={`${flight.live.altitude.toLocaleString()} ft`} />
                <Metric label="Speed" value={`${flight.live.speed} kts`} />
                <Metric label="Heading" value={`${flight.live.direction}°`} />
                <Metric
                  label="Coords"
                  value={`${flight.live.latitude.toFixed(2)}, ${flight.live.longitude.toFixed(2)}`}
                />
              </div>
            </section>
          )}
        </div>
      </Layout>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-2 border-b last:border-0" style={{ borderColor: 'var(--border)' }}>
      <span className="text-sm text-muted">{label}</span>
      <span className="text-sm font-semibold">{value}</span>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-muted mb-1">{label}</div>
      <div className="text-sm font-semibold">{value}</div>
    </div>
  );
}
