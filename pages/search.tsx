import { FormEvent, useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import type { Flight } from '@/lib/types';
import { POPULAR_ROUTES } from '@/lib/types';
import { addRecentSearch, getRecentSearches } from '@/lib/storage';
import { getStatusColor, getStatusText } from '@/lib/utils';

type Suggestion = {
  code: string;
  airline?: string;
  from: string;
  to: string;
  label: string;
  status?: string;
  live?: boolean;
};

export default function SearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [recent, setRecent] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [suggesting, setSuggesting] = useState(false);
  const [liveSuggestion, setLiveSuggestion] = useState<Suggestion | null>(null);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setRecent(getRecentSearches());
  }, []);

  useEffect(() => {
    const code = query.trim().toUpperCase();
    setLiveSuggestion(null);

    // AviationStack searches exact flight numbers, so fetch once input
    // looks like a complete flight code (e.g. AA100, BA178, NH9).
    if (!/^[A-Z0-9]{2,3}\d{1,4}[A-Z]?$/.test(code)) {
      setSuggesting(false);
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setSuggesting(true);
      try {
        const res = await fetch(`/api/flight/${encodeURIComponent(code)}`, {
          signal: controller.signal,
        });
        if (!res.ok) return;
        const flight: Flight = await res.json();
        setLiveSuggestion({
          code: flight.flightNumber,
          airline: flight.airline,
          from: flight.departure.iata,
          to: flight.arrival.iata,
          label: `${flight.departure.city || flight.departure.airport} to ${
            flight.arrival.city || flight.arrival.airport
          }`,
          status: flight.status,
          live: flight.source === 'live',
        });
        setOpen(true);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          setLiveSuggestion(null);
        }
      } finally {
        setSuggesting(false);
      }
    }, 350);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  const normalizedQuery = query.trim().toUpperCase();
  const staticSuggestions: Suggestion[] = POPULAR_ROUTES.filter((route) => {
    if (!normalizedQuery) return false;
    return (
      route.code.includes(normalizedQuery) ||
      route.from.includes(normalizedQuery) ||
      route.to.includes(normalizedQuery) ||
      route.label.toUpperCase().includes(normalizedQuery)
    );
  }).map((route) => ({
    code: route.code,
    from: route.from,
    to: route.to,
    label: route.label,
  }));

  const suggestions = [
    ...(liveSuggestion ? [liveSuggestion] : []),
    ...staticSuggestions.filter((item) => item.code !== liveSuggestion?.code),
  ].slice(0, 6);

  const go = (code: string) => {
    const flightNumber = code.toUpperCase().trim();
    if (!flightNumber) {
      setError('Enter a flight number');
      return;
    }
    setLoading(true);
    setOpen(false);
    addRecentSearch(flightNumber);
    router.push(`/flight/${flightNumber}`);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    go(query);
  };

  return (
    <>
      <Head>
        <title>Search — Fokus</title>
      </Head>
      <Layout title="Search" backHref="/">
        <div className="px-4 py-6 pb-16">
          <h1 className="font-display text-3xl font-bold mb-2">Find your flight</h1>
          <p className="text-muted text-sm mb-6">
            Enter an airline code and number — like AA100 or DL200.
          </p>

          <form onSubmit={onSubmit} className="mb-8">
            <div className="relative">
              <div className="flex gap-2">
                <input
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value.toUpperCase());
                    setError('');
                    setOpen(true);
                  }}
                  onFocus={() => setOpen(true)}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') setOpen(false);
                    if (e.key === 'ArrowDown' && suggestions[0]) {
                      e.preventDefault();
                      document.getElementById('flight-suggestion-0')?.focus();
                    }
                  }}
                  placeholder="AA100"
                  autoCapitalize="characters"
                  autoCorrect="off"
                  autoComplete="off"
                  role="combobox"
                  aria-expanded={open && (suggestions.length > 0 || suggesting)}
                  aria-controls="flight-suggestions"
                  className="flex-1 min-w-0 surface rounded-xl px-4 py-3.5 text-lg font-semibold tracking-wider outline-none focus:ring-2"
                  style={{ caretColor: 'var(--accent)' }}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-3.5 rounded-xl font-semibold text-white disabled:opacity-60"
                  style={{ background: 'var(--accent)' }}
                >
                  {loading ? '…' : 'Go'}
                </button>
              </div>

              {open && normalizedQuery && (suggestions.length > 0 || suggesting) && (
                <div
                  id="flight-suggestions"
                  role="listbox"
                  className="absolute left-0 right-0 top-full mt-2 surface rounded-xl shadow-xl overflow-hidden z-30"
                >
                  {suggesting && suggestions.length === 0 && (
                    <div className="px-4 py-4 text-sm text-muted">
                      Checking live flight…
                    </div>
                  )}
                  {suggestions.map((suggestion, index) => (
                    <button
                      id={`flight-suggestion-${index}`}
                      key={`${suggestion.code}-${suggestion.live ? 'live' : 'route'}`}
                      type="button"
                      role="option"
                      aria-selected={false}
                      onClick={() => go(suggestion.code)}
                      onKeyDown={(e) => {
                        if (e.key === 'ArrowDown') {
                          e.preventDefault();
                          document.getElementById(`flight-suggestion-${index + 1}`)?.focus();
                        }
                        if (e.key === 'ArrowUp') {
                          e.preventDefault();
                          if (index === 0) {
                            (e.currentTarget
                              .closest('form')
                              ?.querySelector('input') as HTMLInputElement | null)?.focus();
                          } else {
                            document.getElementById(`flight-suggestion-${index - 1}`)?.focus();
                          }
                        }
                      }}
                      className="w-full px-4 py-3.5 flex items-center justify-between gap-3 text-left border-b last:border-0 hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-inset"
                      style={{ borderColor: 'var(--border)' }}
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-display font-bold">{suggestion.code}</span>
                          {suggestion.live && (
                            <span
                              className="text-[9px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded"
                              style={{ background: 'var(--border)', color: 'var(--accent)' }}
                            >
                              Live
                            </span>
                          )}
                        </div>
                        <div className="text-sm font-medium truncate mt-0.5">
                          {suggestion.airline || suggestion.label}
                        </div>
                        {suggestion.airline && (
                          <div className="text-xs text-muted truncate mt-0.5">
                            {suggestion.label}
                          </div>
                        )}
                      </div>
                      <div className="text-right shrink-0">
                        <div className="font-display font-bold text-sm">
                          {suggestion.from} → {suggestion.to}
                        </div>
                        {suggestion.status && (
                          <div
                            className="text-[10px] font-semibold mt-1"
                            style={{ color: getStatusColor(suggestion.status) }}
                          >
                            {getStatusText(suggestion.status)}
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            {error && (
              <p className="text-sm mt-2" style={{ color: 'var(--error)' }}>
                {error}
              </p>
            )}
          </form>

          {recent.length > 0 && (
            <section className="mb-8">
              <h2 className="text-xs uppercase tracking-wider text-muted mb-3">Recent</h2>
              <div className="flex flex-wrap gap-2">
                {recent.map((code) => (
                  <button
                    key={code}
                    onClick={() => go(code)}
                    className="surface px-3.5 py-2 rounded-full text-sm font-semibold hover:opacity-80 transition"
                  >
                    {code}
                  </button>
                ))}
              </div>
            </section>
          )}

          <section>
            <h2 className="text-xs uppercase tracking-wider text-muted mb-3">Popular routes</h2>
            <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
              {POPULAR_ROUTES.map((route) => (
                <button
                  key={route.code}
                  onClick={() => go(route.code)}
                  className="w-full flex items-center justify-between py-4 text-left hover:opacity-80 transition"
                >
                  <div>
                    <div className="font-semibold" style={{ color: 'var(--accent)' }}>
                      {route.code}
                    </div>
                    <div className="text-sm text-muted mt-0.5">{route.label}</div>
                  </div>
                  <div className="font-display font-bold text-sm tracking-wide">
                    {route.from} → {route.to}
                  </div>
                </button>
              ))}
            </div>
          </section>
        </div>
      </Layout>
    </>
  );
}
