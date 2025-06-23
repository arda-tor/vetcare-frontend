import React, { useState } from 'react';
import { FileText, Calendar, Stethoscope, Pill, Search, Eye, Download, Phone, Mail } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/common/Button';

interface MedicalRecord {
  id: string;
  petName: string;
  petSpecies: string;
  date: string;
  doctor: string;
  diagnosis: string;
  treatment: string;
  prescription?: string;
  notes?: string;
  status: 'active' | 'completed' | 'follow-up';
  nextAppointment?: string;
}

const CustomerMedicalRecords: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPet, setSelectedPet] = useState<string>('all');
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Mock data for customer's pet medical records
  const mockRecords: MedicalRecord[] = [
    {
      id: '1',
      petName: 'Max',
      petSpecies: 'Dog',
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
      petName: 'Max',
      petSpecies: 'Dog',
      date: '2024-12-10',
      doctor: 'Dr. Michael Clark',
      diagnosis: 'Routine Vaccination',
      treatment: 'DHPP and Rabies vaccinations administered',
      notes: 'No adverse reactions observed. Next vaccinations due in 1 year.',
      status: 'completed'
    },
    {
      id: '3',
      petName: 'Luna',
      petSpecies: 'Cat',
      date: '2025-01-08',
      doctor: 'Dr. Sarah Johnson',
      diagnosis: 'Dental Cleaning',
      treatment: 'Professional dental cleaning under anesthesia',
      prescription: 'Meloxicam 0.5mg - once daily for 3 days',
      notes: 'Soft food diet for 7 days. Monitor for any signs of discomfort.',
      status: 'active',
      nextAppointment: '2025-01-15'
    },
    {
      id: '4',
      petName: 'Luna',
      petSpecies: 'Cat',
      date: '2024-11-20',
      doctor: 'Dr. Michael Clark',
      diagnosis: 'Annual Check-up',
      treatment: 'Physical examination, blood work, vaccinations',
      notes: 'All parameters normal. Continue current diet and exercise routine.',
      status: 'completed'
    }
  ];

  // Customer's pets for filter
  const customerPets = ['Max', 'Luna'];

  // Filter records based on search and pet selection
  const filteredRecords = mockRecords.filter(record => {
    const matchesSearch = 
      record.petName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.doctor.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPet = selectedPet === 'all' || record.petName === selectedPet;
    
    return matchesSearch && matchesPet;
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

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-neutral-800 mb-2">
          Medical Records
        </h1>
        <p className="text-neutral-600">
          View your pets' complete medical history, treatments, and prescriptions.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="rounded-full bg-primary-100 p-3 mr-4">
              <FileText className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <p className="text-sm text-neutral-600">Total Records</p>
              <p className="text-2xl font-bold text-neutral-800">{mockRecords.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="rounded-full bg-blue-100 p-3 mr-4">
              <Stethoscope className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-neutral-600">Active Treatments</p>
              <p className="text-2xl font-bold text-neutral-800">
                {mockRecords.filter(r => r.status === 'active').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="rounded-full bg-green-100 p-3 mr-4">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-neutral-600">Last Visit</p>
              <p className="text-2xl font-bold text-neutral-800">Jan 15</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search medical records..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <select
            value={selectedPet}
            onChange={(e) => setSelectedPet(e.target.value)}
            className="px-4 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">All Pets</option>
            {customerPets.map(pet => (
              <option key={pet} value={pet}>
                {pet}
              </option>
            ))}
          </select>

          <Button variant="outline" icon={<Download size={16} />}>
            Export All Records
          </Button>
        </div>
      </div>

      {/* Records Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead className="bg-neutral-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Pet & Date
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
                            {record.petName.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-neutral-800">
                          {record.petName}
                        </div>
                        <div className="text-sm text-neutral-500">
                          {new Date(record.date).toLocaleDateString()} • {record.petSpecies}
                        </div>
                      </div>
                    </div>
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
                        View Details
                      </button>
                      <button className="text-neutral-600 hover:text-neutral-900 flex items-center">
                        <Download size={16} className="mr-1" />
                        Download
                      </button>
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
              {searchTerm || selectedPet !== 'all'
                ? 'Try adjusting your search criteria'
                : 'Medical records will appear here after your pets\' visits'
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
                Medical Record - {selectedRecord.petName}
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
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Visit Information */}
                <div className="bg-neutral-50 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-neutral-800 mb-4 flex items-center">
                    <Calendar className="mr-2 h-5 w-5 text-primary-500" />
                    Visit Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Pet:</span>
                      <span className="font-medium text-neutral-800">{selectedRecord.petName} ({selectedRecord.petSpecies})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Visit Date:</span>
                      <span className="font-medium text-neutral-800">
                        {new Date(selectedRecord.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Doctor:</span>
                      <span className="font-medium text-neutral-800">{selectedRecord.doctor}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Status:</span>
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

                {/* Contact Information */}
                <div className="bg-primary-50 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-neutral-800 mb-4">Questions About This Visit?</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 text-primary-600 mr-3" />
                      <div>
                        <p className="text-sm text-neutral-600">Call us</p>
                        <p className="font-medium text-neutral-800">(555) 123-4567</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Mail className="h-5 w-5 text-primary-600 mr-3" />
                      <div>
                        <p className="text-sm text-neutral-600">Email us</p>
                        <p className="font-medium text-neutral-800">info@petcareclinic.com</p>
                      </div>
                    </div>
                  </div>
                  <Button className="w-full mt-4" size="sm">
                    Schedule Follow-up
                  </Button>
                </div>
              </div>

              {/* Medical Details */}
              <div className="space-y-6">
                <div className="bg-white border border-neutral-200 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-neutral-800 mb-4">Diagnosis</h3>
                  <p className="text-neutral-700">{selectedRecord.diagnosis}</p>
                </div>

                <div className="bg-white border border-neutral-200 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-neutral-800 mb-4">Treatment Provided</h3>
                  <p className="text-neutral-700">{selectedRecord.treatment}</p>
                </div>

                {selectedRecord.prescription && (
                  <div className="bg-white border border-neutral-200 rounded-lg p-6">
                    <h3 className="text-lg font-bold text-neutral-800 mb-4 flex items-center">
                      <Pill className="mr-2 h-5 w-5 text-primary-500" />
                      Prescription & Medications
                    </h3>
                    <p className="text-neutral-700 mb-4">{selectedRecord.prescription}</p>
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <p className="text-sm text-amber-800">
                        <strong>Important:</strong> Follow the prescribed dosage and schedule. Contact us if you have any questions about administering medications.
                      </p>
                    </div>
                  </div>
                )}

                {selectedRecord.notes && (
                  <div className="bg-white border border-neutral-200 rounded-lg p-6">
                    <h3 className="text-lg font-bold text-neutral-800 mb-4">Doctor's Notes & Recommendations</h3>
                    <p className="text-neutral-700">{selectedRecord.notes}</p>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3 pt-6 border-t border-neutral-200 mt-6">
                <Button variant="outline" icon={<Download size={16} />}>
                  Download PDF
                </Button>
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

export default CustomerMedicalRecords;