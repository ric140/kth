
import React, { useState, useEffect } from 'react';
import { ServiceListing } from '../types';
import ServiceListingCard from '../components/ServiceListingCard';
import SkeletonCard from '../components/SkeletonCard';
import { useDB } from '../contexts/DatabaseContext';
import { getAll, STORES } from '../utils/db';

const VisaPage: React.FC = () => {
  const [listings, setListings] = useState<ServiceListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { db } = useDB();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      if (db) {
        try {
          const allListings = await getAll<ServiceListing>(db, STORES.LISTINGS);
          setListings(allListings.filter(l => l.categoryId === 'cat-visa'));
        } catch (e) {
          console.error("Failed to fetch visa services", e);
        }
      }
      setIsLoading(false);
    };

    fetchData();
  }, [db]);

  return (
    <div className="space-y-8">
      <div className="bg-blue-50 border border-blue-100 p-8 rounded-xl text-center">
        <div className="inline-block p-3 bg-white rounded-full shadow-sm mb-4">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-primary">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z" />
            </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-800">Visa Assistance</h1>
        <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
          Navigate immigration with ease. We assist with extensions, renewals, and new applications.
        </p>
      </div>

      {isLoading ? (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
         </div>
      ) : listings.length > 0 ? (
        <div className="space-y-4">
          {listings.map(listing => (
             <div key={listing.id} className="transform transition hover:scale-[1.01]">
                {/* Reusing ListingCard but in a wider grid context */}
                 <ServiceListingCard listing={listing} />
             </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No visa services available at the moment.</p>
      )}
    </div>
  );
};

export default VisaPage;
