import { FormEvent, useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { POPULAR_ROUTES } from '@/lib/types';
import { addRecentSearch, getRecentSearches } from '@/lib/storage';

export default function SearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [recent, setRecent] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setRecent(getRecentSearches());
  }, []);

  const go = (code: string) => {
    const flightNumber = code.toUpperCase().trim();
    if (!flightNumber) {
      setError('Enter a flight number');
      return;
    }
    setLoading(true);
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
            <div className="flex gap-2">
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value.toUpperCase());
                  setError('');
                }}
                placeholder="AA100"
                autoCapitalize="characters"
                autoCorrect="off"
                className="flex-1 surface rounded-xl px-4 py-3.5 text-lg font-semibold tracking-wider outline-none focus:ring-2"
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
