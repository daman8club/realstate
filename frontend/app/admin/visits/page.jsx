'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { FiCalendar, FiSearch, FiArrowLeft } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function ManageVisits() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    if (!user) { router.push('/login'); return; }
    fetchVisits();
  }, [user]);

  const fetchVisits = async () => {
    try {
      const res = await api.get('/admin/visits');
      setVisits(res.data || []);
    } catch {
      toast.error('Failed to load visits');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/admin/visits/${id}`, { status });
      toast.success('Visit status updated');
      fetchVisits();
    } catch {
      toast.error('Failed to update status');
    }
  };

  const filtered = visits.filter(v => {
    const matchSearch = !search || v.visitor_name?.toLowerCase().includes(search.toLowerCase()) || v.title?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !filterStatus || v.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const statusCounts = {
    scheduled: visits.filter(v => v.status === 'scheduled').length,
    completed: visits.filter(v => v.status === 'completed').length,
    cancelled: visits.filter(v => v.status === 'cancelled').length,
    no_show: visits.filter(v => v.status === 'no_show').length,
  };

  return (
    <div className="min-h-screen bg-lightBg">
      <div className="bg-primary text-white py-8">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Manage Visits</h1>
            <p className="text-gray-300 mt-1">Track and manage all scheduled property visits</p>
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
            { label: 'Scheduled', count: statusCounts.scheduled, color: 'bg-blue-100 text-blue-700' },
            { label: 'Completed', count: statusCounts.completed, color: 'bg-green-100 text-green-700' },
            { label: 'Cancelled', count: statusCounts.cancelled, color: 'bg-red-100 text-red-700' },
            { label: 'No Show', count: statusCounts.no_show, color: 'bg-gray-100 text-gray-700' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center">
              <div className={`text-3xl font-bold mb-1 ${s.color.split(' ')[1]}`}>{s.count}</div>
              <div className="text-sm text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="relative flex-1 min-w-48">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search by visitor or property..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-primary text-sm" />
          </div>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            className="border border-gray-200 rounded-xl px-4 py-2.5 bg-white text-sm focus:outline-none focus:border-primary">
            <option value="">All Status</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="no_show">No Show</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-gray-500">Loading visits...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center">
              <FiCalendar size={48} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500">No visits found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {['Visitor', 'Property', 'Date & Time', 'Contact', 'Status', 'Actions'].map(h => (
                      <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map(visit => (
                    <tr key={visit.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="font-medium text-gray-900 text-sm">{visit.visitor_name}</div>
                      </td>
                      <td className="px-5 py-4">
                        <Link href={`/properties/${visit.property_id}`} className="text-primary hover:underline text-sm line-clamp-1">
                          {visit.title || `Property #${visit.property_id}`}
                        </Link>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-600">
                        <div>{new Date(visit.visit_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                        <div className="text-gray-400">{visit.visit_time}</div>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-600">
                        <div>{visit.visitor_email}</div>
                        <div className="text-gray-400">{visit.visitor_phone}</div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                          visit.status === 'scheduled' ? 'bg-blue-100 text-blue-700' :
                          visit.status === 'completed' ? 'bg-green-100 text-green-700' :
                          visit.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                        }`}>{visit.status}</span>
                      </td>
                      <td className="px-5 py-4">
                        <select value={visit.status} onChange={e => updateStatus(visit.id, e.target.value)}
                          className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:border-primary bg-white">
                          <option value="scheduled">Scheduled</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                          <option value="no_show">No Show</option>
                        </select>
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
