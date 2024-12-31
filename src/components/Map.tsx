import React, { useEffect, useRef, useState } from 'react';
import useLocationStore from '../store/useLocationStore';

interface MapProps {
  center: { lat: number; lng: number };
  onMarkerDragEnd?: (event: any) => void;
  draggable?: boolean;
}

const mapContainerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '0.5rem',
  position: 'relative',
};

const locateButtonStyle = {
  position: 'absolute',
  bottom: '10px',
  left: '50%',
  transform: 'translateX(-50%)',
  backgroundColor: '#fff',
  color: '#FF0000',
  border: '1px solid #ddd',
  borderRadius: '25px',
  padding: '10px 20px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 'bold',
  fontSize: '14px',
  cursor: 'pointer',
  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
  zIndex: 10,
};

const locateIconStyle = {
  marginRight: '8px',
  fontSize: '16px',
};

export default function Map({ center, onMarkerDragEnd, draggable = true }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [marker, setMarker] = useState<any>(null);
  const { setSelectedLocation } = useLocationStore();

  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://maps.gomaps.pro/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=geometry,places&callback=initMap`;
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    (window as any).initMap = () => {
      if (mapRef.current) {
        const mapInstance = new (window as any).google.maps.Map(mapRef.current, {
          center,
          zoom: 15,
        });

        const markerInstance = new (window as any).google.maps.Marker({
          position: center,
          map: mapInstance,
          draggable,
        });

        setMap(mapInstance);
        setMarker(markerInstance);

        // Handle marker drag end
        markerInstance.addListener('dragend', (event: any) => {
          if (onMarkerDragEnd) {
            onMarkerDragEnd(event);
          }
        });
      }
    };

    return () => {
      document.body.removeChild(script);
    };
  }, [center, draggable, onMarkerDragEnd]);

  const locateMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          // Center map on user's location
          if (map) {
            map.setCenter(userLocation);
            map.setZoom(17);
          }

          // Move marker to user's location
          if (marker) {
            marker.setPosition(userLocation);
          }

          // Update selected location in the store
          setSelectedLocation(userLocation.lat, userLocation.lng);
        },
        (error) => {
          console.error("Error fetching location: ", error.message);
          alert("Unable to retrieve your location. Please try again.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  return (
    <div style={mapContainerStyle}>
      {/* Locate Me Button */}
      <div style={locateButtonStyle} onClick={locateMe}>
        <span style={locateIconStyle}>📍</span>
        <span>Locate Me</span>
      </div>

      {/* Map Container */}
      <div style={{ width: '100%', height: '100%' }} ref={mapRef}></div>
    </div>
  );
}