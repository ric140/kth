
import React, { useState, useEffect } from 'react';
import { ServiceListing } from '../types';
import ServiceListingCard from '../components/ServiceListingCard';
import SkeletonCard from '../components/SkeletonCard';
import { useDB } from '../contexts/DatabaseContext';
import { getAll, STORES } from '../utils/db';

const MobileAppPage: React.FC = () => {
  const [listings, setListings] = useState<ServiceListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { db } = useDB();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      if (db) {
        try {
          const allListings = await getAll<ServiceListing>(db, STORES.LISTINGS);
          setListings(allListings.filter(l => l.categoryId === 'cat-app-design'));
        } catch (e) {
          console.error("Failed to fetch app designs", e);
        }
      }
      setIsLoading(false);
    };

    fetchData();
  }, [db]);

  return (
    <div className="space-y-10">
      <div className="text-center py-10">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600 mb-4">
            Mobile App Design Studio
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
            From wireframes to high-fidelity prototypes. We create user experiences that delight and convert on iOS and Android.
        </p>
      </div>

      {isLoading ? (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(2)].map((_, i) => <SkeletonCard key={i} />)}
         </div>
      ) : listings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {listings.map(listing => (
            <div key={listing.id} className="transform hover:-translate-y-2 transition duration-300">
                <ServiceListingCard listing={listing} />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center">No design packages found.</p>
      )}
    </div>
  );
};

export default MobileAppPage;
