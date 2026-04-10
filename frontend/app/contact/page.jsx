'use client';

import { useState } from 'react';
import { FiMail, FiPhone, FiMapPin, FiClock, FiSend } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '@/lib/api';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/inquiries', { ...form, property_id: 1, inquiry_type: 'general' });
      toast.success("Message sent! We'll get back to you within 24 hours.");
      setForm({ name: '', email: '', phone: '', message: '' });
    } catch {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inp = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition bg-white";

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="bg-primary text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-accent font-semibold mb-3">GET IN TOUCH</p>
          <h1 className="text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-gray-300 text-lg">We're here to help you find your perfect property. Reach out anytime.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Contact Info */}
          <div className="space-y-6">
            {[
              { icon: <FiPhone size={22} />, title: 'Phone', lines: ['+91 1234567890', '+91 9876543210'], href: 'tel:+911234567890' },
              { icon: <FiMail size={22} />, title: 'Email', lines: ['info@techprop.com', 'support@techprop.com'], href: 'mailto:info@techprop.com' },
              { icon: <FiMapPin size={22} />, title: 'Office', lines: ['123 Tech Street, Koramangala', 'Bangalore - 560034, Karnataka'], href: null },
              { icon: <FiClock size={22} />, title: 'Business Hours', lines: ['Mon–Fri: 9:00 AM – 6:00 PM', 'Sat: 10:00 AM – 4:00 PM'], href: null },
            ].map(item => (
              <div key={item.title} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex gap-4">
                <div className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center text-primary flex-shrink-0">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                  {item.lines.map((line, i) => (
                    item.href && i === 0
                      ? <a key={i} href={item.href} className="block text-sm text-gray-600 hover:text-primary transition">{line}</a>
                      : <p key={i} className="text-sm text-gray-600">{line}</p>
                  ))}
                </div>
              </div>
            ))}

            {/* 24/7 AI Chat */}
            <div className="bg-primary text-white rounded-2xl p-6">
              <div className="text-3xl mb-3">🤖</div>
              <h3 className="font-bold text-lg mb-2">24/7 AI Chat Support</h3>
              <p className="text-gray-300 text-sm">Get instant answers anytime. Click the chat bubble at the bottom left of the screen.</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Send Us a Message</h2>
            <p className="text-gray-500 mb-8">Fill out the form and our team will get back to you within 24 hours.</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name *</label>
                  <input required placeholder="John Doe" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className={inp} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address *</label>
                  <input required type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} className={inp} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone Number</label>
                <input placeholder="+91 98765 43210" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} className={inp} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Message *</label>
                <textarea required placeholder="Tell us how we can help you..." value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                  rows={6} className={inp + ' resize-none'} />
              </div>
              <button type="submit" disabled={loading}
                className="w-full button-primary py-4 rounded-xl text-base flex items-center justify-center gap-2 disabled:opacity-60">
                <FiSend size={18} />
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
