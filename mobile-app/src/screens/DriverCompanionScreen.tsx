import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
} from 'react-native';
import { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import MapViewComponent from '../components/MapViewComponent';
import { useAppStore } from '../store/appStore';

const GPS_INTERVAL_MS = 10000; // 10 seconds, as per spec

export default function DriverCompanionScreen() {
  const {
    isShiftActive,
    setIsShiftActive,
    driverLocation,
    setDriverLocation,
    waitingPassengerPin,
  } = useAppStore();

  const [permissionGranted, setPermissionGranted] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Request location permission on mount
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Location Permission Required',
          'Please grant location access to use Driver Companion mode.',
        );
      } else {
        setPermissionGranted(true);
      }
    })();
  }, []);

  // Start / stop GPS polling based on shift status
  useEffect(() => {
    if (isShiftActive && permissionGranted) {
      // Immediate first ping
      pingLocation();

      intervalRef.current = setInterval(pingLocation, GPS_INTERVAL_MS);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isShiftActive, permissionGranted]);

  const pingLocation = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setDriverLocation({
        lat: location.coords.latitude,
        lng: location.coords.longitude,
        heading: location.coords.heading ?? 0,
        timestamp: location.timestamp,
      });
      // TODO (Post-MVP): broadcastDriverLocation(driverId, { ... })
    } catch (err) {
      console.warn('GPS ping failed:', err);
    }
  };

  const handleToggleShift = () => {
    if (!permissionGranted) {
      Alert.alert('Permission denied', 'Location access is required to start your shift.');
      return;
    }
    setIsShiftActive(!isShiftActive);
  };

  const mapRegion = driverLocation
    ? {
        latitude: driverLocation.lat,
        longitude: driverLocation.lng,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      }
    : undefined;

  return (
    <View style={styles.container}>
      {/* Status bar */}
      <View style={styles.statusBar}>
        <View style={[styles.statusDot, isShiftActive ? styles.statusDotActive : styles.statusDotIdle]} />
        <Text style={styles.statusText}>
          {isShiftActive ? 'Shift Active — Broadcasting GPS' : 'Shift Inactive'}
        </Text>
        {driverLocation && (
          <Text style={styles.coordsText}>
            {driverLocation.lat.toFixed(5)}, {driverLocation.lng.toFixed(5)}
          </Text>
        )}
      </View>

      {/* Map */}
      <MapViewComponent initialRegion={mapRegion}>
        {/* Driver's own live position */}
        {driverLocation && (
          <Marker
            coordinate={{
              latitude: driverLocation.lat,
              longitude: driverLocation.lng,
            }}
            title="Your location"
            description="Your current GPS position"
            pinColor="#2E7D32"
          />
        )}

        {/* Passenger waiting pin */}
        {waitingPassengerPin && (
          <Marker
            coordinate={{
              latitude: waitingPassengerPin.lat,
              longitude: waitingPassengerPin.lng,
            }}
            title="Waiting Passenger"
            description="A passenger is waiting here"
            pinColor="#1D7FE8"
          />
        )}
      </MapViewComponent>

      {/* Start/Stop Shift Toggle */}
      <View style={styles.fabContainer}>
        <TouchableOpacity
          style={[styles.shiftButton, isShiftActive ? styles.shiftButtonStop : styles.shiftButtonStart]}
          onPress={handleToggleShift}
          activeOpacity={0.85}
        >
          <Text style={styles.shiftButtonText}>
            {isShiftActive ? 'End Shift' : 'Start Shift'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  statusBar: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    left: 16,
    right: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    position: 'absolute',
    top: 14,
    left: 14,
  },
  statusDotActive: {
    backgroundColor: '#2E7D32',
  },
  statusDotIdle: {
    backgroundColor: '#9E9E9E',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#222',
    marginLeft: 20,
  },
  coordsText: {
    fontSize: 11,
    color: '#777',
    marginTop: 2,
    marginLeft: 20,
    fontVariant: ['tabular-nums'],
  },
  fabContainer: {
    position: 'absolute',
    bottom: 36,
    alignSelf: 'center',
  },
  shiftButton: {
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
  },
  shiftButtonStart: {
    backgroundColor: '#2E7D32',
  },
  shiftButtonStop: {
    backgroundColor: '#E53935',
  },
  shiftButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
