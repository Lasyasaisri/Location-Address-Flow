import React, { useEffect, useRef } from 'react';

interface MapProps {
  center: { lat: number; lng: number };
  onMarkerDragEnd?: (event: any) => void;
  draggable?: boolean;
}

export default function Map({ center, onMarkerDragEnd, draggable = true }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load GoMaps script dynamically
    const script = document.createElement('script');
    script.src = `https://maps.gomaps.pro/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=geometry,places&callback=initMap`;
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    (window as any).initMap = () => {
      if (mapRef.current) {
        const map = new (window as any).google.maps.Map(mapRef.current, {
          center,
          zoom: 15,
        });

        const marker = new (window as any).google.maps.Marker({
          position: center,
          map,
          draggable,
        });

        // Handle drag end
        marker.addListener('dragend', (event: any) => {
          if (onMarkerDragEnd) {
            onMarkerDragEnd(event);
          }
        });
      }
    };

    return () => {
      // Cleanup script
      document.body.removeChild(script);
    };
  }, [center, draggable, onMarkerDragEnd]);

  return <div style={{ width: '100%', height: '300px', borderRadius: '0.5rem' }} ref={mapRef}></div>;
}
