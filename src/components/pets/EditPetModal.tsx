// src/components/pets/EditPetModal.tsx
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, Edit as EditIcon } from 'lucide-react';
import Input from '../common/Input';
import Button from '../common/Button';
import Alert from '../common/Alert';
import api from '../../lib/axios';

export interface EditPetFormValues {
  name: string;
  species: string;
  breed?: string;
  birthDate?: string;
  weight?: number;
  color?: string;
  microchipId?: string;
  notes?: string;
}

interface Pet {
  id: number;
  name: string;
  species: string;
  breed?: string;
  dateOfBirth?: string;
  weight?: number;
  color?: string;
  microchipNumber?: string;
  notes?: string;
}

interface EditPetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEditPet: (petId: number, data: EditPetFormValues) => void;
  pet: Pet | null;
}

const EditPetModal: React.FC<EditPetModalProps> = ({
  isOpen,
  onClose,
  onEditPet,
  pet,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { register, handleSubmit, reset, setValue, formState: { errors } } =
    useForm<EditPetFormValues>({
      defaultValues: {
        name: '',
        species: 'dog',
        breed: '',
        birthDate: '',
        weight: undefined,
        color: '',
        microchipId: '',
        notes: '',
      },
    });

  useEffect(() => {
    if (pet && isOpen) {
      setValue('name', pet.name);
      setValue('species', pet.species);
      setValue('breed', pet.breed || '');
      setValue('birthDate', pet.dateOfBirth || '');
      setValue('weight', pet.weight);
      setValue('color', pet.color || '');
      setValue('microchipId', pet.microchipNumber || '');
      setValue('notes', pet.notes || '');
    }
  }, [pet, isOpen, setValue]);

  const onSubmit = async (data: EditPetFormValues) => {
    if (!pet) return;
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await api.put(`/pets/${pet.id}`, {
        name: data.name,
        species: data.species,
        breed: data.breed || undefined,
        date_of_birth: data.birthDate || undefined,
        weight: data.weight || undefined,
        color: data.color || undefined,
        microchip_number: data.microchipId || undefined,
        notes: data.notes || undefined,
      });

      onEditPet(pet.id, data);
      onClose();
    } catch (err: any) {
      const msg =
        err.response?.data?.message || 'Failed to update pet. Please try again.';
      setSubmitError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !pet) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-neutral-200">
          <h2 className="text-2xl font-bold text-neutral-800 flex items-center">
            <EditIcon className="mr-2 h-6 w-6 text-primary-500" />
            Edit {pet.name}
          </h2>
          <button onClick={onClose} className="text-neutral-500 hover:text-neutral-700">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4" noValidate>
          {submitError && (
            <Alert type="error" message={submitError} onClose={() => setSubmitError(null)} />
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Pet Name *"
              placeholder="Enter pet's name"
              {...register('name', {
                required: 'Pet name is required',
                minLength: { value: 2, message: 'Must be at least 2 characters' },
              })}
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
                {['dog','cat','bird','rabbit','hamster','guinea-pig','reptile','fish','other']
                  .map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
              </select>
              {errors.species && <p className="mt-1 text-sm text-red-500">{errors.species.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Breed" placeholder="e.g. Golden Retriever" {...register('breed')} />
            <Input label="Birth Date" type="date" {...register('birthDate')} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Weight (kg)" type="number" step="0.1" {...register('weight',{
              valueAsNumber:true,
              min:{value:0,message:'Must be ≥ 0'}
            })} />
            <Input label="Color/Markings" {...register('color')} />
          </div>

          <Input label="Microchip ID" {...register('microchipId')} />

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Notes
            </label>
            <textarea rows={3} {...register('notes')} className="block w-full rounded-md border-neutral-300 p-3" />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-neutral-200">
            <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              Update Pet
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPetModal;
