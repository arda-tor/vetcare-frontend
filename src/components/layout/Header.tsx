import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../common/Button';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <header
      className={`fixed w-full top-0 z-50 transition-all duration-200 ${
        isScrolled || mobileMenuOpen ? 'bg-white shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="flex items-center text-primary-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
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
            <h1 className="text-xl font-display font-bold tracking-tight text-neutral-800">
              PetCare Clinic
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <ul className="flex space-x-8">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className={`text-sm font-medium transition-colors hover:text-primary-500 ${
                      location.pathname === item.href
                        ? 'text-primary-500'
                        : 'text-neutral-700'
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="text-sm text-neutral-700">
                  <span className="mr-2">Hello, {user?.name.split(' ')[0]}</span>
                  <span className="bg-neutral-100 px-2 py-1 rounded text-xs capitalize">
                    {user?.roles?.[0]?.name}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={logout}
                  className="ml-4"
                >
                  Logout
                </Button>
                <Link to="/dashboard">
                  <Button icon={<User size={18} />} size="sm">
                    Dashboard
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login">
                  <Button variant="outline" size="sm">Sign In</Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">Register</Button>
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-neutral-700 hover:text-primary-500"
            onClick={toggleMobileMenu}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pb-4 pt-2 bg-white">
          <ul className="flex flex-col space-y-4">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  to={item.href}
                  className={`block px-2 py-1 text-base font-medium transition-colors hover:text-primary-500 ${
                    location.pathname === item.href
                      ? 'text-primary-500'
                      : 'text-neutral-700'
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            {isAuthenticated ? (
              <>
                <li className="pt-2 border-t border-neutral-200">
                  <div className="px-2 py-1 flex items-center justify-between">
                    <div className="text-sm text-neutral-700">
                      <span className="mr-2">Hello, {user?.name.split(' ')[0]}</span>
                      <span className="bg-neutral-100 px-2 py-1 rounded text-xs capitalize">
                        {user?.roles?.[0]?.name}
                      </span>
                    </div>
                  </div>
                </li>
                <li>
                  <Link
                    to="/dashboard"
                    className="block px-2 py-1 text-base font-medium text-neutral-700"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <button
                    onClick={logout}
                    className="block w-full text-left px-2 py-1 text-base font-medium text-neutral-700"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="pt-2 border-t border-neutral-200">
                  <Link
                    to="/login"
                    className="block px-2 py-1 text-base font-medium text-primary-500"
                  >
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    className="block px-2 py-1 text-base font-medium text-primary-600"
                  >
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;