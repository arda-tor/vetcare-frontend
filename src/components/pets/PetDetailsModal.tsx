import React from 'react';
import {
  X,
  PawPrint,
  Calendar,
  Weight,
  Palette,
  Ship as ChipIcon,
  Edit as EditIcon,
  Trash2,
} from 'lucide-react';
import Button from '../common/Button';
import { Pet } from '../../types';

interface PetDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  pet: Pet | null;
  onEditPet?: (pet: Pet) => void;
  onDeletePet?: (pet: Pet) => void;
}

const PetDetailsModal: React.FC<PetDetailsModalProps> = ({
  isOpen,
  onClose,
  pet,
  onEditPet,
  onDeletePet,
}) => {
  if (!isOpen || !pet) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header with Edit/Delete */}
        <div className="flex justify-between items-center p-6 border-b border-neutral-200">
          <h2 className="text-2xl font-bold text-neutral-800 flex items-center">
            <PawPrint className="mr-2 h-6 w-6 text-primary-500" />
            {pet.name}'s Profile
          </h2>
          <div className="flex items-center space-x-2">
            {onEditPet && (
              <button
                onClick={() => onEditPet(pet)}
                className="p-2 text-neutral-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg"
                title="Edit"
              >
                <EditIcon size={20} />
              </button>
            )}
            {onDeletePet && (
              <button
                onClick={() => onDeletePet(pet)}
                className="p-2 text-neutral-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                title="Delete"
              >
                <Trash2 size={20} />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-neutral-500 hover:text-neutral-700"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex items-center">
              <PawPrint className="h-5 w-5 text-primary-500 mr-2" />
              <div>
                <p className="text-sm text-neutral-600">Species</p>
                <p className="font-medium text-neutral-800 capitalize">
                  {pet.species}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <ChipIcon className="h-5 w-5 text-primary-500 mr-2" />
              <div>
                <p className="text-sm text-neutral-600">Microchip</p>
                <p className="font-medium text-neutral-800">
                  {pet.microchipNumber || '—'}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-primary-500 mr-2" />
              <div>
                <p className="text-sm text-neutral-600">Born</p>
                <p className="font-medium text-neutral-800">
                  {pet.dateOfBirth
                    ? new Date(pet.dateOfBirth).toLocaleDateString()
                    : 'Unknown'}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <Weight className="h-5 w-5 text-primary-500 mr-2" />
              <div>
                <p className="text-sm text-neutral-600">Weight</p>
                <p className="font-medium text-neutral-800">
                  {pet.weight != null ? `${pet.weight} kg` : '—'}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <Palette className="h-5 w-5 text-primary-500 mr-2" />
              <div>
                <p className="text-sm text-neutral-600">Color</p>
                <p className="font-medium text-neutral-800">
                  {pet.color || '—'}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <p className="text-sm text-neutral-600 mr-2">Age</p>
              <p className="font-medium text-neutral-800">
                {pet.age ?? '—'}
              </p>
            </div>
          </div>

          {/* Notes */}
          {pet.notes && (
            <div>
              <h3 className="text-lg font-medium text-neutral-800 mb-2">
                Notes
              </h3>
              <p className="text-neutral-700">{pet.notes}</p>
            </div>
          )}

          {/* Owner Info */}
          <div className="border-t border-neutral-200 pt-6">
            <h3 className="text-lg font-medium text-neutral-800 mb-4">
              Owner
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-neutral-600">Name</p>
                <p className="font-medium text-neutral-800">
                  {pet.owner.name}
                </p>
              </div>
              <div>
                <p className="text-sm text-neutral-600">Email</p>
                <p className="font-medium text-neutral-800">
                  {pet.owner.email}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-neutral-200">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PetDetailsModal;
