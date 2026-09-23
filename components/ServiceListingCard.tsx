
import React from 'react';
import { Link } from 'react-router-dom';
import { ServiceListing } from '../types';

interface ServiceListingCardProps {
  listing: ServiceListing;
}

const ServiceListingCard: React.FC<ServiceListingCardProps> = ({ listing }) => {
  const photoCount = listing.imagesUrls?.length || 0;
  const primaryImage = listing.imagesUrls?.[0] || 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=800&auto=format&fit=crop';

  return (
    <Link to={`/service/${listing.id}`} className="group block bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 transform hover:-translate-y-1">
      <div className="relative overflow-hidden bg-gray-900">
        <img 
          className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500" 
          src={primaryImage} 
          alt={listing.title} 
          loading="lazy" 
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=800&auto=format&fit=crop';
          }}
        />
        
        {/* Price Tag */}
        <div className="absolute top-3 right-3 bg-secondary text-primary font-bold text-sm px-3 py-1 rounded-md shadow-md">
          {listing.price} {listing.currency}
        </div>

        {/* Photos Count Tag */}
        {photoCount > 1 && (
          <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-md border border-white/10">
            <svg className="w-3.5 h-3.5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{photoCount} photos</span>
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 mb-2 truncate group-hover:text-primary transition-colors">
          {listing.title}
        </h3>
        <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">{listing.description}</p>
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
           <span className="text-gray-400">Kampot Verified</span>
           <span className="text-primary font-semibold group-hover:text-secondary-dark flex items-center gap-1 transition-colors">
             View Gallery & Details &rarr;
           </span>
        </div>
      </div>
    </Link>
  );
};

export default React.memo(ServiceListingCard);
