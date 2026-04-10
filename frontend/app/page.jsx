'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiSearch, FiMapPin, FiTrendingUp, FiShield, FiStar, FiArrowRight } from 'react-icons/fi';
import { MdVilla, MdApartment, MdBusiness } from 'react-icons/md';
import PropertyCard from '@/components/PropertyCard';
import SearchBar from '@/components/SearchBar';
import VirtualTour from '@/components/VirtualTour';
import api from '@/lib/api';

const stats = [
  { label: 'Properties Listed', value: '2,500+' },
  { label: 'Happy Clients', value: '1,200+' },
  { label: 'Cities Covered', value: '25+' },
  { label: 'Expert Agents', value: '150+' },
];

const features = [
  { icon: <FiSearch size={32} />, title: 'AI-Powered Search', desc: 'Smart filters and recommendations tailored to your preferences.' },
  { icon: <MdVilla size={32} />, title: '3D Virtual Tours', desc: 'Explore properties from the comfort of your home with immersive tours.' },
  { icon: <FiTrendingUp size={32} />, title: 'EMI Calculator', desc: 'Plan your finances with our real-time EMI and loan calculator.' },
  { icon: <FiShield size={32} />, title: 'Verified Listings', desc: 'Every property is verified by our expert team for your peace of mind.' },
];

const cities = ['Mumbai', 'Bangalore', 'Delhi', 'Hyderabad', 'Pune', 'Chennai'];

export default function HomePage() {
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Buy');
  const [showTour, setShowTour] = useState(false);

  useEffect(() => {
    api.get('/properties?limit=6&page=1')
      .then(res => setFeaturedProperties(res.data.data || []))
      .catch(() => setFeaturedProperties([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 hero-gradient opacity-90 z-10" />
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80')" }}
        />
        <div className="relative z-20 text-center text-white px-4 max-w-4xl mx-auto">
          <div className="inline-block bg-accent/20 border border-accent/40 text-accent px-4 py-1 rounded-full text-sm font-medium mb-6">
            🏆 India's #1 AI-Powered Real Estate Platform
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Find Your Next Chapter.{' '}
            <span className="text-accent">Smartly.</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-10">
            AI-powered property search and virtual tours across India.
          </p>

          {/* Search Tabs */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 max-w-3xl mx-auto border border-white/20">
            <div className="flex gap-2 mb-4">
              {['Buy', 'Rent', 'Commercial'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                    activeTab === tab ? 'bg-accent text-black' : 'text-white hover:bg-white/20'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <SearchBar />
          </div>

          {/* Popular Cities */}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <span className="text-gray-300 text-sm">Popular:</span>
            {cities.map(city => (
              <Link
                key={city}
                href={`/properties?city=${city}`}
                className="text-sm text-white/80 hover:text-accent transition-colors border border-white/20 px-3 py-1 rounded-full hover:border-accent"
              >
                {city}
              </Link>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2">
            <div className="w-1 h-3 bg-white/70 rounded-full" />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-primary py-12">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map(stat => (
            <div key={stat.label} className="text-center text-white">
              <div className="text-4xl font-bold text-accent mb-1">{stat.value}</div>
              <div className="text-gray-300 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-20 bg-lightBg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <p className="text-accent font-semibold mb-2">HANDPICKED FOR YOU</p>
              <h2 className="text-4xl font-bold text-gray-900">Featured Properties</h2>
            </div>
            <Link href="/properties" className="flex items-center gap-2 text-primary font-semibold hover:text-accent transition-colors">
              View All <FiArrowRight />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl h-80 animate-pulse" />
              ))}
            </div>
          ) : featuredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProperties.map(property => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <MdVilla size={64} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">No properties found. Add some from the admin panel.</p>
              <Link href="/admin" className="button-primary mt-4 inline-block">Go to Admin Panel</Link>
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-accent font-semibold mb-2">WHY CHOOSE US</p>
            <h2 className="text-4xl font-bold text-gray-900">The Smarter Way to Find Property</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map(f => (
              <div key={f.title} className="text-center p-8 rounded-2xl border border-gray-100 hover:border-accent hover:shadow-lg transition-all group">
                <div className="text-primary group-hover:text-accent transition-colors mb-4 flex justify-center">{f.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{f.title}</h3>
                <p className="text-gray-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Virtual Tour CTA */}
      <section className="py-20 hero-gradient text-white">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <p className="text-accent font-semibold mb-3">IMMERSIVE EXPERIENCE</p>
            <h2 className="text-4xl font-bold mb-6">Experience Properties in 3D Virtual Tours</h2>
            <p className="text-gray-300 text-lg mb-8">
              Walk through your dream home without leaving yours. Our 3D virtual tours give you a realistic feel of every room, every corner.
            </p>
            <button onClick={() => setShowTour(true)} className="bg-accent text-black px-8 py-4 rounded-xl font-bold text-lg hover:bg-yellow-400 transition-colors inline-flex items-center gap-2">
              ▶ Start Virtual Tour <FiArrowRight />
            </button>
          </div>
          <div className="flex-1 relative h-80 rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80"
              alt="Virtual Tour"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <button onClick={() => setShowTour(true)} className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white cursor-pointer hover:bg-white/30 transition">
                <span className="text-white text-3xl ml-1">▶</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Virtual Tour Modal */}
      {showTour && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setShowTour(false)}>
          <div className="w-full max-w-4xl" onClick={e => e.stopPropagation()}>
            <VirtualTour propertyTitle="Luxury 3BHK Apartment - Demo Tour" onClose={() => setShowTour(false)} />
          </div>
        </div>
      )}

      {/* Testimonials */}
      <section className="py-20 bg-lightBg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-accent font-semibold mb-2">TESTIMONIALS</p>
            <h2 className="text-4xl font-bold text-gray-900">What Our Clients Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Rahul Sharma', city: 'Bangalore', text: 'Found my dream 3BHK in Koramangala within a week. The virtual tour saved me so much time!', rating: 5 },
              { name: 'Priya Patel', city: 'Mumbai', text: 'The EMI calculator helped me plan my budget perfectly. Excellent service and verified listings.', rating: 5 },
              { name: 'Amit Kumar', city: 'Hyderabad', text: 'The AI chatbot answered all my queries instantly. Booked a site visit in minutes. Highly recommend!', rating: 5 },
            ].map(t => (
              <div key={t.name} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex gap-1 mb-4">
                  {[...Array(t.rating)].map((_, i) => <FiStar key={i} className="text-accent fill-accent" />)}
                </div>
                <p className="text-gray-700 mb-6 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{t.name}</div>
                    <div className="text-gray-500 text-sm">{t.city}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
