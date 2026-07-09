import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { getStatusColor } from '../utils/dateUtils';

export default function FlightCard({ flight, onPress }) {
  const formatTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.flightNumber}>{flight.flightNumber}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(flight.status) }]}>
          <Text style={styles.statusText}>{flight.status.toUpperCase()}</Text>
        </View>
      </View>

      <View style={styles.routeContainer}>
        <View style={styles.airportInfo}>
          <Text style={styles.airportCode}>{flight.departure.iata}</Text>
          <Text style={styles.airportName} numberOfLines={1}>
            {flight.departure.airport}
          </Text>
          <Text style={styles.timeText}>{formatTime(flight.departure.scheduled)}</Text>
        </View>

        <View style={styles.flightPath}>
          <View style={styles.pathLine} />
          <Text style={styles.planeEmoji}>✈️</Text>
          <View style={styles.pathLine} />
        </View>

        <View style={styles.airportInfo}>
          <Text style={styles.airportCode}>{flight.arrival.iata}</Text>
          <Text style={styles.airportName} numberOfLines={1}>
            {flight.arrival.airport}
          </Text>
          <Text style={styles.timeText}>{formatTime(flight.arrival.scheduled)}</Text>
        </View>
      </View>

      <View style={styles.details}>
        <Text style={styles.detailText}>Gate {flight.departure.gate}</Text>
        <Text style={styles.detailText}>•</Text>
        <Text style={styles.detailText}>{flight.aircraft.iata}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  flightNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  routeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  airportInfo: {
    flex: 1,
  },
  airportCode: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  airportName: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  timeText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  flightPath: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  pathLine: {
    width: 20,
    height: 2,
    backgroundColor: '#1a73e8',
  },
  planeEmoji: {
    fontSize: 20,
    marginHorizontal: 4,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  detailText: {
    fontSize: 14,
    color: '#666',
  },
});
