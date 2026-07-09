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
      className="surface rounded-[1.35rem] p-5 animate-fade-up relative group overflow-hidden"
      style={{ animationDelay: `${index * 60}ms`, animationFillMode: 'both' }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{ background: `linear-gradient(90deg, ${statusColor}, transparent)` }}
      />
      <Link href={`/flight/${flight.flightNumber}`} className="block">
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="eyebrow mb-1">{flight.airline}</div>
            <div className="font-display text-xl font-bold tracking-tight">{flight.flightNumber}</div>
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

        <div className="flex items-center gap-3">
          <div className="flex-1">
            <div className="font-display text-[2.15rem] font-bold leading-none tracking-[-0.04em]">
              {flight.departure.iata}
            </div>
            <div className="text-xs text-muted mt-1 truncate">
              {flight.departure.city || flight.departure.airport}
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
            <div className="text-center text-[10px] text-muted mb-2">
              {flight.status === 'active' ? 'IN FLIGHT' : 'ROUTE'}
            </div>
            <div className="h-1 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
              <div
                className="h-full rounded-full route-line-animate"
                style={{
                  width: `${progress}%`,
                  background: 'linear-gradient(90deg, var(--accent), var(--accent-soft))',
                }}
              />
            </div>
            <div className="text-center text-[10px] font-semibold text-muted mt-1.5">{progress}%</div>
          </div>

          <div className="flex-1 text-right">
            <div className="font-display text-[2.15rem] font-bold leading-none tracking-[-0.04em]">
              {flight.arrival.iata}
            </div>
            <div className="text-xs text-muted mt-1 truncate">
              {flight.arrival.city || flight.arrival.airport}
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
          className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] text-muted hover:text-red-500 transition px-3 py-1 opacity-0 group-hover:opacity-100 focus:opacity-100"
          aria-label="Remove flight"
        >
          Remove
        </button>
      )}
    </div>
  );
}
