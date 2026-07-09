import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

class NotificationService {
  async requestPermissions() {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return false;
    }

    return true;
  }

  async scheduleFlightNotification(flight, type) {
    const hasPermission = await this.requestPermissions();
    if (!hasPermission) return;

    let title = '';
    let body = '';
    let trigger = null;

    switch (type) {
      case 'departure':
        title = `${flight.flightNumber} Departure Update`;
        body = `Your flight is departing from ${flight.departure.iata} at gate ${flight.departure.gate}`;
        break;
      case 'boarding':
        title = `${flight.flightNumber} Now Boarding`;
        body = `Boarding has started at gate ${flight.departure.gate}`;
        break;
      case 'arrival':
        title = `${flight.flightNumber} Arrival Update`;
        body = `Landing at ${flight.arrival.iata}. Baggage claim: TBA`;
        break;
      case 'delay':
        title = `${flight.flightNumber} Delayed`;
        body = `Your flight has been delayed. New departure time: ${flight.departure.estimated}`;
        break;
      case 'gate_change':
        title = `${flight.flightNumber} Gate Change`;
        body = `Gate changed to ${flight.departure.gate}`;
        break;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: { flight },
      },
      trigger,
    });
  }

  async cancelAllNotifications() {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }
}

export default new NotificationService();
