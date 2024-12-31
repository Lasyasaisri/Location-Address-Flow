import { create } from 'zustand';
import type { Address, LocationState } from '../types/address';

interface LocationStore extends LocationState {
  setCurrentLocation: (latitude: number, longitude: number) => void;
  setSelectedLocation: (latitude: number, longitude: number) => void;
  setLocationPermission: (granted: boolean) => void;
  addAddress: (address: Address) => void;
  updateAddress: (id: string, updatedAddress: Partial<Address>) => void;
  deleteAddress: (id: string) => void;
  toggleFavorite: (id: string) => void;
}

const useLocationStore = create<LocationStore>((set) => ({
  currentLocation: {
    latitude: null,
    longitude: null,
  },
  selectedLocation: {
    latitude: null,
    longitude: null,
  },
  addresses: [],
  isLocationPermissionGranted: false,

  setCurrentLocation: (latitude: number, longitude: number) =>
    set({ currentLocation: { latitude, longitude } }),

  setSelectedLocation: (latitude: number, longitude: number) =>
    set({ selectedLocation: { latitude, longitude } }),

  setLocationPermission: (granted: boolean) =>
    set({ isLocationPermissionGranted: granted }),

  addAddress: (address: Address) =>
    set((state) => ({ addresses: [...state.addresses, address] })),

  updateAddress: (id: string, updatedAddress: Partial<Address>) =>
    set((state) => ({
      addresses: state.addresses.map((addr) =>
        addr.id === id ? { ...addr, ...updatedAddress } : addr
      ),
    })),

  deleteAddress: (id: string) =>
    set((state) => ({
      addresses: state.addresses.filter((addr) => addr.id !== id),
    })),

  toggleFavorite: (id: string) =>
    set((state) => ({
      addresses: state.addresses.map((addr) =>
        addr.id === id ? { ...addr, isFavorite: !addr.isFavorite } : addr
      ),
    })),
}));

export default useLocationStore;