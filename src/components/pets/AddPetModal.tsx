// src/components/pets/AddPetModal.tsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { X, PawPrint } from 'lucide-react';
import Input from '../common/Input';
import Button from '../common/Button';
import Alert from '../common/Alert';
import { AddPetFormValues } from '../../types';

export interface AddPetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPet: (petData: AddPetFormValues) => Promise<void>;
}

const AddPetModal: React.FC<AddPetModalProps> = ({ isOpen, onClose, onAddPet }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddPetFormValues>({
    defaultValues: {
      name: '',
      species: 'dog', // Default to dog
      breed: '',
      birthDate: '',
      weight: 0, // Default weight
      gender: '', // Default empty gender
    },
  });

  const onSubmit = async (data: AddPetFormValues) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await onAddPet(data);
      reset();
      onClose();
    } catch (err) {
      // It's good to log the actual error for debugging
      console.error('Add pet submission error:', err);
      // Backend validation errors might be in err.response.data.message or err.response.data.errors
      let errorMessage = 'Failed to add pet. Please try again.';
      if (err instanceof Error) {
        // Axios errors have a response property
        if ('response' in err && err.response && typeof err.response === 'object' && 'data' in err.response && err.response.data && typeof err.response.data === 'object') {
          if ('message' in err.response.data && typeof err.response.data.message === 'string') {
            errorMessage = err.response.data.message; // Generic message from backend
          }
          if ('errors' in err.response.data && typeof err.response.data.errors === 'object') {
            // Flatten validation errors
            const validationErrors = Object.values(err.response.data.errors).flat().join('. ');
            if (validationErrors) {
              errorMessage = `Validation failed: ${validationErrors}`;
            }
          }
        }
      }
      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-neutral-200">
          <h2 className="text-2xl font-bold text-neutral-800 flex items-center">
            <PawPrint className="mr-2 h-6 w-6 text-primary-500" />
            Add New Pet
          </h2>
          <button onClick={onClose} className="text-neutral-500 hover:text-neutral-700">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          {submitError && (
            <Alert type="error" message={submitError} onClose={() => setSubmitError(null)} />
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Pet Name *"
              placeholder="Enter pet's name"
              {...register('name', { required: 'Pet name is required' })}
              error={errors.name?.message}
            />

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Species *
              </label>
              <select
                {...register('species', { required: 'Species is required' })}
                className="block w-full rounded-md border-neutral-300 p-2"
              >
                <option value="dog">Dog</option>
                <option value="cat">Cat</option>
                <option value="bird">Bird</option>
                <option value="rabbit">Rabbit</option>
                <option value="hamster">Hamster</option>
                <option value="guinea-pig">Guinea Pig</option>
                <option value="reptile">Reptile</option>
                <option value="fish">Fish</option>
                <option value="other">Other</option>
              </select>
              {errors.species && (
                <p className="mt-1 text-sm text-red-500">{errors.species.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Breed *" // API doc states breed is required
              placeholder="Enter pet's breed"
              {...register('breed', { required: 'Breed is required' })}
              error={errors.breed?.message}
            />
            <Input
              label="Birth Date"
              type="date"
              {...register('birthDate', {
                validate: (value) => {
                  if (value && new Date(value) > new Date()) {
                    return 'Birth Date cannot be in the future';
                  }
                  return true;
                },
              })}
              error={errors.birthDate?.message}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Weight (kg)"
              type="number"
              step="0.01" // Allow decimal for weight
              placeholder="e.g., 25.5"
              {...register('weight', {
                valueAsNumber: true, // Convert to number
                min: { value: 0, message: 'Weight cannot be negative' },
                max: { value: 999.99, message: 'Weight cannot exceed 999.99' },
              })}
              error={errors.weight?.message}
            />
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Gender
              </label>
              <select
                {...register('gender')}
                className="block w-full rounded-md border-neutral-300 p-2"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {errors.gender && (
                <p className="mt-1 text-sm text-red-500">{errors.gender.message}</p>
              )}
            </div>
          </div>

          {/* Remove ownerName, ownerEmail, ownerPhone inputs as backend handles owner assignment */}

          <div className="flex justify-end space-x-3 pt-4 border-t border-neutral-200">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting} disabled={isSubmitting}>
              Add Pet
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPetModal;