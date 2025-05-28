import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';

interface ContactFormValues {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

const Contact: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // In a real application, you would send this data to your backend
      // For demo purposes, we'll simulate a successful submission
      console.log('Form data:', data);
      
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      setSubmitStatus({
        type: 'success',
        message: 'Your message has been sent successfully. We will contact you soon!',
      });
      
      // Reset form after successful submission
      reset();
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus({
        type: 'error',
        message: 'An error occurred while sending your message. Please try again later.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-24">
      {/* Hero Section */}
      <section className="py-16 md:py-20 bg-neutral-50">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-neutral-800 mb-6">
              Contact Us
            </h1>
            <p className="text-xl text-neutral-600">
              Have questions or need to schedule an appointment? We're here to help.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info and Form */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <h2 className="text-2xl font-display font-bold text-neutral-800 mb-6">
                Get in Touch
              </h2>
              <p className="text-neutral-700 mb-8 leading-relaxed">
                Whether you have questions about our services, need to schedule an appointment, or are facing a pet 
                emergency, our team is ready to assist you. Here's how you can reach us:
              </p>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="mt-1 mr-4 flex-shrink-0 bg-primary-100 rounded-full p-3 text-primary-600">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-neutral-800">Phone</h3>
                    <p className="text-neutral-600">Main: (555) 123-4567</p>
                    <p className="text-neutral-600">Emergency: (555) 987-6543</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="mt-1 mr-4 flex-shrink-0 bg-primary-100 rounded-full p-3 text-primary-600">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-neutral-800">Email</h3>
                    <p className="text-neutral-600">General Inquiries: info@petcareclinic.com</p>
                    <p className="text-neutral-600">Appointments: appointments@petcareclinic.com</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="mt-1 mr-4 flex-shrink-0 bg-primary-100 rounded-full p-3 text-primary-600">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-neutral-800">Location</h3>
                    <p className="text-neutral-600">123 Pet Health Street</p>
                    <p className="text-neutral-600">Veterinary District, CA 90210</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="mt-1 mr-4 flex-shrink-0 bg-primary-100 rounded-full p-3 text-primary-600">
                    <Clock className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-neutral-800">Hours</h3>
                    <div className="grid grid-cols-2 gap-2 text-neutral-600">
                      <p>Monday - Friday:</p>
                      <p>8:00 AM - 7:00 PM</p>
                      <p>Saturday:</p>
                      <p>9:00 AM - 5:00 PM</p>
                      <p>Sunday:</p>
                      <p>10:00 AM - 3:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-display font-bold text-neutral-800 mb-6">
                Send Us a Message
              </h2>

              {submitStatus && (
                <Alert
                  type={submitStatus.type}
                  message={submitStatus.message}
                  onClose={() => setSubmitStatus(null)}
                />
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                  label="Your Name"
                  placeholder="Enter your full name"
                  {...register('name', {
                    required: 'Name is required',
                  })}
                  error={errors.name?.message}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Email"
                    type="email"
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

                  <Input
                    label="Phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    {...register('phone', {
                      pattern: {
                        value: /^[0-9-+().\s]*$/,
                        message: 'Invalid phone number',
                      },
                    })}
                    error={errors.phone?.message}
                  />
                </div>

                <Input
                  label="Subject"
                  placeholder="What is your message about?"
                  {...register('subject', {
                    required: 'Subject is required',
                  })}
                  error={errors.subject?.message}
                />

                <div className="mb-4">
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-neutral-700 mb-1"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    className={`
                      block w-full rounded-md border-neutral-300 shadow-sm
                      focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50
                      ${errors.message ? 'border-red-500' : 'border-neutral-300'}
                      p-3
                    `}
                    placeholder="How can we help you?"
                    {...register('message', {
                      required: 'Message is required',
                      minLength: {
                        value: 10,
                        message: 'Message should be at least 10 characters',
                      },
                    })}
                  ></textarea>
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-500">{errors.message.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  fullWidth
                  isLoading={isSubmitting}
                  disabled={isSubmitting}
                >
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 md:py-20 bg-neutral-50">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-neutral-800 mb-4">
              Find Us
            </h2>
            <p className="text-lg text-neutral-600">
              We're conveniently located in the heart of Veterinary District.
            </p>
          </div>

          <div className="rounded-lg overflow-hidden shadow-md h-96 bg-white">
            {/* For a real implementation, replace with a Google Maps or similar component */}
            <div className="w-full h-full bg-neutral-200 flex items-center justify-center">
              <div className="text-center p-8">
                <MapPin className="h-12 w-12 text-primary-500 mx-auto mb-4" />
                <p className="text-lg font-medium text-neutral-800">Map Placeholder</p>
                <p className="text-neutral-600">123 Pet Health Street, Veterinary District, CA 90210</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;