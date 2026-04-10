'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function PropertyCard({ property, listView = false }) {
  const [isFavorite, setIsFavorite] = useState(false);

  const formatPrice = (price) => {
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(1)} Cr`;
    if (price >= 100000) return `₹${(price / 100000).toFixed(1)} L`;
    return `₹${price?.toLocaleString()}`;
  };

  const imgSrc = property.images?.[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=70';

  if (listView) {
    return (
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex">
        <div className="relative w-56 flex-shrink-0">
          <Image src={imgSrc} alt={property.title} fill className="object-cover" />
          {property.featured && (
            <div className="absolute top-3 left-3 bg-accent text-black px-2 py-0.5 rounded text-xs font-bold">Featured</div>
          )}
        </div>
        <div className="p-5 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-1">
              <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{property.title}</h3>
              <button onClick={() => setIsFavorite(!isFavorite)} className="p-1.5 hover:bg-gray-100 rounded-full ml-2">
                <span className={isFavorite ? 'text-red-500' : 'text-gray-400'}>♥</span>
              </button>
            </div>
            <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
              📍 {property.location}, {property.city}
            </div>
            <p className="text-gray-600 text-sm line-clamp-2 mb-3">{property.description}</p>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex gap-3 text-sm text-gray-600">
              {property.bhk && <span>🛏 {property.bhk} BHK</span>}
              {property.area_sqft && <span>📐 {property.area_sqft} sqft</span>}
              <span className="capitalize text-xs bg-gray-100 px-2 py-0.5 rounded">{property.property_type}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xl font-bold text-primary">{formatPrice(property.price)}</span>
              <Link href={`/properties/${property.id}`} className="button-primary py-2 px-4 text-sm rounded-xl">View</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all hover:-translate-y-1 group">
      <div className="relative h-52 bg-gray-200">
        <Image src={imgSrc} alt={property.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
        <button onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow hover:bg-white transition">
          <span className={`text-lg ${isFavorite ? 'text-red-500' : 'text-gray-400'}`}>♥</span>
        </button>
        {property.featured && (
          <div className="absolute top-3 left-3 bg-accent text-black px-3 py-1 rounded-lg text-xs font-bold">⭐ Featured</div>
        )}
        <div className="absolute bottom-3 left-3">
          <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
            property.status === 'available' ? 'bg-green-500 text-white' :
            property.status === 'sold' ? 'bg-red-500 text-white' : 'bg-yellow-500 text-black'
          }`}>{property.status}</span>
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-base font-bold text-gray-900 line-clamp-1 mb-1">{property.title}</h3>
        <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
          📍 {property.city}
        </div>
        <div className="flex gap-2 mb-4 text-sm text-gray-600 flex-wrap">
          {property.bhk && <span className="bg-gray-50 px-2 py-1 rounded-lg">🛏 {property.bhk} BHK</span>}
          {property.area_sqft && <span className="bg-gray-50 px-2 py-1 rounded-lg">📐 {property.area_sqft} sqft</span>}
          <span className="capitalize bg-gray-50 px-2 py-1 rounded-lg text-xs">{property.property_type}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-primary">{formatPrice(property.price)}</span>
          <Link href={`/properties/${property.id}`} className="button-primary py-2 px-4 text-sm rounded-xl">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
