'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { FiMessageSquare, FiSearch, FiArrowLeft } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function ManageInquiries() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    if (!user) { router.push('/login'); return; }
    fetchInquiries();
  }, [user]);

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/inquiries');
      setInquiries(res.data || []);
    } catch {
      toast.error('Failed to fetch inquiries');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put('/admin/inquiries/' + id, { status });
      toast.success('Status updated');
      setInquiries(prev => prev.map(i => i.id === id ? { ...i, status } : i));
    } catch {
      toast.error('Failed to update status');
    }
  };

  const filtered = inquiries.filter(i => {
    const matchSearch = !search ||
      i.name?.toLowerCase().includes(search.toLowerCase()) ||
      i.email?.toLowerCase().includes(search.toLowerCase()) ||
      i.property_title?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !filterStatus || i.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const counts = {
    total: inquiries.length,
    new: inquiries.filter(i => i.status === 'new').length,
    contacted: inquiries.filter(i => i.status === 'contacted').length,
    closed: inquiries.filter(i => i.status === 'closed').length,
  };

  return (
    <div className="min-h-screen bg-lightBg">
      <div className="bg-primary text-white py-8">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Manage Inquiries</h1>
            <p className="text-gray-300 mt-1">Track and respond to all property inquiries</p>
          </div>
          <Link href="/admin" className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm transition">
            <FiArrowLeft size={15} /> Dashboard
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total', count: counts.total, color: 'text-gray-900' },
            { label: 'New', count: counts.new, color: 'text-blue-600' },
            { label: 'Contacted', count: counts.contacted, color: 'text-yellow-600' },
            { label: 'Closed', count: counts.closed, color: 'text-green-600' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center">
              <div className={`text-3xl font-bold mb-1 ${s.color}`}>{s.count}</div>
              <div className="text-sm text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="relative flex-1 min-w-48">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search by name, email or property..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-primary text-sm" />
          </div>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            className="border border-gray-200 rounded-xl px-4 py-2.5 bg-white text-sm focus:outline-none focus:border-primary">
            <option value="">All Status</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="scheduled">Scheduled</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        {/* Inquiries List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-gray-500">Loading inquiries...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center">
              <FiMessageSquare size={48} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500">No inquiries found</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {filtered.map(inq => (
                <div key={inq.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-wrap justify-between items-start gap-4 mb-3">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {inq.name?.[0]?.toUpperCase() || '?'}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900">{inq.name}</h3>
                          <p className="text-sm text-gray-500">{inq.email} • {inq.phone}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                        inq.status === 'new' ? 'bg-blue-100 text-blue-700' :
                        inq.status === 'contacted' ? 'bg-yellow-100 text-yellow-700' :
                        inq.status === 'scheduled' ? 'bg-purple-100 text-purple-700' :
                        'bg-green-100 text-green-700'
                      }`}>{inq.status}</span>
                      <select value={inq.status} onChange={e => updateStatus(inq.id, e.target.value)}
                        className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:border-primary bg-white">
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="scheduled">Scheduled</option>
                        <option value="closed">Closed</option>
                      </select>
                    </div>
                  </div>

                  <div className="ml-12">
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-2">
                      <span className="font-medium text-gray-800">
                        🏠 <Link href={'/properties/' + inq.property_id} className="hover:text-primary">{inq.property_title || 'Property #' + inq.property_id}</Link>
                      </span>
                      <span className="capitalize bg-gray-100 px-2 py-0.5 rounded text-xs">{inq.inquiry_type?.replace('_', ' ')}</span>
                      <span className="text-gray-400 text-xs">{new Date(inq.created_at).toLocaleString('en-IN')}</span>
                    </div>
                    {inq.message && (
                      <p className="text-gray-600 text-sm bg-gray-50 rounded-lg p-3 mt-2">{inq.message}</p>
                    )}
                    <div className="flex gap-3 mt-3">
                      <a href={'mailto:' + inq.email} className="text-xs text-primary hover:underline">✉ Reply via Email</a>
                      {inq.phone && <a href={'tel:' + inq.phone} className="text-xs text-green-600 hover:underline">📞 Call</a>}
                      {inq.phone && <a href={'https://wa.me/' + inq.phone.replace(/\D/g, '')} target="_blank" rel="noopener noreferrer" className="text-xs text-green-600 hover:underline">💬 WhatsApp</a>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
