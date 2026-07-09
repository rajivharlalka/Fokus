import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import { getTheme, setTheme } from '@/lib/storage';

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    setTheme(getTheme());
  }, []);

  return <Component {...pageProps} />;
}
