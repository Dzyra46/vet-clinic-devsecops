import { useState } from 'react';
import Link from 'next/link';
import { LogoutButton } from '@/components/ui/LogoutButton';

interface NavbarProps {
  userRole?: 'admin' | 'doctor' | 'pet-owner';
}

export const Navbar = ({ userRole }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = {
    'admin': [
      { label: 'Dashboard', href: '/admin/dashboard' },
      { label: 'Manage Doctors', href: '/admin/doctors' },
      { label: 'Manage Users', href: '/admin/users' },
    ],
    'doctor': [
      { label: 'Dashboard', href: '/doctor/dashboard' },
      { label: 'Medical Records', href: '/doctor/medical-records' },
    ],
    'pet-owner': [
      { label: 'My Pets', href: '/pets' },
      { label: 'Medical History', href: '/medical-history' },
    ],
  };

  const currentMenu = userRole ? menuItems[userRole] : [];

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold text-blue-600">VetClinic</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden sm:flex sm:items-center">
            {currentMenu.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
              >
                {item.label}
              </Link>
            ))}
            <LogoutButton />
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <span className="sr-only">Open main menu</span>
              {/* Hamburger icon */}
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {currentMenu.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
              >
                {item.label}
              </Link>
            ))}
            <div className="px-3 py-2">
              <LogoutButton />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};