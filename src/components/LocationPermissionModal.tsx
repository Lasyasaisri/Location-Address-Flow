import React from 'react';
import { MapPin, Search } from 'lucide-react';
import useLocationStore from '../store/useLocationStore';

interface LocationPermissionModalProps {
  onEnableLocation: () => void;
  onSearchManually: () => void;
}

export default function LocationPermissionModal({
  onEnableLocation,
  onSearchManually,
}: LocationPermissionModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Enable Location Services</h2>
          <p className="text-gray-600 mb-6">
            Choose how you want to set your delivery location
          </p>
          <div className="space-y-3">
            <button
              onClick={onEnableLocation}
              className="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
            >
              <MapPin className="w-5 h-5" />
              Use My Current Location
            </button>
            <button
              onClick={onSearchManually}
              className="w-full border border-gray-300 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4 text-red-500" />
              Search Manually
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}