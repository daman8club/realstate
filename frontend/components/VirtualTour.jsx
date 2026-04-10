'use client';

import { useState } from 'react';

const DEMO_ROOMS = [
  { id: 'living', label: 'Living Room', icon: '🛋️', bg: 'from-amber-800 to-amber-600' },
  { id: 'bedroom', label: 'Master Bedroom', icon: '🛏️', bg: 'from-blue-800 to-blue-600' },
  { id: 'kitchen', label: 'Kitchen', icon: '🍳', bg: 'from-green-800 to-green-600' },
  { id: 'bathroom', label: 'Bathroom', icon: '🚿', bg: 'from-cyan-800 to-cyan-600' },
  { id: 'balcony', label: 'Balcony', icon: '🌇', bg: 'from-orange-700 to-orange-500' },
];

const ROOM_IMAGES = {
  living: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&q=80',
  bedroom: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1200&q=80',
  kitchen: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&q=80',
  bathroom: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1200&q=80',
  balcony: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80',
};

export default function VirtualTour({ tourUrl, propertyTitle, onClose }) {
  const [activeRoom, setActiveRoom] = useState('living');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewMode, setViewMode] = useState(tourUrl ? 'embed' : 'panorama');
  const [rotating, setRotating] = useState(false);

  return (
    <div className={`bg-gray-900 rounded-2xl overflow-hidden flex flex-col ${isFullscreen ? 'fixed inset-0 z-[100] rounded-none' : 'w-full max-w-4xl max-h-[90vh]'}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 bg-black/50 backdrop-blur-sm border-b border-white/10">
        <div className="flex items-center gap-3">
          <span className="text-white text-xl">🏠</span>
          <div>
            <h3 className="text-white font-bold text-sm">3D Virtual Tour</h3>
            <p className="text-gray-400 text-xs line-clamp-1">{propertyTitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex bg-white/10 rounded-lg overflow-hidden text-xs">
            {tourUrl && (
              <button onClick={() => setViewMode('embed')}
                className={`px-3 py-1.5 font-medium transition ${viewMode === 'embed' ? 'bg-primary text-white' : 'text-gray-300 hover:text-white'}`}>
                360° Tour
              </button>
            )}
            <button onClick={() => setViewMode('panorama')}
              className={`px-3 py-1.5 font-medium transition ${viewMode === 'panorama' ? 'bg-primary text-white' : 'text-gray-300 hover:text-white'}`}>
              Room View
            </button>
          </div>
          <button onClick={() => setIsFullscreen(!isFullscreen)}
            className="text-gray-400 hover:text-white p-1.5 hover:bg-white/10 rounded-lg transition text-sm">
            {isFullscreen ? '⊡' : '⛶'}
          </button>
          {onClose && (
            <button onClick={onClose} className="text-gray-400 hover:text-white p-1.5 hover:bg-white/10 rounded-lg transition">✕</button>
          )}
        </div>
      </div>

      {/* Main Viewer */}
      <div className="flex-1 relative overflow-hidden" style={{ minHeight: '400px' }}>
        {viewMode === 'embed' && tourUrl ? (
          <iframe src={tourUrl} className="w-full h-full border-0" allowFullScreen title="3D Virtual Tour" />
        ) : (
          <div className="relative w-full h-full">
            {/* Room Image */}
            <img
              src={ROOM_IMAGES[activeRoom]}
              alt={activeRoom}
              className={`w-full h-full object-cover transition-all duration-700 ${rotating ? 'scale-110 blur-sm' : 'scale-100'}`}
            />

            {/* Overlay UI */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

            {/* 360 indicator */}
            <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              360° View — {DEMO_ROOMS.find(r => r.id === activeRoom)?.label}
            </div>

            {/* Navigation arrows */}
            <button
              onClick={() => {
                setRotating(true);
                const idx = DEMO_ROOMS.findIndex(r => r.id === activeRoom);
                setTimeout(() => {
                  setActiveRoom(DEMO_ROOMS[(idx - 1 + DEMO_ROOMS.length) % DEMO_ROOMS.length].id);
                  setRotating(false);
                }, 300);
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white w-10 h-10 rounded-full flex items-center justify-center text-xl transition backdrop-blur-sm">
              ‹
            </button>
            <button
              onClick={() => {
                setRotating(true);
                const idx = DEMO_ROOMS.findIndex(r => r.id === activeRoom);
                setTimeout(() => {
                  setActiveRoom(DEMO_ROOMS[(idx + 1) % DEMO_ROOMS.length].id);
                  setRotating(false);
                }, 300);
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white w-10 h-10 rounded-full flex items-center justify-center text-xl transition backdrop-blur-sm">
              ›
            </button>

            {/* Hotspots */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/3 left-1/3 pointer-events-auto">
                <div className="w-6 h-6 bg-white/80 rounded-full flex items-center justify-center cursor-pointer hover:scale-125 transition animate-pulse shadow-lg" title="Click to explore">
                  <span className="text-primary text-xs font-bold">+</span>
                </div>
              </div>
              <div className="absolute top-1/2 right-1/3 pointer-events-auto">
                <div className="w-6 h-6 bg-white/80 rounded-full flex items-center justify-center cursor-pointer hover:scale-125 transition animate-pulse shadow-lg" title="Click to explore">
                  <span className="text-primary text-xs font-bold">+</span>
                </div>
              </div>
            </div>

            {/* Bottom info */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-xs">
              Use arrows to navigate between rooms
            </div>
          </div>
        )}
      </div>

      {/* Room Selector */}
      <div className="bg-black/80 backdrop-blur-sm px-4 py-3 border-t border-white/10">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {DEMO_ROOMS.map(room => (
            <button key={room.id} onClick={() => {
              setRotating(true);
              setTimeout(() => { setActiveRoom(room.id); setRotating(false); }, 300);
              if (viewMode !== 'panorama') setViewMode('panorama');
            }}
              className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeRoom === room.id && viewMode === 'panorama'
                  ? 'bg-primary text-white shadow-lg scale-105'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
              }`}>
              <span>{room.icon}</span>
              <span>{room.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
