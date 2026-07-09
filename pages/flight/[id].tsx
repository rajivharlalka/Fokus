import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import FlightTimeline from '@/components/FlightTimeline';
import FlightMap from '@/components/FlightMap';
import WeatherCard from '@/components/WeatherCard';
import StatusBanner from '@/components/StatusBanner';
import AircraftCard from '@/components/AircraftCard';
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
        <div className="px-4 py-6 pb-24 space-y-4">
          {/* Boarding-pass hero */}
          <section className="boarding-pass rounded-[1.6rem] p-5 sm:p-6 text-white overflow-hidden relative">
            <div className="flex items-start justify-between gap-3 mb-8">
              <div>
                <div className="text-[10px] uppercase tracking-[0.16em] text-white/55 font-bold">
                  {flight.airline}
                </div>
                <h1 className="font-display text-2xl font-bold tracking-tight mt-1">
                  {flight.flightNumber}
                </h1>
              </div>
              <div className="flex items-center gap-2">
                {flight.source === 'live' && (
                  <span className="text-[9px] uppercase tracking-wider font-bold text-white/60">
                    Live
                  </span>
                )}
                <span
                  className={`px-3 py-1.5 rounded-full text-[11px] font-bold text-white ${
                    flight.status === 'active' ? 'status-live' : ''
                  }`}
                  style={{ backgroundColor: statusColor }}
                >
                  {getStatusText(flight.status)}
                </span>
              </div>
            </div>

            <div className="flex items-start justify-between">
              <div className="min-w-0">
                <div className="font-display text-5xl font-bold tracking-[-0.06em]">
                  {flight.departure.iata}
                </div>
                <div className="text-xs text-white/55 mt-1 truncate max-w-[110px]">
                  {flight.departure.city}
                </div>
                <div className="text-sm font-bold mt-3">
                  {formatFlightTime(flight.departure.estimated || flight.departure.scheduled)}
                </div>
              </div>

              <div className="flex-1 px-4 pt-2 text-center min-w-0">
                <div className="text-[10px] text-white/50 mb-3">
                  {getFlightDuration(flight.departure.scheduled, flight.arrival.scheduled)}
                </div>
                <div className="h-px relative bg-white/20">
                  <div
                    className="absolute top-1/2 left-0 -translate-y-1/2 h-0.5 route-line-animate bg-white"
                  />
                  <span className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#315EFB] px-1 text-sm">
                    ✈
                  </span>
                </div>
                <div className="text-[10px] text-white/50 mt-3 truncate">
                  {getTimeUntilFlight(flight.departure.estimated || flight.departure.scheduled)}
                </div>
              </div>

              <div className="text-right min-w-0">
                <div className="font-display text-5xl font-bold tracking-[-0.06em]">
                  {flight.arrival.iata}
                </div>
                <div className="text-xs text-white/55 mt-1 truncate max-w-[110px] ml-auto">
                  {flight.arrival.city}
                </div>
                <div className="text-sm font-bold mt-3">
                  {formatFlightTime(flight.arrival.estimated || flight.arrival.scheduled)}
                </div>
              </div>
            </div>
          </section>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={handleTrack}
              className="flex-1 py-3.5 rounded-full font-semibold text-white transition shadow-lg"
              style={{ background: tracking ? 'var(--success)' : 'var(--accent)' }}
            >
              {tracking ? '✓ Tracking' : '+ Track flight'}
            </button>
            <button
              onClick={handleShare}
              className="px-5 py-3.5 rounded-full font-semibold surface"
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

          <AircraftCard flight={flight} />

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

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-muted mb-1">{label}</div>
      <div className="text-sm font-semibold">{value}</div>
    </div>
  );
}
