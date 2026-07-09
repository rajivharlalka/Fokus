import Link from 'next/link';
import type { Flight } from '@/lib/types';
import {
  formatDelay,
  formatFlightTime,
  getFlightProgress,
  getStatusColor,
  getStatusText,
} from '@/lib/utils';

interface FlightCardProps {
  flight: Flight;
  onRemove?: (flightNumber: string) => void;
  index?: number;
}

export default function FlightCard({ flight, onRemove, index = 0 }: FlightCardProps) {
  const progress = getFlightProgress(flight);
  const depDelay = flight.departure.delayMinutes || 0;
  const statusColor = getStatusColor(flight.status);

  return (
    <div
      className="surface rounded-2xl p-4 animate-fade-up relative group"
      style={{ animationDelay: `${index * 60}ms`, animationFillMode: 'both' }}
    >
      <Link href={`/flight/${flight.flightNumber}`} className="block">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="font-display text-xl font-bold tracking-tight">
              {flight.flightNumber}
            </div>
            <div className="text-sm text-muted mt-0.5">{flight.airline}</div>
          </div>
          <span
            className={`px-2.5 py-1 rounded-full text-[11px] font-semibold text-white ${
              flight.status === 'active' ? 'status-live' : ''
            }`}
            style={{ backgroundColor: statusColor }}
          >
            {getStatusText(flight.status)}
          </span>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1">
            <div className="font-display text-3xl font-bold leading-none">
              {flight.departure.iata}
            </div>
            <div className="text-sm font-medium mt-1.5">
              {formatFlightTime(flight.departure.estimated || flight.departure.scheduled)}
            </div>
            {depDelay !== 0 && (
              <div
                className="text-xs font-semibold mt-0.5"
                style={{ color: depDelay > 0 ? 'var(--warning)' : 'var(--success)' }}
              >
                {formatDelay(depDelay)}
              </div>
            )}
          </div>

          <div className="flex-1 px-1">
            <div className="h-1 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
              <div
                className="h-full rounded-full route-line-animate"
                style={{
                  width: `${progress}%`,
                  background: 'linear-gradient(90deg, var(--accent), var(--accent-soft))',
                }}
              />
            </div>
            <div className="text-center text-xs text-muted mt-1.5">{progress}%</div>
          </div>

          <div className="flex-1 text-right">
            <div className="font-display text-3xl font-bold leading-none">
              {flight.arrival.iata}
            </div>
            <div className="text-sm font-medium mt-1.5">
              {formatFlightTime(flight.arrival.estimated || flight.arrival.scheduled)}
            </div>
          </div>
        </div>
      </Link>

      {onRemove && (
        <button
          onClick={(e) => {
            e.preventDefault();
            onRemove(flight.flightNumber);
          }}
          className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 focus:opacity-100 text-xs text-muted hover:text-red-500 transition px-2 py-1"
          aria-label="Remove flight"
        >
          Remove
        </button>
      )}
    </div>
  );
}
