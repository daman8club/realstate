'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { FiMenu, FiX, FiPhone, FiMessageCircle, FiUser, FiLogOut, FiSettings } from 'react-icons/fi';
import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/properties', label: 'Properties' },
  { href: '/about', label: 'About Us' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, logout } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    router.push('/');
    toast.success('Logged out successfully');
  };

  const isActive = (href) => href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-primary flex items-center gap-1">
            <span className="text-accent">Shine</span>Native
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  isActive(link.href) ? 'text-primary bg-blue-50' : 'text-gray-600 hover:text-primary hover:bg-gray-50'
                }`}>
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 px-4 py-2 rounded-xl transition-colors">
                  <div className="w-7 h-7 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {user.name?.[0]?.toUpperCase()}
                  </div>
                  <span className="font-medium text-gray-800 text-sm">{user.name?.split(' ')[0]}</span>
                </button>
                {showUserMenu && (
                  <div className="absolute right-0 top-12 bg-white rounded-xl shadow-lg border border-gray-100 py-2 w-48 z-50">
                    <Link href="/dashboard" onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-gray-700 hover:bg-gray-50 text-sm">
                      <FiUser size={15} /> My Dashboard
                    </Link>
                    {user.role === 'admin' && (
                      <Link href="/admin" onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-gray-700 hover:bg-gray-50 text-sm">
                        <FiSettings size={15} /> Admin Panel
                      </Link>
                    )}
                    <hr className="my-1 border-gray-100" />
                    <button onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2.5 text-red-600 hover:bg-red-50 text-sm w-full">
                      <FiLogOut size={15} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/login" className="text-gray-700 hover:text-primary font-medium px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                  Login
                </Link>
                <Link href="/register" className="button-primary py-2 px-5 text-sm rounded-xl">
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-1 border-t border-gray-100 pt-3">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href} onClick={() => setIsOpen(false)}
                className={`block px-4 py-2.5 rounded-lg font-medium transition-colors ${
                  isActive(link.href) ? 'text-primary bg-blue-50' : 'text-gray-600 hover:text-primary hover:bg-gray-50'
                }`}>
                {link.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link href="/dashboard" onClick={() => setIsOpen(false)} className="block px-4 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg">Dashboard</Link>
                {user.role === 'admin' && (
                  <Link href="/admin" onClick={() => setIsOpen(false)} className="block px-4 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg">Admin Panel</Link>
                )}
                <button onClick={handleLogout} className="block w-full text-left px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-lg">Logout</button>
              </>
            ) : (
              <div className="flex gap-2 pt-2 px-4">
                <Link href="/login" onClick={() => setIsOpen(false)} className="flex-1 text-center button-secondary py-2 rounded-xl text-sm">Login</Link>
                <Link href="/register" onClick={() => setIsOpen(false)} className="flex-1 text-center button-primary py-2 rounded-xl text-sm">Register</Link>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-40">
        <a href="https://wa.me/911234567890" target="_blank" rel="noopener noreferrer"
          className="bg-[#25D366] text-white p-3.5 rounded-full shadow-lg hover:bg-green-500 transition-transform hover:scale-110"
          title="WhatsApp">
          <FiMessageCircle size={22} />
        </a>
        <a href="tel:+911234567890"
          className="bg-primary text-white p-3.5 rounded-full shadow-lg hover:bg-secondary transition-transform hover:scale-110"
          title="Call Us">
          <FiPhone size={22} />
        </a>
      </div>
    </nav>
  );
}
