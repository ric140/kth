
import React from 'react';
import { Link } from 'react-router-dom';
import { ServiceListing } from '../types';

interface ServiceListingCardProps {
  listing: ServiceListing;
}

const ServiceListingCard: React.FC<ServiceListingCardProps> = ({ listing }) => {
  return (
    <Link to={`/service/${listing.id}`} className="block bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      <div className="relative">
        <img className="w-full h-56 object-cover" src={listing.imagesUrls[0]} alt={listing.title} loading="lazy" />
        <div className="absolute top-0 right-0 bg-secondary text-primary font-bold px-3 py-1 m-2 rounded-md">
          {listing.price} {listing.currency}
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">{listing.title}</h3>
        <p className="text-gray-600 line-clamp-2">{listing.description}</p>
        <div className="mt-4 flex justify-end">
           <span className="text-primary font-semibold hover:underline">View Details &rarr;</span>
        </div>
      </div>
    </Link>
  );
};

export default React.memo(ServiceListingCard);
