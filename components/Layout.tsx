import Link from 'next/link';
import { useTheme } from '@/lib/useTheme';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  backHref?: string;
  transparent?: boolean;
}

export default function Layout({ children, title, backHref, transparent }: LayoutProps) {
  const { theme, toggle, ready } = useTheme();

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)', color: 'var(--text)' }}>
      <header
        className={`sticky top-0 z-40 ${
          transparent
            ? 'bg-transparent'
            : 'backdrop-blur-md border-b'
        }`}
        style={
          transparent
            ? undefined
            : {
                background: 'color-mix(in srgb, var(--bg) 85%, transparent)',
                borderColor: 'var(--border)',
              }
        }
      >
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="w-20">
            {backHref ? (
              <Link
                href={backHref}
                className="text-sm font-medium opacity-80 hover:opacity-100"
              >
                ← Back
              </Link>
            ) : (
              <Link href="/" className="font-display font-bold text-lg tracking-tight">
                Fokus
              </Link>
            )}
          </div>
          <div className="font-display font-semibold text-sm tracking-wide">
            {title || (backHref ? 'Fokus' : '')}
          </div>
          <div className="w-20 flex justify-end">
            {ready && (
              <button
                onClick={toggle}
                aria-label="Toggle theme"
                className="text-sm px-2.5 py-1.5 rounded-lg surface hover:opacity-90 transition"
              >
                {theme === 'dark' ? '☀️' : '🌙'}
              </button>
            )}
          </div>
        </div>
      </header>
      <main className="max-w-3xl mx-auto">{children}</main>
    </div>
  );
}
