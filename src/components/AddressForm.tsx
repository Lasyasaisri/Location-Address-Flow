import React, { useState, useEffect } from 'react';
import { Home, Building2, Users, Star } from 'lucide-react';
import type { Address } from '../types/address';
import useLocationStore from '../store/useLocationStore';

interface AddressFormProps {
  initialAddress?: Partial<Address>;
  onSubmit: (address: Partial<Address>) => void;
}

export default function AddressForm({ initialAddress, onSubmit }: AddressFormProps) {
  // Get the current selected location from the store
  const { selectedLocation } = useLocationStore();

  // State for form data with default values and initial address spread
  const [formData, setFormData] = useState({
    type: initialAddress?.type || 'home',
    houseNumber: initialAddress?.houseNumber || '',
    street: initialAddress?.street || '',
    area: initialAddress?.area || '',
    isFavorite: initialAddress?.isFavorite || false,
  });

  // Effect to fetch reverse geocoding when location changes
  useEffect(() => {
    // Only attempt reverse geocoding if we have a valid location
    if (selectedLocation.latitude && selectedLocation.longitude) {
      fetchAddressDetails();
    }
  }, [selectedLocation]);

  // Function to fetch address details using reverse geocoding
  const fetchAddressDetails = async () => {
    try {
      const response = await fetch(
        `https://maps.gomaps.pro/maps/api/geocode/json?latlng=${selectedLocation.latitude},${selectedLocation.longitude}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
      );
  
      const data = await response.json();
  
      if (data.results && data.results.length > 0) {
        const addressComponents = data.results[0].address_components;
        const formattedAddress = data.results[0].formatted_address;
  
        // Initialize variables for house/flat/block and apartment/road/area
        let houseFlatBlockNo = '';
        let apartmentRoadArea = '';
  
        // Check for specific address components
  
        // Prioritize the 'premise' component for building names
        const premise = addressComponents.find((component: any) =>
          component.types.includes('premise')
        )?.long_name || '';
  
        // If no building name in 'premise', check for 'street_number' (house number)
        const streetNumber = addressComponents.find((component: any) =>
          component.types.includes('street_number')
        )?.long_name || '';
  
        // For street names or routes
        const route = addressComponents.find((component: any) =>
          component.types.includes('route')
        )?.long_name || '';
  
        // For neighborhood and locality
        const neighborhood = addressComponents.find((component: any) =>
          component.types.includes('neighborhood')
        )?.long_name || '';
  
        const subLocality = addressComponents.find((component: any) =>
          component.types.includes('sublocality') ||
          component.types.includes('sublocality_level_1')
        )?.long_name || '';
  
        const locality = addressComponents.find((component: any) =>
          component.types.includes('locality')
        )?.long_name || '';
  
        // If 'premise' is available, it indicates a building name (House/Flat/Block No.)
        houseFlatBlockNo = premise || streetNumber || 'Unnamed Block';
  
        // Combine other components for the road/area
        apartmentRoadArea = [route, neighborhood, subLocality, locality].filter(Boolean).join(' ').trim();
        if (!apartmentRoadArea) {
          apartmentRoadArea = 'Unnamed Area';
        }
  
        // Update the form data
        setFormData((prev) => ({
          ...prev,
          houseNumber: houseFlatBlockNo,
          street: apartmentRoadArea,
        }));
  
        // Optional: Log full details for debugging
        console.log({
          fullAddress: formattedAddress,
          houseFlatBlockNo,
          apartmentRoadArea,
          components: addressComponents,
        });
      } else {
        console.warn('No address results found for the given location.');
        // Fallback to default
        setFormData((prev) => ({
          ...prev,
          houseNumber: 'Unnamed Block',
          street: 'Unnamed Area',
        }));
      }
    } catch (error) {
      console.error('Error fetching address details:', error);
      // Fallback to default
      setFormData((prev) => ({
        ...prev,
        houseNumber: 'Unnamed Block',
        street: 'Unnamed Area',
      }));
    }
  };
  
  

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {/* Address Type Selection */}
        <div className="flex justify-between gap-4">
          {['home', 'office', 'other'].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, type }))}
              className={`flex-1 p-4 rounded-lg border ${
                formData.type === type ? 'border-primary/50 bg-primary/10' : 'border-gray-200'
              }`}
            >
              {type === 'home' && <Home className="w-6 h-6 mx-auto mb-2" />}
              {type === 'office' && <Building2 className="w-6 h-6 mx-auto mb-2" />}
              {type === 'other' && <Users className="w-6 h-6 mx-auto mb-2" />}
              <div className="text-sm capitalize">{type}</div>
            </button>
          ))}
        </div>

        {/* House/Flat Number Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            House/Flat/Block No.
          </label>
          <input
            type="text"
            value={formData.houseNumber}
            onChange={(e) => setFormData(prev => ({ ...prev, houseNumber: e.target.value }))}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
            placeholder="Enter house/flat number"
          />
        </div>

        {/* Street/Road Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Apartment/Road/Area
          </label>
          <input
            type="text"
            value={formData.street}
            onChange={(e) => setFormData(prev => ({ ...prev, street: e.target.value }))}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
            placeholder="Enter street/road details"
          />
        </div>

        {/* Favorite Toggle */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="favorite"
            checked={formData.isFavorite}
            onChange={(e) => setFormData(prev => ({ ...prev, isFavorite: e.target.checked }))}
            className="w-4 h-4 text-blue-600"
          />
          <label htmlFor="favorite" className="flex items-center gap-2">
            <Star className="w-4 h-4" />
            Save as Favorite
          </label>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary/90 transition-colors"
      >
        Save Address
      </button>
    </form>
  );
}