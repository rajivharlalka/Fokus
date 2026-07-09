import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert,
} from 'react-native';
import flightApi from '../services/flightApi';

export default function SearchScreen({ navigation }) {
  const [flightNumber, setFlightNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([
    'AA100',
    'DL200',
    'UA300',
    'SW400',
  ]);

  const searchFlight = async (number) => {
    if (!number.trim()) {
      Alert.alert('Error', 'Please enter a flight number');
      return;
    }

    setLoading(true);
    try {
      const flight = await flightApi.searchByFlightNumber(number.trim());
      
      if (flight) {
        // Add to recent searches
        setRecentSearches(prev => {
          const updated = [number.trim(), ...prev.filter(f => f !== number.trim())];
          return updated.slice(0, 10);
        });
        
        navigation.navigate('FlightDetails', { flight });
      } else {
        Alert.alert('Not Found', 'Flight not found. Please check the flight number.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to search flight. Please try again.');
      console.error('Search error:', error);
    }
    setLoading(false);
  };

  const handleQuickSearch = (number) => {
    setFlightNumber(number);
    searchFlight(number);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
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
            onSubmitEditing={() => searchFlight(flightNumber)}
          />
          <TouchableOpacity
            style={styles.searchIconButton}
            onPress={() => searchFlight(flightNumber)}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.searchIcon}>🔍</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.examplesSection}>
        <Text style={styles.sectionTitle}>Search Tips</Text>
        <View style={styles.tipCard}>
          <Text style={styles.tipEmoji}>💡</Text>
          <View style={styles.tipContent}>
            <Text style={styles.tipTitle}>Flight Number Format</Text>
            <Text style={styles.tipText}>
              Enter airline code + flight number (e.g., AA100, DL200)
            </Text>
          </View>
        </View>

        <View style={styles.tipCard}>
          <Text style={styles.tipEmoji}>🌍</Text>
          <View style={styles.tipContent}>
            <Text style={styles.tipTitle}>International Flights</Text>
            <Text style={styles.tipText}>
              Works with all major airlines worldwide
            </Text>
          </View>
        </View>
      </View>

      {recentSearches.length > 0 && (
        <View style={styles.recentSection}>
          <Text style={styles.sectionTitle}>Recent Searches</Text>
          <View style={styles.recentGrid}>
            {recentSearches.map((search, index) => (
              <TouchableOpacity
                key={index}
                style={styles.recentChip}
                onPress={() => handleQuickSearch(search)}
              >
                <Text style={styles.recentText}>{search}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      <View style={styles.popularSection}>
        <Text style={styles.sectionTitle}>Popular Routes</Text>
        
        <TouchableOpacity
          style={styles.routeCard}
          onPress={() => handleQuickSearch('AA100')}
        >
          <View style={styles.routeHeader}>
            <Text style={styles.routeNumber}>AA100</Text>
            <Text style={styles.routeArrow}>→</Text>
          </View>
          <View style={styles.routeDetails}>
            <Text style={styles.routeAirport}>SFO</Text>
            <Text style={styles.routeSeparator}>•</Text>
            <Text style={styles.routeAirport}>JFK</Text>
          </View>
          <Text style={styles.routeName}>San Francisco to New York</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.routeCard}
          onPress={() => handleQuickSearch('DL200')}
        >
          <View style={styles.routeHeader}>
            <Text style={styles.routeNumber}>DL200</Text>
            <Text style={styles.routeArrow}>→</Text>
          </View>
          <View style={styles.routeDetails}>
            <Text style={styles.routeAirport}>LAX</Text>
            <Text style={styles.routeSeparator}>•</Text>
            <Text style={styles.routeAirport}>ORD</Text>
          </View>
          <Text style={styles.routeName}>Los Angeles to Chicago</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.routeCard}
          onPress={() => handleQuickSearch('UA300')}
        >
          <View style={styles.routeHeader}>
            <Text style={styles.routeNumber}>UA300</Text>
            <Text style={styles.routeArrow}>→</Text>
          </View>
          <View style={styles.routeDetails}>
            <Text style={styles.routeAirport}>ORD</Text>
            <Text style={styles.routeSeparator}>•</Text>
            <Text style={styles.routeAirport}>LHR</Text>
          </View>
          <Text style={styles.routeName}>Chicago to London</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
  },
  searchSection: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
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
  examplesSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  tipCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  tipEmoji: {
    fontSize: 32,
    marginRight: 12,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  tipText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  recentSection: {
    marginBottom: 16,
  },
  recentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  recentChip: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  recentText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a73e8',
  },
  popularSection: {
    marginBottom: 16,
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
  routeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  routeNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a73e8',
  },
  routeArrow: {
    fontSize: 18,
    color: '#666',
    marginLeft: 8,
  },
  routeDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  routeAirport: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  routeSeparator: {
    fontSize: 16,
    color: '#666',
    marginHorizontal: 8,
  },
  routeName: {
    fontSize: 14,
    color: '#666',
  },
});
