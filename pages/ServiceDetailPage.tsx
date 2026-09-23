
import React, { useMemo, useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Motorbike, ServiceListing, TechSolution, MobileAppDesign, VisaService, InquiryBooking, InquiryBookingType, InquiryBookingStatus } from '../types';
import { useAuth } from '../hooks/useAuth';
import AuthModal from '../components/AuthModal';
import RequestQuoteModal from '../components/RequestQuoteModal';
import ImageCarousel from '../components/ImageCarousel';
import KampotMap from '../components/KampotMap';
import { useDB } from '../contexts/DatabaseContext';
import { getById, addItem, STORES } from '../utils/db';
import { MOCK_SERVICE_LISTINGS } from '../data/mockData';

const categoryMap: Record<string, { label: string; path: string }> = {
  'cat-motorbike': { label: 'Motorbike Hub', path: '/services/cat-motorbike' },
  'cat-tech': { label: 'Tech Solutions', path: '/services/cat-tech' },
  'cat-app-design': { label: 'Mobile App Design', path: '/services/cat-app-design' },
  'cat-visa': { label: 'Visa Services', path: '/services/cat-visa' },
};

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
  const { user, isGmailConnected, sendGmailInquiry } = useAuth();
  const { db } = useDB();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [gmailSentNotice, setGmailSentNotice] = useState(false);
  const [isSendingInquiry, setIsSendingInquiry] = useState(false);
  const [listing, setListing] = useState<ServiceListing | null>(null);
  const [loading, setLoading] = useState(true);

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

  // Compute images to display: prioritize listing's images, ensure rich multi-image gallery
  const displayImages = useMemo(() => {
    if (!listing) return [];
    if (listing.imagesUrls && listing.imagesUrls.length > 1) {
      return listing.imagesUrls;
    }
    // Check if mock data has multi-images for this listing
    const mockItem = MOCK_SERVICE_LISTINGS.find(m => m.id === listing.id);
    if (mockItem && mockItem.imagesUrls.length > 1) {
      return mockItem.imagesUrls;
    }
    return listing.imagesUrls && listing.imagesUrls.length > 0 ? listing.imagesUrls : [];
  }, [listing]);

  const categoryInfo = listing ? categoryMap[listing.categoryId] || { label: 'Services', path: '/search' } : null;

  if (loading) return (
    <div className="min-h-[400px] flex items-center justify-center p-10 text-center">
      <div className="flex flex-col items-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="text-gray-500 font-medium">Loading service details...</p>
      </div>
    </div>
  );

  if (!listing) return (
    <div className="p-12 text-center bg-white rounded-xl shadow-sm border max-w-lg mx-auto my-8">
      <div className="text-4xl mb-3">🔍</div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">Service Not Found</h2>
      <p className="text-gray-600 mb-6 text-sm">The listing you are looking for does not exist or has been removed.</p>
      <Link to="/" className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium text-sm">
        Return to Home
      </Link>
    </div>
  );

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
        setIsAuthModalOpen(true);
        return;
    }
    if (inquiryMessage.trim() === '') return;
    
    setIsSendingInquiry(true);
    try {
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

          // If user has Gmail connected, also send through real Gmail API
          if (isGmailConnected) {
            try {
              const res = await sendGmailInquiry({
                to: 'partners@kampot-techhub.com',
                subject: `Service Inquiry: ${listing.title}`,
                body: `Inquiry regarding ${listing.title} ($${listing.price}):\n\n"${inquiryMessage}"\n\nContact email: ${user.email}`,
                partnerName: 'Kampot Service Partner'
              });
              if (res.success) {
                setGmailSentNotice(true);
              }
            } catch (gmailErr) {
              console.warn('Gmail auto-dispatch note:', gmailErr);
            }
          }

          setIsSubmitted(true);
          setInquiryMessage('');
      }
    } finally {
      setIsSendingInquiry(false);
    }
  };

  const openQuoteModal = () => {
      if (!user) {
          setIsAuthModalOpen(true);
      } else {
          setIsQuoteModalOpen(true);
      }
  };

  return (
    <div className="space-y-4">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-sm text-gray-500 px-1 py-1" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-primary transition-colors flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Home
        </Link>
        <span>/</span>
        {categoryInfo && (
          <>
            <Link to={categoryInfo.path} className="hover:text-primary transition-colors">
              {categoryInfo.label}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-gray-900 font-medium truncate max-w-xs sm:max-w-md">
          {listing.title}
        </span>
      </nav>

      {/* Main Listing Card */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
          
          {/* Left Column: Image Carousel */}
          <div className="lg:col-span-3 flex flex-col bg-gray-900 border-r border-gray-100">
            <ImageCarousel 
              images={displayImages} 
              title={listing.title} 
              categoryName={categoryInfo?.label}
            />
          </div>

          {/* Right Column: Details */}
          <div className="lg:col-span-2 p-6 sm:p-8 flex flex-col h-full bg-white relative z-10">
            <div className="mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-secondary bg-secondary/10 px-2.5 py-1 rounded-full">
                {categoryInfo?.label || 'Verified Service'}
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-2.5 leading-tight">
                {listing.title}
              </h1>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-primary">${listing.price}</span>
                <span className="text-sm font-medium text-gray-500">{listing.currency}</span>
              </div>
            </div>
            
            <p className="text-gray-600 mb-6 leading-relaxed flex-grow">{listing.description}</p>
            
            <div className="border-t border-b border-gray-100 py-4 mb-6 bg-gray-50/60 -mx-6 sm:-mx-8 px-6 sm:px-8">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Service Specifications</h3>
                <ul className="divide-y divide-gray-200/70 text-gray-700 text-sm">
                  {renderServiceDetails(listing)}
                </ul>
            </div>

            <div className="mt-auto">
              {listing.details.type === 'tech' ? (
                  <>
                      <h3 className="text-base font-semibold text-gray-800 mb-2">Looking for a custom solution?</h3>
                      <button
                          onClick={openQuoteModal}
                          className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary-dark transition duration-300 font-semibold shadow-md hover:shadow-lg transform active:scale-95 flex justify-center items-center cursor-pointer"
                      >
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Request Formal Quote
                      </button>
                      <p className="text-xs text-gray-500 mt-2 text-center">Fill out a detailed questionnaire for an accurate scope & estimate.</p>
                  </>
              ) : (
                  <>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-base font-semibold text-gray-800">Interested? Send a direct inquiry!</h3>
                        {isGmailConnected ? (
                          <span className="text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                            <span>✉️</span> Gmail Enabled
                          </span>
                        ) : (
                          <Link to="/gmail-inbox" className="text-[11px] text-primary hover:underline">
                            Connect Gmail
                          </Link>
                        )}
                      </div>
                      {isSubmitted ? (
                          <div className="bg-green-50 border border-green-300 text-green-800 p-4 rounded-lg text-sm" role="alert">
                              <div className="flex items-center gap-2 font-bold mb-1">
                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Inquiry Sent Successfully!
                              </div>
                              <p className="text-green-700 text-xs">The service provider has received your inquiry and will respond shortly.</p>
                              {gmailSentNotice && (
                                <p className="text-[11px] text-emerald-800 bg-white/70 p-2 rounded border border-emerald-200 mt-2 font-medium">
                                  ✉️ A direct email message has also been delivered via your connected Gmail account. Check your Gmail Sent folder!
                                </p>
                              )}
                          </div>
                      ) : (
                          <form onSubmit={handleInquirySubmit}>
                              <textarea
                                  value={inquiryMessage}
                                  onChange={e => setInquiryMessage(e.target.value)}
                                  placeholder={`Ask a question or request dates for ${listing.title}...`}
                                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent mb-3 text-sm"
                                  rows={3}
                              ></textarea>
                              <button
                                  type="submit"
                                  disabled={isSendingInquiry}
                                  className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary-dark transition duration-300 font-semibold shadow-md hover:shadow-lg transform active:scale-95 cursor-pointer text-sm flex items-center justify-center gap-2 disabled:opacity-70"
                              >
                                  {isSendingInquiry ? (
                                    <>
                                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                      <span>Sending...</span>
                                    </>
                                  ) : (
                                    <span>{user ? (isGmailConnected ? 'Send Inquiry via Gmail' : 'Send Direct Inquiry') : 'Login to Inquire'}</span>
                                  )}
                              </button>
                          </form>
                      )}
                  </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Service Location with Interactive Google Maps */}
      {listing.location && (
        <div className="bg-white rounded-xl shadow-md p-6 sm:p-8 border border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl">📍</span>
                <h2 className="text-lg font-bold text-gray-900">Service Location in Kampot</h2>
              </div>
              <p className="text-sm text-gray-600 mt-0.5">{listing.location.address}</p>
              {listing.location.landmark && (
                <p className="text-xs text-primary font-semibold mt-1">
                  Landmark: {listing.location.landmark}
                </p>
              )}
            </div>
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${listing.location.lat},${listing.location.lng}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-sm transition self-start sm:self-auto"
            >
              <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Get Directions in Google Maps</span>
            </a>
          </div>

          <KampotMap
            listings={[listing]}
            selectedListingId={listing.id}
            singleListingMode={true}
            mapHeight="360px"
            zoom={16}
            center={{ lat: listing.location.lat, lng: listing.location.lng }}
            showFilterBar={false}
          />
        </div>
      )}
      
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
