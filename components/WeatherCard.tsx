import type { WeatherInfo } from '@/lib/types';

export default function WeatherCard({
  title,
  iata,
  weather,
  loading,
}: {
  title: string;
  iata: string;
  weather: WeatherInfo | null;
  loading?: boolean;
}) {
  return (
    <div className="surface rounded-2xl p-4 flex-1 min-w-[140px]">
      <div className="text-xs uppercase tracking-wider text-muted mb-2">
        {title} · {iata}
      </div>
      {loading ? (
        <div className="text-sm text-muted">Loading…</div>
      ) : weather ? (
        <>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{weather.icon}</span>
            <span className="font-display text-2xl font-bold">{weather.tempC}°</span>
          </div>
          <div className="text-sm mt-1">{weather.condition}</div>
          <div className="text-xs text-muted mt-1">
            Wind {weather.windKph} km/h · {weather.humidity}% humidity
          </div>
        </>
      ) : (
        <div className="text-sm text-muted">Weather unavailable</div>
      )}
    </div>
  );
}
