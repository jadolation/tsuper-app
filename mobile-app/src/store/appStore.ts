import { create } from 'zustand';

export type UserRole = 'passenger' | 'jeep_driver' | 'tricycle_driver' | null;

export type LatLng = {
  lat: number;
  lng: number;
};

export type DriverLocation = {
  lat: number;
  lng: number;
  heading: number;
  timestamp: number;
};

type AppState = {
  // Role
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;

  // Passenger state
  selectedDestination: string | null;
  setSelectedDestination: (destination: string | null) => void;

  waitingPassengerPin: LatLng | null;
  setWaitingPassengerPin: (pin: LatLng | null) => void;

  // Driver state
  driverLocation: DriverLocation | null;
  setDriverLocation: (location: DriverLocation) => void;

  isShiftActive: boolean;
  setIsShiftActive: (active: boolean) => void;
};

export const useAppStore = create<AppState>((set) => ({
  // Role
  userRole: null,
  setUserRole: (role) => set({ userRole: role }),

  // Passenger state
  selectedDestination: null,
  setSelectedDestination: (destination) => set({ selectedDestination: destination }),

  waitingPassengerPin: null,
  setWaitingPassengerPin: (pin) => set({ waitingPassengerPin: pin }),

  // Driver state
  driverLocation: null,
  setDriverLocation: (location) => set({ driverLocation: location }),

  isShiftActive: false,
  setIsShiftActive: (active) => set({ isShiftActive: active }),
}));
