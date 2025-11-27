
import React, { useState, useEffect } from 'react';
import { ServiceListing } from '../types';
import ServiceListingCard from '../components/ServiceListingCard';
import SkeletonCard from '../components/SkeletonCard';
import { useDB } from '../contexts/DatabaseContext';
import { getAll, STORES } from '../utils/db';
import RequestQuoteModal from '../components/RequestQuoteModal';
import { useAuth } from '../hooks/useAuth';
import AuthModal from '../components/AuthModal';

const TechPage: React.FC = () => {
  const [listings, setListings] = useState<ServiceListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { db } = useDB();
  const { user } = useAuth();
  
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      if (db) {
        try {
          const allListings = await getAll<ServiceListing>(db, STORES.LISTINGS);
          setListings(allListings.filter(l => l.categoryId === 'cat-tech'));
        } catch (e) {
          console.error("Failed to fetch tech solutions", e);
        }
      }
      setIsLoading(false);
    };

    fetchData();
  }, [db]);

  const handleRequestQuote = () => {
    if (user) {
        setIsQuoteModalOpen(true);
    } else {
        setIsAuthModalOpen(true);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white border-l-4 border-primary p-8 rounded-r-xl shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
            <h1 className="text-3xl font-bold text-gray-800">Tech Solutions</h1>
            <p className="text-gray-600 mt-2 text-lg">
            Modernize your business with our top-tier development and payment integration services.
            </p>
        </div>
        <button 
            onClick={handleRequestQuote}
            className="bg-secondary text-primary font-bold py-3 px-6 rounded-lg shadow-md hover:bg-yellow-400 hover:shadow-lg transition transform hover:-translate-y-1 whitespace-nowrap"
        >
            Request Custom Proposal
        </button>
      </div>

      {isLoading ? (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
         </div>
      ) : listings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {listings.map(listing => (
                <ServiceListingCard key={listing.id} listing={listing} />
            ))}
        </div>
      ) : (
        <p className="text-center py-10">No tech solutions currently available.</p>
      )}

      <RequestQuoteModal 
        isOpen={isQuoteModalOpen} 
        onClose={() => setIsQuoteModalOpen(false)} 
        defaultTitle="General Tech Inquiry"
      />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
};

export default TechPage;
