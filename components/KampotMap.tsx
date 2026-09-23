import React, { useState, useMemo, useEffect } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow, useMap } from '@vis.gl/react-google-maps';
import { ServiceListing } from '../types';
import firebaseConfig from '../firebase-applet-config.json';
import { Link } from 'react-router-dom';

// Kampot, Cambodia Center Coordinates
export const KAMPOT_CENTER = { lat: 10.5942, lng: 104.1815 };

interface KampotMapProps {
  listings: ServiceListing[];
  selectedListingId?: string | null;
  onSelectListing?: (listing: ServiceListing | null) => void;
  className?: string;
  zoom?: number;
  center?: { lat: number; lng: number };
  showFilterBar?: boolean;
  mapHeight?: string;
  singleListingMode?: boolean;
}

// Map Controller for smooth pan/zoom when a listing is selected
const MapController: React.FC<{ target?: { lat: number; lng: number } | null; zoom?: number }> = ({ target, zoom = 15 }) => {
  const map = useMap();
  useEffect(() => {
    if (map && target) {
      map.panTo(target);
      if (zoom) map.setZoom(zoom);
    }
  }, [map, target, zoom]);
  return null;
};

const categoryPinColors: Record<string, { bg: string; border: string; glyph: string; label: string }> = {
  'cat-motorbike': { bg: '#E65100', border: '#BF360C', glyph: '#FFF', label: 'Motorbike Hub' },
  'cat-tech': { bg: '#004D40', border: '#00251A', glyph: '#FFF', label: 'Tech Solutions' },
  'cat-app-design': { bg: '#0288D1', border: '#01579B', glyph: '#FFF', label: 'App Design' },
  'cat-visa': { bg: '#6A1B9A', border: '#4A148C', glyph: '#FFF', label: 'Visa Services' },
};

export const KampotMap: React.FC<KampotMapProps> = ({
  listings,
  selectedListingId,
  onSelectListing,
  className = '',
  zoom = 14,
  center = KAMPOT_CENTER,
  showFilterBar = true,
  mapHeight = '480px',
  singleListingMode = false,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeListing, setActiveListing] = useState<ServiceListing | null>(null);
  const [hasMapLoadError, setHasMapLoadError] = useState(false);

  // Retrieve API Key
  const apiKey = ((import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY as string) || firebaseConfig.apiKey || '';

  // Filter listings with valid coordinates
  const validListings = useMemo(() => {
    return listings.filter(l => l.location && typeof l.location.lat === 'number' && typeof l.location.lng === 'number');
  }, [listings]);

  const filteredListings = useMemo(() => {
    if (activeCategory === 'all') return validListings;
    return validListings.filter(l => l.categoryId === activeCategory);
  }, [validListings, activeCategory]);

  // Synchronize selection
  useEffect(() => {
    if (selectedListingId) {
      const match = listings.find(l => l.id === selectedListingId);
      if (match) setActiveListing(match);
    }
  }, [selectedListingId, listings]);

  const handleMarkerClick = (listing: ServiceListing) => {
    setActiveListing(listing);
    if (onSelectListing) {
      onSelectListing(listing);
    }
  };

  const mapCenter = activeListing?.location
    ? { lat: activeListing.location.lat, lng: activeListing.location.lng }
    : center;

  // Fallback interactive graphic map if no valid API key or Google script blocked
  if (!apiKey || hasMapLoadError) {
    return (
      <div className={`relative bg-slate-900 rounded-xl overflow-hidden border border-slate-700 shadow-md ${className}`} style={{ minHeight: mapHeight }}>
        {/* Banner */}
        <div className="absolute top-3 left-3 right-3 z-10 bg-slate-800/95 backdrop-blur-md text-slate-100 p-3 rounded-lg border border-slate-600/50 shadow flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-semibold text-slate-200">Interactive Kampot Service Map (Visual Preview)</span>
          </div>
          <span className="text-[11px] text-slate-400">Kampot Province, Cambodia</span>
        </div>

        {/* SVG Styled Cartographic Illustration */}
        <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-slate-300">
          <svg className="w-full max-w-lg h-64 text-emerald-500/20 my-4" viewBox="0 0 600 350" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 20 C 180 80, 220 180, 320 220 C 420 260, 480 320, 520 350" stroke="#004D40" strokeWidth="48" strokeLinecap="round" opacity="0.4" />
            <path d="M100 20 C 180 80, 220 180, 320 220 C 420 260, 480 320, 520 350" stroke="#4DB6AC" strokeWidth="24" strokeLinecap="round" opacity="0.6" />
            <circle cx="300" cy="180" r="14" fill="#E65100" />
            <circle cx="300" cy="180" r="28" stroke="#E65100" strokeWidth="2" strokeDasharray="4 4" opacity="0.6" />
            <text x="320" y="185" fill="#E2E8F0" fontSize="13" fontWeight="bold">Durian Roundabout</text>
            <circle cx="240" cy="220" r="10" fill="#004D40" />
            <text x="140" y="240" fill="#80CBC4" fontSize="11">Tech Hub Old Market</text>
            <circle cx="380" cy="120" r="10" fill="#6A1B9A" />
            <text x="400" y="125" fill="#CE93D8" fontSize="11">Riverside Visa Desk</text>
            <circle cx="210" cy="290" r="10" fill="#0288D1" />
            <text x="230" y="295" fill="#81D4FA" fontSize="11">Fish Island Design Studio</text>
          </svg>

          {/* Service points in Kampot */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 w-full max-w-2xl text-left mt-2">
            {filteredListings.slice(0, 4).map(item => (
              <div key={item.id} className="bg-slate-800/90 border border-slate-700 p-2.5 rounded-lg text-xs hover:border-emerald-500 transition-colors">
                <p className="font-semibold text-white truncate">{item.title}</p>
                <p className="text-slate-400 text-[11px] truncate">{item.location?.address}</p>
                <div className="mt-1 flex items-center justify-between text-[11px]">
                  <span className="text-secondary font-bold">${item.price}</span>
                  <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.location?.address || 'Kampot Cambodia')}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-emerald-400 hover:underline"
                  >
                    View on Maps &rarr;
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative bg-gray-100 rounded-xl overflow-hidden shadow-lg border border-gray-200 flex flex-col ${className}`}>
      {/* Category filter pills (if enabled and not in single item mode) */}
      {showFilterBar && !singleListingMode && (
        <div className="p-3 bg-white border-b border-gray-200 flex items-center gap-2 overflow-x-auto no-scrollbar z-10">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1 mr-2 hidden sm:inline">
            Locations:
          </span>
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeCategory === 'all'
                ? 'bg-primary text-white shadow-sm'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Services ({validListings.length})
          </button>
          <button
            onClick={() => setActiveCategory('cat-motorbike')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeCategory === 'cat-motorbike'
                ? 'bg-[#E65100] text-white shadow-sm'
                : 'bg-orange-50 text-orange-800 hover:bg-orange-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#E65100]"></span>
            Motorbikes
          </button>
          <button
            onClick={() => setActiveCategory('cat-tech')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeCategory === 'cat-tech'
                ? 'bg-primary text-white shadow-sm'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-primary"></span>
            Tech Solutions
          </button>
          <button
            onClick={() => setActiveCategory('cat-app-design')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeCategory === 'cat-app-design'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'bg-sky-50 text-sky-800 hover:bg-sky-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-sky-600"></span>
            Mobile Apps
          </button>
          <button
            onClick={() => setActiveCategory('cat-visa')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeCategory === 'cat-visa'
                ? 'bg-purple-700 text-white shadow-sm'
                : 'bg-purple-50 text-purple-800 hover:bg-purple-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-purple-700"></span>
            Visa Services
          </button>
        </div>
      )}

      {/* Google Map Container */}
      <div className="relative w-full flex-grow" style={{ height: mapHeight, minHeight: '320px' }}>
        <APIProvider apiKey={apiKey} onError={() => setHasMapLoadError(true)}>
          <Map
            defaultCenter={mapCenter}
            defaultZoom={singleListingMode ? 16 : zoom}
            gestureHandling="greedy"
            disableDefaultUI={false}
            mapId="DEMO_MAP_ID"
            // MANDATORY OVERRIDE from Google Maps Skill:
            internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
            style={{ width: '100%', height: '100%' }}
          >
            <MapController target={activeListing?.location ? { lat: activeListing.location.lat, lng: activeListing.location.lng } : null} />

            {/* Render Advanced Markers for each service listing */}
            {filteredListings.map((listing) => {
              if (!listing.location) return null;
              const isSelected = activeListing?.id === listing.id;
              const colorInfo = categoryPinColors[listing.categoryId] || { bg: '#004D40', border: '#00251A', glyph: '#FFF', label: 'Service' };

              return (
                <AdvancedMarker
                  key={listing.id}
                  position={{ lat: listing.location.lat, lng: listing.location.lng }}
                  onClick={() => handleMarkerClick(listing)}
                  title={listing.title}
                >
                  <Pin
                    background={colorInfo.bg}
                    borderColor={isSelected ? '#FFD700' : colorInfo.border}
                    glyphColor={colorInfo.glyph}
                    scale={isSelected ? 1.3 : 1.0}
                  />
                </AdvancedMarker>
              );
            })}

            {/* InfoWindow for selected listing */}
            {activeListing && activeListing.location && (
              <InfoWindow
                position={{ lat: activeListing.location.lat, lng: activeListing.location.lng }}
                onCloseClick={() => {
                  setActiveListing(null);
                  if (onSelectListing) onSelectListing(null);
                }}
              >
                <div className="p-1 max-w-[260px] text-gray-900 font-sans">
                  {activeListing.imagesUrls && activeListing.imagesUrls.length > 0 && (
                    <img
                      src={activeListing.imagesUrls[0]}
                      alt={activeListing.title}
                      className="w-full h-28 object-cover rounded-md mb-2"
                    />
                  )}
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-secondary bg-secondary/10 px-2 py-0.5 rounded-full">
                      {categoryPinColors[activeListing.categoryId]?.label || 'Kampot Service'}
                    </span>
                    <span className="text-sm font-bold text-primary">
                      ${activeListing.price}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-gray-900 line-clamp-1 leading-snug">
                    {activeListing.title}
                  </h4>
                  <p className="text-xs text-gray-500 mt-0.5 flex items-start gap-1">
                    <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="line-clamp-2">{activeListing.location.address}</span>
                  </p>
                  
                  {activeListing.location.landmark && (
                    <p className="text-[11px] text-emerald-700 font-medium mt-1">
                      📍 {activeListing.location.landmark}
                    </p>
                  )}

                  <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between gap-2">
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${activeListing.location.lat},${activeListing.location.lng}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 hover:underline"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                      Directions
                    </a>
                    <Link
                      to={`/service/${activeListing.id}`}
                      className="px-2.5 py-1 bg-primary text-white text-xs font-semibold rounded hover:bg-primary-dark transition-colors"
                    >
                      Details &rarr;
                    </Link>
                  </div>
                </div>
              </InfoWindow>
            )}
          </Map>
        </APIProvider>

        {/* Map Legend Badge */}
        <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-md border border-gray-200 text-[11px] text-gray-700 hidden sm:flex items-center gap-3 pointer-events-none">
          <span className="font-semibold text-gray-900">Kampot Hub</span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#E65100]"></span> Motorbikes
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-primary"></span> Tech
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-purple-700"></span> Visa
          </span>
        </div>
      </div>
    </div>
  );
};

export default KampotMap;
