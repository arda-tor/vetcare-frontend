import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-neutral-800 text-neutral-100 pt-12 pb-8">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="flex items-center text-primary-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-heart-handshake"
                >
                  <path d="M19 6c0-1.7-1.3-3-3-3h-2.9a3 3 0 0 0-2.1.9L10.5 5" />
                  <path d="M5 6c0-1.7 1.3-3 3-3h2.9a3 3 0 0 1 2.1.9L13.5 5" />
                  <path d="M3 14c0 3 2 6 6 6" />
                  <path d="M21 14c0 3-2 6-6 6" />
                  <path d="M12 13a3 3 0 0 0-2.1-.9H5a3 3 0 0 0 0 6h3" />
                  <path d="M12 13a3 3 0 0 1 2.1-.9H19a3 3 0 0 1 0 6h-3" />
                  <path d="M7.5 18.5 7 19" />
                  <path d="m16.5 18.5.5.5" />
                  <path d="M3 14h11" />
                  <path d="M10 14h11" />
                </svg>
              </div>
              <span className="text-lg font-display font-bold">PetCare Clinic</span>
            </Link>
            <p className="text-sm text-neutral-400 mb-6 leading-relaxed">
              Providing compassionate veterinary care for your beloved pets since 2010. Our team of dedicated professionals is committed to your pet's health and wellbeing.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-neutral-400 hover:text-primary-400 transition-colors"
              >
                <Facebook size={20} />
                <span className="sr-only">Facebook</span>
              </a>
              <a
                href="#"
                className="text-neutral-400 hover:text-primary-400 transition-colors"
              >
                <Instagram size={20} />
                <span className="sr-only">Instagram</span>
              </a>
              <a
                href="#"
                className="text-neutral-400 hover:text-primary-400 transition-colors"
              >
                <Twitter size={20} />
                <span className="sr-only">Twitter</span>
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-neutral-400 hover:text-primary-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-neutral-400 hover:text-primary-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-neutral-400 hover:text-primary-400 transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-neutral-400 hover:text-primary-400 transition-colors">
                  Staff Login
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-lg mb-4">Our Services</h3>
            <ul className="space-y-2">
              <li className="text-neutral-400">Regular Check-ups</li>
              <li className="text-neutral-400">Vaccinations</li>
              <li className="text-neutral-400">Dental Care</li>
              <li className="text-neutral-400">Surgery</li>
              <li className="text-neutral-400">Emergency Care</li>
              <li className="text-neutral-400">Pet Grooming</li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-lg mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin size={20} className="text-primary-400 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-neutral-400">
                  123 Pet Health Street<br />Veterinary District, CA 90210
                </span>
              </li>
              <li className="flex items-center">
                <Phone size={20} className="text-primary-400 mr-2 flex-shrink-0" />
                <span className="text-neutral-400">(555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <Mail size={20} className="text-primary-400 mr-2 flex-shrink-0" />
                <span className="text-neutral-400">info@petcareclinic.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-700 mt-12 pt-8 text-center text-sm text-neutral-500">
          <p>&copy; {new Date().getFullYear()} PetCare Veterinary Clinic. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;