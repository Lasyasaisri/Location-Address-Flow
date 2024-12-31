import React, { useState } from 'react'; // Add React and useState import
import Map from './components/Map'; // Adjust the import path as needed
import LocationPermissionModal from './components/LocationPermissionModal'; // Adjust the import path
import AddressForm from './components/AddressForm'; // Adjust the import path
import AddressList from './components/AddressList'; // Adjust the import path
import useLocationStore from './store/useLocationStore'; // Adjust the import path
import { Address } from './types/address'; // Import Address type

function App() {
  const [showPermissionModal, setShowPermissionModal] = useState(true);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  
  const {
    currentLocation,
    selectedLocation,
    addresses,
    setCurrentLocation,
    setSelectedLocation,
    addAddress,
    updateAddress,
    deleteAddress,
    setLocationPermission,
  } = useLocationStore();

  const handleEnableLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          
          // Set current and selected location
          setCurrentLocation(latitude, longitude);
          setSelectedLocation(latitude, longitude);
          
          // Automatically open address form with current location
          setLocationPermission(true);
          setShowPermissionModal(false);
          setShowAddressForm(true);
        },
        () => {
          alert('Unable to retrieve your location');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser');
    }
  };

  const handleAddressSubmit = (addressData: Partial<Address>) => {
    // If no latitude/longitude, use selected location
    const addressToSave = {
      ...addressData,
      id: crypto.randomUUID(),
      latitude: selectedLocation.latitude!,
      longitude: selectedLocation.longitude!,
    } as Address;

    addAddress(addressToSave);
    setShowAddressForm(false);
    setEditingAddress(null);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {showPermissionModal && (
        <LocationPermissionModal
          onEnableLocation={handleEnableLocation}
          onSearchManually={() => {
            setShowPermissionModal(false);
            setShowAddressForm(true);
          }}
        />
      )}

      <div className="max-w-2xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Delivery Location</h1>

        {/* Map will show when location is selected */}
        {selectedLocation.latitude && selectedLocation.longitude && (
          <div className="mb-6">
            <Map
              center={{
                lat: selectedLocation.latitude,
                lng: selectedLocation.longitude,
              }}
              onMarkerDragEnd={(event) => {
                if (event.latLng) {
                  setSelectedLocation(event.latLng.lat(), event.latLng.lng());
                }
              }}
            />
          </div>
        )}

        {showAddressForm ? (
          <AddressForm
            initialAddress={editingAddress || {
              // Pre-fill with some default values if coming from enable location
              type: 'home',
              houseNumber: '',
              street: '',
              area: '',
              isFavorite: false,
            }}
            onSubmit={handleAddressSubmit}
          />
        ) : (
          <>
            <button
              onClick={() => setShowAddressForm(true)}
              className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary/90 transition-colors mb-6"
            >
              Add New Address
            </button>

            <AddressList
              addresses={addresses}
              onEdit={(address) => {
                setEditingAddress(address);
                setSelectedLocation(address.latitude, address.longitude);
                setShowAddressForm(true);
              }}
              onDelete={deleteAddress}
              onSelect={(address) => {
                setSelectedLocation(address.latitude, address.longitude);
              }}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default App; // Add export default