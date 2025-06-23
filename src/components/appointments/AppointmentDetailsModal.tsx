import React, { useState } from 'react';
import { X, Calendar, Clock, User, PawPrint, FileText, AlertTriangle } from 'lucide-react';
import Button from '../common/Button';
import { UpcomingAppointment } from '../../types';
import api from '../../lib/axios';

interface AppointmentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: UpcomingAppointment | null;
  onAppointmentCancelled: (appointmentId: number) => void;
}

const AppointmentDetailsModal: React.FC<AppointmentDetailsModalProps> = ({
  isOpen,
  onClose,
  appointment,
  onAppointmentCancelled,
}) => {
  const [isCancelling, setIsCancelling] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  if (!isOpen || !appointment) {
    return null;
  }

  const formatDateTime = (datetime: string) => {
    const date = new Date(datetime);
    return {
      date: date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }),
    };
  };

  const startDateTime = formatDateTime(appointment.start_datetime);
  const endDateTime = formatDateTime(appointment.end_datetime);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'in_progress':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'completed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const canCancelAppointment = () => {
    return ['pending', 'scheduled', 'confirmed'].includes(appointment.status);
  };

  const handleCancelAppointment = async () => {
    setIsCancelling(true);
    try {
      await api.patch(`/appointments/${appointment.id}/cancel`);
      onAppointmentCancelled(appointment.id);
      setShowCancelConfirm(false);
      onClose();
    } catch (err: any) {
      console.error('Error cancelling appointment:', err);
      alert(err.response?.data?.message || 'Failed to cancel appointment');
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Appointment Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status Badge */}
          <div className="flex items-center justify-center">
            <span
              className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(
                appointment.status
              )}`}
            >
              {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
            </span>
          </div>

          {/* Appointment Time */}
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Calendar className="h-5 w-5 text-blue-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">When</h3>
            </div>
            <div className="text-gray-700">
              <p className="font-medium">{startDateTime.date}</p>
              <div className="flex items-center mt-1">
                <Clock className="h-4 w-4 text-gray-500 mr-1" />
                <span>
                  {startDateTime.time} - {endDateTime.time} ({appointment.duration} minutes)
                </span>
              </div>
            </div>
          </div>

          {/* Doctor Information */}
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <User className="h-5 w-5 text-green-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Doctor</h3>
            </div>
            <div className="text-gray-700">
              <p className="font-medium">{appointment.doctor_name}</p>
              <p className="text-sm text-gray-600">{appointment.doctor_specialization}</p>
            </div>
          </div>

          {/* Pet Information */}
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <PawPrint className="h-5 w-5 text-purple-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Pet</h3>
            </div>
            <div className="text-gray-700">
              <p className="font-medium">{appointment.pet_name}</p>
              <p className="text-sm text-gray-600">
                {appointment.pet_species} - {appointment.pet_breed}
              </p>
            </div>
          </div>

          {/* Appointment Details */}
          <div className="bg-orange-50 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <FileText className="h-5 w-5 text-orange-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Appointment Details</h3>
            </div>
            <div className="text-gray-700 space-y-2">
              <div>
                <span className="font-medium">Type:</span>{' '}
                <span className="capitalize">{appointment.appointment_type}</span>
              </div>
              <div>
                <span className="font-medium">Duration:</span> {appointment.duration} minutes
              </div>
              {appointment.notes && (
                <div>
                  <span className="font-medium">Notes:</span>
                  <p className="mt-1 text-sm bg-white p-2 rounded border">
                    {appointment.notes}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Appointment Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <span className="font-medium">Created:</span>{' '}
              {new Date(appointment.created_at).toLocaleDateString()}
            </div>
            <div>
              <span className="font-medium">Last Updated:</span>{' '}
              {new Date(appointment.updated_at).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div>
            {canCancelAppointment() && (
              <Button
                variant="outline"
                onClick={() => setShowCancelConfirm(true)}
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                Cancel Appointment
              </Button>
            )}
          </div>
          <div className="space-x-3">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-60 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Cancel Appointment</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to cancel this appointment with {appointment.doctor_name} on{' '}
              {startDateTime.date} at {startDateTime.time}? This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowCancelConfirm(false)}
                className="flex-1"
              >
                Keep Appointment
              </Button>
              <Button
                onClick={handleCancelAppointment}
                isLoading={isCancelling}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                Yes, Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentDetailsModal; 