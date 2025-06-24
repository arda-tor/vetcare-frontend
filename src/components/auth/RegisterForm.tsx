// src/components/auth/RegisterForm.tsx

import React from 'react';
import { useForm } from 'react-hook-form';
import { RegisterFormValues } from '../../types'; // RegisterFormValues hala aynı kalıyor
import Input from '../common/Input';
import Button from '../common/Button';
import Alert from '../common/Alert';
import { useAuth } from '../../contexts/AuthContext';
import { AxiosError } from 'axios'; // AxiosError'u import edin

const RegisterForm: React.FC<{ onSuccess: (role: string) => void }> = ({ onSuccess }) => {
    const { register: registerUser } = useAuth();
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isValid } // isValid eklendi, opsiyonel olarak kullanılabilir
    } = useForm<RegisterFormValues>({
        defaultValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: ''
        }
    });
    const [submitError, setSubmitError] = React.useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const onSubmit = async (data: RegisterFormValues) => {
        setSubmitError(null);
        if (data.password !== data.confirmPassword) {
            setSubmitError('Passwords do not match.');
            return;
        }
        setIsSubmitting(true);
        try {
            // Laravel'in 'confirmed' kuralı için password_confirmation beklediğini varsayarak
            const user = await registerUser({
                name: data.name,
                email: data.email,
                password: data.password,
                password_confirmation: data.confirmPassword // Bu alan Laravel'e gönderiliyor
            });

            if (user) {
                onSuccess(user.roles[0].name);
            } else {
                setSubmitError('Registration failed. Please try again.');
            }
        } catch (err) {
            console.error('Registration error:', err);
            // Axios hatası olup olmadığını kontrol edin ve detayları gösterin
            if (err instanceof AxiosError && err.response?.status === 422) {
                const errorData = err.response.data;
                if (errorData.errors) {
                    // Laravel'den gelen doğrulama hatalarını göster
                    const errorMessages = Object.values(errorData.errors).flat().join(' ');
                    setSubmitError(`Validation Error: ${errorMessages}`);
                } else {
                    setSubmitError('Registration failed due to invalid data. Please check your inputs.');
                }
            } else {
                setSubmitError('An unexpected error occurred. Please try again later.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full max-w-md">
            <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-display font-bold text-center mb-6 text-neutral-800">
                    Register
                </h2>

                {submitError && (
                    <Alert type="error" message={submitError} onClose={() => setSubmitError(null)} />
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Input
                        type="text"
                        id="name"
                        label="Name"
                        placeholder="Enter your full name"
                        {...register('name', { required: 'Name is required' })}
                        error={errors.name?.message}
                    />

                    <Input
                        type="email"
                        id="email"
                        label="Email"
                        placeholder="Enter your email"
                        {...register('email', {
                            required: 'Email is required',
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: 'Invalid email address'
                            }
                        })}
                        error={errors.email?.message}
                    />

                    <Input
                        type="password"
                        id="password"
                        label="Password"
                        placeholder="Enter a password"
                        {...register('password', {
                            required: 'Password is required',
                            minLength: {
                                value: 6,
                                message: 'Password must be at least 6 characters'
                            }
                        })}
                        error={errors.password?.message}
                    />

                    <Input
                        type="password"
                        id="confirmPassword"
                        label="Confirm Password"
                        placeholder="Re-enter your password"
                        {...register('confirmPassword', {
                            required: 'Please confirm your password',
                            validate: (value) => value === watch('password') || 'Passwords do not match'
                        })}
                        error={errors.confirmPassword?.message}
                    />

                    {/* isValid kontrolü ile butonu daha akıllı hale getirebilirsiniz. */}
                    <Button type="submit" fullWidth isLoading={isSubmitting} disabled={isSubmitting || !isValid}>
                        Sign Up
                    </Button>

                    <p className="text-center text-sm text-neutral-600 mt-4">
                        Already have an account?{' '}
                        <a href="/login" className="font-medium text-primary-600 hover:text-primary-500">
                            Login here
                        </a>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default RegisterForm;