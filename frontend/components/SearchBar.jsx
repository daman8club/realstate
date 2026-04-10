'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiSearch, FiMapPin } from 'react-icons/fi';

export default function SearchBar() {
  const router = useRouter();
  const [location, setLocation] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (location.trim()) {
      router.push(`/properties?city=${encodeURIComponent(location.trim())}`);
    } else {
      router.push('/properties');
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex gap-2">
      <div className="flex-1 flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl px-4 py-3">
        <FiMapPin className="text-white/70 flex-shrink-0" />
        <input
          type="text"
          placeholder="Enter Location (e.g., Koramangala, Bangalore)"
          value={location}
          onChange={e => setLocation(e.target.value)}
          className="w-full bg-transparent text-white placeholder-white/60 outline-none text-sm"
        />
      </div>
      <button type="submit"
        className="bg-accent text-black px-6 py-3 rounded-xl font-bold hover:bg-yellow-400 transition-colors flex items-center gap-2 whitespace-nowrap text-sm">
        <FiSearch size={16} /> Search
      </button>
    </form>
  );
}
