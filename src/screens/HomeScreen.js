import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import flightApi from '../services/flightApi';

export default function HomeScreen({ navigation }) {
  const [trackedFlights, setTrackedFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadTrackedFlights();
  }, []);

  const loadTrackedFlights = async () => {
    setLoading(true);
    try {
      // Load saved flights from storage (implement AsyncStorage later)
      // For now, show example flights
      const exampleFlights = [
        await flightApi.getMockFlightData('AA100'),
        await flightApi.getMockFlightData('DL200'),
      ];
      setTrackedFlights(exampleFlights);
    } catch (error) {
      console.error('Error loading flights:', error);
    }
    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTrackedFlights();
    setRefreshing(false);
  };

  const renderFlightCard = ({ item }) => (
    <TouchableOpacity
      style={styles.flightCard}
      onPress={() => navigation.navigate('FlightDetails', { flight: item })}
    >
      <View style={styles.flightHeader}>
        <Text style={styles.flightNumber}>{item.flightNumber}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
        </View>
      </View>

      <View style={styles.routeContainer}>
        <View style={styles.airportInfo}>
          <Text style={styles.airportCode}>{item.departure.iata}</Text>
          <Text style={styles.airportName} numberOfLines={1}>
            {item.departure.airport}
          </Text>
          <Text style={styles.timeText}>{formatTime(item.departure.scheduled)}</Text>
        </View>

        <View style={styles.flightPath}>
          <View style={styles.pathLine} />
          <Text style={styles.planeEmoji}>✈️</Text>
          <View style={styles.pathLine} />
        </View>

        <View style={styles.airportInfo}>
          <Text style={styles.airportCode}>{item.arrival.iata}</Text>
          <Text style={styles.airportName} numberOfLines={1}>
            {item.arrival.airport}
          </Text>
          <Text style={styles.timeText}>{formatTime(item.arrival.scheduled)}</Text>
        </View>
      </View>

      <View style={styles.flightDetails}>
        <Text style={styles.detailText}>Gate {item.departure.gate}</Text>
        <Text style={styles.detailText}>•</Text>
        <Text style={styles.detailText}>{item.aircraft.iata}</Text>
      </View>
    </TouchableOpacity>
  );

  const formatTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'scheduled':
        return '#4CAF50';
      case 'active':
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

  return (
    <View style={styles.container}>
      <View style={styles.searchButtonContainer}>
        <TouchableOpacity
          style={styles.searchButton}
          onPress={() => navigation.navigate('Search')}
        >
          <Text style={styles.searchButtonText}>🔍 Search Flights</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Tracked Flights</Text>
        <TouchableOpacity onPress={onRefresh}>
          <Text style={styles.refreshButton}>Refresh</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#1a73e8" style={styles.loader} />
      ) : trackedFlights.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>✈️</Text>
          <Text style={styles.emptyTitle}>No Tracked Flights</Text>
          <Text style={styles.emptySubtitle}>
            Search for a flight to start tracking
          </Text>
        </View>
      ) : (
        <FlatList
          data={trackedFlights}
          renderItem={renderFlightCard}
          keyExtractor={(item, index) => `${item.flightNumber}-${index}`}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchButtonContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchButton: {
    backgroundColor: '#1a73e8',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  refreshButton: {
    color: '#1a73e8',
    fontSize: 16,
    fontWeight: '600',
  },
  loader: {
    marginTop: 50,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  listContainer: {
    padding: 16,
  },
  flightCard: {
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
  flightHeader: {
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
  flightDetails: {
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
