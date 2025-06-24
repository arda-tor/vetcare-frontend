import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import api from '../lib/axios';
import { useAuth } from '../contexts/AuthContext';
import { CalendarDay, CalendarResponse, TimeSlot, AvailableDoctor, AvailableDoctorsResponse, Pet } from '../types';

const Calendar: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [availableDates, setAvailableDates] = useState<CalendarDay[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Doctor selection state
  const [selectedSlot, setSelectedSlot] = useState<{
    date: string;
    time: string;
    time_range: string;
  } | null>(null);
  const [availableDoctors, setAvailableDoctors] = useState<AvailableDoctor[]>([]);
  const [isDoctorsLoading, setIsDoctorsLoading] = useState(false);
  const [doctorsError, setDoctorsError] = useState('');
  
  // Appointment booking state
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<AvailableDoctor | null>(null);
  const [userPets, setUserPets] = useState<Pet[]>([]);
  const [isPetsLoading, setIsPetsLoading] = useState(false);
  const [isBookingLoading, setIsBookingLoading] = useState(false);
  const [appointmentForm, setAppointmentForm] = useState({
    pet_id: '',
    appointment_type: '',
    duration: 30,
    notes: '',
  });

  // Set default dates (today and 1 day from today)
  useEffect(() => {
    const today = new Date();
  
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
  
    const dayAfterTomorrow = new Date();
    dayAfterTomorrow.setDate(today.getDate() + 2);
  
    setStartDate(tomorrow.toISOString().split('T')[0]);
    setEndDate(dayAfterTomorrow.toISOString().split('T')[0]);
  }, []);
  

  const fetchAvailableDates = async () => {
    if (!startDate || !endDate) {
      setError('Please select both start and end dates');
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      setError('Start date cannot be after end date');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await api.get<CalendarResponse>('/calendar', {
        params: {
          start_date: startDate,
          end_date: endDate,
        },
      });
      console.log(response.data);
      setAvailableDates(response.data.data.calendar || []);
    } catch (err: any) {
      console.error('Error fetching calendar data:', err);
      setError(err.response?.data?.message || 'Failed to fetch calendar data');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAvailableDoctors = async (date: string, time: string, timeRange: string) => {
    setIsDoctorsLoading(true);
    setDoctorsError('');
    setSelectedSlot({ date, time, time_range: timeRange });

    try {
      const response = await api.get<AvailableDoctorsResponse>('/available-doctors', {
        params: {
          date: date,
          time: time,
        },
      });
      console.log('Available doctors:', response.data);
      setAvailableDoctors(response.data.data.doctors || []);
    } catch (err: any) {
      console.error('Error fetching available doctors:', err);
      setDoctorsError(err.response?.data?.message || 'Failed to fetch available doctors');
    } finally {
      setIsDoctorsLoading(false);
    }
  };

  const fetchUserPets = async () => {
    setIsPetsLoading(true);
    try {
      const response = await api.get('/pets');
      console.log('User pets:', response.data);
      setUserPets(response.data.data.pets || response.data || []);
    } catch (err: any) {
      console.error('Error fetching user pets:', err);
    } finally {
      setIsPetsLoading(false);
    }
  };

  const handleDoctorSelection = (doctor: AvailableDoctor) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setSelectedDoctor(doctor);
    setShowAppointmentForm(true);
    fetchUserPets();
  };

  const handleAppointmentSubmission = async () => {
    if (!selectedDoctor || !selectedSlot) return;

    setIsBookingLoading(true);
    try {
      const appointmentData = {
        doctor_id: selectedDoctor.id,
        pet_id: parseInt(appointmentForm.pet_id),
        date: selectedSlot.date,
        time: selectedSlot.time,
        appointment_type: appointmentForm.appointment_type,
        duration: appointmentForm.duration,
        notes: appointmentForm.notes || null,
      };

      console.log('Booking appointment:', appointmentData);
      const response = await api.post('/appointments', appointmentData);
      console.log('Appointment booked successfully:', response.data);

      // Reset form and close modal
      setShowAppointmentForm(false);
      setSelectedDoctor(null);
      setAppointmentForm({
        pet_id: '',
        appointment_type: '',
        duration: 30,
        notes: '',
      });

      // Show success message or redirect
      alert('Appointment booked successfully!');

    } catch (err: any) {
      console.error('Error booking appointment:', err);
      alert(err.response?.data?.message || 'Failed to book appointment');
    } finally {
      setIsBookingLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getDayOfWeek = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  const getDateNumber = (dateString: string) => {
    const date = new Date(dateString);
    return date.getDate();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Appointment Calendar
          </h1>
          <p className="text-gray-600">
            Select a date range to view available appointment slots
          </p>
        </div>

        {/* Date Selection Form */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Select Date Range
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center justify-center">
            <Input
              type="date"
              label="Start Date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
            
            <Input
              type="date"
              label="End Date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate || new Date().toISOString().split('T')[0]}
            />
            
            <Button
              onClick={fetchAvailableDates}
              isLoading={isLoading}
              className="h-fit"
            >
              Search Available Dates
            </Button>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}
        </div>

        {/* Calendar Grid */}
        {availableDates.length > 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Available Appointment Dates
            </h2>
            
            <div className="grid grid-cols-1 gap-6">
              {availableDates.map((day) => (
                <div
                  key={day.date}
                  className="bg-white border-2 border-green-200 rounded-lg p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {day.day_name}, {formatDate(day.date)}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {day.total_available_slots} total available slots
                      </p>
                    </div>
                    <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      Available
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {day.available_slots.map((slot) => (
                      <div
                        key={slot.time}
                        onClick={() => fetchAvailableDoctors(day.date, slot.time, slot.time_range)}
                        className={`
                          bg-gray-50 border border-gray-200 rounded-lg p-3 transition-colors cursor-pointer
                          hover:bg-green-50 hover:border-green-300
                          ${selectedSlot?.date === day.date && selectedSlot?.time === slot.time 
                            ? 'bg-green-100 border-green-400 ring-2 ring-green-200' 
                            : ''}
                        `}
                      >
                        <div className="text-sm font-medium text-gray-900 mb-1">
                          {slot.time}
                        </div>
                        <div className="text-xs text-gray-600 mb-2">
                          {slot.time_range}
                        </div>
                        <div className="text-xs">
                          <span className="text-green-600 font-medium">
                            {slot.available_count}
                          </span>
                          <span className="text-gray-500">
                            /{slot.total_doctors} doctors
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-center py-12">
              <div className="text-gray-400 mb-2">
                <svg
                  className="mx-auto h-12 w-12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <p className="text-gray-500">No available dates found in the selected range</p>
              <p className="text-gray-400 text-sm mt-2">Try selecting a different date range or check back later</p>
            </div>
          </div>
        )}

        {/* Available Doctors Section */}
        {selectedSlot && (
          <div className="bg-white rounded-lg shadow-sm p-6 mt-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Available Doctors
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {formatDate(selectedSlot.date)} at {selectedSlot.time_range}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedSlot(null);
                  setAvailableDoctors([]);
                }}
              >
                Close
              </Button>
            </div>

            {isDoctorsLoading ? (
              <div className="text-center py-8">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
                <p className="text-gray-600 mt-2">Loading available doctors...</p>
              </div>
            ) : doctorsError ? (
              <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-700 text-sm">{doctorsError}</p>
              </div>
            ) : availableDoctors.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableDoctors.map((doctor) => (
                  <div
                    key={doctor.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-green-300 hover:bg-green-50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-medium text-gray-900">{doctor.name}</h3>
                        <p className="text-sm text-blue-600 font-medium">
                          {doctor.specialization}
                        </p>
                      </div>
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-green-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>
                    </div>
                    
                    {doctor.email && (
                      <p className="text-xs text-gray-600 mb-1">
                        📧 {doctor.email}
                      </p>
                    )}
                    
                    {doctor.license_number && (
                      <p className="text-xs text-gray-600 mb-3">
                        🆔 License: {doctor.license_number}
                      </p>
                    )}

                                         <Button
                       size="sm"
                       fullWidth
                       onClick={() => handleDoctorSelection(doctor)}
                     >
                       Select Doctor
                     </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-400 mb-2">
                  <svg
                    className="mx-auto h-12 w-12"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <p className="text-gray-500">No doctors available for this time slot</p>
              </div>
            )}
          </div>
        )}

        {/* Appointment Booking Form Modal */}
        {showAppointmentForm && selectedDoctor && selectedSlot && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Book Appointment
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowAppointmentForm(false);
                    setSelectedDoctor(null);
                  }}
                >
                  ×
                </Button>
              </div>

              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">
                  <strong>Doctor:</strong> {selectedDoctor.name}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  <strong>Specialization:</strong> {selectedDoctor.specialization}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  <strong>Date:</strong> {formatDate(selectedSlot.date)}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Time:</strong> {selectedSlot.time_range}
                </p>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAppointmentSubmission();
                }}
                className="space-y-4"
              >
                {/* Pet Selection */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Select Pet *
                  </label>
                  {isPetsLoading ? (
                    <div className="flex items-center justify-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500"></div>
                    </div>
                  ) : (
                    <select
                      value={appointmentForm.pet_id}
                      onChange={(e) =>
                        setAppointmentForm({ ...appointmentForm, pet_id: e.target.value })
                      }
                      required
                      className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50 px-4 py-2"
                    >
                      <option value="">Choose a pet...</option>
                      {userPets.map((pet) => (
                        <option key={pet.id} value={pet.id}>
                          {pet.name} ({pet.species} - {pet.breed || 'Unknown breed'})
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Appointment Type */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Appointment Type *
                  </label>
                  <select
                    value={appointmentForm.appointment_type}
                    onChange={(e) =>
                      setAppointmentForm({ ...appointmentForm, appointment_type: e.target.value })
                    }
                    required
                    className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50 px-4 py-2"
                  >
                    <option value="">Select type...</option>
                    <option value="regular">Regular</option>
                    <option value="emergency">Emergency</option>
                    <option value="surgery">Surgery</option>
                    <option value="vaccination">Vaccination</option>
                    <option value="checkup">Checkup</option>
                    <option value="consultation">Consultation</option>
                  </select>
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Duration (minutes) *
                  </label>
                  <select
                    value={appointmentForm.duration}
                    onChange={(e) =>
                      setAppointmentForm({ ...appointmentForm, duration: parseInt(e.target.value) })
                    }
                    required
                    className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50 px-4 py-2"
                  >
                    <option value={15}>15 minutes</option>
                    <option value={20}>20 minutes</option>
                    <option value={30}>30 minutes</option>
                    <option value={45}>45 minutes</option>
                    <option value={60}>1 hour</option>
                    <option value={90}>1.5 hours</option>
                    <option value={120}>2 hours</option>
                  </select>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Notes (Optional)
                  </label>
                  <textarea
                    value={appointmentForm.notes}
                    onChange={(e) =>
                      setAppointmentForm({ ...appointmentForm, notes: e.target.value })
                    }
                    rows={3}
                    maxLength={1000}
                    placeholder="Any additional information about the appointment..."
                    className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50 px-4 py-2"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {appointmentForm.notes.length}/1000 characters
                  </p>
                </div>

                {/* Form Actions */}
                <div className="flex space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    fullWidth
                    onClick={() => {
                      setShowAppointmentForm(false);
                      setSelectedDoctor(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    fullWidth
                    isLoading={isBookingLoading}
                    disabled={
                      !appointmentForm.pet_id ||
                      !appointmentForm.appointment_type ||
                      isBookingLoading
                    }
                  >
                    Book Appointment
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-900 mb-2">
            How to use the calendar
          </h3>
          <ul className="text-blue-800 text-sm space-y-1">
            <li>• Select your preferred start and end dates</li>
            <li>• Click "Search Available Dates" to see available appointment slots</li>
            <li>• Click on a time slot to see available doctors</li>
            <li>• Click "Select Doctor" to book an appointment (login required)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Calendar; 