import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { RecoveryFormValues } from '../../types';
import Input from '../common/Input';
import Button from '../common/Button';
import Alert from '../common/Alert';
import { useAuth } from '../../contexts/AuthContext';

const PasswordRecoveryForm: React.FC = () => {
  const { recoverPassword } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    try {
      const success = await recoverPassword(data.email);
      if (success) {
        setSuccessMessage('Recovery email sent. Please check your inbox.');
      } else {
        setErrorMessage('No account found with this email.');
      }
    } catch (error) {
      console.error('Password recovery error:', error);
      setErrorMessage('An error occurred while sending the recovery email.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-display font-bold text-center mb-6 text-neutral-800">
          Recover Password
        </h2>

        {errorMessage && <Alert type="error" message={errorMessage} onClose={() => setErrorMessage(null)} />}
        {successMessage && <Alert type="success" message={successMessage} onClose={() => setSuccessMessage(null)} />}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            type="email"
            id="email"
            label="Email"
            placeholder="Enter your email"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            })}
            error={errors.email?.message}
          />

          <Button type="submit" fullWidth isLoading={isSubmitting} disabled={isSubmitting}>
            Send Recovery Email
          </Button>
        </form>
      </div>
    </div>
  );
};

export default PasswordRecoveryForm;
