'use client';

import { useState } from 'react';
import { FiCalendar, FiClock, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '@/lib/api';

const timeSlots = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

export default function ScheduleVisit({ propertyId, propertyTitle, onClose }) {
  const [form, setForm] = useState({
    visitor_name: '', visitor_email: '', visitor_phone: '',
    visit_date: '', visit_time: '', notes: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.visit_time) { toast.error('Please select a time slot'); return; }
    setSubmitting(true);
    try {
      await api.post('/visits/schedule', { ...form, property_id: propertyId });
      toast.success('Visit scheduled successfully! We will confirm shortly.');
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to schedule visit');
    } finally {
      setSubmitting(false);
    }
  };

  const update = (k, v) => setForm(p => ({ ...p, [k]: v }));

  return (
    <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-5">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Schedule a Visit</h3>
          <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">{propertyTitle}</p>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition">
          <FiX size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name *</label>
            <input required placeholder="Your name" value={form.visitor_name} onChange={e => update('visitor_name', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary text-sm" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone *</label>
            <input required placeholder="+91 98765 43210" value={form.visitor_phone} onChange={e => update('visitor_phone', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary text-sm" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email *</label>
          <input required type="email" placeholder="you@example.com" value={form.visitor_email} onChange={e => update('visitor_email', e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary text-sm" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            <FiCalendar className="inline mr-1" />Visit Date *
          </label>
          <input required type="date" min={today} value={form.visit_date} onChange={e => update('visit_date', e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary text-sm" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <FiClock className="inline mr-1" />Preferred Time *
          </label>
          <div className="grid grid-cols-3 gap-2">
            {timeSlots.map(slot => (
              <button key={slot} type="button" onClick={() => update('visit_time', slot)}
                className={`py-2 rounded-lg text-sm font-medium border transition-all ${
                  form.visit_time === slot
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-primary'
                }`}>
                {slot}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Notes (Optional)</label>
          <textarea placeholder="Any specific requirements or questions..." value={form.notes} onChange={e => update('notes', e.target.value)}
            rows={2} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary text-sm resize-none" />
        </div>

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="flex-1 button-secondary py-3 rounded-xl">Cancel</button>
          <button type="submit" disabled={submitting} className="flex-1 button-primary py-3 rounded-xl disabled:opacity-60">
            {submitting ? 'Scheduling...' : 'Confirm Visit'}
          </button>
        </div>
      </form>
    </div>
  );
}
