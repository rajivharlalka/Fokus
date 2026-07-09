import type { Flight } from '@/lib/types';

export default function AircraftCard({ flight }: { flight: Flight }) {
  const aircraft = flight.aircraft;
  const hasType = aircraft.type && aircraft.type !== '—';
  const hasRegistration = aircraft.registration && aircraft.registration !== '—';
  const hasDetails = hasType || hasRegistration;

  return (
    <section className="surface rounded-[1.35rem] overflow-hidden">
      {aircraft.photoUrl && (
        <div className="relative h-44 bg-sky-deep overflow-hidden">
          {/* External aircraft imagery comes from ADSBdb / airport-data.com. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={aircraft.photoUrl}
            alt={`${flight.airline} aircraft ${aircraft.registration}`}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-sky-deep/80 via-transparent to-transparent" />
          <div className="absolute bottom-3 left-4 text-white">
            <div className="text-[10px] font-bold tracking-[0.14em] uppercase text-white/60">
              Operating aircraft
            </div>
            <div className="font-display font-bold text-lg">{aircraft.registration}</div>
          </div>
        </div>
      )}

      <div className="p-5">
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <div className="eyebrow mb-1">Aircraft</div>
            <h3 className="font-display font-bold text-xl tracking-tight">
              {hasType ? aircraft.type : 'Details not reported'}
            </h3>
          </div>
          {aircraft.modeS && (
            <span className="text-[10px] font-mono px-2 py-1 rounded-md surface-flat">
              {aircraft.modeS}
            </span>
          )}
        </div>

        {hasDetails ? (
          <div className="grid grid-cols-2 gap-x-5 gap-y-4">
            <Fact label="Registration" value={hasRegistration ? aircraft.registration : 'Not reported'} />
            <Fact label="Model" value={hasType ? aircraft.type : 'Not reported'} />
            {aircraft.owner && <Fact label="Operator" value={aircraft.owner} />}
            <Fact
              label="Data source"
              value={aircraft.source === 'adsbdb' ? 'ADSBdb' : 'AviationStack'}
            />
          </div>
        ) : (
          <p className="text-sm text-muted leading-relaxed">
            The flight feed has not published an aircraft registration yet. This often appears
            closer to departure after the airline assigns a specific airframe.
          </p>
        )}
      </div>
    </section>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <div className="text-[10px] uppercase tracking-wider text-muted mb-1">{label}</div>
      <div className="text-sm font-semibold break-words">{value}</div>
    </div>
  );
}
