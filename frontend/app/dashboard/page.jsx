'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiUser, FiMessageSquare, FiCalendar, FiEdit2, FiLogOut, FiHome } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { useAuthStore } from '@/lib/store';

export default function DashboardPage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState({ name: '', phone: '', address: '' });
  const [inquiries, setInquiries] = useState([]);
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) { router.push('/login'); return; }
    setProfile({ name: user.name || '', phone: user.phone || '', address: user.address || '' });
    fetchInquiries();
    fetchVisits();
  }, [user]);

  const fetchInquiries = async () => {
    try {
      const res = await api.get('/inquiries/user/list');
      setInquiries(res.data || []);
    } catch { setInquiries([]); }
  };

  const fetchVisits = async () => {
    try {
      const res = await api.get('/visits/user/list');
      setVisits(res.data || []);
    } catch { setVisits([]); }
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/auth/profile', profile);
      toast.success('Profile updated successfully!');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
    toast.success('Logged out successfully');
  };

  const formatPrice = (price) => {
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(1)} Cr`;
    if (price >= 100000) return `₹${(price / 100000).toFixed(1)} L`;
    return `₹${price?.toLocaleString()}`;
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <FiUser /> },
    { id: 'inquiries', label: 'My Inquiries', icon: <FiMessageSquare /> },
    { id: 'visits', label: 'My Visits', icon: <FiCalendar /> },
  ];

  if (!user) return null;

  return (
    <div className="min-h-screen bg-lightBg">
      <div className="bg-primary text-white py-12">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center text-black text-2xl font-bold">
              {user.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <p className="text-gray-300">{user.email}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition">
            <FiLogOut /> Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8 flex-col md:flex-row">
          {/* Sidebar */}
          <aside className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {tabs.map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-6 py-4 text-left transition-colors ${activeTab === tab.id ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-50'}`}>
                  {tab.icon} {tab.label}
                </button>
              ))}
              <Link href="/properties"
                className="w-full flex items-center gap-3 px-6 py-4 text-gray-700 hover:bg-gray-50 transition-colors">
                <FiHome /> Browse Properties
              </Link>
            </div>
          </aside>

          {/* Content */}
          <div className="flex-1">
            {activeTab === 'profile' && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2"><FiEdit2 /> Edit Profile</h2>
                <form onSubmit={saveProfile} className="space-y-5 max-w-lg">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                    <input type="text" value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                    <input type="email" value={user.email} disabled
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                    <input type="tel" value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
                    <textarea value={profile.address} onChange={e => setProfile(p => ({ ...p, address: e.target.value }))}
                      rows={3} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary resize-none" />
                  </div>
                  <button type="submit" disabled={saving} className="button-primary py-3 px-8 rounded-xl disabled:opacity-60">
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'inquiries' && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-6">My Inquiries ({inquiries.length})</h2>
                {inquiries.length === 0 ? (
                  <div className="text-center py-12">
                    <FiMessageSquare size={48} className="mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-500">No inquiries yet.</p>
                    <Link href="/properties" className="button-primary mt-4 inline-block">Browse Properties</Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {inquiries.map(inq => (
                      <div key={inq.id} className="border border-gray-100 rounded-xl p-4 hover:border-primary transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <Link href={`/properties/${inq.property_id}`} className="font-semibold text-gray-900 hover:text-primary">{inq.title}</Link>
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                            inq.status === 'new' ? 'bg-blue-100 text-blue-700' :
                            inq.status === 'contacted' ? 'bg-yellow-100 text-yellow-700' :
                            inq.status === 'closed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                          }`}>{inq.status}</span>
                        </div>
                        <p className="text-gray-600 text-sm mb-2">{inq.message}</p>
                        <div className="flex justify-between text-xs text-gray-400">
                          <span className="capitalize">{inq.inquiry_type?.replace('_', ' ')}</span>
                          <span>{new Date(inq.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'visits' && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Scheduled Visits ({visits.length})</h2>
                {visits.length === 0 ? (
                  <div className="text-center py-12">
                    <FiCalendar size={48} className="mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-500">No visits scheduled yet.</p>
                    <Link href="/properties" className="button-primary mt-4 inline-block">Browse Properties</Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {visits.map(visit => (
                      <div key={visit.id} className="border border-gray-100 rounded-xl p-4 hover:border-primary transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <Link href={`/properties/${visit.property_id}`} className="font-semibold text-gray-900 hover:text-primary">{visit.title}</Link>
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                            visit.status === 'scheduled' ? 'bg-blue-100 text-blue-700' :
                            visit.status === 'completed' ? 'bg-green-100 text-green-700' :
                            visit.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                          }`}>{visit.status}</span>
                        </div>
                        <div className="flex gap-4 text-sm text-gray-600">
                          <span>📅 {new Date(visit.visit_date).toLocaleDateString()}</span>
                          <span>🕐 {visit.visit_time}</span>
                          <span>📍 {visit.location}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
