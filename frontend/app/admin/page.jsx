'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { FiHome, FiUsers, FiMessageSquare, FiCalendar, FiTrendingUp, FiPlus, FiEye, FiSettings } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#1e3c72', '#d4af37', '#10b981', '#ef4444'];

export default function AdminDashboard() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { router.push('/login'); return; }
    api.get('/admin/stats')
      .then(res => setStats(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-lightBg">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-gray-600">Loading dashboard...</p>
      </div>
    </div>
  );

  const statCards = [
    { label: 'Total Properties', value: stats?.total_properties || 0, icon: <FiHome size={22} />, color: 'bg-blue-500', change: '+12%' },
    { label: 'Available', value: stats?.available_properties || 0, icon: <FiTrendingUp size={22} />, color: 'bg-green-500', change: '+5%' },
    { label: 'Sold', value: stats?.sold_properties || 0, icon: <FiHome size={22} />, color: 'bg-purple-500', change: '+8%' },
    { label: 'Total Users', value: stats?.total_users || 0, icon: <FiUsers size={22} />, color: 'bg-orange-500', change: '+23%' },
    { label: 'New Inquiries', value: stats?.new_inquiries || 0, icon: <FiMessageSquare size={22} />, color: 'bg-red-500', change: '+15%' },
    { label: 'Total Inquiries', value: stats?.total_inquiries || 0, icon: <FiMessageSquare size={22} />, color: 'bg-indigo-500', change: '+10%' },
  ];

  const barData = [
    { name: 'Total', value: stats?.total_properties || 0 },
    { name: 'Available', value: stats?.available_properties || 0 },
    { name: 'Sold', value: stats?.sold_properties || 0 },
    { name: 'Users', value: stats?.total_users || 0 },
  ];

  const pieData = [
    { name: 'Available', value: stats?.available_properties || 0 },
    { name: 'Sold', value: stats?.sold_properties || 0 },
    { name: 'Under Offer', value: Math.max(0, (stats?.total_properties || 0) - (stats?.available_properties || 0) - (stats?.sold_properties || 0)) },
  ];

  const quickActions = [
    { href: '/admin/properties/new', label: 'Add Property', icon: <FiPlus />, color: 'bg-primary text-white' },
    { href: '/admin/properties', label: 'All Properties', icon: <FiHome />, color: 'bg-white border border-gray-200' },
    { href: '/admin/inquiries', label: 'Inquiries', icon: <FiMessageSquare />, color: 'bg-white border border-gray-200' },
    { href: '/admin/visits', label: 'Visits', icon: <FiCalendar />, color: 'bg-white border border-gray-200' },
    { href: '/admin/agents', label: 'Agents', icon: <FiUsers />, color: 'bg-white border border-gray-200' },
    { href: '/properties', label: 'View Site', icon: <FiEye />, color: 'bg-white border border-gray-200' },
  ];

  return (
    <div className="min-h-screen bg-lightBg">
      {/* Header */}
      <div className="bg-primary text-white py-8">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-gray-300 mt-1">Welcome back, {user?.name}</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/properties" className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm transition flex items-center gap-2">
              <FiEye size={15} /> View Site
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {statCards.map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className={`${stat.color} text-white w-10 h-10 rounded-xl flex items-center justify-center mb-3`}>
                {stat.icon}
              </div>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
              <div className="text-xs text-green-600 font-medium mt-1">{stat.change} this month</div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
          <h2 className="font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            {quickActions.map(action => (
              <Link key={action.href} href={action.href}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all hover:shadow-md ${action.color}`}>
                {action.icon} {action.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-bold text-gray-900 mb-6">Properties Overview</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="value" fill="#1e3c72" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-bold text-gray-900 mb-6">Property Status</h2>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-2 mt-2">
              {pieData.map((item, i) => (
                <div key={item.name} className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full" style={{ background: COLORS[i] }} />
                  <span className="text-gray-600">{item.name}: <strong>{item.value}</strong></span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Total Sales Value */}
        {stats?.total_sales_value > 0 && (
          <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-6 text-white">
            <p className="text-gray-300 text-sm mb-1">Total Sales Value</p>
            <p className="text-4xl font-bold text-accent">
              ₹{(stats.total_sales_value / 10000000).toFixed(1)} Cr
            </p>
            <p className="text-gray-300 text-sm mt-2">From {stats.sold_properties} sold properties</p>
          </div>
        )}
      </div>
    </div>
  );
}
