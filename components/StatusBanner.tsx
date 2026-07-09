export default function StatusBanner({
  status,
  progress,
  label,
}: {
  status: string;
  progress: number;
  label: string;
}) {
  return (
    <div className="surface rounded-2xl p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold">{label}</span>
        <span className="text-sm text-muted">{progress}%</span>
      </div>
      <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${progress}%`,
            background:
              status === 'delayed'
                ? 'var(--warning)'
                : status === 'cancelled'
                ? 'var(--error)'
                : 'linear-gradient(90deg, var(--accent), var(--accent-soft))',
          }}
        />
      </div>
    </div>
  );
}
