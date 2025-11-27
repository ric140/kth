
import React, { useMemo, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MOCK_SERVICE_CATEGORIES } from '../data/mockData';
import { ServiceListing } from '../types';
import ServiceListingCard from '../components/ServiceListingCard';
import SkeletonCard from '../components/SkeletonCard';
import { useDB } from '../contexts/DatabaseContext';
import { getAll, STORES } from '../utils/db';

const ServiceListPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [searchTerm, setSearchTerm] = useState('');
  const [listings, setListings] = useState<ServiceListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { db } = useDB();

  const category = useMemo(() => MOCK_SERVICE_CATEGORIES.find(c => c.id === categoryId), [categoryId]);
  
  useEffect(() => {
    const fetchData = async () => {
        setIsLoading(true);
        if (db && categoryId) {
            try {
                const allListings = await getAll<ServiceListing>(db, STORES.LISTINGS);
                // Filter by category
                const catListings = allListings.filter(l => l.categoryId === categoryId);
                setListings(catListings);
            } catch (e) {
                console.error("Failed to fetch listings", e);
            }
        }
        setIsLoading(false);
    };

    fetchData();
  }, [categoryId, db]);

  const filteredListings = useMemo(() => {
    return listings
      .filter(l => l.title.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [listings, searchTerm]);

  if (!category) {
    return <div className="text-center text-red-500">Category not found.</div>;
  }

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h1 className="text-3xl font-bold text-primary">{category.name}</h1>
        <p className="text-gray-600 mt-2">{category.description}</p>
        <div className="mt-4">
          <input
            type="text"
            placeholder={`Search in ${category.name}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      ) : filteredListings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredListings.map(listing => (
            <ServiceListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-lg shadow-sm">
          <p className="text-xl text-gray-500">No listings found for this category.</p>
        </div>
      )}
    </div>
  );
};

export default ServiceListPage;
