
import React, { useMemo, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Motorbike, ServiceListing, TechSolution, MobileAppDesign, VisaService, InquiryBooking, InquiryBookingType, InquiryBookingStatus } from '../types';
import { useAuth } from '../hooks/useAuth';
import AuthModal from '../components/AuthModal';
import RequestQuoteModal from '../components/RequestQuoteModal';
import { useDB } from '../contexts/DatabaseContext';
import { getById, addItem, STORES } from '../utils/db';

const renderServiceDetails = (listing: ServiceListing) => {
  const details = listing.details;
  switch (details.type) {
    case 'motorbike':
      const mb = details as Motorbike;
      return (
        <>
          <li className="flex justify-between py-2"><span className="font-semibold">Make:</span><span>{mb.make}</span></li>
          <li className="flex justify-between py-2"><span className="font-semibold">Model:</span><span>{mb.model}</span></li>
          <li className="flex justify-between py-2"><span className="font-semibold">Year:</span><span>{mb.year}</span></li>
          <li className="flex justify-between py-2"><span className="font-semibold">Condition:</span><span>{mb.condition}</span></li>
          {mb.salePrice && <li className="flex justify-between py-2"><span className="font-semibold">Sale Price:</span><span>${mb.salePrice}</span></li>}
        </>
      );
    case 'mobile-app':
      const app = details as MobileAppDesign;
      return (
        <>
          <li className="flex justify-between py-2"><span className="font-semibold">Platforms:</span><span>{app.platforms.join(', ')}</span></li>
          <li className="flex justify-between py-2"><span className="font-semibold">Design Tools:</span><span>{app.designTools.join(', ')}</span></li>
          <li className="flex justify-between py-2"><span className="font-semibold">Estimated Duration:</span><span>{app.estimatedDuration}</span></li>
          <li className="flex justify-between py-2"><span className="font-semibold">Prototype Included:</span><span>{app.prototypeIncluded ? 'Yes' : 'No'}</span></li>
        </>
      );
    case 'visa':
        const visa = details as VisaService;
        return (
             <>
                <li className="flex justify-between py-2"><span className="font-semibold">Visa Type:</span><span>{visa.visaType}</span></li>
                <li className="flex justify-between py-2"><span className="font-semibold">Processing Time:</span><span>{visa.processingTimeDays} days</span></li>
                <li className="py-2"><span className="font-semibold">Requirements:</span><p className="text-sm mt-1">{visa.requirements}</p></li>
             </>
        );
    case 'tech':
        const tech = details as TechSolution;
        return (
             <>
                <li className="flex justify-between py-2"><span className="font-semibold">Solution Type:</span><span>{tech.solutionType.replace('_', ' ')}</span></li>
                <li className="flex justify-between py-2"><span className="font-semibold">Pricing Model:</span><span>{tech.pricingModel}</span></li>
                <li className="py-2"><span className="font-semibold">Core Offerings:</span>
                    <ul className="list-disc list-inside mt-1">
                        {tech.coreOfferings.map(o => <li key={o}>{o}</li>)}
                    </ul>
                </li>
             </>
        );
    default:
      return null;
  }
};


const ServiceDetailPage: React.FC = () => {
  const { listingId } = useParams<{ listingId: string }>();
  const { user } = useAuth();
  const { db } = useDB();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [listing, setListing] = useState<ServiceListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    const fetchListing = async () => {
        if (db && listingId) {
            try {
                const item = await getById<ServiceListing>(db, STORES.LISTINGS, listingId);
                setListing(item || null);
            } catch (e) {
                console.error("Error fetching listing", e);
            }
        }
        setLoading(false);
    };
    fetchListing();
  }, [db, listingId]);

  // Reset image selection when listing changes
  useEffect(() => {
    setSelectedImageIndex(0);
  }, [listingId]);

  if (loading) return <div className="p-10 text-center">Loading details...</div>;
  if (!listing) return <div className="text-center text-red-500">Service listing not found.</div>;

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
        setIsAuthModalOpen(true);
        return;
    }
    if(inquiryMessage.trim() === '') return;
    
    if (db) {
        const newInquiry: InquiryBooking = {
            id: `inq-${Date.now()}`,
            customerId: user.id,
            partnerId: listing.partnerId,
            serviceListingId: listing.id,
            messageFromCustomer: inquiryMessage,
            status: InquiryBookingStatus.PENDING,
            type: InquiryBookingType.INQUIRY,
            createdAt: new Date()
        };
        await addItem(db, STORES.INQUIRIES, newInquiry);
        setIsSubmitted(true);
        setInquiryMessage('');
    }
  };

  const handleNextImage = () => {
    if (!listing) return;
    setSelectedImageIndex((prev) => (prev + 1) % listing.imagesUrls.length);
  };

  const handlePrevImage = () => {
    if (!listing) return;
    setSelectedImageIndex((prev) => (prev - 1 + listing.imagesUrls.length) % listing.imagesUrls.length);
  };

  const openQuoteModal = () => {
      if (!user) {
          setIsAuthModalOpen(true);
      } else {
          setIsQuoteModalOpen(true);
      }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
        
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-3 flex flex-col bg-gray-50 border-r border-gray-100">
            <div className="relative w-full h-[300px] sm:h-[400px] lg:h-[500px] bg-gray-200 group overflow-hidden">
                <img 
                    src={listing.imagesUrls[selectedImageIndex]} 
                    alt={`${listing.title} - View ${selectedImageIndex + 1}`} 
                    className="w-full h-full object-cover transition-opacity duration-300"
                />
                
                {/* Navigation Arrows */}
                {listing.imagesUrls.length > 1 && (
                    <>
                        <button 
                            onClick={(e) => { e.preventDefault(); handlePrevImage(); }}
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 focus:opacity-100"
                            aria-label="Previous Image"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <button 
                            onClick={(e) => { e.preventDefault(); handleNextImage(); }}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 focus:opacity-100"
                            aria-label="Next Image"
                        >
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </>
                )}
            </div>
            
            {/* Thumbnails */}
            {listing.imagesUrls.length > 1 && (
                <div className="flex gap-3 p-4 overflow-x-auto bg-white border-t border-gray-100 no-scrollbar">
                    {listing.imagesUrls.map((url, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedImageIndex(index)}
                            className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-all duration-200 ${selectedImageIndex === index ? 'border-secondary ring-2 ring-secondary ring-opacity-50 scale-105' : 'border-transparent opacity-70 hover:opacity-100'}`}
                        >
                            <img src={url} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                        </button>
                    ))}
                </div>
            )}
        </div>

        {/* Right Column: Details */}
        <div className="lg:col-span-2 p-8 flex flex-col h-full bg-white relative z-10">
          <h1 className="text-3xl font-bold text-primary mb-2">{listing.title}</h1>
          <p className="text-2xl font-light text-gray-800 mb-6">{listing.price} <span className="text-lg text-gray-500">{listing.currency}</span></p>
          
          <p className="text-gray-600 mb-6 flex-grow">{listing.description}</p>
          
          <div className="border-t border-b border-gray-200 py-4 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Details</h3>
              <ul className="divide-y divide-gray-200 text-gray-700">
                {renderServiceDetails(listing)}
              </ul>
          </div>

          <div className="mt-auto">
            {listing.details.type === 'tech' ? (
                <>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Looking for a solution?</h3>
                    <button
                        onClick={openQuoteModal}
                        className="w-full bg-primary text-white py-3 rounded-md hover:bg-primary-dark transition duration-300 font-semibold shadow-md hover:shadow-lg transform active:scale-95 flex justify-center items-center"
                    >
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Request Formal Quote
                    </button>
                    <p className="text-xs text-gray-500 mt-2 text-center">Fill out a detailed form to get a precise estimate.</p>
                </>
            ) : (
                <>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Interested? Send an inquiry!</h3>
                    {isSubmitted ? (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                            <strong className="font-bold">Success! </strong>
                            <span className="block sm:inline">Your inquiry has been sent. The partner will get back to you soon.</span>
                        </div>
                    ) : (
                        <form onSubmit={handleInquirySubmit}>
                            <textarea
                                value={inquiryMessage}
                                onChange={e => setInquiryMessage(e.target.value)}
                                placeholder="Ask a question or request a booking..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary mb-4"
                                rows={3}
                            ></textarea>
                            <button
                                type="submit"
                                className="w-full bg-primary text-white py-3 rounded-md hover:bg-primary-dark transition duration-300 font-semibold shadow-md hover:shadow-lg transform active:scale-95"
                            >
                                {user ? 'Send Inquiry' : 'Login to Inquire'}
                            </button>
                        </form>
                    )}
                </>
            )}
          </div>
        </div>
      </div>
      
       <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
       {listing && (
           <RequestQuoteModal 
                isOpen={isQuoteModalOpen} 
                onClose={() => setIsQuoteModalOpen(false)} 
                serviceListingId={listing.id}
                partnerId={listing.partnerId}
                defaultTitle={listing.title}
           />
       )}
    </div>
  );
};

export default ServiceDetailPage;
