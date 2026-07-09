import { format, formatDistance, parseISO, differenceInMinutes } from 'date-fns';

export const formatFlightTime = (dateString: string): string => {
  if (!dateString) return 'N/A';
  try {
    const date = parseISO(dateString);
    return format(date, 'h:mm a');
  } catch (error) {
    return 'N/A';
  }
};

export const formatFlightDate = (dateString: string): string => {
  if (!dateString) return 'N/A';
  try {
    const date = parseISO(dateString);
    return format(date, 'MMM dd, yyyy');
  } catch (error) {
    return 'N/A';
  }
};

export const getTimeUntilFlight = (dateString: string): string => {
  if (!dateString) return 'Unknown';
  try {
    const date = parseISO(dateString);
    return formatDistance(date, new Date(), { addSuffix: true });
  } catch (error) {
    return 'Unknown';
  }
};

export const getFlightDuration = (
  departureString: string,
  arrivalString: string
): string => {
  if (!departureString || !arrivalString) return 'N/A';
  try {
    const departure = parseISO(departureString);
    const arrival = parseISO(arrivalString);
    const minutes = differenceInMinutes(arrival, departure);
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  } catch (error) {
    return 'N/A';
  }
};

export const getStatusColor = (status: string): string => {
  switch (status?.toLowerCase()) {
    case 'scheduled':
      return '#4CAF50';
    case 'active':
    case 'en-route':
      return '#2196F3';
    case 'landed':
      return '#9E9E9E';
    case 'cancelled':
      return '#F44336';
    case 'delayed':
      return '#FF9800';
    default:
      return '#757575';
  }
};

export const getStatusText = (status: string): string => {
  switch (status?.toLowerCase()) {
    case 'scheduled':
      return 'Scheduled';
    case 'active':
    case 'en-route':
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
