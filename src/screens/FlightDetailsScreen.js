import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import notificationService from '../services/notificationService';
import {
  formatFlightTime,
  formatFlightDate,
  getTimeUntilFlight,
  getFlightDuration,
  getStatusColor,
  getStatusText,
} from '../utils/dateUtils';

const { width } = Dimensions.get('window');

export default function FlightDetailsScreen({ route, navigation }) {
  const { flight } = route.params;
  const [isTracking, setIsTracking] = useState(false);
  const [mapRegion, setMapRegion] = useState(null);

  useEffect(() => {
    // Set up map region based on flight coordinates
    if (flight.live) {
      setMapRegion({
        latitude: flight.live.latitude,
        longitude: flight.live.longitude,
        latitudeDelta: 10,
        longitudeDelta: 10,
      });
    } else {
      // Default to showing both airports
      setMapRegion({
        latitude: 39.8283, // Center of US
        longitude: -98.5795,
        latitudeDelta: 50,
        longitudeDelta: 50,
      });
    }
  }, [flight]);

  const handleTrackFlight = async () => {
    if (isTracking) {
      setIsTracking(false);
      await notificationService.cancelAllNotifications();
      Alert.alert('Success', 'Flight tracking disabled');
    } else {
      setIsTracking(true);
      await notificationService.scheduleFlightNotification(flight, 'departure');
      Alert.alert(
        'Success',
        'Flight tracking enabled! You will receive notifications for important updates.'
      );
    }
  };

  const InfoCard = ({ title, children }) => (
    <View style={styles.infoCard}>
      <Text style={styles.cardTitle}>{title}</Text>
      {children}
    </View>
  );

  const TimelineItem = ({ time, label, sublabel, airport, terminal, gate, isActive }) => (
    <View style={styles.timelineItem}>
      <View style={styles.timelineIndicator}>
        <View style={[styles.timelineDot, isActive && styles.timelineDotActive]} />
        {isActive && <View style={styles.timelinePulse} />}
      </View>
      <View style={styles.timelineContent}>
        <View style={styles.timelineHeader}>
          <Text style={styles.airportCode}>{airport}</Text>
          <Text style={styles.timelineTime}>{time}</Text>
        </View>
        <Text style={styles.timelineLabel}>{label}</Text>
        {sublabel && <Text style={styles.timelineSublabel}>{sublabel}</Text>}
        <View style={styles.gateInfo}>
          {terminal && (
            <Text style={styles.gateText}>Terminal {terminal}</Text>
          )}
          {gate && (
            <Text style={styles.gateText}>Gate {gate}</Text>
          )}
        </View>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.flightNumber}>{flight.flightNumber}</Text>
            <Text style={styles.airline}>{flight.airline}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(flight.status) }]}>
            <Text style={styles.statusText}>{getStatusText(flight.status)}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.trackButton, isTracking && styles.trackButtonActive]}
          onPress={handleTrackFlight}
        >
          <Text style={styles.trackButtonText}>
            {isTracking ? '✓ Tracking' : '+ Track Flight'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Map Section */}
      {mapRegion && (
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={mapRegion}
            showsUserLocation={false}
          >
            {flight.live && (
              <Marker
                coordinate={{
                  latitude: flight.live.latitude,
                  longitude: flight.live.longitude,
                }}
                title={flight.flightNumber}
                description="Current Position"
              >
                <Text style={styles.planeMarker}>✈️</Text>
              </Marker>
            )}
          </MapView>
        </View>
      )}

      {/* Flight Progress */}
      <InfoCard title="Flight Progress">
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '40%' }]} />
          </View>
          <Text style={styles.progressText}>
            {getTimeUntilFlight(flight.departure.scheduled)}
          </Text>
        </View>
      </InfoCard>

      {/* Timeline */}
      <InfoCard title="Flight Timeline">
        <View style={styles.timeline}>
          <TimelineItem
            airport={flight.departure.iata}
            time={formatFlightTime(flight.departure.scheduled)}
            label={`Departure from ${flight.departure.airport}`}
            sublabel={formatFlightDate(flight.departure.scheduled)}
            terminal={flight.departure.terminal}
            gate={flight.departure.gate}
            isActive={flight.status === 'scheduled' || flight.status === 'active'}
          />
          
          <View style={styles.timelineLine} />
          
          <TimelineItem
            airport={flight.arrival.iata}
            time={formatFlightTime(flight.arrival.scheduled)}
            label={`Arrival at ${flight.arrival.airport}`}
            sublabel={formatFlightDate(flight.arrival.scheduled)}
            terminal={flight.arrival.terminal}
            gate={flight.arrival.gate}
            isActive={flight.status === 'landed'}
          />
        </View>

        <View style={styles.durationContainer}>
          <Text style={styles.durationLabel}>Flight Duration</Text>
          <Text style={styles.durationValue}>
            {getFlightDuration(flight.departure.scheduled, flight.arrival.scheduled)}
          </Text>
        </View>
      </InfoCard>

      {/* Aircraft Information */}
      <InfoCard title="Aircraft Information">
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Aircraft Type</Text>
          <Text style={styles.infoValue}>{flight.aircraft.iata}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Registration</Text>
          <Text style={styles.infoValue}>{flight.aircraft.registration}</Text>
        </View>
      </InfoCard>

      {/* Live Data (if available) */}
      {flight.live && (
        <InfoCard title="Live Data">
          <View style={styles.liveDataGrid}>
            <View style={styles.liveDataItem}>
              <Text style={styles.liveDataLabel}>Altitude</Text>
              <Text style={styles.liveDataValue}>
                {flight.live.altitude?.toLocaleString() || 'N/A'} ft
              </Text>
            </View>
            <View style={styles.liveDataItem}>
              <Text style={styles.liveDataLabel}>Speed</Text>
              <Text style={styles.liveDataValue}>
                {flight.live.speed || 'N/A'} kts
              </Text>
            </View>
            <View style={styles.liveDataItem}>
              <Text style={styles.liveDataLabel}>Heading</Text>
              <Text style={styles.liveDataValue}>
                {flight.live.direction || 'N/A'}°
              </Text>
            </View>
            <View style={styles.liveDataItem}>
              <Text style={styles.liveDataLabel}>Coordinates</Text>
              <Text style={styles.liveDataValue}>
                {flight.live.latitude.toFixed(2)}, {flight.live.longitude.toFixed(2)}
              </Text>
            </View>
          </View>
        </InfoCard>
      )}

      {/* Notifications Info */}
      {isTracking && (
        <View style={styles.notificationInfo}>
          <Text style={styles.notificationEmoji}>🔔</Text>
          <View style={styles.notificationContent}>
            <Text style={styles.notificationTitle}>Notifications Enabled</Text>
            <Text style={styles.notificationText}>
              You'll receive alerts for gate changes, delays, boarding, and arrival updates.
            </Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  flightNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  airline: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  trackButton: {
    backgroundColor: '#1a73e8',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  trackButtonActive: {
    backgroundColor: '#4CAF50',
  },
  trackButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  mapContainer: {
    height: 250,
    backgroundColor: '#e0e0e0',
  },
  map: {
    flex: 1,
  },
  planeMarker: {
    fontSize: 32,
  },
  infoCard: {
    backgroundColor: '#fff',
    margin: 16,
    marginBottom: 0,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  progressContainer: {
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#1a73e8',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  timeline: {
    marginBottom: 16,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 0,
  },
  timelineIndicator: {
    width: 40,
    alignItems: 'center',
    position: 'relative',
  },
  timelineDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
    borderWidth: 3,
    borderColor: '#fff',
    zIndex: 2,
  },
  timelineDotActive: {
    backgroundColor: '#1a73e8',
  },
  timelinePulse: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#1a73e8',
    opacity: 0.3,
    top: -4,
  },
  timelineLine: {
    width: 2,
    height: 40,
    backgroundColor: '#e0e0e0',
    marginLeft: 19,
    marginVertical: -8,
  },
  timelineContent: {
    flex: 1,
    paddingBottom: 24,
  },
  timelineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  airportCode: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  timelineTime: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a73e8',
  },
  timelineLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  timelineSublabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  gateInfo: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  gateText: {
    fontSize: 13,
    color: '#666',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  durationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  durationLabel: {
    fontSize: 14,
    color: '#666',
  },
  durationValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  liveDataGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  liveDataItem: {
    width: '50%',
    padding: 8,
  },
  liveDataLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  liveDataValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  notificationInfo: {
    flexDirection: 'row',
    backgroundColor: '#E3F2FD',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#90CAF9',
  },
  notificationEmoji: {
    fontSize: 32,
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1565C0',
    marginBottom: 4,
  },
  notificationText: {
    fontSize: 14,
    color: '#1976D2',
    lineHeight: 20,
  },
});
