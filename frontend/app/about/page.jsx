'use client';

import Link from 'next/link';
import { FiTarget, FiEye, FiAward, FiUsers } from 'react-icons/fi';

const team = [
  { name: 'Arjun Mehta', role: 'CEO & Founder', desc: '15 years in real estate. Former VP at HDFC Realty.' },
  { name: 'Sneha Patel', role: 'CTO', desc: 'Ex-Google engineer. Built AI-powered search systems.' },
  { name: 'Vikram Singh', role: 'Head of Sales', desc: '10 years closing premium deals across India.' },
  { name: 'Ananya Rao', role: 'Head of Design', desc: 'Award-winning UX designer with a passion for PropTech.' },
];

const stats = [
  { value: '2,500+', label: 'Properties Listed' },
  { value: '1,200+', label: 'Happy Clients' },
  { value: '25+', label: 'Cities Covered' },
  { value: '₹500 Cr+', label: 'Deals Closed' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="bg-primary text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-accent font-semibold mb-3">ABOUT SHINE NATIVE</p>
          <h1 className="text-5xl font-bold mb-6">Redefining Real Estate in India</h1>
          <p className="text-xl text-gray-300 leading-relaxed">
            We combine cutting-edge AI technology with deep real estate expertise to make property search transparent, efficient, and delightful.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-accent py-12">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map(s => (
            <div key={s.label} className="text-center">
              <div className="text-4xl font-bold text-primary mb-1">{s.value}</div>
              <div className="text-gray-700 font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-lightBg rounded-2xl p-8">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white mb-5">
              <FiTarget size={24} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed">
              To make property search transparent, efficient, and user-friendly by combining cutting-edge AI technology with real estate expertise. We believe everyone deserves to find their perfect home without stress.
            </p>
          </div>
          <div className="bg-lightBg rounded-2xl p-8">
            <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center text-black mb-5">
              <FiEye size={24} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h2>
            <p className="text-gray-600 leading-relaxed">
              To become India's most trusted real estate platform by 2026, serving 1 million+ homebuyers with AI-powered search, virtual tours, and verified listings across every major city.
            </p>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="py-20 bg-lightBg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-accent font-semibold mb-2">WHAT WE OFFER</p>
            <h2 className="text-4xl font-bold text-gray-900">Everything You Need</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: '🤖', title: 'AI-Powered Search', desc: 'Smart recommendations based on your preferences and budget.' },
              { icon: '🏠', title: '3D Virtual Tours', desc: 'Explore every room without leaving your home.' },
              { icon: '💰', title: 'EMI Calculator', desc: 'Plan your finances with real-time loan calculations.' },
              { icon: '📍', title: 'Neighborhood Insights', desc: 'Schools, hospitals, metro, and safety ratings.' },
              { icon: '💬', title: '24/7 AI Chat', desc: 'Get instant answers to all your property questions.' },
              { icon: '✅', title: 'Verified Listings', desc: 'Every property verified by our expert team.' },
            ].map(f => (
              <div key={f.title} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-600 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-accent font-semibold mb-2">OUR TEAM</p>
            <h2 className="text-4xl font-bold text-gray-900">Meet the People Behind Shine Native</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map(member => (
              <div key={member.name} className="text-center p-6 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
                  {member.name[0]}
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-accent text-sm font-semibold mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-20 bg-primary text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-4xl font-bold mb-4">Ready to Find Your Dream Home?</h2>
          <p className="text-gray-300 mb-8">Join 1,200+ happy homeowners who found their perfect property with Shine Native.</p>
          <div className="flex gap-4 justify-center">
            <Link href="/properties" className="bg-accent text-black px-8 py-3 rounded-xl font-bold hover:bg-yellow-400 transition">Browse Properties</Link>
            <Link href="/contact" className="bg-white/10 border border-white/30 px-8 py-3 rounded-xl font-semibold hover:bg-white/20 transition">Contact Us</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
