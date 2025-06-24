import React, { useState } from 'react';
import { FileText, Calendar, User, Stethoscope, Pill, Search, Filter, Plus, Eye, Edit, Download } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

interface MedicalRecord {
  id: string;
  patientName: string;
  patientSpecies: string;
  ownerName: string;
  date: string;
  doctor: string;
  diagnosis: string;
  treatment: string;
  prescription?: string;
  notes?: string;
  status: 'active' | 'completed' | 'follow-up';
  nextAppointment?: string;
}

interface Patient {
  id: string;
  name: string;
  species: string;
  breed: string;
  ownerName: string;
}

const MedicalRecords: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Mock data for medical records
  const mockRecords: MedicalRecord[] = [
    {
      id: '1',
      patientName: 'Max',
      patientSpecies: 'Dog',
      ownerName: 'Emily Wilson',
      date: '2025-01-15',
      doctor: 'Dr. Sarah Johnson',
      diagnosis: 'Annual Wellness Exam',
      treatment: 'Routine checkup, vaccinations updated, dental cleaning recommended',
      prescription: 'Heartworm prevention - 1 tablet monthly',
      notes: 'Patient is in excellent health. Weight is optimal. Recommend dental cleaning in 6 months.',
      status: 'completed',
      nextAppointment: '2025-07-15'
    },
    {
      id: '2',
      patientName: 'Luna',
      patientSpecies: 'Cat',
      ownerName: 'James Thompson',
      date: '2025-01-10',
      doctor: 'Dr. Michael Clark',
      diagnosis: 'Upper Respiratory Infection',
      treatment: 'Antibiotic therapy, supportive care',
      prescription: 'Amoxicillin 50mg - twice daily for 10 days',
      notes: 'Monitor for improvement. Return if symptoms worsen or persist after treatment.',
      status: 'active',
      nextAppointment: '2025-01-20'
    },
    {
      id: '3',
      patientName: 'Rocky',
      patientSpecies: 'Dog',
      ownerName: 'Sophia Martinez',
      date: '2025-01-08',
      doctor: 'Dr. Sarah Johnson',
      diagnosis: 'Ear Infection (Otitis Externa)',
      treatment: 'Ear cleaning, topical antibiotic drops',
      prescription: 'Otibiotic Ointment - 2 drops in affected ear twice daily',
      notes: 'Owner instructed on proper ear cleaning technique. Follow-up in 1 week.',
      status: 'follow-up'
    },
    {
      id: '4',
      patientName: 'Bella',
      patientSpecies: 'Dog',
      ownerName: 'Michael Johnson',
      date: '2025-01-05',
      doctor: 'Dr. Michael Clark',
      diagnosis: 'Post-Surgical Follow-up (Spay)',
      treatment: 'Incision check, suture removal',
      notes: 'Healing well. Activity can gradually increase. No complications noted.',
      status: 'completed'
    },
    {
      id: '5',
      patientName: 'Charlie',
      patientSpecies: 'Cat',
      ownerName: 'Olivia Brown',
      date: '2025-01-03',
      doctor: 'Dr. Sarah Johnson',
      diagnosis: 'Dental Disease',
      treatment: 'Dental cleaning under anesthesia, tooth extraction',
      prescription: 'Meloxicam 0.5mg - once daily for 3 days',
      notes: 'Soft food diet for 7 days. Monitor for any signs of discomfort.',
      status: 'active',
      nextAppointment: '2025-01-10'
    }
  ];

  // Mock patients for filter
  const mockPatients: Patient[] = [
    { id: '1', name: 'Max', species: 'Dog', breed: 'Golden Retriever', ownerName: 'Emily Wilson' },
    { id: '2', name: 'Luna', species: 'Cat', breed: 'Siamese', ownerName: 'James Thompson' },
    { id: '3', name: 'Rocky', species: 'Dog', breed: 'German Shepherd', ownerName: 'Sophia Martinez' },
    { id: '4', name: 'Bella', species: 'Dog', breed: 'Labrador', ownerName: 'Michael Johnson' },
    { id: '5', name: 'Charlie', species: 'Cat', breed: 'Persian', ownerName: 'Olivia Brown' },
  ];

  // Filter records based on search and filters
  const filteredRecords = mockRecords.filter(record => {
    const matchesSearch = 
      record.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.doctor.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPatient = selectedPatient === 'all' || record.patientName === selectedPatient;
    const matchesStatus = selectedStatus === 'all' || record.status === selectedStatus;
    
    return matchesSearch && matchesPatient && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      'follow-up': 'bg-amber-100 text-amber-800'
    };
    
    const labels = {
      active: 'Active Treatment',
      completed: 'Completed',
      'follow-up': 'Follow-up Required'
    };

    return (
      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const handleViewDetails = (record: MedicalRecord) => {
    setSelectedRecord(record);
    setIsDetailModalOpen(true);
  };

  const isDoctor = user?.role === 'doctor';

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-neutral-800 mb-2">
          Medical Records
        </h1>
        <p className="text-neutral-600">
          {isDoctor 
            ? 'Manage and review patient medical records and treatment history.'
            : 'View your pets\' medical history and treatment records.'
          }
        </p>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search records..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <select
            value={selectedPatient}
            onChange={(e) => setSelectedPatient(e.target.value)}
            className="px-4 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">All Patients</option>
            {mockPatients.map(patient => (
              <option key={patient.id} value={patient.name}>
                {patient.name} ({patient.species})
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active Treatment</option>
            <option value="completed">Completed</option>
            <option value="follow-up">Follow-up Required</option>
          </select>

          {isDoctor && (
            <Button icon={<Plus size={16} />}>
              New Record
            </Button>
          )}
        </div>
      </div>

      {/* Records Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead className="bg-neutral-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Patient
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Doctor
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Diagnosis
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-200">
              {filteredRecords.map((record, index) => (
                <tr key={record.id} className={index % 2 === 0 ? 'bg-white' : 'bg-neutral-50'}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                          <span className="text-sm font-medium text-primary-600">
                            {record.patientName.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-neutral-800">
                          {record.patientName}
                        </div>
                        <div className="text-sm text-neutral-500">
                          {record.ownerName} • {record.patientSpecies}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-700">
                    {new Date(record.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-700">
                    {record.doctor}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-700">
                    {record.diagnosis}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(record.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewDetails(record)}
                        className="text-primary-600 hover:text-primary-900 flex items-center"
                      >
                        <Eye size={16} className="mr-1" />
                        View
                      </button>
                      {isDoctor && (
                        <>
                          <button className="text-neutral-600 hover:text-neutral-900 flex items-center">
                            <Edit size={16} className="mr-1" />
                            Edit
                          </button>
                          <button className="text-neutral-600 hover:text-neutral-900 flex items-center">
                            <Download size={16} className="mr-1" />
                            Export
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRecords.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
            <p className="text-neutral-600 mb-2">No medical records found</p>
            <p className="text-sm text-neutral-500">
              {searchTerm || selectedPatient !== 'all' || selectedStatus !== 'all'
                ? 'Try adjusting your search criteria'
                : 'Medical records will appear here once visits are completed'
              }
            </p>
          </div>
        )}
      </div>

      {/* Medical Record Detail Modal */}
      {isDetailModalOpen && selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-neutral-200">
              <h2 className="text-2xl font-bold text-neutral-800 flex items-center">
                <FileText className="mr-2 h-6 w-6 text-primary-500" />
                Medical Record Details
              </h2>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="text-neutral-500 hover:text-neutral-700 transition-colors"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Patient Information */}
                <div className="bg-neutral-50 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-neutral-800 mb-4 flex items-center">
                    <User className="mr-2 h-5 w-5 text-primary-500" />
                    Patient Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Patient Name:</span>
                      <span className="font-medium text-neutral-800">{selectedRecord.patientName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Species:</span>
                      <span className="font-medium text-neutral-800">{selectedRecord.patientSpecies}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Owner:</span>
                      <span className="font-medium text-neutral-800">{selectedRecord.ownerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Visit Date:</span>
                      <span className="font-medium text-neutral-800">
                        {new Date(selectedRecord.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Attending Doctor:</span>
                      <span className="font-medium text-neutral-800">{selectedRecord.doctor}</span>
                    </div>
                  </div>
                </div>

                {/* Visit Summary */}
                <div className="bg-neutral-50 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-neutral-800 mb-4 flex items-center">
                    <Stethoscope className="mr-2 h-5 w-5 text-primary-500" />
                    Visit Summary
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-neutral-600 block mb-1">Status:</span>
                      {getStatusBadge(selectedRecord.status)}
                    </div>
                    {selectedRecord.nextAppointment && (
                      <div className="flex justify-between">
                        <span className="text-neutral-600">Next Appointment:</span>
                        <span className="font-medium text-neutral-800">
                          {new Date(selectedRecord.nextAppointment).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Medical Details */}
              <div className="mt-6 space-y-6">
                <div className="bg-white border border-neutral-200 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-neutral-800 mb-4">Diagnosis</h3>
                  <p className="text-neutral-700">{selectedRecord.diagnosis}</p>
                </div>

                <div className="bg-white border border-neutral-200 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-neutral-800 mb-4">Treatment</h3>
                  <p className="text-neutral-700">{selectedRecord.treatment}</p>
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
                <Button onClick={() => setIsDetailModalOpen(false)} variant="outline">
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

export default MedicalRecords;