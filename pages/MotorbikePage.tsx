
import React, { useState, useEffect } from 'react';
import { ServiceListing, Motorbike } from '../types';
import ServiceListingCard from '../components/ServiceListingCard';
import SkeletonCard from '../components/SkeletonCard';
import { useDB } from '../contexts/DatabaseContext';
import { getAll, STORES } from '../utils/db';

const MotorbikePage: React.FC = () => {
  const [listings, setListings] = useState<ServiceListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'rent' | 'sale'>('all');
  const { db } = useDB();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      if (db) {
        try {
          const allListings = await getAll<ServiceListing>(db, STORES.LISTINGS);
          const bikeListings = allListings.filter(l => l.categoryId === 'cat-motorbike');
          setListings(bikeListings);
        } catch (e) {
          console.error("Failed to fetch motorbikes", e);
        }
      }
      setIsLoading(false);
    };

    fetchData();
  }, [db]);

  const filteredListings = listings.filter(item => {
    const details = item.details as Motorbike;
    if (filter === 'rent') return !details.salePrice;
    if (filter === 'sale') return !!details.salePrice;
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white p-8 rounded-xl shadow-lg relative overflow-hidden">
        <div className="relative z-10">
            <h1 className="text-4xl font-extrabold mb-2">Motorbike Hub</h1>
            <p className="text-gray-300 text-lg">Rent a ride for the day or buy your freedom forever.</p>
            
            <div className="flex gap-4 mt-6">
                <button 
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 rounded-full font-semibold transition ${filter === 'all' ? 'bg-secondary text-primary' : 'bg-gray-700 hover:bg-gray-600'}`}
                >
                    All Bikes
                </button>
                <button 
                    onClick={() => setFilter('rent')}
                    className={`px-4 py-2 rounded-full font-semibold transition ${filter === 'rent' ? 'bg-secondary text-primary' : 'bg-gray-700 hover:bg-gray-600'}`}
                >
                    For Rent
                </button>
                <button 
                    onClick={() => setFilter('sale')}
                    className={`px-4 py-2 rounded-full font-semibold transition ${filter === 'sale' ? 'bg-secondary text-primary' : 'bg-gray-700 hover:bg-gray-600'}`}
                >
                    For Sale
                </button>
            </div>
        </div>
        <div className="absolute right-0 top-0 h-full w-1/3 opacity-20 transform translate-x-10">
             <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                 <path d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
             </svg>
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : filteredListings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredListings.map(listing => (
            <ServiceListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          No motorbikes found for this category.
        </div>
      )}
    </div>
  );
};

export default MotorbikePage;
