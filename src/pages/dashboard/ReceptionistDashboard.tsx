import React from 'react';
import { Calendar, Phone, Users, Clock, Bell } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/common/Button';

const ReceptionistDashboard: React.FC = () => {
  const { user } = useAuth();

  // Mock data for demonstration
  const upcomingAppointments = [
    { id: 1, time: '09:00 AM', ownerName: 'Emily Wilson', petName: 'Max', petType: 'Dog', doctor: 'Dr. Johnson', status: 'Checked In' },
    { id: 2, time: '10:30 AM', ownerName: 'James Thompson', petName: 'Luna', petType: 'Cat', doctor: 'Dr. Johnson', status: 'Scheduled' },
    { id: 3, time: '11:45 AM', ownerName: 'Sophia Martinez', petName: 'Rocky', petType: 'Dog', doctor: 'Dr. Wilson', status: 'Scheduled' },
    { id: 4, time: '02:15 PM', ownerName: 'Michael Johnson', petName: 'Daisy', petType: 'Dog', doctor: 'Dr. Johnson', status: 'Confirmed' },
    { id: 5, time: '03:30 PM', ownerName: 'Olivia Brown', petName: 'Charlie', petType: 'Cat', doctor: 'Dr. Wilson', status: 'Scheduled' },
  ];

  const waitingPatients = [
    { id: 1, waitTime: '10 min', ownerName: 'Emily Wilson', petName: 'Max', petType: 'Dog', doctor: 'Dr. Johnson' },
  ];

  const todayStats = [
    { label: 'Total Appointments', value: 12, icon: <Calendar className="h-6 w-6" />, color: 'bg-primary-50 text-primary-600' },
    { label: 'Checked In', value: 3, icon: <Users className="h-6 w-6" />, color: 'bg-green-50 text-green-600' },
    { label: 'Waiting', value: 1, icon: <Clock className="h-6 w-6" />, color: 'bg-amber-50 text-amber-600' },
    { label: 'Upcoming', value: 8, icon: <Bell className="h-6 w-6" />, color: 'bg-blue-50 text-blue-600' },
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-neutral-800 mb-2">
          Reception Dashboard
        </h1>
        <p className="text-neutral-600">
          Welcome back, {user?.name}. Here's today's appointment overview.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="xl:col-span-2 space-y-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {todayStats.map((stat, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-5">
                <div className={`rounded-full ${stat.color} p-3 inline-flex mb-3`}>
                  {stat.icon}
                </div>
                <h3 className="text-sm font-medium text-neutral-500">{stat.label}</h3>
                <p className="text-2xl font-bold text-neutral-800 mt-1">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Today's Schedule */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-neutral-800 flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-primary-500" />
                Today's Schedule
              </h2>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline">
                  <Phone size={16} className="mr-1" />
                  Call Reminder
                </Button>
                <Button size="sm">
                  Add Appointment
                </Button>
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
                      Client
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Pet
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Doctor
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
                        {appointment.doctor}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={appointment.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          {appointment.status === 'Scheduled' ? (
                            <button className="text-primary-600 hover:text-primary-500">
                              Check In
                            </button>
                          ) : appointment.status === 'Checked In' ? (
                            <button className="text-green-600 hover:text-green-500">
                              Ready
                            </button>
                          ) : null}
                          <button className="text-neutral-500 hover:text-neutral-700">
                            Edit
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Waiting Room */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-neutral-800 mb-4 flex items-center">
              <Users className="mr-2 h-5 w-5 text-primary-500" />
              Waiting Room
            </h2>
            
            {waitingPatients.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-neutral-200">
                  <thead className="bg-neutral-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Wait Time
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Client
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Pet
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Doctor
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-neutral-200">
                    {waitingPatients.map((patient) => (
                      <tr key={patient.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-800">
                            {patient.waitTime}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-700">
                          {patient.ownerName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="text-sm font-medium text-neutral-800">
                              {patient.petName}
                            </div>
                            <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                              {patient.petType}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-700">
                          {patient.doctor}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button className="text-green-600 hover:text-green-500">
                              Ready
                            </button>
                            <button className="text-neutral-500 hover:text-neutral-700">
                              View Details
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-6 bg-neutral-50 rounded-lg">
                <Clock className="h-12 w-12 text-neutral-400 mx-auto mb-3" />
                <p className="text-neutral-600">No patients currently waiting</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Receptionist Profile */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <div className="w-16 h-16 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-xl font-bold">
                {user?.name.charAt(0)}
              </div>
              <div className="ml-4">
                <h2 className="text-xl font-bold text-neutral-800">{user?.name}</h2>
                <p className="text-neutral-600">Front Desk Receptionist</p>
              </div>
            </div>
            <div className="border-t border-neutral-200 pt-4 mt-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <p className="text-neutral-600">ID:</p>
                <p className="text-neutral-800 font-medium">{user?.id}</p>
                <p className="text-neutral-600">Email:</p>
                <p className="text-neutral-800 font-medium">{user?.email}</p>
                <p className="text-neutral-600">Shift:</p>
                <p className="text-neutral-800 font-medium">Morning (8AM-4PM)</p>
              </div>
            </div>
          </div>

          {/* Recent Calls */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-neutral-800 mb-4 flex items-center">
              <Phone className="mr-2 h-5 w-5 text-primary-500" />
              Recent Calls
            </h2>
            
            <div className="space-y-4">
              <div className="border-b border-neutral-200 pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-neutral-800">James Thompson</h3>
                    <p className="text-sm text-neutral-500">Re: Luna's appointment</p>
                  </div>
                  <span className="text-xs text-neutral-500">10:15 AM</span>
                </div>
                <p className="text-sm text-neutral-600 mt-1">
                  Confirmed appointment for today at 10:30 AM
                </p>
              </div>
              
              <div className="border-b border-neutral-200 pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-neutral-800">Sophia Martinez</h3>
                    <p className="text-sm text-neutral-500">Re: Prescription refill</p>
                  </div>
                  <span className="text-xs text-neutral-500">9:45 AM</span>
                </div>
                <p className="text-sm text-neutral-600 mt-1">
                  Requested heartworm medication refill, forwarded to Dr. Wilson
                </p>
              </div>
              
              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-neutral-800">New Client Inquiry</h3>
                    <p className="text-sm text-neutral-500">Re: New puppy visit</p>
                  </div>
                  <span className="text-xs text-neutral-500">9:20 AM</span>
                </div>
                <p className="text-sm text-neutral-600 mt-1">
                  New client with 8-week-old Lab puppy, scheduled for next Tuesday
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-neutral-800 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Button fullWidth>New Appointment</Button>
              <Button fullWidth variant="outline">Check In Patient</Button>
              <Button fullWidth variant="outline">Client Record Lookup</Button>
              <Button fullWidth variant="outline">Process Payment</Button>
            </div>
          </div>

          {/* Today's Reminders */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-neutral-800 mb-4 flex items-center">
              <Bell className="mr-2 h-5 w-5 text-primary-500" />
              Reminders
            </h2>
            
            <div className="space-y-3">
              <div className="bg-amber-50 border-l-4 border-amber-500 p-3">
                <h3 className="font-medium text-neutral-800">Call Reminders</h3>
                <p className="text-sm text-neutral-600">4 appointment confirmations for tomorrow</p>
                <button className="text-sm text-primary-600 hover:text-primary-500 font-medium mt-1">
                  View list
                </button>
              </div>
              
              <div className="bg-blue-50 border-l-4 border-blue-500 p-3">
                <h3 className="font-medium text-neutral-800">Medication Pickups</h3>
                <p className="text-sm text-neutral-600">2 clients scheduled for medication pickup today</p>
                <button className="text-sm text-primary-600 hover:text-primary-500 font-medium mt-1">
                  View details
                </button>
              </div>
              
              <div className="bg-green-50 border-l-4 border-green-500 p-3">
                <h3 className="font-medium text-neutral-800">Inventory Check</h3>
                <p className="text-sm text-neutral-600">Weekly inventory check due by EOD</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper component for status badges
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'Checked In':
        return 'bg-green-100 text-green-800';
      case 'Confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'Scheduled':
        return 'bg-neutral-100 text-neutral-800';
      case 'Completed':
        return 'bg-purple-100 text-purple-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-neutral-100 text-neutral-800';
    }
  };

  return (
    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusStyles()}`}>
      {status}
    </span>
  );
};

export default ReceptionistDashboard;