// src/pages/dashboard/CustomerDashboard.tsx
import React, { useEffect, useState, useCallback } from 'react';
import {
  Calendar,
  Clock,
  PawPrint,
  Bell,
  Phone,
  Plus,
  Edit as EditIcon,
  Trash2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../lib/axios';
import Button from '../../components/common/Button';
import AddPetModal from '../../components/pets/AddPetModal';
import EditPetModal, { EditPetFormValues } from '../../components/pets/EditPetModal';
import DeletePetModal from '../../components/pets/DeletePetModal';
import PetDetailsModal from '../../components/pets/PetDetailsModal';
import { Pet, AddPetFormValues } from '../../types';

const CustomerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Dynamic pets from API
  const [pets, setPets] = useState<Pet[]>([]);
  const [loadingPets, setLoadingPets] = useState(true);

  // Modal state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);

  // Static mock appointments
  const upcomingAppointments = [
    {
      id: 1,
      date: '2025-03-25',
      time: '10:30 AM',
      petName: 'Max',
      doctor: 'Dr. Sarah Johnson',
      type: 'Annual Checkup',
      status: 'Confirmed',
    },
    {
      id: 2,
      date: '2025-04-02',
      time: '2:15 PM',
      petName: 'Luna',
      doctor: 'Dr. Michael Clark',
      type: 'Vaccination',
      status: 'Scheduled',
    },
  ];

  // Fetch /pets
  const fetchPets = useCallback(async () => {
    setLoadingPets(true);
    try {
      const res = await api.get<{ data: { pets: any[] } }>('/pets');
      setPets(
        res.data.data.pets.map((dto: any): Pet => ({
          id: dto.id,
          ownerId: dto.owner_id,
          name: dto.name,
          species: dto.species,
          breed: dto.breed,
          dateOfBirth: dto.date_of_birth,
          gender: dto.gender,
          weight: dto.weight != null ? `${dto.weight} kg` : undefined,
          age: dto.age != null ? `${dto.age} years` : 'Unknown',
          owner: dto.owner,
          color: dto.color,
          microchipNumber: dto.microchipNumber,
          notes: dto.notes,
          createdAt: dto.created_at,
          updatedAt: dto.updated_at,
          lastVisit: '—',
        }))
      );
    } catch (err) {
      console.error(err);
      setPets([]);
    } finally {
      setLoadingPets(false);
    }
  }, []);

  useEffect(() => {
    if (user) fetchPets();
    else setLoadingPets(false);
  }, [user, fetchPets]);

  // Handlers
  const handleAddPet = async (form: AddPetFormValues) => {
    const payload = {
      name: form.name,
      species: form.species,
      breed: form.breed,
      date_of_birth: form.birthDate || undefined,
      weight: form.weight || undefined,
      gender: form.gender || undefined,
    };
    const res = await api.post<{ data: any }>('/pets', payload);
    const dto = res.data.data;
    setPets((prev) => [
      ...prev,
      {
        id: dto.id,
        ownerId: dto.owner_id,
        name: dto.name,
        species: dto.species,
        breed: dto.breed,
        dateOfBirth: dto.date_of_birth,
        gender: dto.gender,
        weight: dto.weight != null ? `${dto.weight} kg` : undefined,
        age: dto.age != null ? `${dto.age} years` : 'Unknown',
        owner: dto.owner,
        color: dto.color,
        microchipNumber: dto.microchipNumber,
        notes: dto.notes,
        createdAt: dto.created_at,
        updatedAt: dto.updated_at,
        lastVisit: '—',
      },
    ]);
  };

  const handleEditPet = async (petId: number, data: EditPetFormValues) => {
    await api.put(`/pets/${petId}`, {
      name: data.name,
      species: data.species,
      breed: data.breed || undefined,
      date_of_birth: data.birthDate || undefined,
      weight: data.weight || undefined,
      color: data.color || undefined,
      microchip_number: data.microchipId || undefined,
      notes: data.notes || undefined,
    });
    setPets((prev) =>
      prev.map((p) =>
        p.id === petId
          ? {
              ...p,
              name: data.name,
              species: data.species,
              breed: data.breed,
              dateOfBirth: data.birthDate,
              weight: data.weight != null ? `${data.weight} kg` : undefined,
              color: data.color,
              microchipNumber: data.microchipId,
              notes: data.notes,
            }
          : p
      )
    );
  };

  const handleDeletePet = async (petId: number) => {
    await api.delete(`/pets/${petId}`);
    setPets((prev) => prev.filter((p) => p.id !== petId));
  };

  // Modal openers
  const openDetails = (pet: Pet) => {
    setSelectedPet(pet);
    setIsDetailsOpen(true);
  };
  const openEdit = (pet: Pet) => {
    setSelectedPet(pet);
    setIsEditOpen(true);
  };
  const openDelete = (pet: Pet) => {
    setSelectedPet(pet);
    setIsDeleteOpen(true);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-neutral-800 mb-2">
          Pet Parent Dashboard
        </h1>
        <p className="text-neutral-600">
          Welcome back, {user?.name}. Here’s an overview of your pets.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main Column */}
        <div className="xl:col-span-2 space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
              <div className="rounded-full bg-primary-100 p-3 mr-4">
                <PawPrint className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <p className="text-sm text-neutral-600">My Pets</p>
                <p className="text-2xl font-bold text-neutral-800">
                  {loadingPets ? '…' : pets.length}
                </p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
              <div className="rounded-full bg-secondary-100 p-3 mr-4">
                <Calendar className="h-6 w-6 text-secondary-600" />
              </div>
              <div>
                <p className="text-sm text-neutral-600">Upcoming Visits</p>
                <p className="text-2xl font-bold text-neutral-800">
                  {upcomingAppointments.length}
                </p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
              <div className="rounded-full bg-accent-100 p-3 mr-4">
                <Clock className="h-6 w-6 text-accent-600" />
              </div>
              <div>
                <p className="text-sm text-neutral-600">Last Visit</p>
                <p className="text-2xl font-bold text-neutral-800">2w ago</p>
              </div>
            </div>
          </div>

          {/* Upcoming Appointments */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-neutral-800 flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-primary-500" />
                Upcoming Appointments
              </h2>
              <Button size="sm">Schedule Visit</Button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-neutral-200">
                <thead className="bg-neutral-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Pet
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Doctor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-neutral-200">
                  {upcomingAppointments.map((appointment) => (
                    <tr key={appointment.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-800">
                        <div className="font-medium">{appointment.date}</div>
                        <div className="text-neutral-500">{appointment.time}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-700">
                        {appointment.petName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-700">
                        {appointment.doctor}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-700">
                        {appointment.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs font-semibold rounded-full ${
                            appointment.status === 'Confirmed'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {appointment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-primary-600 hover:text-primary-900">
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* My Pets */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-neutral-800 flex items-center">
                <PawPrint className="mr-2 h-5 w-5 text-primary-500" />
                My Pets
              </h2>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsAddOpen(true)}
                icon={<Plus size={16} />}
              >
                Add Pet
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pets.map((pet) => (
                <div
                  key={pet.id}
                  className="border rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow relative group"
                  onClick={() => openDetails(pet)}
                >
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openEdit(pet);
                      }}
                      className="p-1.5 bg-white shadow-md rounded-full text-neutral-600 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                    >
                      <EditIcon size={14} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openDelete(pet);
                      }}
                      className="p-1.5 bg-white shadow-md rounded-full text-neutral-600 hover:text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-neutral-800">{pet.name}</h3>
                      <p className="text-neutral-600">{pet.breed}</p>
                    </div>
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-primary-100 text-primary-800">
                      {pet.species}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Age:</span>
                      <span className="text-neutral-800">{pet.age}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Last Visit:</span>
                      <span className="text-neutral-800">{pet.lastVisit}</span>
                    </div>
                    {pet.weight && (
                      <div className="flex justify-between">
                        <span className="text-neutral-600">Weight:</span>
                        <span className="text-neutral-800">{pet.weight}</span>
                      </div>
                    )}
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {pets.length === 0 && (
              <div className="text-center py-8">
                <PawPrint className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
                <p className="text-neutral-600 mb-4">You haven't added any pets yet.</p>
                <Button onClick={() => setIsAddOpen(true)}>Add Your First Pet</Button>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <aside className="space-y-6">
          {/* Profile Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center text-xl font-bold text-primary-600">
                {user?.name.charAt(0)}
              </div>
              <div className="ml-4">
                <h2 className="text-xl font-bold text-neutral-800">{user?.name}</h2>
                <p className="text-neutral-600">Pet Parent</p>
              </div>
            </div>
            <div className="border-t border-neutral-200 pt-4 mt-4 text-sm text-neutral-700 space-y-1">
              <div>
                <strong>Email:</strong> {user?.email}
              </div>
              <div>
                <strong>Member Since:</strong>{' '}
                {user?.createdAt && new Date(user.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-neutral-800 mb-4">Quick Actions</h2>
            <div className="space-y-3">
<Button fullWidth>Schedule Appointment</Button>
    <Button fullWidth variant="outline">Request Prescription Refill</Button>
    <Button fullWidth variant="outline">Message Your Vet</Button>
    <Button fullWidth onClick={() => navigate('/customer-medical-records')}>
      View Medical Records
    </Button>
  </div>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-neutral-800 mb-4 flex items-center">
              <Bell className="mr-2 h-5 w-5 text-primary-500" /> Notifications
            </h2>

            <div className="space-y-4">
              <div className="border-l-4 border-primary-500 pl-4 py-2">
                <h3 className="font-medium text-neutral-800">Vaccination Due</h3>
                <p className="text-sm text-neutral-600">
                  Max's annual vaccinations are due in 2 weeks
                </p>
                <button className="text-sm text-primary-600 font-medium mt-1">
                  Schedule Now
                </button>
              </div>

              <div className="border-l-4 border-secondary-500 pl-4 py-2">
                <h3 className="font-medium text-neutral-800">Prescription Ready</h3>
                <p className="text-sm text-neutral-600">
                  Luna's medication is ready for pickup
                </p>
                <button className="text-sm text-primary-600 font-medium mt-1">
                  View Details
                </button>
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-neutral-800 mb-4 flex items-center">
              <Phone className="mr-2 h-5 w-5 text-primary-500" /> Emergency Contact
            </h2>

            <div className="bg-red-50 border border-red-100 rounded-lg p-4">
              <p className="text-red-800 font-medium mb-2">24/7 Emergency Care</p>
              <p className="text-red-700 text-sm mb-2">
                If you have an emergency outside of our regular hours:
              </p>
              <p className="text-red-800 font-bold">(555) 987-6543</p>
            </div>
          </div>
        </aside>
      </div>

      {/* Modals */}
      <AddPetModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} onAddPet={handleAddPet} />
      <EditPetModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onEditPet={handleEditPet}
        pet={selectedPet}
      />
      <DeletePetModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onDeletePet={handleDeletePet}
        pet={selectedPet}
      />
      <PetDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        pet={selectedPet}
        onEditPet={openEdit}
        onDeletePet={openDelete}
      />
    </div>
  );
};

export default CustomerDashboard;
