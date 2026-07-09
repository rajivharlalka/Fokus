import type { Flight } from './types';
import { STORAGE_KEYS } from './utils';

const isBrowser = () => typeof window !== 'undefined';

export function getTrackedFlights(): Flight[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.tracked);
    return raw ? (JSON.parse(raw) as Flight[]) : [];
  } catch {
    return [];
  }
}

export function saveTrackedFlights(flights: Flight[]) {
  if (!isBrowser()) return;
  localStorage.setItem(STORAGE_KEYS.tracked, JSON.stringify(flights));
}

export function isFlightTracked(flightNumber: string): boolean {
  return getTrackedFlights().some((f) => f.flightNumber === flightNumber);
}

export function toggleTrackedFlight(flight: Flight): boolean {
  const tracked = getTrackedFlights();
  const exists = tracked.some((f) => f.flightNumber === flight.flightNumber);
  if (exists) {
    saveTrackedFlights(tracked.filter((f) => f.flightNumber !== flight.flightNumber));
    return false;
  }
  saveTrackedFlights([flight, ...tracked.filter((f) => f.flightNumber !== flight.flightNumber)]);
  return true;
}

export function removeTrackedFlight(flightNumber: string) {
  saveTrackedFlights(getTrackedFlights().filter((f) => f.flightNumber !== flightNumber));
}

export function getRecentSearches(): string[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.recent);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function addRecentSearch(flightNumber: string) {
  if (!isBrowser()) return;
  const code = flightNumber.toUpperCase().trim();
  if (!code) return;
  const next = [code, ...getRecentSearches().filter((s) => s !== code)].slice(0, 8);
  localStorage.setItem(STORAGE_KEYS.recent, JSON.stringify(next));
}

export function getTheme(): 'light' | 'dark' {
  if (!isBrowser()) return 'light';
  const stored = localStorage.getItem(STORAGE_KEYS.theme);
  if (stored === 'dark' || stored === 'light') return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function setTheme(theme: 'light' | 'dark') {
  if (!isBrowser()) return;
  localStorage.setItem(STORAGE_KEYS.theme, theme);
  document.documentElement.classList.toggle('dark', theme === 'dark');
}
