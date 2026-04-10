'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import api from '@/lib/api';
import { FiTrash2, FiEdit, FiSearch, FiPlus, FiArrowLeft, FiEye } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function ManageProperties() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    if (!user) { router.push('/login'); return; }
    fetchProperties();
  }, [user]);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const res = await api.get('/properties?limit=100&page=1');
      setProperties(res.data.data || []);
    } catch {
      toast.error('Failed to fetch properties');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this property? This cannot be undone.')) return;
    setDeleting(id);
    try {
      await api.delete(`/admin/properties/${id}`);
      toast.success('Property deleted successfully');
      setProperties(prev => prev.filter(p => p.id !== id));
    } catch {
      toast.error('Failed to delete property');
    } finally {
      setDeleting(null);
    }
  };

  const toggleFeatured = async (property) => {
    try {
      await api.put(`/admin/properties/${property.id}`, { ...property, featured: !property.featured });
      toast.success(`Property ${!property.featured ? 'marked as featured' : 'removed from featured'}`);
      fetchProperties();
    } catch {
      toast.error('Failed to update property');
    }
  };

  const filtered = properties.filter(p => {
    const matchSearch = !search || p.title?.toLowerCase().includes(search.toLowerCase()) || p.city?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !filterStatus || p.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const formatPrice = (price) => {
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(1)} Cr`;
    if (price >= 100000) return `₹${(price / 100000).toFixed(1)} L`;
    return `₹${price?.toLocaleString()}`;
  };

  return (
    <div className="min-h-screen bg-lightBg">
      <div className="bg-primary text-white py-8">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Manage Properties</h1>
            <p className="text-gray-300 mt-1">{properties.length} total properties</p>
          </div>
          <div className="flex gap-3">
            <Link href="/admin" className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm transition">
              <FiArrowLeft size={15} /> Dashboard
            </Link>
            <Link href="/admin/properties/new" className="flex items-center gap-2 bg-accent text-black px-4 py-2 rounded-lg text-sm font-bold hover:bg-yellow-400 transition">
              <FiPlus size={15} /> Add Property
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="relative flex-1 min-w-48">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search by title or city..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-primary text-sm" />
          </div>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            className="border border-gray-200 rounded-xl px-4 py-2.5 bg-white text-sm focus:outline-none focus:border-primary">
            <option value="">All Status</option>
            <option value="available">Available</option>
            <option value="sold">Sold</option>
            <option value="under_offer">Under Offer</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-gray-500">Loading properties...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-500 mb-4">No properties found.</p>
              <Link href="/admin/properties/new" className="button-primary">Add First Property</Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {['Property', 'City', 'Price', 'Type', 'BHK', 'Status', 'Featured', 'Actions'].map(h => (
                      <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map(p => (
                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                            {p.images?.[0] ? (
                              <Image src={p.images[0]} alt="" fill className="object-cover" />
                            ) : (
                              <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs">No img</div>
                            )}
                          </div>
                          <span className="font-medium text-gray-900 text-sm line-clamp-2 max-w-48">{p.title}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-600">{p.city}</td>
                      <td className="px-5 py-4 text-sm font-semibold text-primary">{formatPrice(p.price)}</td>
                      <td className="px-5 py-4 text-sm text-gray-600 capitalize">{p.property_type}</td>
                      <td className="px-5 py-4 text-sm text-gray-600">{p.bhk ? `${p.bhk} BHK` : '—'}</td>
                      <td className="px-5 py-4">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                          p.status === 'available' ? 'bg-green-100 text-green-700' :
                          p.status === 'sold' ? 'bg-red-100 text-red-700' :
                          p.status === 'under_offer' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'
                        }`}>{p.status}</span>
                      </td>
                      <td className="px-5 py-4">
                        <button onClick={() => toggleFeatured(p)}
                          className={`text-xs px-2.5 py-1 rounded-full font-semibold transition ${p.featured ? 'bg-accent text-black' : 'bg-gray-100 text-gray-500 hover:bg-accent hover:text-black'}`}>
                          {p.featured ? '⭐ Yes' : 'No'}
                        </button>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <Link href={`/properties/${p.id}`}
                            className="p-1.5 text-gray-500 hover:text-primary hover:bg-blue-50 rounded-lg transition" title="View">
                            <FiEye size={15} />
                          </Link>
                          <Link href={`/admin/properties/${p.id}/edit`}
                            className="p-1.5 text-gray-500 hover:text-primary hover:bg-blue-50 rounded-lg transition" title="Edit">
                            <FiEdit size={15} />
                          </Link>
                          <button onClick={() => handleDelete(p.id)} disabled={deleting === p.id}
                            className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50" title="Delete">
                            <FiTrash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
