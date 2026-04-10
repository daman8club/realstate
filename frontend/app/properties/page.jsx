'use client';

import { Suspense } from 'react';
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import PropertyCard from '@/components/PropertyCard';
import api from '@/lib/api';

const propertyTypes = ['apartment', 'villa', 'townhouse', 'commercial', 'land'];
const bhkOptions = ['1', '2', '3', '4'];

function PropertiesContent() {
  const searchParams = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    city: searchParams.get('city') || '',
    type: searchParams.get('type') || '',
    minPrice: '',
    maxPrice: '',
    bhk: '',
    search: searchParams.get('search') || '',
  });

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([k, v]) => { if (v) params.set(k, v); });
      params.set('page', page);
      params.set('limit', 12);
      const res = await api.get(`/properties?${params}`);
      setProperties(res.data.data || []);
      setTotal(res.data.pagination?.total || 0);
    } catch {
      setProperties([]);
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => { fetchProperties(); }, [fetchProperties]);

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({ city: '', type: '', minPrice: '', maxPrice: '', bhk: '', search: '' });
    setPage(1);
  };

  const totalPages = Math.ceil(total / 12);

  return (
    <div className="min-h-screen bg-lightBg">
      <div className="bg-primary text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">Explore Properties</h1>
          <p className="text-gray-300">Find your perfect home from our curated listings</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-lg hover:border-primary transition-colors font-medium text-sm">
              🔧 Filters
              {Object.values(filters).some(v => v) && (
                <span className="bg-primary text-white text-xs px-2 py-0.5 rounded-full">Active</span>
              )}
            </button>
            <span className="text-gray-600 font-medium text-sm">
              {loading ? 'Loading...' : `${total} Properties Found`}
            </span>
          </div>
          <div className="flex border border-gray-200 rounded-lg overflow-hidden">
            <button onClick={() => setViewMode('grid')} className={`px-3 py-2 text-sm ${viewMode === 'grid' ? 'bg-primary text-white' : 'bg-white text-gray-600'}`}>Grid</button>
            <button onClick={() => setViewMode('list')} className={`px-3 py-2 text-sm ${viewMode === 'list' ? 'bg-primary text-white' : 'bg-white text-gray-600'}`}>List</button>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Filters Sidebar */}
          <aside className={`${showFilters ? 'block' : 'hidden'} md:block w-full md:w-72 flex-shrink-0`}>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-20">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-900 text-lg">Filters</h3>
                <button onClick={clearFilters} className="text-sm text-red-500 hover:text-red-700">✕ Clear</button>
              </div>

              <div className="mb-5">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Search</label>
                <input type="text" placeholder="Search properties..." value={filters.search}
                  onChange={e => updateFilter('search', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary" />
              </div>

              <div className="mb-5">
                <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
                <input type="text" placeholder="Enter city..." value={filters.city}
                  onChange={e => updateFilter('city', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary" />
              </div>

              <div className="mb-5">
                <label className="block text-sm font-semibold text-gray-700 mb-3">Property Type</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="type" value="" checked={filters.type === ''} onChange={() => updateFilter('type', '')} className="accent-primary" />
                    <span className="text-sm text-gray-700">All Types</span>
                  </label>
                  {propertyTypes.map(type => (
                    <label key={type} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="type" value={type} checked={filters.type === type} onChange={e => updateFilter('type', e.target.value)} className="accent-primary" />
                      <span className="text-sm text-gray-700 capitalize">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-5">
                <label className="block text-sm font-semibold text-gray-700 mb-3">BHK</label>
                <div className="flex flex-wrap gap-2">
                  {bhkOptions.map(b => (
                    <button key={b} onClick={() => updateFilter('bhk', filters.bhk === b ? '' : b)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${filters.bhk === b ? 'bg-primary text-white border-primary' : 'bg-white text-gray-700 border-gray-200 hover:border-primary'}`}>
                      {b} BHK
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">Price Range (₹)</label>
                <div className="space-y-2">
                  <input type="number" placeholder="Min Price" value={filters.minPrice}
                    onChange={e => updateFilter('minPrice', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary" />
                  <input type="number" placeholder="Max Price" value={filters.maxPrice}
                    onChange={e => updateFilter('maxPrice', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary" />
                </div>
              </div>

              <button onClick={fetchProperties} className="w-full button-primary py-3 rounded-xl">Apply Filters</button>
            </div>
          </aside>

          {/* Results */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(9)].map((_, i) => <div key={i} className="bg-white rounded-xl h-80 animate-pulse" />)}
              </div>
            ) : properties.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-bold text-gray-700 mb-2">No Properties Found</h3>
                <p className="text-gray-500 mb-6">Try adjusting your filters or search terms.</p>
                <button onClick={clearFilters} className="button-primary">Clear Filters</button>
              </div>
            ) : (
              <>
                <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
                  {properties.map(property => (
                    <PropertyCard key={property.id} property={property} listView={viewMode === 'list'} />
                  ))}
                </div>
                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-10">
                    <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                      className="px-4 py-2 border border-gray-200 rounded-lg disabled:opacity-50 hover:border-primary bg-white text-sm">
                      ← Previous
                    </button>
                    {[...Array(Math.min(5, totalPages))].map((_, i) => (
                      <button key={i + 1} onClick={() => setPage(i + 1)}
                        className={`px-4 py-2 rounded-lg text-sm transition-colors ${page === i + 1 ? 'bg-primary text-white' : 'border border-gray-200 bg-white hover:border-primary'}`}>
                        {i + 1}
                      </button>
                    ))}
                    <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                      className="px-4 py-2 border border-gray-200 rounded-lg disabled:opacity-50 hover:border-primary bg-white text-sm">
                      Next →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PropertiesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-lightBg">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-600">Loading properties...</p>
        </div>
      </div>
    }>
      <PropertiesContent />
    </Suspense>
  );
}
