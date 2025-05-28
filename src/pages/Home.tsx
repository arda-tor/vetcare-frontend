import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Phone, Shield, Award, Users } from 'lucide-react';
import Button from '../components/common/Button';

const Home: React.FC = () => {
  const features = [
    {
      icon: <Calendar className="h-10 w-10 text-primary-500" />,
      title: 'Online Scheduling',
      description: 'Book appointments easily through our online portal, available 24/7 for your convenience.',
    },
    {
      icon: <Clock className="h-10 w-10 text-primary-500" />,
      title: 'Extended Hours',
      description: 'We offer extended evening and weekend hours to accommodate your busy schedule.',
    },
    {
      icon: <Phone className="h-10 w-10 text-primary-500" />,
      title: 'Emergency Care',
      description: '24/7 emergency services available for your pet when urgent care is needed.',
    },
    {
      icon: <Shield className="h-10 w-10 text-primary-500" />,
      title: 'Preventative Care',
      description: 'Comprehensive wellness plans to keep your pets healthy and happy for years to come.',
    },
    {
      icon: <Award className="h-10 w-10 text-primary-500" />,
      title: 'Expert Veterinarians',
      description: 'Our team of board-certified veterinarians provide the highest quality care.',
    },
    {
      icon: <Users className="h-10 w-10 text-primary-500" />,
      title: 'Compassionate Staff',
      description: 'Friendly staff dedicated to making you and your pet feel comfortable and cared for.',
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section 
        className="min-h-[85vh] flex items-center relative overflow-hidden bg-gradient-to-r from-primary-600 to-primary-700 pt-24"
      >
        <div className="absolute inset-0 bg-black opacity-30 z-10"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{ 
            backgroundImage: "url('https://images.pexels.com/photos/6235233/pexels-photo-6235233.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')" 
          }}
        ></div>
        <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-20">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-6 leading-tight">
              Compassionate Pet Care You Can Trust
            </h1>
            <p className="text-xl text-white mb-8 max-w-2xl">
              Our dedicated team of veterinary professionals is committed to providing the highest quality care for your beloved pets.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/contact">
                <Button size="lg">Schedule an Appointment</Button>
              </Link>
              <Link to="/about">
                <Button variant="outline" size="lg" className="bg-white/10 text-white border-white">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-800 mb-4">
              Our Services
            </h2>
            <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
              We offer a comprehensive range of veterinary services to keep your pets healthy and happy throughout all stages of their lives.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md p-8 transition-transform hover:translate-y-[-8px] hover:shadow-lg"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-neutral-800 mb-3">{feature.title}</h3>
                <p className="text-neutral-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-neutral-50">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-800 mb-4">
              What Our Clients Say
            </h2>
            <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
              Hear from pet owners who trust us with the health and wellbeing of their beloved companions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-xl font-bold">
                  S
                </div>
                <div className="ml-4">
                  <h4 className="font-bold">Sarah Thompson</h4>
                  <p className="text-sm text-neutral-500">Dog Owner</p>
                </div>
              </div>
              <p className="text-neutral-700 italic">
                "Dr. Johnson is amazing with my anxious rescue dog. Her patience and expertise have made a world of difference. The entire staff is so caring, and I appreciate their thorough explanations of all treatments."
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-secondary-100 text-secondary-600 flex items-center justify-center text-xl font-bold">
                  M
                </div>
                <div className="ml-4">
                  <h4 className="font-bold">Michael Garcia</h4>
                  <p className="text-sm text-neutral-500">Cat Owner</p>
                </div>
              </div>
              <p className="text-neutral-700 italic">
                "I've been bringing my three cats here for years. The clinic is always clean, the staff is friendly, and I feel like my pets receive the best possible care. Their preventative care programs have kept my older cat healthy into her senior years."
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-accent-100 text-accent-600 flex items-center justify-center text-xl font-bold">
                  J
                </div>
                <div className="ml-4">
                  <h4 className="font-bold">Jennifer Wilson</h4>
                  <p className="text-sm text-neutral-500">Multiple Pets</p>
                </div>
              </div>
              <p className="text-neutral-700 italic">
                "When my rabbit needed emergency surgery, PetCare Clinic was there for us. They not only saved his life but made the experience less stressful for both of us. I now bring all my pets here and recommend them to everyone I know."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">Ready to Schedule an Appointment?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Whether it's time for a regular check-up or your pet needs special attention, we're here to help.
          </p>
          <Link to="/contact">
            <Button size="lg" variant="secondary">
              Contact Us Today
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;