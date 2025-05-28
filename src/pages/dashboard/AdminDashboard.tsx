import React from 'react';
import { BarChart, UsersRound, DollarSign, Calendar, ClipboardCheck, Briefcase, LineChart, PieChart, Cog } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/common/Button';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();

  const stats = [
    { label: 'Appointments', value: '1,248', change: '+12%', icon: <Calendar className="h-6 w-6" />, color: 'bg-primary-50 text-primary-600' },
    { label: 'Patients', value: '845', change: '+5%', icon: <UsersRound className="h-6 w-6" />, color: 'bg-blue-50 text-blue-600' },
    { label: 'Revenue', value: '$28,560', change: '+18%', icon: <DollarSign className="h-6 w-6" />, color: 'bg-green-50 text-green-600' },
    { label: 'Services', value: '24', change: '+2', icon: <Briefcase className="h-6 w-6" />, color: 'bg-purple-50 text-purple-600' },
  ];

  // Staff performance data for demonstration
  const staffPerformance = [
    { name: 'Dr. Sarah Johnson', role: 'Veterinarian', patients: 145, satisfaction: 98, revenue: '$12,450' },
    { name: 'Dr. Michael Clark', role: 'Veterinarian', patients: 128, satisfaction: 96, revenue: '$10,820' },
    { name: 'Emily Davis', role: 'Receptionist', patients: 0, satisfaction: 95, revenue: '$0' },
    { name: 'Daniel Wilson', role: 'Vet Technician', patients: 0, satisfaction: 94, revenue: '$0' },
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-neutral-800 mb-2">
          Administrator Dashboard
        </h1>
        <p className="text-neutral-600">
          Welcome back, {user?.name}. Here's an overview of your clinic's performance.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <div className={`rounded-full ${stat.color} p-3`}>
                {stat.icon}
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                stat.change.startsWith('+') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {stat.change}
              </span>
            </div>
            <h3 className="text-sm font-medium text-neutral-500">{stat.label}</h3>
            <p className="text-2xl font-bold text-neutral-800 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="xl:col-span-2 space-y-6">
          {/* Revenue Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-neutral-800 flex items-center">
                <BarChart className="mr-2 h-5 w-5 text-primary-500" />
                Monthly Revenue
              </h2>
              <div className="flex space-x-2">
                <select className="text-sm border border-neutral-300 rounded-md px-3 py-1">
                  <option>Last 6 Months</option>
                  <option>Last 12 Months</option>
                  <option>Year to Date</option>
                </select>
              </div>
            </div>
            
            {/* Chart placeholder */}
            <div className="bg-neutral-50 rounded-lg p-6 h-80 flex items-center justify-center">
              <div className="text-center">
                <LineChart className="h-12 w-12 text-neutral-400 mx-auto mb-3" />
                <p className="text-neutral-500 font-medium">Revenue Chart Placeholder</p>
                <p className="text-sm text-neutral-400">This would contain a real chart in production</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="border border-neutral-200 rounded-lg p-4 text-center">
                <p className="text-sm text-neutral-500">Total Revenue</p>
                <p className="text-xl font-bold text-neutral-800">$145,280</p>
                <p className="text-xs text-green-600">+12.5% YoY</p>
              </div>
              <div className="border border-neutral-200 rounded-lg p-4 text-center">
                <p className="text-sm text-neutral-500">Avg. Ticket Value</p>
                <p className="text-xl font-bold text-neutral-800">$124.50</p>
                <p className="text-xs text-green-600">+5.2% YoY</p>
              </div>
              <div className="border border-neutral-200 rounded-lg p-4 text-center">
                <p className="text-sm text-neutral-500">Recurring Revenue</p>
                <p className="text-xl font-bold text-neutral-800">$84,350</p>
                <p className="text-xs text-green-600">+18.3% YoY</p>
              </div>
            </div>
          </div>

          {/* Staff Performance */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-neutral-800 flex items-center">
                <UsersRound className="mr-2 h-5 w-5 text-primary-500" />
                Staff Performance
              </h2>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline">
                  <ClipboardCheck size={16} className="mr-1" />
                  Export Report
                </Button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-neutral-200">
                <thead className="bg-neutral-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Patients Seen
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Satisfaction
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Revenue
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-neutral-200">
                  {staffPerformance.map((staff, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-neutral-50'}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-neutral-800">{staff.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-neutral-700">{staff.role}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-700">
                        {staff.patients > 0 ? staff.patients : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-sm text-neutral-700 mr-2">{staff.satisfaction}%</span>
                          <div className="w-24 bg-neutral-200 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full" 
                              style={{ width: `${staff.satisfaction}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-700">
                        {staff.revenue !== '$0' ? staff.revenue : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-neutral-800 mb-4 flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-primary-500" />
              Recent Activity
            </h2>
            
            <div className="space-y-4">
              <div className="border-l-4 border-green-500 pl-4 py-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-neutral-800">New Patient Record</h3>
                    <p className="text-sm text-neutral-600">A new patient "Bella" was registered</p>
                  </div>
                  <span className="text-xs text-neutral-500">Today, 10:30 AM</span>
                </div>
              </div>
              
              <div className="border-l-4 border-blue-500 pl-4 py-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-neutral-800">Inventory Updated</h3>
                    <p className="text-sm text-neutral-600">Monthly inventory check completed</p>
                  </div>
                  <span className="text-xs text-neutral-500">Today, 9:15 AM</span>
                </div>
              </div>
              
              <div className="border-l-4 border-amber-500 pl-4 py-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-neutral-800">Staff Schedule Updated</h3>
                    <p className="text-sm text-neutral-600">Dr. Wilson's schedule was modified for next week</p>
                  </div>
                  <span className="text-xs text-neutral-500">Yesterday, 4:45 PM</span>
                </div>
              </div>
              
              <div className="border-l-4 border-purple-500 pl-4 py-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-neutral-800">New Service Added</h3>
                    <p className="text-sm text-neutral-600">Added "Dental Wellness Package" to service list</p>
                  </div>
                  <span className="text-xs text-neutral-500">Yesterday, 2:30 PM</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Admin Profile */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <div className="w-16 h-16 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-xl font-bold">
                {user?.name.charAt(0)}
              </div>
              <div className="ml-4">
                <h2 className="text-xl font-bold text-neutral-800">{user?.name}</h2>
                <p className="text-neutral-600">Clinic Administrator</p>
              </div>
            </div>
            <div className="border-t border-neutral-200 pt-4 mt-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <p className="text-neutral-600">ID:</p>
                <p className="text-neutral-800 font-medium">{user?.id}</p>
                <p className="text-neutral-600">Email:</p>
                <p className="text-neutral-800 font-medium">{user?.email}</p>
                <p className="text-neutral-600">Role:</p>
                <p className="text-neutral-800 font-medium">System Administrator</p>
              </div>
            </div>
          </div>

          {/* Service Distribution */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-neutral-800 mb-4 flex items-center">
              <PieChart className="mr-2 h-5 w-5 text-primary-500" />
              Service Distribution
            </h2>
            
            {/* Chart placeholder */}
            <div className="bg-neutral-50 rounded-lg p-4 h-48 flex items-center justify-center mb-4">
              <div className="text-center">
                <PieChart className="h-10 w-10 text-neutral-400 mx-auto mb-2" />
                <p className="text-sm text-neutral-500">Chart Placeholder</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-primary-500 mr-2"></div>
                  <span className="text-sm text-neutral-700">Wellness Exams</span>
                </div>
                <span className="text-sm font-medium text-neutral-800">32%</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                  <span className="text-sm text-neutral-700">Vaccinations</span>
                </div>
                <span className="text-sm font-medium text-neutral-800">24%</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-sm text-neutral-700">Surgeries</span>
                </div>
                <span className="text-sm font-medium text-neutral-800">18%</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
                  <span className="text-sm text-neutral-700">Dental</span>
                </div>
                <span className="text-sm font-medium text-neutral-800">15%</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                  <span className="text-sm text-neutral-700">Other</span>
                </div>
                <span className="text-sm font-medium text-neutral-800">11%</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-neutral-800 mb-4">Admin Actions</h2>
            <div className="space-y-3">
              <Button fullWidth>Staff Management</Button>
              <Button fullWidth variant="outline">Financial Reports</Button>
              <Button fullWidth variant="outline">Inventory Management</Button>
              <Button fullWidth variant="outline" className="flex items-center justify-center">
                <Cog className="mr-2 h-4 w-4" />
                Clinic Settings
              </Button>
            </div>
          </div>

          {/* System Alerts */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-neutral-800 mb-4">System Notifications</h2>
            
            <div className="space-y-4">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <h3 className="font-medium text-amber-800 text-sm">Inventory Alert</h3>
                <p className="text-xs text-amber-700 mt-1">
                  3 items are running low on stock and need to be reordered.
                </p>
                <button className="text-xs text-primary-600 font-medium mt-1">
                  View Inventory
                </button>
              </div>
              
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-medium text-blue-800 text-sm">Software Update</h3>
                <p className="text-xs text-blue-700 mt-1">
                  System update v2.4 is available with new features.
                </p>
                <button className="text-xs text-primary-600 font-medium mt-1">
                  Review Changes
                </button>
              </div>
              
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <h3 className="font-medium text-green-800 text-sm">Staff Reviews</h3>
                <p className="text-xs text-green-700 mt-1">
                  Quarterly staff performance reviews due in 2 weeks.
                </p>
                <button className="text-xs text-primary-600 font-medium mt-1">
                  Schedule Reviews
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;