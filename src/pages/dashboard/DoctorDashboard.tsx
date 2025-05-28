import React from 'react';
import { Calendar, User, Clock, FileText, Stethoscope, Activity } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const DoctorDashboard: React.FC = () => {
  const { user } = useAuth();

  // Mock data for demonstration
  const upcomingAppointments = [
    { id: 1, time: '09:00 AM', ownerName: 'Emily Wilson', petName: 'Max', petType: 'Dog', reason: 'Annual Checkup' },
    { id: 2, time: '10:30 AM', ownerName: 'James Thompson', petName: 'Luna', petType: 'Cat', reason: 'Vaccination' },
    { id: 3, time: '11:45 AM', ownerName: 'Sophia Martinez', petName: 'Rocky', petType: 'Dog', reason: 'Ear Infection' },
    { id: 4, time: '02:15 PM', ownerName: 'Michael Johnson', petName: 'Daisy', petType: 'Dog', reason: 'Post-Surgery Follow-up' },
  ];

  const patientAlerts = [
    { id: 1, petName: 'Bella', ownerName: 'Daniel Clark', type: 'Medication Reminder', message: 'Antibiotic course ends today' },
    { id: 2, petName: 'Charlie', ownerName: 'Sarah Williams', type: 'Lab Results', message: 'Blood work results available for review' },
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-neutral-800 mb-2">
          Doctor Dashboard
        </h1>
        <p className="text-neutral-600">
          Welcome back, {user?.name}. Here's your schedule and patient information for today.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main Content - Appointments */}
        <div className="xl:col-span-2 space-y-6">
          {/* Today's Overview */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-neutral-800 mb-4 flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-primary-500" />
              Today's Schedule - {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-primary-50 rounded-lg p-4 flex items-center">
                <div className="rounded-full bg-primary-100 p-3 mr-4">
                  <User className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <p className="text-neutral-600 text-sm">Total Patients</p>
                  <p className="text-2xl font-bold text-neutral-800">12</p>
                </div>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4 flex items-center">
                <div className="rounded-full bg-green-100 p-3 mr-4">
                  <Stethoscope className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-neutral-600 text-sm">Completed</p>
                  <p className="text-2xl font-bold text-neutral-800">5</p>
                </div>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-4 flex items-center">
                <div className="rounded-full bg-blue-100 p-3 mr-4">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-neutral-600 text-sm">Upcoming</p>
                  <p className="text-2xl font-bold text-neutral-800">7</p>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-neutral-200">
                <thead className="bg-neutral-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Time
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Owner
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Pet
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Reason
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-neutral-200">
                  {upcomingAppointments.map((appointment, index) => (
                    <tr key={appointment.id} className={index % 2 === 0 ? 'bg-white' : 'bg-neutral-50'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-800 font-medium">
                        {appointment.time}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-700">
                        {appointment.ownerName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="text-sm font-medium text-neutral-800">
                            {appointment.petName}
                          </div>
                          <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            {appointment.petType}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-700">
                        {appointment.reason}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {index < 2 ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Completed
                          </span>
                        ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-neutral-100 text-neutral-800">
                            Scheduled
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Medical Records */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-neutral-800 mb-4 flex items-center">
              <FileText className="mr-2 h-5 w-5 text-primary-500" />
              Recent Medical Records
            </h2>
            
            <div className="space-y-4">
              <div className="border border-neutral-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium text-neutral-800">Bella - Golden Retriever</h3>
                    <p className="text-sm text-neutral-600">Owner: Daniel Clark</p>
                  </div>
                  <span className="px-2 py-1 text-xs font-semibold rounded bg-blue-100 text-blue-800">
                    Updated 2h ago
                  </span>
                </div>
                <p className="text-sm text-neutral-700 mb-2">
                  <span className="font-medium">Diagnosis:</span> Ear infection (Otitis externa)
                </p>
                <p className="text-sm text-neutral-700 mb-2">
                  <span className="font-medium">Treatment:</span> Prescribed Otibiotic Ointment, 2 drops in affected ear twice daily for 7 days
                </p>
                <p className="text-sm text-neutral-700">
                  <span className="font-medium">Notes:</span> Follow-up in one week to assess improvement. Owner instructed on proper ear cleaning technique.
                </p>
              </div>
              
              <div className="border border-neutral-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium text-neutral-800">Max - Siamese Cat</h3>
                    <p className="text-sm text-neutral-600">Owner: Emily Wilson</p>
                  </div>
                  <span className="px-2 py-1 text-xs font-semibold rounded bg-blue-100 text-blue-800">
                    Updated 5h ago
                  </span>
                </div>
                <p className="text-sm text-neutral-700 mb-2">
                  <span className="font-medium">Procedure:</span> Dental cleaning and extraction of two lower premolars
                </p>
                <p className="text-sm text-neutral-700 mb-2">
                  <span className="font-medium">Medication:</span> Meloxicam 0.5mg/kg PO q24h for 3 days
                </p>
                <p className="text-sm text-neutral-700">
                  <span className="font-medium">Notes:</span> Recover well from anesthesia. Advised soft food diet for 7 days. Dental radiographs stored in imaging system.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Doctor Profile */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <div className="w-16 h-16 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-xl font-bold">
                {user?.name.charAt(0)}
              </div>
              <div className="ml-4">
                <h2 className="text-xl font-bold text-neutral-800">{user?.name}</h2>
                <p className="text-neutral-600">Veterinarian, Small Animals</p>
              </div>
            </div>
            <div className="border-t border-neutral-200 pt-4 mt-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <p className="text-neutral-600">ID:</p>
                <p className="text-neutral-800 font-medium">{user?.id}</p>
                <p className="text-neutral-600">Email:</p>
                <p className="text-neutral-800 font-medium">{user?.email}</p>
                <p className="text-neutral-600">Department:</p>
                <p className="text-neutral-800 font-medium">General Practice</p>
                <p className="text-neutral-600">Schedule:</p>
                <p className="text-neutral-800 font-medium">Mon-Fri, 9AM-6PM</p>
              </div>
            </div>
          </div>

          {/* Alerts & Notifications */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-neutral-800 mb-4 flex items-center">
              <Activity className="mr-2 h-5 w-5 text-primary-500" />
              Patient Alerts
            </h2>
            
            <div className="space-y-4">
              {patientAlerts.map((alert) => (
                <div key={alert.id} className="border-l-4 border-amber-500 pl-4 py-2">
                  <h3 className="font-medium text-neutral-800">{alert.petName} ({alert.ownerName})</h3>
                  <p className="text-sm text-amber-600 font-medium">{alert.type}</p>
                  <p className="text-sm text-neutral-600">{alert.message}</p>
                </div>
              ))}

              {/* Lab Results Alert */}
              <div className="border-l-4 border-green-500 pl-4 py-2">
                <h3 className="font-medium text-neutral-800">New Lab Results</h3>
                <p className="text-sm text-green-600 font-medium">3 reports ready for review</p>
                <button className="text-sm text-primary-600 hover:text-primary-500 font-medium mt-1">
                  View all results
                </button>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-neutral-800 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              <button className="flex flex-col items-center p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors">
                <Calendar className="h-6 w-6 text-primary-600 mb-2" />
                <span className="text-sm text-neutral-800">View Schedule</span>
              </button>
              <button className="flex flex-col items-center p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors">
                <FileText className="h-6 w-6 text-primary-600 mb-2" />
                <span className="text-sm text-neutral-800">New Record</span>
              </button>
              <button className="flex flex-col items-center p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors">
                <Stethoscope className="h-6 w-6 text-primary-600 mb-2" />
                <span className="text-sm text-neutral-800">Prescriptions</span>
              </button>
              <button className="flex flex-col items-center p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors">
                <Activity className="h-6 w-6 text-primary-600 mb-2" />
                <span className="text-sm text-neutral-800">Lab Orders</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;