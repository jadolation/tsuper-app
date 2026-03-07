import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import MapViewComponent, { MarkerData } from '../components/MapViewComponent';
import { useAppStore } from '../store/appStore';

const DESTINATIONS = ['Manaoag', 'Mapandan'];

// Mocked jeepney data keyed by destination
const MOCKED_JEEPS: Record<string, MarkerData[]> = {
  Manaoag: [
    {
      id: 'jeep-1',
      lat: 16.0440,
      lng: 120.3340,
      title: 'Jeepney A',
      description: 'Dagupan → Manaoag | Seats available',
      pinColor: '#FF6B00',
    },
    {
      id: 'jeep-2',
      lat: 16.0420,
      lng: 120.3310,
      title: 'Jeepney B',
      description: 'Dagupan → Manaoag | Almost full',
      pinColor: '#FF6B00',
    },
  ],
  Mapandan: [
    {
      id: 'jeep-3',
      lat: 16.0450,
      lng: 120.3360,
      title: 'Jeepney C',
      description: 'Dagupan → Mapandan | Seats available',
      pinColor: '#FF6B00',
    },
  ],
};

export default function PassengerMapScreen() {
  const { selectedDestination, setSelectedDestination, waitingPassengerPin, setWaitingPassengerPin } =
    useAppStore();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [waitStatus, setWaitStatus] = useState<'idle' | 'loading' | 'pinned'>('idle');

  const visibleJeeps = selectedDestination ? (MOCKED_JEEPS[selectedDestination] ?? []) : [];

  const handleWaitHere = async () => {
    setWaitStatus('loading');
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setWaitStatus('idle');
      return;
    }
    const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
    setWaitingPassengerPin({
      lat: location.coords.latitude,
      lng: location.coords.longitude,
    });
    setWaitStatus('pinned');
  };

  const handleCancelWait = () => {
    setWaitingPassengerPin(null);
    setWaitStatus('idle');
  };

  return (
    <View style={styles.container}>
      {/* Destination Picker */}
      <View style={styles.pickerContainer}>
        <TouchableOpacity
          style={styles.pickerButton}
          onPress={() => setDropdownOpen((prev) => !prev)}
          activeOpacity={0.8}
        >
          <Text style={styles.pickerButtonText}>
            {selectedDestination ? `Going to: ${selectedDestination}` : 'Where are you going?'}
          </Text>
          <Text style={styles.pickerChevron}>{dropdownOpen ? '▲' : '▼'}</Text>
        </TouchableOpacity>

        {dropdownOpen && (
          <View style={styles.dropdownMenu}>
            {DESTINATIONS.map((dest) => (
              <TouchableOpacity
                key={dest}
                style={[
                  styles.dropdownItem,
                  selectedDestination === dest && styles.dropdownItemActive,
                ]}
                onPress={() => {
                  setSelectedDestination(dest);
                  setDropdownOpen(false);
                }}
              >
                <Text
                  style={[
                    styles.dropdownItemText,
                    selectedDestination === dest && styles.dropdownItemTextActive,
                  ]}
                >
                  {dest}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Map */}
      <MapViewComponent markers={visibleJeeps}>
        {/* Waiting passenger pin */}
        {waitingPassengerPin && (
          <Marker
            coordinate={{
              latitude: waitingPassengerPin.lat,
              longitude: waitingPassengerPin.lng,
            }}
            title="Waiting here"
            description="You dropped a wait pin"
            pinColor="#1D7FE8"
          />
        )}
      </MapViewComponent>

      {/* Wait Here FAB */}
      <View style={styles.fabContainer}>
        {waitStatus === 'pinned' ? (
          <TouchableOpacity style={[styles.fab, styles.fabCancel]} onPress={handleCancelWait}>
            <Text style={styles.fabText}>Cancel Wait</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.fab, waitStatus === 'loading' && styles.fabDisabled]}
            onPress={handleWaitHere}
            disabled={waitStatus === 'loading'}
          >
            <Text style={styles.fabText}>
              {waitStatus === 'loading' ? 'Getting location...' : 'Wait Here'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pickerContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    left: 16,
    right: 16,
    zIndex: 10,
  },
  pickerButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  pickerButtonText: {
    fontSize: 15,
    color: '#222',
    fontWeight: '500',
  },
  pickerChevron: {
    fontSize: 12,
    color: '#666',
  },
  dropdownMenu: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginTop: 4,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 6,
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#EEE',
  },
  dropdownItemActive: {
    backgroundColor: '#FFF3E8',
  },
  dropdownItemText: {
    fontSize: 15,
    color: '#333',
  },
  dropdownItemTextActive: {
    color: '#FF6B00',
    fontWeight: '600',
  },
  fabContainer: {
    position: 'absolute',
    bottom: 36,
    alignSelf: 'center',
  },
  fab: {
    backgroundColor: '#FF6B00',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
  },
  fabCancel: {
    backgroundColor: '#E53935',
  },
  fabDisabled: {
    opacity: 0.6,
  },
  fabText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
