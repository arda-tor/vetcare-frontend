import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FileText,
  Calendar,
  Search,
  Eye,
  Download,
  Loader2,
  AlertCircle,
  User,      
  Stethoscope, 
  Pill,        
  Edit,       
  Plus,        
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/common/Button';

import api from '../../lib/axios';
import { Pet } from '../../types'; 

interface ApiMedicalRecord {
  id: number;
  visit_date: string; 
  assessment: string;
  plan: string;
  status: 'draft' | 'completed' | 'reviewed'; 
  next_visit_date?: string; 
  doctor: { user: { name: string; } }; 
  chief_complaint?: string; 
  physical_examination?: string; 
  notes?: string; 
  prescription?: string; 
  petId: number; 
  petName: string; 
  petSpecies?: string; 
  ownerName?: string; 
}

const CustomerMedicalRecords: React.FC = () => {
  const { petId: paramPetId } = useParams<{ petId: string }>(); 
  const navigate = useNavigate();
  const { user } = useAuth(); 

  const [pets, setPets] = useState<Pet[]>([]);
  const [isLoadingPets, setIsLoadingPets] = useState(true);

  const [records, setRecords] = useState<ApiMedicalRecord[]>([]);
  const [isLoadingRecords, setIsLoadingRecords] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<ApiMedicalRecord | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  
  const currentSelectedPetId = useMemo(() => {
    return paramPetId ? Number(paramPetId) : null;
  }, [paramPetId]);

  
  const isDoctor = user?.role === 'doctor';


  // 1) Load dropdown list of pets
  useEffect(() => {
    let cancelled = false;

    const fetchSummary = async () => {
      console.log('→ fetching /my/pets/medical-summary…');
      try {
        const res = await api.get('/my/pets/medical-summary');
        console.log('← /my/pets/medical-summary response:', res.status, res.data);
        if (!cancelled) {
          if (res.data?.is_success && Array.isArray(res.data.data.pets)) {
            setPets(res.data.data.pets);
          } else {
            console.error('Unexpected payload shape for pets summary:', res.data);
            setError('Failed to load pet summary due to unexpected data format.');
          }
        }
      } catch (err: any) {
        console.error('Error fetching pets summary:', err.response?.data?.message || err.message || err);
        if (!cancelled) setError(err.response?.data?.message || err.message || 'Failed to load pet summary.');
      } finally {
        if (!cancelled) setIsLoadingPets(false);
      }
    };

    fetchSummary();

    return () => {
      cancelled = true;
    };
  }, []);

  // 2) Load medical history based on selected pet or all pets
  useEffect(() => {
   
    if (isLoadingPets) return;

    let cancelled = false;

    const fetchHistory = async () => {
      setIsLoadingRecords(true);
      setError(null);
      let fetchedRecords: ApiMedicalRecord[] = [];

      try {
        if (currentSelectedPetId) {
        
          const pet = pets.find(p => p.id === currentSelectedPetId);
          if (!pet) {
            throw new Error('Selected pet not found in your list.');
          }
          console.log(`→ fetching /my/pets/${currentSelectedPetId}/medical-history…`);
          const res = await api.get(`/my/pets/${currentSelectedPetId}/medical-history`);
          console.log(`← /my/pets/${currentSelectedPetId}/medical-history response:`, res.status, res.data);

          if (res.data.is_success && Array.isArray(res.data.data.medical_records)) {
            fetchedRecords = res.data.data.medical_records.map((rec: any) => ({
              ...rec,
              petId: pet.id,
              petName: pet.name,
              petSpecies: pet.species, // Assuming 'species' is on your Pet object
              ownerName: user?.name, // Assuming current user is the owner
            }));
          } else {
            throw new Error(res.data.message || 'Invalid response for single pet history');
          }
        } else {
          
          console.log('→ fetching medical history for all pets…');
          const allPetRecordsPromises = pets.map(async (p) => {
            try {
              console.log(`  -> fetching /my/pets/${p.id}/medical-history for ${p.name}`);
              const res = await api.get(`/my/pets/${p.id}/medical-history`);
              if (res.data.is_success && Array.isArray(res.data.data.medical_records)) {
                return res.data.data.medical_records.map((rec: any) => ({
                  ...rec,
                  petId: p.id,
                  petName: p.name,
                  petSpecies: p.species, // Assuming 'species' is on your Pet object
                  ownerName: user?.name, // Assuming current user is the owner
                }));
              }
              return [];
            } catch (innerErr) {
              console.warn(`Failed to fetch history for pet ${p.name} (${p.id}):`, (innerErr as any).response?.data?.message || (innerErr as any).message || innerErr);
              return []; // Hata durumunda bu pet için boş kayıt döneriz
            }
          });

          const results = await Promise.all(allPetRecordsPromises);
          fetchedRecords = results.flat(); // Tüm kayıtları tek bir diziye birleştir
          console.log('← All pets medical history fetched.');
        }

        if (!cancelled) {
          setRecords(fetchedRecords);
        }
      } catch (err: any) {
        console.error('Error fetching medical history:', err.response?.data?.message || err.message || err);
        if (!cancelled) setError(err.response?.data?.message || err.message || 'Failed to load medical history.');
      } finally {
        if (!cancelled) setIsLoadingRecords(false);
      }
    };

    // Sadece pets listesi yüklendikten sonra veya petId değiştiğinde çağrı yap
    if (!isLoadingPets) {
      fetchHistory();
    }

    return () => {
      cancelled = true;
    };
  }, [currentSelectedPetId, pets, isLoadingPets, user?.name]); // 'pets' ve 'isLoadingPets' de dependency olarak eklenmeli

  // 3) Filter logic
  const filteredRecords = useMemo(() => {
    const lower = searchTerm.toLowerCase();
    return records.filter(r =>
      r.assessment.toLowerCase().includes(lower) ||
      r.doctor.user.name.toLowerCase().includes(lower) ||
      r.petName.toLowerCase().includes(lower) || // Evcil hayvan adına göre arama
      (r.chief_complaint && r.chief_complaint.toLowerCase().includes(lower)) || // Chief complaint'e göre arama
      (r.physical_examination && r.physical_examination.toLowerCase().includes(lower)) || // Physical exam'a göre arama
      (r.notes && r.notes.toLowerCase().includes(lower)) // Notes'a göre arama
    );
  }, [records, searchTerm]);

  const getStatusBadge = useCallback((status: ApiMedicalRecord['status']) => {
    const map = {
      draft: { label: 'Active Treatment', style: 'bg-blue-100 text-blue-800' },
      completed: { label: 'Completed', style: 'bg-green-100 text-green-800' },
      reviewed: { label: 'Reviewed', style: 'bg-purple-100 text-purple-800' }, // Assuming 'reviewed' is a possible status
    } as const;
    // Fallback if status doesn't match, or map 'active' to 'draft' if that's your intention
    const { label, style } = map[status] || map.draft; 
    return <span className={`px-2 py-1 rounded-full text-xs font-semibold ${style}`}>{label}</span>;
  }, []);


  // Escape tuşu ile modal kapatma
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsDetailModalOpen(false);
      }
    };
    if (isDetailModalOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isDetailModalOpen]);

  // 4) Loading / Error states
  if (isLoadingPets || isLoadingRecords) {
    return (
      <div className="flex flex-col justify-center items-center h-64 bg-white rounded-lg shadow-md p-6">
        <Loader2 className="h-12 w-12 animate-spin text-primary-500 mb-4" />
        <p className="text-lg text-neutral-600">Loading medical records...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md text-center max-w-lg mx-auto mt-8">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-2" />
        <p className="text-red-700 font-medium text-lg">Error loading records:</p>
        <p className="text-red-600 text-sm mt-1">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-neutral-50 min-h-screen">
      {/* Header */}
      <div className="mb-6 bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-neutral-800 flex items-center">
          <FileText className="h-8 w-8 mr-3 text-primary-600" /> Medical Records
        </h1>
        <p className="text-neutral-600 mt-2">View your pet’s comprehensive medical history.</p>
      </div>

      {/* Pet selector */}
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4 sm:mb-0 sm:mr-4 w-full sm:w-auto">
          <label htmlFor="pet-select" className="block text-sm font-medium text-neutral-700 mb-1">
            Select Pet:
          </label>
          <select
            id="pet-select"
            value={paramPetId || ''} // URL'den gelen petId varsa onu kullan, yoksa boş string
            onChange={e => {
              const newPetId = e.target.value;
              // Eğer "All Pets" seçilirse URL'den petId'yi kaldır
              navigate(newPetId === '' ? '/customer-medical-records' : `/customer-medical-records/${newPetId}`);
            }}
            className="block w-full sm:w-64 border-neutral-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 text-neutral-700 p-2"
          >
            <option value="">All Pets</option> {/* "All Pets" seçeneği */}
            {pets.map(p => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Current Pet Info - Display only if a specific pet is selected */}
        {currentSelectedPetId && pets.find(p => p.id === currentSelectedPetId) && (
          <div className="bg-primary-50 border border-primary-200 text-primary-800 p-3 rounded-md flex items-center text-sm">
            <Calendar size={18} className="mr-2" />
            Viewing records for: <span className="font-semibold ml-1">{pets.find(p => p.id === currentSelectedPetId)?.name}</span>
          </div>
        )}
      </div>

      {/* Search & Export */}
      <div className="mb-6 flex flex-col sm:flex-row items-center justify-between bg-white p-6 rounded-lg shadow-md">
        <div className="relative flex-grow w-full sm:w-auto sm:mr-4 mb-4 sm:mb-0">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by assessment, doctor, pet name, complaint, or notes…"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-neutral-300 rounded-md focus:ring-primary-500 focus:border-primary-500 shadow-sm"
          />
        </div>
        {/* Customer can view, but typically not export all records from UI directly,
            unless you provide a bulk export feature. */}
        {/*
        <Button
          className="w-full sm:w-auto"
          variant="outline"
          icon={<Download size={16} />}
          onClick={() => { // TODO: export all logic here }}
        >
          Export Records
        </Button>
        */}
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full divide-y divide-neutral-200">
          <thead className="bg-neutral-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Date & Pet</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Doctor</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Assessment</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {filteredRecords.length > 0 ? (
              filteredRecords.map(rec => (
                <tr key={rec.id} className="hover:bg-neutral-50">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="font-medium text-neutral-800">{new Date(rec.visit_date).toLocaleDateString()}</div>
                    <div className="text-sm text-neutral-500">
                        <span className="font-semibold">{rec.petName || 'Unknown Pet'}</span>
                        {rec.petSpecies && <span className="ml-1">({rec.petSpecies})</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-700">{rec.doctor.user.name}</td>
                  <td className="px-4 py-3 max-w-xs truncate text-sm text-neutral-700" title={rec.assessment}>
                    {rec.assessment}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">{getStatusBadge(rec.status)}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <button
                      onClick={() => {
                        setSelectedRecord(rec);
                        setIsDetailModalOpen(true);
                      }}
                      className="flex items-center text-primary-600 hover:text-primary-800 transition-colors duration-200"
                    >
                      <Eye size={16} className="mr-1" /> View
                    </button>
                    {/* Doctor-only actions (Edit, Export) are intentionally hidden for customers */}
                    {isDoctor && (
                      <>
                        <button className="text-neutral-600 hover:text-neutral-900 flex items-center ml-2">
                          <Edit size={16} className="mr-1" /> Edit
                        </button>
                        <button className="text-neutral-600 hover:text-neutral-900 flex items-center ml-2">
                          <Download size={16} className="mr-1" /> Export
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-8 text-center text-neutral-500 text-lg">
                  <FileText className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
                  <p className="text-neutral-600 mb-2">No medical records found</p>
                  <p className="text-sm text-neutral-500">
                    {searchTerm ? 'Try adjusting your search criteria.' : 'Medical records will appear here once visits are completed.'}
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Medical Record Detail Modal */}
      {isDetailModalOpen && selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[999]" onClick={() => setIsDetailModalOpen(false)}>
          <div
            className="bg-white rounded-lg shadow-2xl max-w-4xl w-full overflow-hidden max-h-[90vh] flex flex-col"
            onClick={e => e.stopPropagation()} // Click inside modal should not close it
          >
            <div className="flex justify-between items-center p-6 border-b border-neutral-200 bg-neutral-50">
              <h2 className="text-2xl font-bold text-neutral-800 flex items-center">
                <FileText className="mr-2 h-6 w-6 text-primary-500" />
                Medical Record Details for {selectedRecord.petName}
              </h2>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="text-neutral-500 hover:text-neutral-700 text-2xl p-1"
                aria-label="Close modal"
              >
                &times; {/* Times symbol for close */}
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-grow"> {/* Added flex-grow for better modal sizing */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Pet Information (Renamed from Patient Information) */}
                <div className="bg-neutral-50 rounded-lg p-6 border border-neutral-100">
                  <h3 className="text-lg font-bold text-neutral-800 mb-4 flex items-center">
                    <User className="mr-2 h-5 w-5 text-primary-500" />
                    Pet Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Pet Name:</span>
                      <span className="font-medium text-neutral-800">{selectedRecord.petName}</span>
                    </div>
                    {selectedRecord.petSpecies && (
                        <div className="flex justify-between">
                            <span className="text-neutral-600">Species:</span>
                            <span className="font-medium text-neutral-800">{selectedRecord.petSpecies}</span>
                        </div>
                    )}
                    {selectedRecord.ownerName && (
                        <div className="flex justify-between">
                            <span className="text-neutral-600">Owner:</span>
                            <span className="font-medium text-neutral-800">{selectedRecord.ownerName}</span>
                        </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Visit Date:</span>
                      <span className="font-medium text-neutral-800">
                        {new Date(selectedRecord.visit_date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Attending Doctor:</span>
                      <span className="font-medium text-neutral-800">{selectedRecord.doctor.user.name}</span>
                    </div>
                  </div>
                </div>

                {/* Visit Summary */}
                <div className="bg-neutral-50 rounded-lg p-6 border border-neutral-100">
                  <h3 className="text-lg font-bold text-neutral-800 mb-4 flex items-center">
                    <Stethoscope className="mr-2 h-5 w-5 text-primary-500" />
                    Visit Summary
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-neutral-600 block mb-1">Status:</span>
                      {getStatusBadge(selectedRecord.status)}
                    </div>
                    {selectedRecord.next_visit_date && (
                      <div className="flex justify-between">
                        <span className="text-neutral-600">Next Visit Date:</span>
                        <span className="font-medium text-neutral-800">
                          {new Date(selectedRecord.next_visit_date).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Medical Details */}
              <div className="mt-6 space-y-6">
                <div className="bg-white border border-neutral-200 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-neutral-800 mb-4">Chief Complaint</h3>
                  <p className="text-neutral-700">{selectedRecord.chief_complaint || 'N/A'}</p>
                </div>

                <div className="bg-white border border-neutral-200 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-neutral-800 mb-4">Physical Examination</h3>
                  <p className="text-neutral-700">{selectedRecord.physical_examination || 'N/A'}</p>
                </div>

                <div className="bg-white border border-neutral-200 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-neutral-800 mb-4">Assessment</h3>
                  <p className="text-neutral-700">{selectedRecord.assessment || 'N/A'}</p>
                </div>

                <div className="bg-white border border-neutral-200 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-neutral-800 mb-4">Plan</h3>
                  <p className="text-neutral-700">{selectedRecord.plan || 'N/A'}</p>
                </div>

                {selectedRecord.prescription && (
                  <div className="bg-white border border-neutral-200 rounded-lg p-6">
                    <h3 className="text-lg font-bold text-neutral-800 mb-4 flex items-center">
                      <Pill className="mr-2 h-5 w-5 text-primary-500" />
                      Prescription
                    </h3>
                    <p className="text-neutral-700">{selectedRecord.prescription}</p>
                  </div>
                )}

                {selectedRecord.notes && (
                  <div className="bg-white border border-neutral-200 rounded-lg p-6">
                    <h3 className="text-lg font-bold text-neutral-800 mb-4">Additional Notes</h3>
                    <p className="text-neutral-700">{selectedRecord.notes}</p>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3 pt-6 border-t border-neutral-200 mt-6">
                {/* Customer only views, cannot edit/export from here */}
                {/* These buttons are commented out or hidden based on 'isDoctor' */}
                {isDoctor && (
                  <>
                    <Button variant="outline" icon={<Download size={16} />}>
                      Export PDF
                    </Button>
                    <Button variant="outline" icon={<Edit size={16} />}>
                      Edit Record
                    </Button>
                  </>
                )}
                <Button onClick={() => setIsDetailModalOpen(false)} variant="secondary">
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerMedicalRecords;