'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { FiArrowLeft, FiPlus, FiX } from 'react-icons/fi';

export default function AddProperty() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [amenities, setAmenities] = useState([]);
  const [agents, setAgents] = useState([]);
  const [imageInput, setImageInput] = useState('');
  const [form, setForm] = useState({
    title: '', description: '', property_type: 'apartment', bhk: '',
    price: '', location: '', city: '', state: '', postal_code: '',
    latitude: '', longitude: '', area_sqft: '', build_year: '',
    agent_id: '', virtual_tour_url: '', status: 'available', featured: false,
    images: [], amenity_ids: []
  });

  useEffect(() => {
    if (!user) { router.push('/login'); return; }
    api.get('/admin/amenities').then(r => setAmenities(r.data || [])).catch(() => {});
    api.get('/admin/agents').then(r => setAgents(r.data || [])).catch(() => {});
  }, [user]);

  const update = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const addImage = () => {
    if (!imageInput.trim()) return;
    setForm(p => ({ ...p, images: [...p.images, imageInput.trim()] }));
    setImageInput('');
  };

  const removeImage = (i) => setForm(p => ({ ...p, images: p.images.filter((_, idx) => idx !== i) }));

  const toggleAmenity = (id) => {
    setForm(p => ({
      ...p,
      amenity_ids: p.amenity_ids.includes(id)
        ? p.amenity_ids.filter(a => a !== id)
        : [...p.amenity_ids, id]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.property_type || !form.price || !form.location || !form.city) {
      toast.error('Please fill all required fields');
      return;
    }
    setLoading(true);
    try {
      await api.post('/admin/properties', {
        ...form,
        price: parseInt(form.price),
        bhk: form.bhk ? parseInt(form.bhk) : null,
        area_sqft: form.area_sqft ? parseInt(form.area_sqft) : null,
        build_year: form.build_year ? parseInt(form.build_year) : null,
        agent_id: form.agent_id ? parseInt(form.agent_id) : null,
        latitude: form.latitude ? parseFloat(form.latitude) : null,
        longitude: form.longitude ? parseFloat(form.longitude) : null,
        featured: form.featured ? 1 : 0,
      });
      toast.success('Property created successfully!');
      router.push('/admin/properties');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create property');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary bg-white";
  const labelClass = "block text-sm font-semibold text-gray-700 mb-1.5";

  return (
    <div className="min-h-screen bg-lightBg">
      <div className="bg-primary text-white py-8">
        <div className="max-w-5xl mx-auto px-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Add New Property</h1>
            <p className="text-gray-300 mt-1">Fill in the details to list a new property</p>
          </div>
          <Link href="/admin/properties" className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm transition">
            <FiArrowLeft size={15} /> Back
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Basic Info */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-bold text-gray-900 mb-5 text-lg">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className={labelClass}>Property Title *</label>
                <input required value={form.title} onChange={e => update('title', e.target.value)}
                  placeholder="e.g., Luxury 3BHK Apartment in Koramangala" className={inputClass} />
              </div>
              <div className="md:col-span-2">
                <label className={labelClass}>Description</label>
                <textarea value={form.description} onChange={e => update('description', e.target.value)}
                  rows={4} placeholder="Detailed property description..." className={`${inputClass} resize-none`} />
              </div>
              <div>
                <label className={labelClass}>Property Type *</label>
                <select required value={form.property_type} onChange={e => update('property_type', e.target.value)} className={inputClass}>
                  <option value="apartment">Apartment</option>
                  <option value="villa">Villa</option>
                  <option value="townhouse">Townhouse</option>
                  <option value="commercial">Commercial</option>
                  <option value="land">Land</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Status</label>
                <select value={form.status} onChange={e => update('status', e.target.value)} className={inputClass}>
                  <option value="available">Available</option>
                  <option value="sold">Sold</option>
                  <option value="under_offer">Under Offer</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Price (₹) *</label>
                <input required type="number" value={form.price} onChange={e => update('price', e.target.value)}
                  placeholder="e.g., 12500000" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>BHK</label>
                <input type="number" value={form.bhk} onChange={e => update('bhk', e.target.value)}
                  placeholder="e.g., 3" min="1" max="10" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Area (sq ft)</label>
                <input type="number" value={form.area_sqft} onChange={e => update('area_sqft', e.target.value)}
                  placeholder="e.g., 1850" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Build Year</label>
                <input type="number" value={form.build_year} onChange={e => update('build_year', e.target.value)}
                  placeholder="e.g., 2022" min="1900" max="2030" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Assign Agent</label>
                <select value={form.agent_id} onChange={e => update('agent_id', e.target.value)} className={inputClass}>
                  <option value="">No Agent</option>
                  {agents.map(a => <option key={a.id} value={a.id}>{a.name} — {a.specialization || 'Agent'}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Virtual Tour URL</label>
                <input type="url" value={form.virtual_tour_url} onChange={e => update('virtual_tour_url', e.target.value)}
                  placeholder="https://..." className={inputClass} />
              </div>
              <div className="flex items-center gap-3 pt-4">
                <input type="checkbox" id="featured" checked={form.featured} onChange={e => update('featured', e.target.checked)}
                  className="w-5 h-5 accent-primary rounded" />
                <label htmlFor="featured" className="font-semibold text-gray-700 cursor-pointer">Mark as Featured Property</label>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-bold text-gray-900 mb-5 text-lg">Location Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className={labelClass}>Full Location / Address *</label>
                <input required value={form.location} onChange={e => update('location', e.target.value)}
                  placeholder="e.g., Koramangala 5th Block, Near Forum Mall" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>City *</label>
                <input required value={form.city} onChange={e => update('city', e.target.value)}
                  placeholder="e.g., Bangalore" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>State</label>
                <input value={form.state} onChange={e => update('state', e.target.value)}
                  placeholder="e.g., Karnataka" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Postal Code</label>
                <input value={form.postal_code} onChange={e => update('postal_code', e.target.value)}
                  placeholder="e.g., 560095" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Latitude (for map)</label>
                <input type="number" step="any" value={form.latitude} onChange={e => update('latitude', e.target.value)}
                  placeholder="e.g., 12.9349" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Longitude (for map)</label>
                <input type="number" step="any" value={form.longitude} onChange={e => update('longitude', e.target.value)}
                  placeholder="e.g., 77.6264" className={inputClass} />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-bold text-gray-900 mb-5 text-lg">Property Images</h2>
            <div className="flex gap-2 mb-4">
              <input value={imageInput} onChange={e => setImageInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addImage())}
                placeholder="Paste image URL (Unsplash, Cloudinary, etc.)" className={`${inputClass} flex-1`} />
              <button type="button" onClick={addImage}
                className="bg-primary text-white px-4 py-2.5 rounded-xl hover:bg-secondary transition flex items-center gap-1 text-sm font-medium">
                <FiPlus size={16} /> Add
              </button>
            </div>
            {form.images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {form.images.map((img, i) => (
                  <div key={i} className="relative group rounded-xl overflow-hidden h-24 bg-gray-100">
                    <img src={img} alt="" className="w-full h-full object-cover" onError={e => e.target.src = 'https://via.placeholder.com/200x150?text=Invalid+URL'} />
                    <button type="button" onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition">
                      <FiX size={12} />
                    </button>
                    {i === 0 && <span className="absolute bottom-1 left-1 bg-primary text-white text-xs px-1.5 py-0.5 rounded">Main</span>}
                  </div>
                ))}
              </div>
            )}
            <p className="text-xs text-gray-400 mt-2">Tip: Use Unsplash URLs like https://images.unsplash.com/photo-...?w=800&q=80</p>
          </div>

          {/* Amenities */}
          {amenities.length > 0 && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="font-bold text-gray-900 mb-5 text-lg">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {amenities.map(a => (
                  <label key={a.id} className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${
                    form.amenity_ids.includes(a.id) ? 'border-primary bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <input type="checkbox" checked={form.amenity_ids.includes(a.id)} onChange={() => toggleAmenity(a.id)} className="accent-primary" />
                    <span className="text-sm font-medium text-gray-700">{a.name}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Submit */}
          <div className="flex gap-3">
            <button type="submit" disabled={loading}
              className="button-primary py-3 px-8 rounded-xl text-base disabled:opacity-60">
              {loading ? 'Creating Property...' : 'Create Property'}
            </button>
            <Link href="/admin/properties" className="button-secondary py-3 px-8 rounded-xl text-base">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
