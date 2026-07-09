import { useEffect, useState } from 'react';
import { getTheme, setTheme } from '@/lib/storage';

export function useTheme() {
  const [theme, setThemeState] = useState<'light' | 'dark'>('light');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const initial = getTheme();
    setTheme(initial);
    setThemeState(initial);
    setReady(true);
  }, []);

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    setThemeState(next);
  };

  return { theme, toggle, ready };
}
