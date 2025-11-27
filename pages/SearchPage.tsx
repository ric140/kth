
import React, { useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ServiceListing } from '../types';
import ServiceListingCard from '../components/ServiceListingCard';
import SkeletonCard from '../components/SkeletonCard';
import { useDB } from '../contexts/DatabaseContext';
import { getAll, STORES } from '../utils/db';

const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [isLoading, setIsLoading] = useState(true);
  const [allListings, setAllListings] = useState<ServiceListing[]>([]);
  const { db } = useDB();

  useEffect(() => {
      const fetchListings = async () => {
          setIsLoading(true);
          if (db) {
            try {
                const items = await getAll<ServiceListing>(db, STORES.LISTINGS);
                setAllListings(items);
            } catch (e) { console.error(e); }
          }
          setIsLoading(false);
      };
      fetchListings();
  }, [db]);

  const results = useMemo(() => {
    if (!query || allListings.length === 0) return [];
    const lowerQuery = query.toLowerCase();
    return allListings.filter(l => 
      l.title.toLowerCase().includes(lowerQuery) || 
      l.description.toLowerCase().includes(lowerQuery)
    );
  }, [query, allListings]);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h1 className="text-2xl font-bold text-gray-800">
          Search Results for <span className="text-primary">"{query}"</span>
        </h1>
        <p className="text-gray-600 mt-2">
          {isLoading ? 'Searching...' : `Found ${results.length} results`}
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(3)].map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {results.map(listing => (
            <ServiceListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-lg shadow-sm">
          <p className="text-xl text-gray-500">No services found matching your search.</p>
          <p className="text-gray-400 mt-2">Try different keywords or browse our categories.</p>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
