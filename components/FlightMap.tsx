import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import type { Flight } from '@/lib/types';

const MapInner = dynamic(() => import('./FlightMapInner'), {
  ssr: false,
  loading: () => (
    <div
      className="w-full h-56 rounded-2xl flex items-center justify-center text-sm text-muted"
      style={{ background: 'var(--border)' }}
    >
      Loading map…
    </div>
  ),
});

export default function FlightMap({ flight }: { flight: Flight }) {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  if (!ready) return null;
  return <MapInner flight={flight} />;
}
