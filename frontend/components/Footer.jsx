'use client';

import Link from 'next/link';
import { FiMail, FiPhone, FiMapPin, FiFacebook, FiTwitter, FiInstagram, FiLinkedin } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div>
            <div className="text-2xl font-bold mb-4">
              <span className="text-accent">Shine</span>Native
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-5">
              India's #1 AI-powered real estate platform. Find your dream home with smart search, 3D tours, and expert agents.
            </p>
            <div className="flex gap-3">
              {[FiFacebook, FiTwitter, FiInstagram, FiLinkedin].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 bg-gray-800 hover:bg-primary rounded-lg flex items-center justify-center transition-colors">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-white mb-5">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { href: '/', label: 'Home' },
                { href: '/properties', label: 'Browse Properties' },
                { href: '/about', label: 'About Us' },
                { href: '/contact', label: 'Contact' },
                { href: '/login', label: 'Login' },
                { href: '/register', label: 'Register' },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-400 hover:text-accent transition-colors text-sm">
                    → {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Property Types */}
          <div>
            <h4 className="font-bold text-white mb-5">Property Types</h4>
            <ul className="space-y-3">
              {['Apartments', 'Villas', 'Townhouses', 'Commercial', 'Land', 'Luxury Homes'].map(type => (
                <li key={type}>
                  <Link href={`/properties?type=${type.toLowerCase()}`} className="text-gray-400 hover:text-accent transition-colors text-sm">
                    → {type}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-white mb-5">Contact Us</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <FiMapPin className="text-accent mt-0.5 flex-shrink-0" size={16} />
                <span className="text-gray-400 text-sm">123 Tech Street, Koramangala, Bangalore - 560034</span>
              </div>
              <div className="flex items-center gap-3">
                <FiPhone className="text-accent flex-shrink-0" size={16} />
                <a href="tel:+911234567890" className="text-gray-400 hover:text-accent transition-colors text-sm">+91 1234567890</a>
              </div>
              <div className="flex items-center gap-3">
                <FiMail className="text-accent flex-shrink-0" size={16} />
                <a href="mailto:info@techprop.com" className="text-gray-400 hover:text-accent transition-colors text-sm">info@techprop.com</a>
              </div>
            </div>

            {/* Newsletter */}
            <div className="mt-6">
              <p className="text-sm font-semibold text-white mb-2">Get Property Alerts</p>
              <div className="flex gap-2">
                <input type="email" placeholder="Your email" className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-accent" />
                <button className="bg-accent text-black px-3 py-2 rounded-lg text-sm font-bold hover:bg-yellow-400 transition-colors">Go</button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">© 2024 Shine Native. All rights reserved.</p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="text-gray-500 hover:text-accent transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-500 hover:text-accent transition-colors">Terms of Service</a>
            <a href="#" className="text-gray-500 hover:text-accent transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
