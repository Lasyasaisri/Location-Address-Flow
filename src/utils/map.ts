// Map utility functions and constants
export const DEFAULT_MAP_OPTIONS = {
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: false,
};

export const DEFAULT_MAP_ZOOM = 15;

export const MAP_CONTAINER_STYLE = {
  width: '100%',
  height: '300px',
  borderRadius: '0.5rem'
} as const;

export const isValidCoordinates = (lat: number | null, lng: number | null): boolean => {
  if (lat === null || lng === null) return false;
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
};