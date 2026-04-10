'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { FiArrowLeft, FiPlus, FiTrash2, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function ManageAgents() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: 'agent123',
    specialization: '', experience_years: '', bio: '', whatsapp: ''
  });

  useEffect(() => {
    if (!user) { router.push('/login'); return; }
    fetchAgents();
  }, [user]);

  const fetchAgents = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/agents');
      setAgents(res.data || []);
    } catch {
      toast.error('Failed to load agents');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/admin/agents', form);
      toast.success('Agent added successfully!');
      setShowForm(false);
      setForm({ name: '', email: '', phone: '', password: 'agent123', specialization: '', experience_years: '', bio: '', whatsapp: '' });
      fetchAgents();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add agent');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this agent? This will also delete their user account.')) return;
    try {
      await api.delete('/admin/agents/' + id);
      toast.success('Agent deleted');
      setAgents(prev => prev.filter(a => a.id !== id));
    } catch {
      toast.error('Failed to delete agent');
    }
  };

  const inp = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary bg-white";

  return (
    <div className="min-h-screen bg-lightBg">
      <div className="bg-primary text-white py-8">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Manage Agents</h1>
            <p className="text-gray-300 mt-1">{agents.length} agents registered</p>
          </div>
          <div className="flex gap-3">
            <Link href="/admin" className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm transition">
              <FiArrowLeft size={15} /> Dashboard
            </Link>
            <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-accent text-black px-4 py-2 rounded-lg text-sm font-bold hover:bg-yellow-400 transition">
              <FiPlus size={15} /> Add Agent
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : agents.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
            <p className="text-gray-500 mb-4">No agents yet.</p>
            <button onClick={() => setShowForm(true)} className="button-primary">Add First Agent</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.map(agent => (
              <div key={agent.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white text-xl font-bold">
                      {agent.name?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{agent.name}</h3>
                      <p className="text-sm text-gray-500">{agent.specialization || 'Real Estate Agent'}</p>
                    </div>
                  </div>
                  <button onClick={() => handleDelete(agent.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition">
                    <FiTrash2 size={16} />
                  </button>
                </div>
                <div className="space-y-1.5 text-sm text-gray-600">
                  <div>📧 {agent.email}</div>
                  {agent.phone && <div>📞 {agent.phone}</div>}
                  {agent.experience_years && <div>🏆 {agent.experience_years} yrs experience</div>}
                  {agent.properties_sold > 0 && <div>🏠 {agent.properties_sold} sold</div>}
                  {agent.rating && <div>⭐ {agent.rating} rating</div>}
                </div>
                {agent.bio && <p className="text-xs text-gray-500 mt-3 line-clamp-2">{agent.bio}</p>}
              </div>
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-xl font-bold text-gray-900">Add New Agent</h3>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-full"><FiX size={20} /></button>
            </div>
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name *</label>
                  <input required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className={inp} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email *</label>
                  <input required type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} className={inp} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone</label>
                  <input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} className={inp} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                  <input value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} className={inp} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">WhatsApp</label>
                  <input value={form.whatsapp} onChange={e => setForm(p => ({ ...p, whatsapp: e.target.value }))} placeholder="91XXXXXXXXXX" className={inp} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Specialization</label>
                  <input value={form.specialization} onChange={e => setForm(p => ({ ...p, specialization: e.target.value }))} className={inp} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Experience (Years)</label>
                  <input type="number" value={form.experience_years} onChange={e => setForm(p => ({ ...p, experience_years: e.target.value }))} className={inp} />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Bio</label>
                  <textarea value={form.bio} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))} rows={3} className={inp + ' resize-none'} />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 button-secondary py-3 rounded-xl">Cancel</button>
                <button type="submit" disabled={submitting} className="flex-1 button-primary py-3 rounded-xl disabled:opacity-60">
                  {submitting ? 'Adding...' : 'Add Agent'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
