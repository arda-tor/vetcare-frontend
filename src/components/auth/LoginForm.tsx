import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { LoginFormValues } from '../../types';
import Input from '../common/Input';
import Button from '../common/Button';
import Alert from '../common/Alert';
import { useAuth } from '../../contexts/AuthContext';

const LoginForm: React.FC<{ onSuccess: (role: string) => void }> = ({ onSuccess }) => {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = async (data: LoginFormValues) => {
    setLoginError(null);
    setIsSubmitting(true);
    
    try {
      const user = await login({
        email: data.email,
        password: data.password,
      });

      if (user) {
        onSuccess(user.role);
      } else {
        setLoginError('Invalid email or password. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('An unexpected error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper text for mock users
  const mockUserHelp = [
    { email: 'doctor@example.com', role: 'Doctor' },
    { email: 'receptionist@example.com', role: 'Receptionist' },
    { email: 'admin@example.com', role: 'Administrator' },
  ];

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-display font-bold text-center mb-6 text-neutral-800">
          Staff Login
        </h2>
        
        {loginError && (
          <Alert
            type="error"
            message={loginError}
            onClose={() => setLoginError(null)}
          />
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <div className="relative">
              <Mail
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500"
              />
              <Input
                type="email"
                id="email"
                label="Email"
                placeholder="Enter your email"
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
          </div>

          <div>
            <div className="relative">
              <Lock
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500"
              />
              <Input
                type={showPassword ? 'text' : 'password'}
                id="password"
                label="Password"
                placeholder="Enter your password"
                className="pl-10 pr-10"
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                })}
                error={errors.password?.message}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="rememberMe"
                type="checkbox"
                className="h-4 w-4 rounded border-neutral-300 text-primary-500 focus:ring-primary-500"
                {...register('rememberMe')}
              />
              <label
                htmlFor="rememberMe"
                className="ml-2 block text-sm text-neutral-700"
              >
                Remember me
              </label>
            </div>
            <Link
              to="/forgot-password"
              className="text-sm font-medium text-primary-600 hover:text-primary-500"
            >
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            fullWidth
            isLoading={isSubmitting}
            disabled={isSubmitting}
          >
            Sign In
          </Button>
        </form>

        <div className="mt-8 border-t border-neutral-200 pt-6">
          <p className="text-sm text-neutral-600 mb-2">For demo purposes, use:</p>
          <div className="bg-neutral-50 rounded p-3 text-xs space-y-1">
            {mockUserHelp.map((user) => (
              <div key={user.email} className="flex justify-between">
                <span className="font-medium">{user.email}</span>
                <span className="text-neutral-500">{user.role}</span>
              </div>
            ))}
            <p className="text-neutral-500 pt-1">Use any password</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;