import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAppStore } from '../src/store/appStore';
import type { UserRole } from '../src/store/appStore';

type RoleOption = {
  role: UserRole;
  label: string;
  subtitle: string;
  color: string;
  route: '/passenger/map' | '/driver/companion';
};

const ROLES: RoleOption[] = [
  {
    role: 'passenger',
    label: 'I am a Passenger',
    subtitle: 'Find jeepneys & book tricycles',
    color: '#1D7FE8',
    route: '/passenger/map',
  },
  {
    role: 'jeep_driver',
    label: 'I am a Jeepney Driver',
    subtitle: 'Broadcast your location to passengers',
    color: '#FF6B00',
    route: '/driver/companion',
  },
  {
    role: 'tricycle_driver',
    label: 'I am a Tricycle Driver',
    subtitle: 'Receive booking requests in your zone',
    color: '#2E7D32',
    route: '/driver/companion',
  },
];

export default function RoleSelectionScreen() {
  const router = useRouter();
  const setUserRole = useAppStore((s) => s.setUserRole);

  const handleSelect = (option: RoleOption) => {
    setUserRole(option.role);
    router.push(option.route);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.appName}>Tsuper</Text>
        <Text style={styles.tagline}>Real-time transport for everyone.</Text>
      </View>

      <View style={styles.rolesContainer}>
        <Text style={styles.prompt}>Who are you today?</Text>
        {ROLES.map((option) => (
          <TouchableOpacity
            key={option.role}
            style={[styles.roleCard, { borderLeftColor: option.color }]}
            onPress={() => handleSelect(option)}
            activeOpacity={0.85}
          >
            <View style={[styles.roleIndicator, { backgroundColor: option.color }]} />
            <View style={styles.roleTextContainer}>
              <Text style={styles.roleLabel}>{option.label}</Text>
              <Text style={styles.roleSubtitle}>{option.subtitle}</Text>
            </View>
            <Text style={[styles.roleArrow, { color: option.color }]}>›</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 28,
    paddingBottom: 32,
  },
  appName: {
    fontSize: 42,
    fontWeight: '800',
    color: '#111',
    letterSpacing: -1,
  },
  tagline: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  rolesContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  prompt: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  roleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderLeftWidth: 5,
    paddingHorizontal: 20,
    paddingVertical: 18,
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
  },
  roleIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 14,
  },
  roleTextContainer: {
    flex: 1,
  },
  roleLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
  },
  roleSubtitle: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
  roleArrow: {
    fontSize: 28,
    fontWeight: '300',
    lineHeight: 30,
  },
});
