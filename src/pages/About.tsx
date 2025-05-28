import React from 'react';
import { Calendar, Heart, Stethoscope, Trophy } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="pt-24">
      {/* Hero Section */}
      <section className="py-16 md:py-20 bg-neutral-50">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-neutral-800 mb-6">
              About PetCare Clinic
            </h1>
            <p className="text-xl text-neutral-600 leading-relaxed">
              Founded with a mission to provide exceptional veterinary care with compassion and integrity, 
              we've been serving our community's pets for over 15 years.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-display font-bold text-neutral-800 mb-6">
                Our Story
              </h2>
              <p className="text-neutral-700 mb-4 leading-relaxed">
                PetCare Clinic was established in 2010 by Dr. Sarah Johnson, a veterinarian with a vision of 
                creating a practice where pets receive the highest standard of medical care in a stress-free 
                environment. What began as a small practice has grown into a full-service veterinary center 
                serving thousands of pets annually.
              </p>
              <p className="text-neutral-700 mb-4 leading-relaxed">
                Over the years, we've expanded our facilities and team to meet the growing needs of our 
                community, but our core values remain unchanged: exceptional medicine, genuine compassion, 
                and open communication with pet owners.
              </p>
              <p className="text-neutral-700 leading-relaxed">
                Today, our team of veterinarians, technicians, and support staff work together to provide 
                comprehensive healthcare throughout every stage of your pet's life.
              </p>
            </div>
            <div className="rounded-lg overflow-hidden shadow-lg">
              <img 
                src="https://images.pexels.com/photos/7469214/pexels-photo-7469214.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="Veterinarian with cat" 
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 md:py-20 bg-primary-50">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-neutral-800 mb-4">
              Our Core Values
            </h2>
            <p className="text-lg text-neutral-600">
              These principles guide every interaction and decision at PetCare Clinic.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-100 text-primary-600">
                <Heart className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-neutral-800 mb-2">Compassion</h3>
              <p className="text-neutral-600">
                We treat every pet with the same care and attention we would want for our own animals.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-100 text-primary-600">
                <Stethoscope className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-neutral-800 mb-2">Excellence</h3>
              <p className="text-neutral-600">
                We are committed to providing the highest standard of veterinary medicine.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-100 text-primary-600">
                <Calendar className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-neutral-800 mb-2">Availability</h3>
              <p className="text-neutral-600">
                We strive to be there when you need us, with extended hours and emergency services.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-100 text-primary-600">
                <Trophy className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-neutral-800 mb-2">Integrity</h3>
              <p className="text-neutral-600">
                We provide honest recommendations based solely on the needs of your pet.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Meet Our Team */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-neutral-800 mb-4">
              Meet Our Team
            </h2>
            <p className="text-lg text-neutral-600">
              Our experienced staff is passionate about animal health and dedicated to providing exceptional care.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <img 
                src="https://images.pexels.com/photos/5272933/pexels-photo-5272933.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="Dr. Sarah Johnson" 
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-neutral-800 mb-1">Dr. Sarah Johnson</h3>
                <p className="text-primary-600 mb-3">Founder & Chief Veterinarian</p>
                <p className="text-neutral-600">
                  Dr. Johnson has over 20 years of experience in small animal medicine and is passionate about preventative care and senior pet wellness.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <img 
                src="https://images.pexels.com/photos/6234600/pexels-photo-6234600.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="Dr. Michael Clark" 
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-neutral-800 mb-1">Dr. Michael Clark</h3>
                <p className="text-primary-600 mb-3">Veterinary Surgeon</p>
                <p className="text-neutral-600">
                  Specializing in orthopedics and soft tissue surgery, Dr. Clark brings advanced surgical skills to our practice.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <img 
                src="https://images.pexels.com/photos/6234973/pexels-photo-6234973.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="Emily Davis" 
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-neutral-800 mb-1">Emily Davis</h3>
                <p className="text-primary-600 mb-3">Head Veterinary Technician</p>
                <p className="text-neutral-600">
                  With her gentle approach and technical expertise, Emily ensures that all patients receive outstanding nursing care.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Facilities */}
      <section className="py-16 md:py-20 bg-neutral-50">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <div className="grid grid-cols-2 gap-4">
                <img 
                  src="https://images.pexels.com/photos/5731866/pexels-photo-5731866.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                  alt="Modern examination room" 
                  className="rounded-lg w-full h-48 object-cover"
                />
                <img 
                  src="https://images.pexels.com/photos/7469441/pexels-photo-7469441.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                  alt="Laboratory equipment" 
                  className="rounded-lg w-full h-48 object-cover"
                />
                <img 
                  src="https://images.pexels.com/photos/6235050/pexels-photo-6235050.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                  alt="Surgical suite" 
                  className="rounded-lg w-full h-48 object-cover"
                />
                <img 
                  src="https://images.pexels.com/photos/6235052/pexels-photo-6235052.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                  alt="Dental station" 
                  className="rounded-lg w-full h-48 object-cover"
                />
              </div>
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-3xl font-display font-bold text-neutral-800 mb-6">
                Our State-of-the-Art Facilities
              </h2>
              <p className="text-neutral-700 mb-4 leading-relaxed">
                Our clinic is equipped with advanced diagnostic and treatment technologies to provide comprehensive care for your pet. Our facilities include:
              </p>
              <ul className="space-y-2 text-neutral-700 mb-6">
                <li className="flex items-start">
                  <span className="text-primary-500 mr-2">•</span>
                  Modern examination rooms designed for comfort
                </li>
                <li className="flex items-start">
                  <span className="text-primary-500 mr-2">•</span>
                  Digital radiography for immediate diagnostic results
                </li>
                <li className="flex items-start">
                  <span className="text-primary-500 mr-2">•</span>
                  In-house laboratory for rapid test results
                </li>
                <li className="flex items-start">
                  <span className="text-primary-500 mr-2">•</span>
                  Fully-equipped surgical suite
                </li>
                <li className="flex items-start">
                  <span className="text-primary-500 mr-2">•</span>
                  Dental suite with digital dental radiography
                </li>
                <li className="flex items-start">
                  <span className="text-primary-500 mr-2">•</span>
                  Separate dog and cat waiting areas to reduce stress
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;