'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/store';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { FiArrowLeft, FiPlus, FiX } from 'react-icons/fi';

export default function EditProperty() {
  const { user } = useAuthStore();
  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [amenities, setAmenities] = useState([]);
  const [agents, setAgents] = useState([]);
  const [imageInput, setImageInput] = useState('');
  const [form, setForm] = useState(null);

  useEffect(() => {
    if (!user) { router.push('/login'); return; }
    Promise.all([
      api.get('/properties/' + id),
      api.get('/admin/amenities').catch(() => ({ data: [] })),
      api.get('/admin/agents').catch(() => ({ data: [] })),
    ]).then(([propRes, amenRes, agentRes]) => {
      const p = propRes.data;
      setForm({
        title: p.title || '', description: p.description || '',
        property_type: p.property_type || 'apartment', bhk: p.bhk || '',
        price: p.price || '', location: p.location || '', city: p.city || '',
        state: p.state || '', postal_code: p.postal_code || '',
        latitude: p.latitude || '', longitude: p.longitude || '',
        area_sqft: p.area_sqft || '', build_year: p.build_year || '',
        agent_id: p.agent_id || '', virtual_tour_url: p.virtual_tour_url || '',
        status: p.status || 'available', featured: p.featured || false,
        images: p.images || [],
        amenity_ids: p.amenities?.map(a => a.id) || [],
      });
      setAmenities(amenRes.data || []);
      setAgents(agentRes.data || []);
    }).catch(() => toast.error('Failed to load property'))
      .finally(() => setFetching(false));
  }, [user, id]);

  const update = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const addImage = () => {
    if (!imageInput.trim()) return;
    setForm(p => ({ ...p, images: [...p.images, imageInput.trim()] }));
    setImageInput('');
  };

  const removeImage = (i) => setForm(p => ({ ...p, images: p.images.filter((_, idx) => idx !== i) }));

  const toggleAmenity = (aid) => setForm(p => ({
    ...p,
    amenity_ids: p.amenity_ids.includes(aid)
      ? p.amenity_ids.filter(a => a !== aid)
      : [...p.amenity_ids, aid]
  }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put('/admin/properties/' + id, {
        ...form,
        price: parseInt(form.price),
        bhk: form.bhk ? parseInt(form.bhk) : null,
        area_sqft: form.area_sqft ? parseInt(form.area_sqft) : null,
        build_year: form.build_year ? parseInt(form.build_year) : null,
        agent_id: form.agent_id ? parseInt(form.agent_id) : null,
        featured: form.featured ? 1 : 0,
      });
      toast.success('Property updated successfully!');
      router.push('/admin/properties');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update property');
    } finally {
      setLoading(false);
    }
  };

  const inp = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary bg-white";
  const lbl = "block text-sm font-semibold text-gray-700 mb-1.5";

  if (fetching) return (
    <div className="min-h-screen flex items-center justify-center bg-lightBg">
      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!form) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">Property not found.</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-lightBg">
      <div className="bg-primary text-white py-8">
        <div className="max-w-5xl mx-auto px-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Edit Property</h1>
            <p className="text-gray-300 mt-1 line-clamp-1">{form.title}</p>
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
                <label className={lbl}>Title *</label>
                <input required value={form.title} onChange={e => update('title', e.target.value)} className={inp} />
              </div>
              <div className="md:col-span-2">
                <label className={lbl}>Description</label>
                <textarea value={form.description} onChange={e => update('description', e.target.value)} rows={4} className={inp + ' resize-none'} />
              </div>
              <div>
                <label className={lbl}>Type *</label>
                <select required value={form.property_type} onChange={e => update('property_type', e.target.value)} className={inp}>
                  <option value="apartment">Apartment</option>
                  <option value="villa">Villa</option>
                  <option value="townhouse">Townhouse</option>
                  <option value="commercial">Commercial</option>
                  <option value="land">Land</option>
                </select>
              </div>
              <div>
                <label className={lbl}>Status</label>
                <select value={form.status} onChange={e => update('status', e.target.value)} className={inp}>
                  <option value="available">Available</option>
                  <option value="sold">Sold</option>
                  <option value="under_offer">Under Offer</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
              <div>
                <label className={lbl}>Price (₹) *</label>
                <input required type="number" value={form.price} onChange={e => update('price', e.target.value)} className={inp} />
              </div>
              <div>
                <label className={lbl}>BHK</label>
                <input type="number" value={form.bhk} onChange={e => update('bhk', e.target.value)} className={inp} />
              </div>
              <div>
                <label className={lbl}>Area (sq ft)</label>
                <input type="number" value={form.area_sqft} onChange={e => update('area_sqft', e.target.value)} className={inp} />
              </div>
              <div>
                <label className={lbl}>Build Year</label>
                <input type="number" value={form.build_year} onChange={e => update('build_year', e.target.value)} className={inp} />
              </div>
              <div>
                <label className={lbl}>Agent</label>
                <select value={form.agent_id} onChange={e => update('agent_id', e.target.value)} className={inp}>
                  <option value="">No Agent</option>
                  {agents.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              </div>
              <div>
                <label className={lbl}>Virtual Tour URL</label>
                <input type="url" value={form.virtual_tour_url} onChange={e => update('virtual_tour_url', e.target.value)} placeholder="https://..." className={inp} />
              </div>
              <div className="flex items-center gap-3 pt-2">
                <input type="checkbox" id="featured" checked={form.featured} onChange={e => update('featured', e.target.checked)} className="w-5 h-5 accent-primary" />
                <label htmlFor="featured" className="font-semibold text-gray-700 cursor-pointer">Mark as Featured</label>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-bold text-gray-900 mb-5 text-lg">Location</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className={lbl}>Full Address *</label>
                <input required value={form.location} onChange={e => update('location', e.target.value)} className={inp} />
              </div>
              <div><label className={lbl}>City *</label><input required value={form.city} onChange={e => update('city', e.target.value)} className={inp} /></div>
              <div><label className={lbl}>State</label><input value={form.state} onChange={e => update('state', e.target.value)} className={inp} /></div>
              <div><label className={lbl}>Postal Code</label><input value={form.postal_code} onChange={e => update('postal_code', e.target.value)} className={inp} /></div>
              <div><label className={lbl}>Latitude</label><input type="number" step="any" value={form.latitude} onChange={e => update('latitude', e.target.value)} className={inp} /></div>
              <div><label className={lbl}>Longitude</label><input type="number" step="any" value={form.longitude} onChange={e => update('longitude', e.target.value)} className={inp} /></div>
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-bold text-gray-900 mb-5 text-lg">Images</h2>
            <div className="flex gap-2 mb-4">
              <input value={imageInput} onChange={e => setImageInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addImage())}
                placeholder="Paste image URL..." className={inp + ' flex-1'} />
              <button type="button" onClick={addImage} className="bg-primary text-white px-4 py-2.5 rounded-xl hover:bg-secondary transition flex items-center gap-1 text-sm">
                <FiPlus size={16} /> Add
              </button>
            </div>
            {form.images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {form.images.map((img, i) => (
                  <div key={i} className="relative group rounded-xl overflow-hidden h-24 bg-gray-100">
                    <img src={img} alt="" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition">
                      <FiX size={12} />
                    </button>
                    {i === 0 && <span className="absolute bottom-1 left-1 bg-primary text-white text-xs px-1.5 py-0.5 rounded">Main</span>}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Amenities */}
          {amenities.length > 0 && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="font-bold text-gray-900 mb-5 text-lg">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {amenities.map(a => (
                  <label key={a.id} className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${form.amenity_ids.includes(a.id) ? 'border-primary bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <input type="checkbox" checked={form.amenity_ids.includes(a.id)} onChange={() => toggleAmenity(a.id)} className="accent-primary" />
                    <span className="text-sm font-medium text-gray-700">{a.name}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button type="submit" disabled={loading} className="button-primary py-3 px-8 rounded-xl text-base disabled:opacity-60">
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <Link href="/admin/properties" className="button-secondary py-3 px-8 rounded-xl text-base">Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
