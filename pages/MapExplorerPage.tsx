import React, { useState, useEffect } from 'react';
import { useDB } from '../contexts/DatabaseContext';
import { getAll, STORES } from '../utils/db';
import { ServiceListing } from '../types';
import KampotMap, { KAMPOT_CENTER } from '../components/KampotMap';
import { Link } from 'react-router-dom';

const categoryLabels: Record<string, string> = {
  'cat-motorbike': 'Motorbikes',
  'cat-tech': 'Tech Solutions',
  'cat-app-design': 'Mobile Apps',
  'cat-visa': 'Visa Services',
};

const MapExplorerPage: React.FC = () => {
  const { db } = useDB();
  const [listings, setListings] = useState<ServiceListing[]>([]);
  const [selectedListing, setSelectedListing] = useState<ServiceListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  useEffect(() => {
    const fetchListings = async () => {
      if (db) {
        try {
          const allItems = await getAll<ServiceListing>(db, STORES.LISTINGS);
          setListings(allItems);
        } catch (e) {
          console.error('Error fetching listings for map:', e);
        }
      }
      setLoading(false);
    };
    fetchListings();
  }, [db]);

  const filteredListings = listings.filter((l) => {
    if (filterCategory === 'all') return true;
    return l.categoryId === filterCategory;
  });

  if (loading) {
    return (
      <div className="min-h-[500px] flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-3"></div>
          <p className="text-gray-500 font-medium">Loading Kampot service locations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-primary to-primary-dark text-white rounded-2xl p-6 sm:p-8 shadow-md">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-semibold tracking-wider text-secondary mb-3 backdrop-blur-sm">
            <span>📍 Google Maps Platform Enabled</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Kampot Hub Interactive Map
          </h1>
          <p className="text-emerald-100 text-sm sm:text-base mt-2 leading-relaxed">
            Locate trusted local service providers across Krong Kampot. From motorbike rentals near the Durian Monument to riverside tech hubs and visa offices.
          </p>
        </div>
      </div>

      {/* Main Grid: Sidebar Listings + Google Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Listings Navigator */}
        <div className="lg:col-span-4 flex flex-col space-y-4">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Filter by Category
            </span>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="text-xs border border-gray-300 rounded-md px-2.5 py-1.5 bg-gray-50 text-gray-700 font-medium focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
            >
              <option value="all">All Categories ({listings.length})</option>
              <option value="cat-motorbike">Motorbikes</option>
              <option value="cat-tech">Tech Solutions</option>
              <option value="cat-app-design">Mobile App Design</option>
              <option value="cat-visa">Visa Services</option>
            </select>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
            {filteredListings.map((item) => {
              const isSelected = selectedListing?.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedListing(item)}
                  className={`p-3.5 transition-colors cursor-pointer hover:bg-emerald-50/40 flex items-start gap-3 ${
                    isSelected ? 'bg-emerald-50/80 border-l-4 border-primary' : ''
                  }`}
                >
                  <img
                    src={item.imagesUrls?.[0] || 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=200'}
                    alt={item.title}
                    className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-secondary">
                        {categoryLabels[item.categoryId] || 'Service'}
                      </span>
                      <span className="text-xs font-bold text-primary">${item.price}</span>
                    </div>
                    <h3 className="text-sm font-bold text-gray-900 truncate mt-0.5">
                      {item.title}
                    </h3>
                    <p className="text-xs text-gray-500 truncate flex items-center gap-1 mt-1">
                      <span>📍</span> {item.location?.address || 'Kampot, Cambodia'}
                    </p>
                    <div className="mt-2 flex items-center justify-between text-[11px]">
                      <span className="text-primary font-medium hover:underline">
                        Focus on map &rarr;
                      </span>
                      <Link
                        to={`/service/${item.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-gray-400 hover:text-gray-700 font-medium"
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Interactive Google Map */}
        <div className="lg:col-span-8">
          <KampotMap
            listings={filteredListings}
            selectedListingId={selectedListing?.id}
            onSelectListing={(listing) => setSelectedListing(listing)}
            mapHeight="660px"
            center={selectedListing?.location ? { lat: selectedListing.location.lat, lng: selectedListing.location.lng } : KAMPOT_CENTER}
            zoom={selectedListing ? 16 : 14}
            showFilterBar={true}
          />
        </div>
      </div>
    </div>
  );
};

export default MapExplorerPage;
