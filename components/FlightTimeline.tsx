import type { Flight, TimelineStage } from '@/lib/types';
import { formatFlightDate, formatFlightTime, getTimelineStage } from '@/lib/utils';

const STAGES: { key: TimelineStage; label: string }[] = [
  { key: 'scheduled', label: 'Scheduled' },
  { key: 'boarding', label: 'Boarding' },
  { key: 'departed', label: 'Departed' },
  { key: 'enroute', label: 'En route' },
  { key: 'landed', label: 'Landed' },
];

function stageIndex(stage: TimelineStage): number {
  if (stage === 'cancelled') return -1;
  if (stage === 'departed') return 2;
  return STAGES.findIndex((s) => s.key === stage);
}

export default function FlightTimeline({ flight }: { flight: Flight }) {
  const stage = getTimelineStage(flight);
  const current = stageIndex(stage);
  const cancelled = stage === 'cancelled';

  return (
    <section className="surface rounded-2xl p-5">
      <h3 className="font-display font-bold text-lg mb-5">Journey</h3>

      {cancelled ? (
        <div className="text-sm font-semibold" style={{ color: 'var(--error)' }}>
          This flight has been cancelled.
        </div>
      ) : (
        <div className="flex justify-between mb-8 relative">
          <div
            className="absolute top-2 left-0 right-0 h-0.5"
            style={{ background: 'var(--border)' }}
          />
          <div
            className="absolute top-2 left-0 h-0.5 transition-all duration-700"
            style={{
              width: `${Math.max(0, (current / (STAGES.length - 1)) * 100)}%`,
              background: 'var(--accent)',
            }}
          />
          {STAGES.map((s, i) => {
            const done = i <= current;
            const active = i === current;
            return (
              <div key={s.key} className="relative z-10 flex flex-col items-center flex-1">
                <div
                  className={`w-4 h-4 rounded-full border-2 ${active ? 'status-live' : ''}`}
                  style={{
                    background: done ? 'var(--accent)' : 'var(--bg-elevated)',
                    borderColor: done ? 'var(--accent)' : 'var(--border)',
                  }}
                />
                <span
                  className={`text-[10px] mt-2 font-medium ${
                    active ? '' : 'text-muted'
                  }`}
                >
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      )}

      <div className="space-y-6">
        <Endpoint
          label="Departure"
          iata={flight.departure.iata}
          airport={flight.departure.airport}
          time={flight.departure.estimated || flight.departure.scheduled}
          scheduled={flight.departure.scheduled}
          date={flight.departure.scheduled}
          terminal={flight.departure.terminal}
          gate={flight.departure.gate}
          delay={flight.departure.delayMinutes || 0}
          active={current <= 2}
        />
        <Endpoint
          label="Arrival"
          iata={flight.arrival.iata}
          airport={flight.arrival.airport}
          time={flight.arrival.estimated || flight.arrival.scheduled}
          scheduled={flight.arrival.scheduled}
          date={flight.arrival.scheduled}
          terminal={flight.arrival.terminal}
          gate={flight.arrival.gate}
          delay={flight.arrival.delayMinutes || 0}
          active={current >= 3}
        />
      </div>
    </section>
  );
}

function Endpoint({
  label,
  iata,
  airport,
  time,
  scheduled,
  date,
  terminal,
  gate,
  delay,
  active,
}: {
  label: string;
  iata: string;
  airport: string;
  time?: string;
  scheduled?: string;
  date?: string;
  terminal: string;
  gate: string;
  delay: number;
  active: boolean;
}) {
  return (
    <div className={`pl-3 border-l-2 ${active ? '' : 'opacity-70'}`} style={{ borderColor: active ? 'var(--accent)' : 'var(--border)' }}>
      <div className="text-xs uppercase tracking-wider text-muted mb-1">{label}</div>
      <div className="flex items-baseline justify-between gap-3">
        <div className="font-display text-2xl font-bold">{iata}</div>
        <div className="text-right">
          <div className="font-semibold text-lg">{formatFlightTime(time)}</div>
          {delay !== 0 && (
            <div
              className="text-xs font-semibold"
              style={{ color: delay > 0 ? 'var(--warning)' : 'var(--success)' }}
            >
              {delay > 0 ? `+${delay}m` : `${delay}m`} vs {formatFlightTime(scheduled)}
            </div>
          )}
        </div>
      </div>
      <div className="text-sm text-muted mt-1">{airport}</div>
      <div className="text-xs text-muted mt-0.5">{formatFlightDate(date)}</div>
      <div className="flex gap-2 mt-2">
        <span className="text-xs px-2 py-1 rounded-md" style={{ background: 'var(--border)' }}>
          Terminal {terminal}
        </span>
        <span className="text-xs px-2 py-1 rounded-md" style={{ background: 'var(--border)' }}>
          Gate {gate}
        </span>
      </div>
    </div>
  );
}
