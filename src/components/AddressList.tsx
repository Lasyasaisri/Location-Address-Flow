import React from 'react';
import { Home, Building2, Users, Star, Trash2, Edit } from 'lucide-react';
import type { Address } from '../types/address';

interface AddressListProps {
  addresses: Address[];
  onEdit: (address: Address) => void;
  onDelete: (id: string) => void;
  onSelect: (address: Address) => void;
}

export default function AddressList({
  addresses,
  onEdit,
  onDelete,
  onSelect,
}: AddressListProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'home':
        return <Home className="w-6 h-6" />;
      case 'office':
        return <Building2 className="w-6 h-6" />;
      default:
        return <Users className="w-6 h-6" />;
    }
  };

  return (
    <div className="space-y-4">
      {addresses.map((address) => (
        <div
          key={address.id}
          className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition-colors"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="mt-1">{getIcon(address.type)}</div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium capitalize">{address.type}</h3>
                  {address.isFavorite && (
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {address.houseNumber}, {address.street}
                </p>
                <p className="text-sm text-gray-600">{address.area}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onEdit(address)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(address.id)}
                className="p-2 hover:bg-gray-100 rounded-full text-red-500"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
          <button
            onClick={() => onSelect(address)}
            className="mt-4 w-full py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Deliver Here
          </button>
        </div>
      ))}
    </div>
  );
}