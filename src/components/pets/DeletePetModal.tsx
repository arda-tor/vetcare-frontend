
import React, { useState } from 'react';
import { X, Trash2, AlertTriangle } from 'lucide-react';
import Button from '../common/Button';
import Alert from '../common/Alert';
import api from '../../lib/axios';

interface Pet {
  id: number;
  name: string;
}

interface DeletePetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeletePet: (petId: number) => void;
  pet: Pet | null;
}

const DeletePetModal: React.FC<DeletePetModalProps> = ({
  isOpen,
  onClose,
  onDeletePet,
  pet,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!pet) return;
    setIsDeleting(true);
    setDeleteError(null);

    try {
      await api.delete(`/pets/${pet.id}`);
      onDeletePet(pet.id);
      onClose();
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        'Failed to delete pet. Please try again.';
      setDeleteError(msg);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen || !pet) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex justify-between items-center p-6 border-b border-neutral-200">
          <h2 className="text-xl font-bold text-neutral-800 flex items-center">
            <Trash2 className="mr-2 h-5 w-5 text-red-500" />
            Delete Pet
          </h2>
          <button onClick={onClose} className="text-neutral-500 hover:text-neutral-700">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {deleteError && (
            <Alert type="error" message={deleteError} onClose={() => setDeleteError(null)} />
          )}

          <div className="flex items-center mb-4">
            <div className="rounded-full bg-red-100 p-3 mr-4">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-neutral-800">
                Are you sure you want to delete {pet.name}?
              </h3>
              <p className="text-sm text-neutral-600 mt-1">
                This action cannot be undone. All related records will be removed.
              </p>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={onClose} disabled={isDeleting}>
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              isLoading={isDeleting}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? 'Deleting...' : 'Delete Pet'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeletePetModal;
