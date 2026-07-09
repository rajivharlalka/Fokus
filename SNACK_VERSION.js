// Flight Tracker App - Expo Snack Version
// Paste this entire file into: https://snack.expo.dev

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';

// Mock Flight Data Generator
const getMockFlight = (flightNumber) => {
  const now = new Date();
  const departure = new Date(now.getTime() + 2 * 60 * 60 * 1000);
  const arrival = new Date(departure.getTime() + 5 * 60 * 60 * 1000);

  const flights = {
    AA100: {
      flightNumber: 'AA100',
      airline: 'American Airlines',
      status: 'scheduled',
      departure: {
        airport: 'San Francisco International',
        iata: 'SFO',
        scheduled: departure.toISOString(),
        terminal: '2',
        gate: 'A12',
      },
      arrival: {
        airport: 'John F Kennedy International',
        iata: 'JFK',
        scheduled: arrival.toISOString(),
        terminal: '4',
        gate: 'B23',
      },
      aircraft: {
        registration: 'N12345',
        type: 'Boeing 737-800',
      },
    },
    DL200: {
      flightNumber: 'DL200',
      airline: 'Delta Air Lines',
      status: 'active',
      departure: {
        airport: 'Los Angeles International',
        iata: 'LAX',
        scheduled: new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString(),
        terminal: 'B',
        gate: '47',
      },
      arrival: {
        airport: "O'Hare International",
        iata: 'ORD',
        scheduled: new Date(now.getTime() + 3 * 60 * 60 * 1000).toISOString(),
        terminal: '1',
        gate: 'C18',
      },
      aircraft: {
        registration: 'N67890',
        type: 'Airbus A320',
      },
    },
    UA300: {
      flightNumber: 'UA300',
      airline: 'United Airlines',
      status: 'delayed',
      departure: {
        airport: "O'Hare International",
        iata: 'ORD',
        scheduled: new Date(now.getTime() + 4 * 60 * 60 * 1000).toISOString(),
        terminal: '1',
        gate: 'B6',
      },
      arrival: {
        airport: 'London Heathrow',
        iata: 'LHR',
        scheduled: new Date(now.getTime() + 12 * 60 * 60 * 1000).toISOString(),
        terminal: '2',
        gate: 'A10',
      },
      aircraft: {
        registration: 'N11223',
        type: 'Boeing 787-9',
      },
    },
  };

  return flights[flightNumber] || {
    flightNumber: flightNumber,
    airline: 'Demo Airlines',
    status: 'scheduled',
    departure: {
      airport: 'San Francisco International',
      iata: 'SFO',
      scheduled: departure.toISOString(),
      terminal: '2',
      gate: 'A12',
    },
    arrival: {
      airport: 'John F Kennedy International',
      iata: 'JFK',
      scheduled: arrival.toISOString(),
      terminal: '4',
      gate: 'B23',
    },
    aircraft: {
      registration: 'N99999',
      type: 'Boeing 737-800',
    },
  };
};

// Utility Functions
const formatTime = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit' 
  });
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  });
};

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'scheduled': return '#4CAF50';
    case 'active': return '#2196F3';
    case 'landed': return '#9E9E9E';
    case 'cancelled': return '#F44336';
    case 'delayed': return '#FF9800';
    default: return '#757575';
  }
};

const getStatusText = (status) => {
  switch (status?.toLowerCase()) {
    case 'scheduled': return 'Scheduled';
    case 'active': return 'In Flight';
    case 'landed': return 'Landed';
    case 'cancelled': return 'Cancelled';
    case 'delayed': return 'Delayed';
    default: return 'Unknown';
  }
};

// Home Screen Component
const HomeScreen = ({ onSearchPress, trackedFlights, onFlightPress }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>✈️ Flight Tracker</Text>
      </View>

      <TouchableOpacity 
        style={styles.searchButton}
        onPress={onSearchPress}
      >
        <Text style={styles.searchButtonText}>🔍 Search Flights</Text>
      </TouchableOpacity>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tracked Flights</Text>
      </View>

      <ScrollView style={styles.flightList}>
        {trackedFlights.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>✈️</Text>
            <Text style={styles.emptyTitle}>No Tracked Flights</Text>
            <Text style={styles.emptySubtitle}>
              Search for a flight to start tracking
            </Text>
          </View>
        ) : (
          trackedFlights.map((flight, index) => (
            <TouchableOpacity
              key={index}
              style={styles.flightCard}
              onPress={() => onFlightPress(flight)}
            >
              <View style={styles.flightHeader}>
                <Text style={styles.flightNumber}>{flight.flightNumber}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(flight.status) }]}>
                  <Text style={styles.statusText}>{getStatusText(flight.status)}</Text>
                </View>
              </View>

              <View style={styles.routeContainer}>
                <View style={styles.airportInfo}>
                  <Text style={styles.airportCode}>{flight.departure.iata}</Text>
                  <Text style={styles.timeText}>{formatTime(flight.departure.scheduled)}</Text>
                </View>

                <View style={styles.flightPath}>
                  <View style={styles.pathLine} />
                  <Text style={styles.planeEmoji}>✈️</Text>
                  <View style={styles.pathLine} />
                </View>

                <View style={styles.airportInfo}>
                  <Text style={styles.airportCode}>{flight.arrival.iata}</Text>
                  <Text style={styles.timeText}>{formatTime(flight.arrival.scheduled)}</Text>
                </View>
              </View>

              <Text style={styles.airlineName}>{flight.airline}</Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
};

// Search Screen Component
const SearchScreen = ({ onBack, onFlightFound }) => {
  const [flightNumber, setFlightNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const searchFlight = () => {
    if (!flightNumber.trim()) {
      Alert.alert('Error', 'Please enter a flight number');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const flight = getMockFlight(flightNumber.trim().toUpperCase());
      setLoading(false);
      onFlightFound(flight);
    }, 500);
  };

  const quickSearch = (number) => {
    setFlightNumber(number);
    setLoading(true);
    setTimeout(() => {
      const flight = getMockFlight(number);
      setLoading(false);
      onFlightFound(flight);
    }, 500);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Search Flights</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.searchSection}>
          <Text style={styles.label}>Flight Number</Text>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.input}
              placeholder="e.g., AA100, DL200, UA300"
              value={flightNumber}
              onChangeText={setFlightNumber}
              autoCapitalize="characters"
              autoCorrect={false}
              returnKeyType="search"
              onSubmitEditing={searchFlight}
            />
            <TouchableOpacity
              style={styles.searchIconButton}
              onPress={searchFlight}
              disabled={loading}
            >
              <Text style={styles.searchIcon}>🔍</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.popularSection}>
          <Text style={styles.sectionTitle}>Popular Flights</Text>
          
          <TouchableOpacity
            style={styles.routeCard}
            onPress={() => quickSearch('AA100')}
          >
            <Text style={styles.routeNumber}>AA100</Text>
            <View style={styles.routeDetails}>
              <Text style={styles.routeAirport}>SFO → JFK</Text>
            </View>
            <Text style={styles.routeName}>San Francisco to New York</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.routeCard}
            onPress={() => quickSearch('DL200')}
          >
            <Text style={styles.routeNumber}>DL200</Text>
            <View style={styles.routeDetails}>
              <Text style={styles.routeAirport}>LAX → ORD</Text>
            </View>
            <Text style={styles.routeName}>Los Angeles to Chicago</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.routeCard}
            onPress={() => quickSearch('UA300')}
          >
            <Text style={styles.routeNumber}>UA300</Text>
            <View style={styles.routeDetails}>
              <Text style={styles.routeAirport}>ORD → LHR</Text>
            </View>
            <Text style={styles.routeName}>Chicago to London</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

// Flight Details Screen Component
const FlightDetailsScreen = ({ flight, onBack, onTrack }) => {
  const [isTracking, setIsTracking] = useState(false);

  const handleTrack = () => {
    setIsTracking(!isTracking);
    onTrack(flight);
    Alert.alert(
      'Success',
      isTracking 
        ? 'Flight tracking disabled'
        : 'Flight tracking enabled! You will receive notifications.'
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Flight Details</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.detailsHeader}>
          <View>
            <Text style={styles.detailFlightNumber}>{flight.flightNumber}</Text>
            <Text style={styles.detailAirline}>{flight.airline}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(flight.status) }]}>
            <Text style={styles.statusText}>{getStatusText(flight.status)}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.trackButton, isTracking && styles.trackButtonActive]}
          onPress={handleTrack}
        >
          <Text style={styles.trackButtonText}>
            {isTracking ? '✓ Tracking Enabled' : '+ Track This Flight'}
          </Text>
        </TouchableOpacity>

        {/* Timeline */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Flight Timeline</Text>
          
          <View style={styles.timelineItem}>
            <View style={styles.timelineLeft}>
              <View style={[styles.timelineDot, { backgroundColor: getStatusColor(flight.status) }]} />
            </View>
            <View style={styles.timelineRight}>
              <Text style={styles.timelineAirport}>{flight.departure.iata}</Text>
              <Text style={styles.timelineCity}>{flight.departure.airport}</Text>
              <Text style={styles.timelineTime}>{formatTime(flight.departure.scheduled)}</Text>
              <Text style={styles.timelineDate}>{formatDate(flight.departure.scheduled)}</Text>
              <View style={styles.gateInfo}>
                <Text style={styles.gateText}>Terminal {flight.departure.terminal}</Text>
                <Text style={styles.gateText}>Gate {flight.departure.gate}</Text>
              </View>
            </View>
          </View>

          <View style={styles.timelineLine} />

          <View style={styles.timelineItem}>
            <View style={styles.timelineLeft}>
              <View style={styles.timelineDot} />
            </View>
            <View style={styles.timelineRight}>
              <Text style={styles.timelineAirport}>{flight.arrival.iata}</Text>
              <Text style={styles.timelineCity}>{flight.arrival.airport}</Text>
              <Text style={styles.timelineTime}>{formatTime(flight.arrival.scheduled)}</Text>
              <Text style={styles.timelineDate}>{formatDate(flight.arrival.scheduled)}</Text>
              <View style={styles.gateInfo}>
                <Text style={styles.gateText}>Terminal {flight.arrival.terminal}</Text>
                <Text style={styles.gateText}>Gate {flight.arrival.gate}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Aircraft Info */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Aircraft Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Aircraft Type</Text>
            <Text style={styles.infoValue}>{flight.aircraft.type}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Registration</Text>
            <Text style={styles.infoValue}>{flight.aircraft.registration}</Text>
          </View>
        </View>

        {isTracking && (
          <View style={styles.notificationInfo}>
            <Text style={styles.notificationEmoji}>🔔</Text>
            <View>
              <Text style={styles.notificationTitle}>Notifications Enabled</Text>
              <Text style={styles.notificationText}>
                You'll receive alerts for gate changes, delays, and more.
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

// Main App Component
export default function App() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [trackedFlights, setTrackedFlights] = useState([]);
  const [selectedFlight, setSelectedFlight] = useState(null);

  const handleSearchPress = () => {
    setCurrentScreen('search');
  };

  const handleFlightFound = (flight) => {
    setSelectedFlight(flight);
    setCurrentScreen('details');
  };

  const handleFlightPress = (flight) => {
    setSelectedFlight(flight);
    setCurrentScreen('details');
  };

  const handleBack = () => {
    setCurrentScreen('home');
  };

  const handleTrack = (flight) => {
    const exists = trackedFlights.find(f => f.flightNumber === flight.flightNumber);
    if (!exists) {
      setTrackedFlights([flight, ...trackedFlights]);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      {currentScreen === 'home' && (
        <HomeScreen
          onSearchPress={handleSearchPress}
          trackedFlights={trackedFlights}
          onFlightPress={handleFlightPress}
        />
      )}
      {currentScreen === 'search' && (
        <SearchScreen
          onBack={handleBack}
          onFlightFound={handleFlightFound}
        />
      )}
      {currentScreen === 'details' && selectedFlight && (
        <FlightDetailsScreen
          flight={selectedFlight}
          onBack={handleBack}
          onTrack={handleTrack}
        />
      )}
    </SafeAreaView>
  );
}

// Styles
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1a73e8',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#1a73e8',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  searchButton: {
    backgroundColor: '#1a73e8',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  section: {
    padding: 16,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  flightList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 60,
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
    alignItems: 'center',
  },
  airportCode: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
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
  airlineName: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
  content: {
    flex: 1,
  },
  searchSection: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 50,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  searchIconButton: {
    width: 50,
    height: 50,
    backgroundColor: '#1a73e8',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  searchIcon: {
    fontSize: 24,
  },
  popularSection: {
    padding: 16,
  },
  routeCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  routeNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a73e8',
    marginBottom: 4,
  },
  routeDetails: {
    marginBottom: 4,
  },
  routeAirport: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  routeName: {
    fontSize: 14,
    color: '#666',
  },
  detailsHeader: {
    backgroundColor: '#fff',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  detailFlightNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  detailAirline: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  trackButton: {
    backgroundColor: '#1a73e8',
    margin: 16,
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
  card: {
    backgroundColor: '#fff',
    margin: 16,
    marginTop: 0,
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
  timelineItem: {
    flexDirection: 'row',
  },
  timelineLeft: {
    width: 40,
    alignItems: 'center',
  },
  timelineDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
  },
  timelineLine: {
    width: 2,
    height: 40,
    backgroundColor: '#e0e0e0',
    marginLeft: 19,
    marginVertical: -8,
  },
  timelineRight: {
    flex: 1,
    paddingBottom: 24,
  },
  timelineAirport: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  timelineCity: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  timelineTime: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a73e8',
  },
  timelineDate: {
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
  notificationInfo: {
    flexDirection: 'row',
    backgroundColor: '#E3F2FD',
    margin: 16,
    marginTop: 0,
    padding: 16,
    borderRadius: 12,
  },
  notificationEmoji: {
    fontSize: 32,
    marginRight: 12,
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
