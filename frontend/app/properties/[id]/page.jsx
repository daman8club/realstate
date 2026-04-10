'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import EMICalculator from '@/components/EMICalculator';
import ScheduleVisit from '@/components/ScheduleVisit';
import VirtualTour from '@/components/VirtualTour';

const amenityIcons = {
  'Gym': '🏋️', 'Swimming Pool': '🏊', '24/7 Security': '🔒', 'Parking': '🚗',
  'Garden': '🌿', 'Clubhouse': '🏠', 'Lift': '🛗', 'Central AC': '❄️',
  'Water Supply': '💧', 'Power Backup': '🔋', 'Gate': '🚪', 'Playground': '🛝',
};

export default function PropertyDetailPage() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [showEMI, setShowEMI] = useState(false);
  const [showVisit, setShowVisit] = useState(false);
  const [showInquiry, setShowInquiry] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [inquiry, setInquiry] = useState({ name: '', email: '', phone: '', message: '', inquiry_type: 'general' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get(`/properties/${id}`)
      .then(res => setProperty(res.data))
      .catch(() => toast.error('Property not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const submitInquiry = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/inquiries', { ...inquiry, property_id: id });
      toast.success('Inquiry submitted! We will contact you soon.');
      setShowInquiry(false);
      setInquiry({ name: '', email: '', phone: '', message: '', inquiry_type: 'general' });
    } catch {
      toast.error('Failed to submit inquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatPrice = (price) => {
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
    if (price >= 100000) return `₹${(price / 100000).toFixed(1)} L`;
    return `₹${price?.toLocaleString()}`;
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Loading property details...</p>
      </div>
    </div>
  );

  if (!property) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">Property Not Found</h2>
        <Link href="/properties" className="button-primary">Browse Properties</Link>
      </div>
    </div>
  );

  const images = property.images?.length > 0
    ? property.images
    : ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80'];

  return (
    <div className="min-h-screen bg-lightBg">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100 py-3">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <Link href="/properties" className="hover:text-primary">Properties</Link>
          <span>/</span>
          <span className="text-gray-800 font-medium line-clamp-1">{property.title}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Link href="/properties" className="inline-flex items-center gap-2 text-gray-600 hover:text-primary mb-6 transition-colors text-sm">
          ← Back to Properties
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Images + Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
              <div className="relative h-96 md:h-[500px]">
                <Image src={images[activeImage]} alt={property.title} fill className="object-cover" />
                <button onClick={() => setShowTour(true)}
                    className="absolute top-4 left-4 bg-black/70 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary transition backdrop-blur-sm text-sm font-semibold">
                    ▶ 3D Virtual Tour
                  </button>
                <div className="absolute top-4 right-4 flex gap-2">
                  <button onClick={() => setIsFavorite(!isFavorite)}
                    className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow hover:bg-white transition text-lg">
                    <span className={isFavorite ? 'text-red-500' : 'text-gray-600'}>♥</span>
                  </button>
                  <button onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success('Link copied!'); }}
                    className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow hover:bg-white transition text-sm">
                    🔗
                  </button>
                </div>
                {property.featured && (
                  <div className="absolute bottom-4 left-4 bg-accent text-black px-3 py-1 rounded-lg text-sm font-bold">⭐ Featured</div>
                )}
              </div>
              {images.length > 1 && (
                <div className="flex gap-2 p-4 overflow-x-auto">
                  {images.map((img, i) => (
                    <button key={i} onClick={() => setActiveImage(i)}
                      className={`relative w-20 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${activeImage === i ? 'border-primary' : 'border-transparent'}`}>
                      <Image src={img} alt="" fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Property Info */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{property.title}</h1>
                  <div className="flex items-center gap-2 text-gray-600">
                    📍 {property.location}, {property.city}{property.state ? `, ${property.state}` : ''}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary">{formatPrice(property.price)}</div>
                  {property.area_sqft && (
                    <div className="text-gray-500 text-sm">₹{Math.round(property.price / property.area_sqft).toLocaleString()}/sqft</div>
                  )}
                </div>
              </div>

              {/* Key Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-y border-gray-100 mb-6">
                {property.bhk && (
                  <div className="text-center">
                    <div className="text-2xl mb-1">🛏</div>
                    <div className="font-bold text-gray-900">{property.bhk} BHK</div>
                    <div className="text-xs text-gray-500">Bedrooms</div>
                  </div>
                )}
                {property.area_sqft && (
                  <div className="text-center">
                    <div className="text-2xl mb-1">📐</div>
                    <div className="font-bold text-gray-900">{property.area_sqft.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">Sq. Ft.</div>
                  </div>
                )}
                {property.build_year && (
                  <div className="text-center">
                    <div className="text-2xl mb-1">📅</div>
                    <div className="font-bold text-gray-900">{property.build_year}</div>
                    <div className="text-xs text-gray-500">Built Year</div>
                  </div>
                )}
                <div className="text-center">
                  <div className="text-2xl mb-1">🏠</div>
                  <div className="font-bold text-gray-900 capitalize">{property.property_type}</div>
                  <div className="text-xs text-gray-500">Type</div>
                </div>
              </div>

              {property.description && (
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">About This Property</h3>
                  <p className="text-gray-600 leading-relaxed">{property.description}</p>
                </div>
              )}

              {property.amenities?.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Amenities</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {property.amenities.map(a => (
                      <div key={a.id} className="flex items-center gap-2 bg-lightBg rounded-lg px-3 py-2">
                        <span className="text-xl">{amenityIcons[a.name] || '✅'}</span>
                        <span className="text-sm text-gray-700 font-medium">{a.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Neighborhood Insights */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Neighborhood Insights</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { icon: '🏫', label: 'Schools', value: 9.2 },
                  { icon: '🏥', label: 'Hospitals', value: 8.5 },
                  { icon: '🚇', label: 'Metro', value: 7.8 },
                  { icon: '🛒', label: 'Shopping', value: 8.2 },
                  { icon: '🍽️', label: 'Restaurants', value: 7.9 },
                  { icon: '🛡️', label: 'Safety', value: 8.8 },
                ].map(item => (
                  <div key={item.label} className="bg-lightBg rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">{item.icon}</span>
                      <span className="font-semibold text-gray-700 text-sm">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: `${item.value * 10}%` }} />
                      </div>
                      <span className="text-sm font-bold text-primary">{item.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Map */}
            {property.latitude && property.longitude && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Location</h3>
                <div className="rounded-xl overflow-hidden h-64 bg-gray-100">
                  <iframe width="100%" height="100%"
                    src={`https://maps.google.com/maps?q=${property.latitude},${property.longitude}&z=15&output=embed`}
                    style={{ border: 0 }} allowFullScreen loading="lazy" />
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="text-3xl font-bold text-primary mb-1">{formatPrice(property.price)}</div>
              <div className="text-gray-500 text-sm mb-6 capitalize">{property.property_type} • {property.status}</div>
              <div className="space-y-3">
                <button onClick={() => setShowInquiry(true)}
                  className="w-full button-primary py-3 rounded-xl flex items-center justify-center gap-2">
                  📞 Request Call Back
                </button>
                <button onClick={() => setShowVisit(true)}
                  className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2">
                  📅 Schedule Site Visit
                </button>
                <button onClick={() => setShowTour(true)}
                  className="w-full bg-purple-600 text-white py-3 rounded-xl font-semibold hover:bg-purple-700 transition flex items-center justify-center gap-2">
                  🏠 3D Virtual Tour
                </button>
                <button onClick={() => setShowEMI(true)}
                  className="w-full button-secondary py-3 rounded-xl flex items-center justify-center gap-2">
                  💰 EMI Calculator
                </button>
                {property.agent?.whatsapp && (
                  <a href={`https://wa.me/${property.agent.whatsapp}?text=Hi, I'm interested in ${property.title}`}
                    target="_blank" rel="noopener noreferrer"
                    className="w-full bg-[#25D366] text-white py-3 rounded-xl font-semibold hover:bg-green-500 transition flex items-center justify-center gap-2">
                    💬 WhatsApp Agent
                  </a>
                )}
              </div>
            </div>

            {property.agent && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4">Listed By</h3>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center text-white text-xl font-bold">
                    {property.agent.name?.[0] || 'A'}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{property.agent.name}</div>
                    <div className="text-gray-500 text-sm">{property.agent.specialization || 'Real Estate Agent'}</div>
                    {property.agent.rating && <div className="text-accent text-sm">⭐ {property.agent.rating}</div>}
                  </div>
                </div>
                {property.agent.bio && <p className="text-gray-600 text-sm mb-4">{property.agent.bio}</p>}
                <div className="grid grid-cols-2 gap-2">
                  <a href={`tel:${property.agent.phone}`}
                    className="flex items-center justify-center gap-2 border border-gray-200 py-2 rounded-lg text-sm font-medium hover:border-primary transition">
                    📞 Call
                  </a>
                  <a href={`https://wa.me/${property.agent.whatsapp || property.agent.phone}`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-[#25D366] text-white py-2 rounded-lg text-sm font-medium hover:bg-green-500 transition">
                    💬 WhatsApp
                  </a>
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4">Quick Facts</h3>
              <div className="space-y-3 text-sm">
                {[
                  ['Property ID', `#${property.id}`],
                  ['Type', property.property_type],
                  ['Status', property.status],
                  ['City', property.city],
                  ['Postal Code', property.postal_code],
                  ['Area', property.area_sqft ? `${property.area_sqft} sqft` : 'N/A'],
                  ['Built Year', property.build_year || 'N/A'],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between border-b border-gray-50 pb-2">
                    <span className="text-gray-500">{label}</span>
                    <span className="font-medium text-gray-800 capitalize">{value || 'N/A'}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Inquiry Modal */}
      {showInquiry && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowInquiry(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Request Call Back</h3>
            <form onSubmit={submitInquiry} className="space-y-4">
              <input required placeholder="Your Name" value={inquiry.name} onChange={e => setInquiry(p => ({ ...p, name: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary" />
              <input required type="email" placeholder="Email Address" value={inquiry.email} onChange={e => setInquiry(p => ({ ...p, email: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary" />
              <input required placeholder="Phone Number" value={inquiry.phone} onChange={e => setInquiry(p => ({ ...p, phone: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary" />
              <select value={inquiry.inquiry_type} onChange={e => setInquiry(p => ({ ...p, inquiry_type: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary">
                <option value="general">General Inquiry</option>
                <option value="call_back">Request Call Back</option>
                <option value="schedule_visit">Schedule Visit</option>
                <option value="emi_query">EMI Query</option>
              </select>
              <textarea placeholder="Your message..." value={inquiry.message} onChange={e => setInquiry(p => ({ ...p, message: e.target.value }))}
                rows={3} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary resize-none" />
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowInquiry(false)} className="flex-1 button-secondary py-3 rounded-xl">Cancel</button>
                <button type="submit" disabled={submitting} className="flex-1 button-primary py-3 rounded-xl disabled:opacity-60">
                  {submitting ? 'Sending...' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEMI && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowEMI(false)}>
          <div onClick={e => e.stopPropagation()}>
            <EMICalculator propertyPrice={property.price} onClose={() => setShowEMI(false)} />
          </div>
        </div>
      )}

      {showVisit && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowVisit(false)}>
          <div onClick={e => e.stopPropagation()}>
            <ScheduleVisit propertyId={property.id} propertyTitle={property.title} onClose={() => setShowVisit(false)} />
          </div>
        </div>
      )}

      {showTour && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setShowTour(false)}>
          <div className="w-full max-w-4xl" onClick={e => e.stopPropagation()}>
            <VirtualTour tourUrl={property.virtual_tour_url} propertyTitle={property.title} onClose={() => setShowTour(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
