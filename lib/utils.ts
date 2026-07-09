import { differenceInMinutes, format, formatDistance, parseISO } from 'date-fns';
import type { Flight, FlightStatus, TimelineStage } from './types';

export const formatFlightTime = (dateString?: string | null): string => {
  if (!dateString) return '—';
  try {
    return format(parseISO(dateString), 'h:mm a');
  } catch {
    return '—';
  }
};

export const formatFlightDate = (dateString?: string | null): string => {
  if (!dateString) return '—';
  try {
    return format(parseISO(dateString), 'EEE, MMM d');
  } catch {
    return '—';
  }
};

export const getTimeUntilFlight = (dateString?: string | null): string => {
  if (!dateString) return 'Unknown';
  try {
    return formatDistance(parseISO(dateString), new Date(), { addSuffix: true });
  } catch {
    return 'Unknown';
  }
};

export const getFlightDuration = (
  departureString?: string | null,
  arrivalString?: string | null
): string => {
  if (!departureString || !arrivalString) return '—';
  try {
    const minutes = differenceInMinutes(parseISO(arrivalString), parseISO(departureString));
    const hours = Math.floor(Math.abs(minutes) / 60);
    const mins = Math.abs(minutes) % 60;
    return `${hours}h ${mins}m`;
  } catch {
    return '—';
  }
};

export const getDelayMinutes = (
  scheduled?: string | null,
  estimated?: string | null
): number => {
  if (!scheduled || !estimated) return 0;
  try {
    return differenceInMinutes(parseISO(estimated), parseISO(scheduled));
  } catch {
    return 0;
  }
};

export const formatDelay = (minutes: number): string => {
  if (!minutes) return '';
  const abs = Math.abs(minutes);
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  const time = h > 0 ? `${h}h ${m}m` : `${m}m`;
  return minutes > 0 ? `+${time}` : `−${time}`;
};

export const getStatusColor = (status: string): string => {
  switch (status?.toLowerCase()) {
    case 'scheduled':
      return '#0D9488';
    case 'boarding':
      return '#0284C7';
    case 'active':
    case 'en-route':
    case 'enroute':
      return '#0E7C86';
    case 'landed':
      return '#64748B';
    case 'cancelled':
      return '#DC2626';
    case 'delayed':
      return '#D4920A';
    default:
      return '#64748B';
  }
};

export const getStatusText = (status: string): string => {
  switch (status?.toLowerCase()) {
    case 'scheduled':
      return 'Scheduled';
    case 'boarding':
      return 'Boarding';
    case 'active':
    case 'en-route':
    case 'enroute':
      return 'In Flight';
    case 'landed':
      return 'Landed';
    case 'cancelled':
      return 'Cancelled';
    case 'delayed':
      return 'Delayed';
    default:
      return 'Unknown';
  }
};

export const getTimelineStage = (flight: Flight): TimelineStage => {
  if (flight.status === 'cancelled') return 'cancelled';
  if (flight.status === 'landed') return 'landed';
  if (flight.status === 'active') return 'enroute';
  if (flight.status === 'boarding') return 'boarding';

  const now = Date.now();
  const dep = flight.departure.actual || flight.departure.estimated || flight.departure.scheduled;
  const arr = flight.arrival.actual || flight.arrival.estimated || flight.arrival.scheduled;

  try {
    const depTime = parseISO(dep).getTime();
    const arrTime = parseISO(arr).getTime();
    if (now >= arrTime) return 'landed';
    if (now >= depTime) return 'enroute';
    if (depTime - now < 45 * 60 * 1000) return 'boarding';
  } catch {
    // ignore
  }

  return flight.status === 'delayed' ? 'scheduled' : 'scheduled';
};

export const getFlightProgress = (flight: Flight): number => {
  if (typeof flight.progress === 'number') return Math.min(100, Math.max(0, flight.progress));

  const stage = getTimelineStage(flight);
  if (stage === 'landed') return 100;
  if (stage === 'scheduled' || stage === 'boarding') return 5;
  if (stage === 'departed') return 15;
  if (stage === 'cancelled') return 0;

  const dep = flight.departure.actual || flight.departure.estimated || flight.departure.scheduled;
  const arr = flight.arrival.estimated || flight.arrival.scheduled;

  try {
    const start = parseISO(dep).getTime();
    const end = parseISO(arr).getTime();
    const now = Date.now();
    if (end <= start) return 50;
    const pct = ((now - start) / (end - start)) * 100;
    return Math.min(95, Math.max(10, Math.round(pct)));
  } catch {
    return 40;
  }
};

export const normalizeStatus = (raw?: string | null): FlightStatus => {
  const s = (raw || '').toLowerCase();
  if (s.includes('cancel')) return 'cancelled';
  if (s.includes('delay')) return 'delayed';
  if (s.includes('land') || s.includes('arriv')) return 'landed';
  if (s.includes('board')) return 'boarding';
  if (s.includes('active') || s.includes('en-route') || s.includes('enroute') || s.includes('airborne')) {
    return 'active';
  }
  return 'scheduled';
};

export const STORAGE_KEYS = {
  tracked: 'trackedFlights',
  recent: 'recentSearches',
  theme: 'theme',
};
