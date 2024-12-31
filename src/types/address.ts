export interface Address {
  id: string;
  type: 'home' | 'office' | 'other';
  houseNumber: string;
  street: string;
  area: string;
  latitude: number;
  longitude: number;
  isFavorite: boolean;
}

export interface LocationState {
  currentLocation: {
    latitude: number | null;
    longitude: number | null;
  };
  selectedLocation: {
    latitude: number | null;
    longitude: number | null;
  };
  addresses: Address[];
  isLocationPermissionGranted: boolean;
}