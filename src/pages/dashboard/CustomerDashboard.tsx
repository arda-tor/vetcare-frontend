// src/pages/dashboard/CustomerDashboard.tsx
import React, { useEffect, useState } from 'react';
import { Calendar, Clock, PawPrint, Bell, Phone } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../lib/axios';
import Button from '../../components/common/Button';
import AddPetModal from '../../components/pets/AddPetModal';
import PetDetailsModal from '../../components/pets/PetDetailsModal';
import AppointmentDetailsModal from '../../components/appointments/AppointmentDetailsModal';
import { Pet, AddPetFormValues, UpcomingAppointment } from '../../types'; // Ensure correct imports
import { useNavigate } from 'react-router-dom';

const CustomerDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [pets, setPets] = useState<Pet[]>([]);
  const [loadingPets, setLoadingPets] = useState(true);
  
  // Upcoming appointments state
  const [upcomingAppointments, setUpcomingAppointments] = useState<UpcomingAppointment[]>([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);

  // Add-pet modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Details modal state
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  
  // Appointment details modal state
  const [selectedAppointment, setSelectedAppointment] = useState<UpcomingAppointment | null>(null);

  // Fetch upcoming appointments
  const fetchUpcomingAppointments = async () => {
    setLoadingAppointments(true);
    try {
      const res = await api.get('/appointments/upcoming/list');
      console.log('Upcoming appointments response:', res.data);
      
      // Handle different response structures
      const appointments = res.data.data?.appointments || res.data.data || res.data || [];
      setUpcomingAppointments(Array.isArray(appointments) ? appointments : []);
    } catch (err) {
      console.error('Error fetching upcoming appointments:', err);
      setUpcomingAppointments([]);
    } finally {
      setLoadingAppointments(false);
    }
  };

  // Fetch the current user's pets
  const fetchPets = async () => {
    setLoadingPets(true);
    try {
      // API Doc: GET /api/pets returns { is_success: true, message: ..., data: { pets: Pet[], total: number } }
      const res = await api.get<{
        is_success: boolean;
        message: string;
        data: {
          pets: any[]; // Use any[] initially to handle backend's snake_case properties
          total: number;
        };
      }>('/pets');

      // UNWRAP THE ENVELOPE and MAP KEYS:
      // Backend uses snake_case (e.g., date_of_birth, owner_id)
      // Frontend (your types) uses camelCase (e.g., dateOfBirth, ownerId)
      const fetchedPets: Pet[] = Array.isArray(res.data.data.pets) // Ensure res.data.data.pets is an array
        ? res.data.data.pets.map((backendPet: any) => ({
            id: backendPet.id,
            ownerId: backendPet.owner_id, // Map owner_id to ownerId
            name: backendPet.name,
            species: backendPet.species,
            breed: backendPet.breed,
            dateOfBirth: backendPet.date_of_birth, // Map date_of_birth to dateOfBirth
            gender: backendPet.gender,
            weight: backendPet.weight ? parseFloat(backendPet.weight) : undefined, // Parse weight if it comes as string
            age: backendPet.age, // Directly from API doc example
            owner: backendPet.owner, // Direct mapping of the nested owner object
            color: backendPet.color, // Include if backend provides it
            microchipNumber: backendPet.microchipNumber, // Include if backend provides it
            createdAt: backendPet.createdAt, // Adjust if backend uses created_at
            updatedAt: backendPet.updatedAt, // Adjust if backend uses updated_at
          }))
        : [];
      setPets(fetchedPets);
    } catch (err) {
      console.error('Error fetching pets:', err);
      setPets([]); // Ensure pets is an empty array on error to prevent map issues
    } finally {
      setLoadingPets(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchPets();
      fetchUpcomingAppointments();
    } else {
      setLoadingPets(false);
      setPets([]);
      setLoadingAppointments(false);
      setUpcomingAppointments([]);
    }
  }, [user]);

  // Handler for appointment cancellation
  const handleAppointmentCancelled = (appointmentId: number) => {
    setUpcomingAppointments(prevAppointments =>
      prevAppointments.map(appointment =>
        appointment.id === appointmentId
          ? { ...appointment, status: 'cancelled' }
          : appointment
      )
    );
  };

  // Handler for adding a new pet
  const handleAddPet = async (formData: AddPetFormValues) => {
    try {
      // API Doc: POST /api/pets
      // Request Body: { name, species, breed, date_of_birth, weight, gender }
      // The backend automatically assigns owner_id, so do NOT send it.
      // Color and microchipNumber are NOT in the user's POST API doc.
      const payload = {
        name: formData.name,
        species: formData.species,
        breed: formData.breed,
        // Map frontend camelCase birthDate to backend snake_case date_of_birth
        date_of_birth: formData.birthDate || undefined,
        weight: formData.weight || undefined,
        gender: formData.gender || undefined,
      };

      const res = await api.post<{
        is_success: boolean;
        message: string;
        data: any; // Use any to allow flexible mapping from snake_case to camelCase
      }>('/pets', payload);

      // UNWRAP THE ENVELOPE and MAP KEYS for the newly created pet:
      const newPetFromBackend: any = res.data.data;
      const newPet: Pet = {
        id: newPetFromBackend.id,
        ownerId: newPetFromBackend.owner_id, // Map owner_id to ownerId
        name: newPetFromBackend.name,
        species: newPetFromBackend.species,
        breed: newPetFromBackend.breed,
        dateOfBirth: newPetFromBackend.date_of_birth, // Map date_of_birth to dateOfBirth
        gender: newPetFromBackend.gender,
        weight: newPetFromBackend.weight ? parseFloat(newPetFromBackend.weight) : undefined, // Parse weight if it comes as string
        age: newPetFromBackend.age, // Assume backend provides age on creation too
        owner: newPetFromBackend.owner, // Direct mapping of the nested owner object
        color: newPetFromBackend.color, // If backend returns it
        microchipNumber: newPetFromBackend.microchipNumber, // If backend returns it
        createdAt: newPetFromBackend.createdAt,
        updatedAt: newPetFromBackend.updatedAt,
      };

      setPets((prev) => [...prev, newPet]);
    } catch (err) {
      console.error('Error adding pet:', err);
      throw err;
    }
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
                <p className="text-sm text-neutral-600">Upcoming Appointments</p>
                <p className="text-2xl font-bold text-neutral-800">
                  {loadingAppointments ? '…' : upcomingAppointments.length}
                </p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
              <div className="rounded-full bg-accent-100 p-3 mr-4">
                <Clock className="h-6 w-6 text-accent-600" />
              </div>
              <div>
                <p className="text-sm text-neutral-600">Last Visit</p>
                <p className="text-2xl font-bold text-neutral-800">—</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-neutral-800 flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-primary-500" />
                Upcoming Appointments
              </h2>
              <Button size="sm" onClick={() => navigate('/calendar')}>Schedule Visit</Button>
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
                  {loadingAppointments ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-neutral-600">
                        Loading appointments...
                      </td>
                    </tr>
                  ) : upcomingAppointments.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-neutral-600">
                        No upcoming appointments found.
                      </td>
                    </tr>
                  ) : (
                    upcomingAppointments.map((appointment) => (
                      <tr key={appointment.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-800">
                          <div className="font-medium">
                            {new Date(appointment.start_datetime).toLocaleDateString()}
                          </div>
                          <div className="text-neutral-500">
                            {new Date(appointment.start_datetime).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })} - {new Date(appointment.end_datetime).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-700">
                          <div className="font-medium">{appointment.pet_name}</div>
                          <div className="text-xs text-neutral-500">
                            {appointment.pet_species} - {appointment.pet_breed}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-700">
                          <div className="font-medium">{appointment.doctor_name}</div>
                          <div className="text-xs text-neutral-500">
                            {appointment.doctor_specialization}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-700">
                          <span className="capitalize">{appointment.appointment_type}</span>
                          <div className="text-xs text-neutral-500">
                            {appointment.duration} min
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 inline-flex text-xs font-semibold rounded-full ${
                              appointment.status === 'confirmed'
                                ? 'bg-green-100 text-green-800'
                                : appointment.status === 'scheduled'
                                ? 'bg-blue-100 text-blue-800'
                                : appointment.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : appointment.status === 'in_progress'
                                ? 'bg-yellow-100 text-yellow-800'
                                : appointment.status === 'completed'
                                ? 'bg-gray-100 text-gray-800'
                                : appointment.status === 'cancelled'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button 
                            onClick={() => setSelectedAppointment(appointment)}
                            className="text-primary-600 hover:text-primary-900 transition-colors"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
          {/* My Pets List */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-neutral-800 flex items-center">
                <PawPrint className="mr-2 h-5 w-5 text-primary-500" />
                My Pets
              </h2>
              <Button size="sm" onClick={() => setIsAddModalOpen(true)}>
                Add Pet
              </Button>
            </div>

            {loadingPets ? (
              <p className="text-neutral-600">Loading pets...</p>
            ) : pets.length === 0 ? (
              <p className="text-neutral-600">You have no pets yet.</p>
            ) : (
              <ul className="space-y-4">
                {pets.map((pet) => (
                  <li
                    key={pet.id}
                    className="flex justify-between items-center border rounded-lg p-4 hover:shadow cursor-pointer"
                    onClick={() => setSelectedPet(pet)}
                  >
                    <div>
                      <h3 className="text-lg font-medium text-neutral-800">
                        {pet.name}
                      </h3>
                      <p className="text-sm text-neutral-600">
                        {pet.species.charAt(0).toUpperCase() +
                          pet.species.slice(1)}, {pet.breed || 'Unknown breed'}
                      </p>
                      {/* Use pet.dateOfBirth as per your types.ts */}
                      {pet.dateOfBirth && (
                         <p className="text-xs text-neutral-500">
                            Born: {new Date(pet.dateOfBirth).toLocaleDateString()}
                        </p>
                      )}
                       {pet.weight !== undefined && (
                        <p className="text-xs text-neutral-500">
                           Weight: {pet.weight} kg
                       </p>
                       )}
                       {pet.gender && (
                        <p className="text-xs text-neutral-500">
                           Gender: {pet.gender.charAt(0).toUpperCase() + pet.gender.slice(1)}
                        </p>
                       )}
                    </div>
                    <Button size="sm" variant="outline">
                      Details
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          {/* Profile Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center text-xl font-bold text-primary-600">
                {user?.name.charAt(0)}
              </div>
              <div className="ml-4">
                <h2 className="text-xl font-bold text-neutral-800">
                  {user?.name}
                </h2>
                <p className="text-neutral-600">Pet Parent</p>
              </div>
            </div>
            <div className="border-t border-neutral-200 pt-4 mt-4 text-sm text-neutral-700 space-y-1">
              <div>
                <strong>Email:</strong> {user?.email}
              </div>
              <div>
                <strong>Joined:</strong>{' '}
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold text-neutral-800 mb-4 flex items-center">
              <Bell className="mr-2 h-5 w-5 text-primary-500" />
              Notifications
            </h3>
            <p className="text-neutral-600">No new notifications.</p>
          </div>

          {/* Emergency Contact */}
          <div className="bg-red-50 rounded-lg shadow-inner p-6">
            <h3 className="text-lg font-bold text-red-800 mb-2">Emergency</h3>
            <div className="flex items-center text-red-700 mb-1">
              <Phone className="h-4 w-4 mr-2" /> (555) 987-6543
            </div>
          </div>
        </aside>
      </div>

      {/* Add Pet Modal */}
      <AddPetModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddPet={handleAddPet}
      />

      {/* Pet Details Modal */}
      <PetDetailsModal
        isOpen={!!selectedPet}
        onClose={() => setSelectedPet(null)}
        pet={selectedPet}
      />

      {/* Appointment Details Modal */}
      <AppointmentDetailsModal
        isOpen={!!selectedAppointment}
        onClose={() => setSelectedAppointment(null)}
        appointment={selectedAppointment}
        onAppointmentCancelled={handleAppointmentCancelled}
      />
    </div>
  );
};

export default CustomerDashboard;