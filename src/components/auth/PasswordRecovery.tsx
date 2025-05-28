import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { RecoveryFormValues } from '../../types';
import Input from '../common/Input';
import Button from '../common/Button';
import Alert from '../common/Alert';
import { useAuth } from '../../contexts/AuthContext';

const PasswordRecovery: React.FC = () => {
  const { recoverPassword } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RecoveryFormValues>({
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: RecoveryFormValues) => {
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const success = await recoverPassword(data.email);

      if (success) {
        setSubmitStatus({
          type: 'success',
          message: 'Password recovery instructions have been sent to your email.',
        });
      } else {
        setSubmitStatus({
          type: 'error',
          message: 'We couldn\'t find an account with that email address.',
        });
      }
    } catch (error) {
      console.error('Password recovery error:', error);
      setSubmitStatus({
        type: 'error',
        message: 'An unexpected error occurred. Please try again later.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-display font-bold text-center mb-2 text-neutral-800">
          Forgot Password
        </h2>
        <p className="text-neutral-600 text-center mb-6">
          Enter your email address and we'll send you instructions to reset your password.
        </p>

        {submitStatus && (
          <Alert
            type={submitStatus.type}
            message={submitStatus.message}
            onClose={() => setSubmitStatus(null)}
          />
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="relative">
            <Mail
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500"
            />
            <Input
              type="email"
              id="email"
              label="Email"
              placeholder="Enter your email address"
              className="pl-10"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
              error={errors.email?.message}
            />
          </div>

          <Button
            type="submit"
            fullWidth
            isLoading={isSubmitting}
            disabled={isSubmitting}
          >
            Send Reset Link
          </Button>

          <div className="text-center mt-4">
            <Link
              to="/login"
              className="text-sm font-medium text-primary-600 hover:text-primary-500"
            >
              Back to Login
            </Link>
          </div>
        </form>

        <div className="mt-8 border-t border-neutral-200 pt-6">
          <p className="text-sm text-neutral-600 mb-2">For demo purposes, use:</p>
          <div className="bg-neutral-50 rounded p-3 text-xs">
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="font-medium">doctor@example.com</span>
                <span className="text-neutral-500">Doctor</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">receptionist@example.com</span>
                <span className="text-neutral-500">Receptionist</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">admin@example.com</span>
                <span className="text-neutral-500">Administrator</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordRecovery;