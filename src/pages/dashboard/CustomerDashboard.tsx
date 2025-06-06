// src/dashboard/CustomerDashboard.tsx
import React, { useEffect, useState } from 'react';
import { Calendar, Clock, PawPrint, Bell, Phone } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/common/Button';
import api from '../../lib/axios';

// -------------- TYPE TANIMLARI (types.ts içinde halihazır)
// export interface Patient { ... }           // (Müşteri değil, hayvan. Gerekirse burda Pet interface ekleyin.)
// export interface Pet { 
//   id: number; 
//   name: string; 
//   species: string; 
//   breed?: string; 
//   birthDate?: string; 
//   ownerName: string; 
//   ownerEmail: string; 
//   ownerPhone: string; 
//   createdAt: string; 
//   updatedAt: string;
// }

// export interface Appointment { ... }
// O nedenle bu dashboard’da sadece Pet arayüzünü kullanacağız.

interface Pet {
  id: number;
  name: string;
  species: string;
  breed?: string;
  birthDate?: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  createdAt: string;
  updatedAt: string;
}

// Yeni pet eklemek için form değerleri:
interface NewPetFormValues {
  name: string;
  species: string;
  breed?: string;
  birthDate?: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
}

const CustomerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [pets, setPets] = useState<Pet[]>([]);
  const [loadingPets, setLoadingPets] = useState<boolean>(true);

  // Form state
  const [showForm, setShowForm] = useState<boolean>(false);
  const [newPetData, setNewPetData] = useState<NewPetFormValues>({
    name: '',
    species: '',
    breed: '',
    birthDate: '',
    ownerName: user?.name || '',
    ownerEmail: user?.email || '',
    ownerPhone: '',
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [formSubmitting, setFormSubmitting] = useState<boolean>(false);

  // 1) Mevcut pet profilini backend'den çek:
  useEffect(() => {
    const fetchPets = async () => {
      try {
        setLoadingPets(true);
        // GET /api/pets → kullanıcıya ait pet'leri dönecek
        // Eğer API “ownerId” bazlı filtre istiyorsa query param ekle: /api/pets?ownerId={user.id}
        const res = await api.get<Pet[]>('/pets');
        // backend, sadece bu user’ın pet’lerini döndürüyorsa, direkt set edilir.
        setPets(res.data);
      } catch (err) {
        console.error('Error fetching pets:', err);
      } finally {
        setLoadingPets(false);
      }
    };

    fetchPets();
  }, [user]);

  // 2) Formdaki input değişimlerini yönet
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewPetData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 3) Yeni pet ekleme işlemi
  const handleAddPet = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Basit bir validasyon: zorunlu alanlar
    if (!newPetData.name.trim() || !newPetData.species.trim() || !newPetData.ownerPhone.trim()) {
      setFormError('Pet name, species ve owner phone zorunludur.');
      return;
    }

    try {
      setFormSubmitting(true);
      // POST /api/pets → newPetData 
      const res = await api.post<Pet>('/pets', newPetData);
      // Backend’in yeni eklenen pet’i döndüğünü varsayıyoruz
      setPets((prev) => [...prev, res.data]);
      // Formu sıfırla ve gizle
      setNewPetData({
        name: '',
        species: '',
        breed: '',
        birthDate: '',
        ownerName: user?.name || '',
        ownerEmail: user?.email || '',
        ownerPhone: '',
      });
      setShowForm(false);
    } catch (err: any) {
      console.error('Error adding pet:', err);
      setFormError('Pet eklenirken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setFormSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-neutral-800 mb-2">
          Pet Parent Dashboard
        </h1>
        <p className="text-neutral-600">
          Welcome back, {user?.name}. Here's an overview of your pets' health and upcoming appointments.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="xl:col-span-2 space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="rounded-full bg-primary-100 p-3 mr-4">
                  <PawPrint className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm text-neutral-600">Active Pets</p>
                  <p className="text-2xl font-bold text-neutral-800">{pets.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="rounded-full bg-secondary-100 p-3 mr-4">
                  <Calendar className="h-6 w-6 text-secondary-600" />
                </div>
                <div>
                  <p className="text-sm text-neutral-600">Upcoming Visits</p>
                  {/* Kendi mantığına göre appointments API’si ile güncelleyebilirsin */}
                  <p className="text-2xl font-bold text-neutral-800">2</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="rounded-full bg-accent-100 p-3 mr-4">
                  <Clock className="h-6 w-6 text-accent-600" />
                </div>
                <div>
                  <p className="text-sm text-neutral-600">Last Visit</p>
                  <p className="text-2xl font-bold text-neutral-800">2w ago</p>
                </div>
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
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider"
                    >
                      Date & Time
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider"
                    >
                      Pet
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider"
                    >
                      Doctor
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider"
                    >
                      Type
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-neutral-200">
                  {/* Mock veriyi bırakıyoruz; gerçek data için backend API’sini entegre et */}
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-800">
                      <div className="font-medium">2025-03-25</div>
                      <div className="text-neutral-500">10:30 AM</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-700">
                      Max
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-700">
                      Dr. Sarah Johnson
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-700">
                      Annual Checkup
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Confirmed
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-primary-600 hover:text-primary-900">
                        View Details
                      </button>
                    </td>
                  </tr>
                  <tr className="bg-neutral-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-800">
                      <div className="font-medium">2025-04-02</div>
                      <div className="text-neutral-500">2:15 PM</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-700">
                      Luna
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-700">
                      Dr. Michael Clark
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-700">
                      Vaccination
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        Scheduled
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-primary-600 hover:text-primary-900">
                        View Details
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Pet Profiles */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-neutral-800 flex items-center">
                <PawPrint className="mr-2 h-5 w-5 text-primary-500" />
                My Pets
              </h2>
              <Button size="sm" onClick={() => setShowForm(true)}>
                Add Pet
              </Button>
            </div>

            {loadingPets ? (
              <p className="text-neutral-600">Loading pets...</p>
            ) : pets.length === 0 ? (
              <p className="text-neutral-600">You have no pets yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pets.map((pet) => (
                  <div key={pet.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg font-bold text-neutral-800">{pet.name}</h3>
                        <p className="text-neutral-600">{pet.breed}</p>
                      </div>
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-primary-100 text-primary-800">
                        {pet.species}
                      </span>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-neutral-600">Age:</span>
                        <span className="text-neutral-800">{pet.birthDate || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-600">Owner Phone:</span>
                        <span className="text-neutral-800">{pet.ownerPhone}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Yeni pet ekleme formu modal veya conditional area */}
            {showForm && (
              <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-lg">
                  <h2 className="text-xl font-bold text-neutral-800 mb-4">Add New Pet</h2>
                  {formError && (
                    <p className="text-red-600 text-sm mb-3">{formError}</p>
                  )}
                  <form onSubmit={handleAddPet} className="space-y-4">
                    <div>
                      <label className="block text-sm text-neutral-700 mb-1">
                        Pet Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={newPetData.name}
                        onChange={handleInputChange}
                        className="w-full border border-neutral-300 rounded p-2"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-neutral-700 mb-1">
                        Species <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="species"
                        value={newPetData.species}
                        onChange={handleInputChange}
                        className="w-full border border-neutral-300 rounded p-2"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-neutral-700 mb-1">
                        Breed
                      </label>
                      <input
                        type="text"
                        name="breed"
                        value={newPetData.breed}
                        onChange={handleInputChange}
                        className="w-full border border-neutral-300 rounded p-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-neutral-700 mb-1">
                        Birth Date
                      </label>
                      <input
                        type="date"
                        name="birthDate"
                        value={newPetData.birthDate}
                        onChange={handleInputChange}
                        className="w-full border border-neutral-300 rounded p-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-neutral-700 mb-1">
                        Owner Phone <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="ownerPhone"
                        value={newPetData.ownerPhone}
                        onChange={handleInputChange}
                        className="w-full border border-neutral-300 rounded p-2"
                        required
                      />
                    </div>
                    <div className="flex justify-end space-x-2 mt-4">
                      <button
                        type="button"
                        onClick={() => {
                          setFormError(null);
                          setShowForm(false);
                        }}
                        className="px-4 py-2 bg-neutral-200 rounded hover:bg-neutral-300"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={formSubmitting}
                        className={`px-4 py-2 rounded ${
                          formSubmitting
                            ? 'bg-primary-300 cursor-not-allowed'
                            : 'bg-primary-600 hover:bg-primary-700 text-white'
                        }`}
                      >
                        {formSubmitting ? 'Saving...' : 'Save'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Profile Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <div className="w-16 h-16 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-xl font-bold">
                {user?.name.charAt(0)}
              </div>
              <div className="ml-4">
                <h2 className="text-xl font-bold text-neutral-800">{user?.name}</h2>
                <p className="text-neutral-600">Pet Parent</p>
              </div>
            </div>
            <div className="border-t border-neutral-200 pt-4 mt-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <p className="text-neutral-600">Email:</p>
                <p className="text-neutral-800 font-medium">{user?.email}</p>
                <p className="text-neutral-600">Member Since:</p>
                <p className="text-neutral-800 font-medium">January 2025</p>
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
              <Button fullWidth variant="outline">View Medical Records</Button>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-neutral-800 mb-4 flex items-center">
              <Bell className="mr-2 h-5 w-5 text-primary-500" />
              Notifications
            </h2>

            <div className="space-y-4">
              <div className="border-l-4 border-primary-500 pl-4 py-2">
                <h3 className="font-medium text-neutral-800">Vaccination Due</h3>
                <p className="text-sm text-neutral-600">Max's annual vaccinations are due in 2 weeks</p>
                <button className="text-sm text-primary-600 font-medium mt-1">
                  Schedule Now
                </button>
              </div>

              <div className="border-l-4 border-secondary-500 pl-4 py-2">
                <h3 className="font-medium text-neutral-800">Prescription Ready</h3>
                <p className="text-sm text-neutral-600">Luna's medication is ready for pickup</p>
                <button className="text-sm text-primary-600 font-medium mt-1">
                  View Details
                </button>
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-neutral-800 mb-4 flex items-center">
              <Phone className="mr-2 h-5 w-5 text-primary-500" />
              Emergency Contact
            </h2>

            <div className="bg-red-50 border border-red-100 rounded-lg p-4">
              <p className="text-red-800 font-medium mb-2">24/7 Emergency Care</p>
              <p className="text-red-700 text-sm mb-2">
                If you have an emergency outside of our regular hours:
              </p>
              <p className="text-red-800 font-bold">
                (555) 987-6543
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
