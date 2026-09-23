import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useDB } from '../contexts/DatabaseContext';
import { getAll, addItem, STORES } from '../utils/db';
import { User, Role, ServiceListing, InquiryBooking, InquiryBookingType, InquiryBookingStatus } from '../types';
import { Link } from 'react-router-dom';

interface ContactUsFormProps {
  className?: string;
  onSuccess?: () => void;
}

export const ContactUsForm: React.FC<ContactUsFormProps> = ({ className = '', onSuccess }) => {
  const { user } = useAuth();
  const { db } = useDB();

  const [partners, setPartners] = useState<User[]>([]);
  const [listings, setListings] = useState<ServiceListing[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Form State
  const [recipient, setRecipient] = useState<string>('all-partners');
  const [category, setCategory] = useState<string>('General Inquiry');
  const [senderName, setSenderName] = useState<string>('');
  const [senderEmail, setSenderEmail] = useState<string>('');
  const [senderPhone, setSenderPhone] = useState<string>('');
  const [subject, setSubject] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [sendCopy, setSendCopy] = useState<boolean>(true);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedInquiry, setSubmittedInquiry] = useState<{
    id: string;
    recipientName: string;
    subject: string;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Load partners and listings from database
  useEffect(() => {
    if (db) {
      Promise.all([
        getAll<User>(db, STORES.USERS),
        getAll<ServiceListing>(db, STORES.LISTINGS)
      ]).then(([allUsers, allListings]) => {
        const partnerUsers = allUsers.filter(u => u.role === Role.PARTNER);
        setPartners(partnerUsers);
        setListings(allListings);
        setLoadingData(false);
      }).catch(err => {
        console.error('Failed to load partners/listings', err);
        setLoadingData(false);
      });
    }
  }, [db]);

  // Pre-populate if logged in
  useEffect(() => {
    if (user) {
      if (!senderName) setSenderName(user.name);
      if (!senderEmail) setSenderEmail(user.email);
    }
  }, [user]);

  // Update category automatically if specific listing or partner is selected
  const handleRecipientChange = (val: string) => {
    setRecipient(val);
    if (val.startsWith('listing-')) {
      const listingId = val.replace('listing-', '');
      const item = listings.find(l => l.id === listingId);
      if (item) {
        if (item.categoryId === 'cat-motorbike') setCategory('Motorbike Rental & Sales');
        else if (item.categoryId === 'cat-tech') setCategory('Web & Software Development');
        else if (item.categoryId === 'cat-app-design') setCategory('Mobile App UI/UX Design');
        else if (item.categoryId === 'cat-visa') setCategory('Visa Services');
        if (!subject) setSubject(`Inquiry regarding ${item.title}`);
      }
    } else if (val === 'user-2') {
      setCategory('Motorbike Rental & Sales');
    } else if (val === 'user-3') {
      setCategory('Web & Software Development');
    }
  };

  // Quick message template insertion
  const applyTemplate = (templateType: string) => {
    let text = '';
    let subj = '';
    switch (templateType) {
      case 'rental':
        subj = 'Motorbike rental availability & rates inquiry';
        text = 'Hello, I would like to inquire about renting a motorbike for approximately [number of days/months] starting from [dates]. Could you please share the current availability, pricing, and required deposit?';
        setCategory('Motorbike Rental & Sales');
        break;
      case 'quote':
        subj = 'Custom project quote & scope request';
        text = 'Hi there, we are planning a new tech project (website / mobile app / POS system) and would like to schedule a consultation to discuss our requirements and receive an estimated timeline and quote.';
        setCategory('Web & Software Development');
        break;
      case 'visa':
        subj = 'Visa extension requirements & processing inquiry';
        text = 'Greetings, I am looking to extend my Cambodian visa. What are the current document requirements, processing timeline, and total fee for this service?';
        setCategory('Visa Services');
        break;
      case 'general':
        subj = 'General service inquiry for Kampot Tech Hub';
        text = 'Hello, I have a few questions regarding your services in Kampot and would appreciate more details on how to get started.';
        setCategory('General Inquiry');
        break;
    }
    setMessage(text);
    if (subj) setSubject(subj);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!senderName.trim()) {
      setErrorMessage('Please provide your name.');
      return;
    }
    if (!senderEmail.trim() || !senderEmail.includes('@')) {
      setErrorMessage('Please provide a valid email address.');
      return;
    }
    if (!message.trim()) {
      setErrorMessage('Please enter your inquiry message.');
      return;
    }

    if (!db) {
      setErrorMessage('Database is still initializing. Please wait a moment and try again.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Determine Customer ID (use logged-in user or guest user)
      let customerId = user ? user.id : `guest-${Date.now()}`;
      if (!user) {
        // Try to match or register guest in STORES.USERS
        const allUsers = await getAll<User>(db, STORES.USERS);
        const existing = allUsers.find(u => u.email.toLowerCase() === senderEmail.trim().toLowerCase());
        if (existing) {
          customerId = existing.id;
        } else {
          const guestUser: User = {
            id: customerId,
            name: senderName.trim(),
            email: senderEmail.trim(),
            role: Role.CUSTOMER
          };
          await addItem(db, STORES.USERS, guestUser);
        }
      }

      // Determine Partner ID and Listing ID
      let targetPartnerId = 'all-partners';
      let targetListingId: string | undefined = undefined;
      let recipientDisplay = 'All Verified Partners';

      if (recipient.startsWith('listing-')) {
        targetListingId = recipient.replace('listing-', '');
        const matchedListing = listings.find(l => l.id === targetListingId);
        if (matchedListing) {
          targetPartnerId = matchedListing.partnerId;
          const partnerObj = partners.find(p => p.id === matchedListing.partnerId);
          recipientDisplay = `${matchedListing.title} (${partnerObj ? partnerObj.name : 'Provider'})`;
        }
      } else if (recipient !== 'all-partners') {
        targetPartnerId = recipient;
        const matchedPartner = partners.find(p => p.id === targetPartnerId);
        if (matchedPartner) {
          recipientDisplay = matchedPartner.name;
        }
      }

      const inquiryId = `inq-${Date.now()}`;
      const finalSubject = subject.trim() || `Inquiry regarding ${category}`;

      // Build comprehensive inquiry message including metadata
      const formattedMessage = `
[SUBJECT]: ${finalSubject}
[CATEGORY]: ${category}
[FROM]: ${senderName.trim()} <${senderEmail.trim()}>${senderPhone.trim() ? ` | Tel: ${senderPhone.trim()}` : ''}
${sendCopy ? '[REQUESTED COPY]: Yes, sender requested an email confirmation copy.' : ''}

[MESSAGE]:
${message.trim()}
      `.trim();

      const newInquiry: InquiryBooking = {
        id: inquiryId,
        serviceListingId: targetListingId,
        customerId: customerId,
        partnerId: targetPartnerId,
        type: InquiryBookingType.INQUIRY,
        status: InquiryBookingStatus.PENDING,
        messageFromCustomer: formattedMessage,
        createdAt: new Date(),
        senderName: senderName.trim(),
        senderEmail: senderEmail.trim(),
        senderPhone: senderPhone.trim() || undefined,
        subject: finalSubject
      };

      await addItem(db, STORES.INQUIRIES, newInquiry);

      // If 'all-partners' selected, also create targeted copies for each partner so both see it directly in their partner dashboard
      if (targetPartnerId === 'all-partners' && partners.length > 0) {
        for (const partner of partners) {
          const partnerInquiry: InquiryBooking = {
            ...newInquiry,
            id: `inq-${Date.now()}-${partner.id}`,
            partnerId: partner.id,
          };
          await addItem(db, STORES.INQUIRIES, partnerInquiry);
        }
      }

      // Dispatch custom event so any open dashboards can reactively update
      window.dispatchEvent(new CustomEvent('kth_inquiry_added', { detail: newInquiry }));

      setSubmittedInquiry({
        id: inquiryId,
        recipientName: recipientDisplay,
        subject: finalSubject
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error('Failed to submit contact inquiry', err);
      setErrorMessage('Failed to send inquiry. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmittedInquiry(null);
    setMessage('');
    setSubject('');
    if (!user) {
      setSenderName('');
      setSenderEmail('');
      setSenderPhone('');
    }
  };

  return (
    <div className={`bg-gray-800/90 rounded-2xl p-6 sm:p-8 border border-gray-700/80 shadow-2xl backdrop-blur-sm ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-700/80 pb-5 mb-6 gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-secondary bg-secondary/10 px-3 py-1 rounded-full mb-2">
            <span className="w-2 h-2 rounded-full bg-secondary animate-ping mr-1"></span>
            Direct Provider Messaging
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <span>Contact Us & Inquire Directly</span>
          </h3>
          <p className="text-sm text-gray-400 mt-1">
            Send an inquiry to local service providers in Kampot. We guarantee swift and secure communication.
          </p>
        </div>

        {/* Quick Badges */}
        <div className="flex items-center space-x-3 text-xs text-gray-300">
          <div className="flex items-center space-x-1.5 bg-gray-900/60 px-3 py-1.5 rounded-lg border border-gray-700/50">
            <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Verified Partners</span>
          </div>
          <div className="flex items-center space-x-1.5 bg-gray-900/60 px-3 py-1.5 rounded-lg border border-gray-700/50">
            <svg className="w-4 h-4 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Avg Reply: ~2 Hours</span>
          </div>
        </div>
      </div>

      {/* Success View */}
      {submittedInquiry ? (
        <div className="py-8 text-center bg-gray-900/70 rounded-xl border border-accent/40 p-6 sm:p-8 animate-fadeIn">
          <div className="w-16 h-16 bg-accent/20 border border-accent rounded-full flex items-center justify-center mx-auto mb-4 text-accent shadow-lg shadow-accent/20">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className="inline-block text-xs font-bold uppercase tracking-wider text-accent bg-accent/10 px-3 py-1 rounded-full mb-2">
            Inquiry Dispatched Successfully
          </span>
          <h4 className="text-xl sm:text-2xl font-bold text-white mb-2">
            Thank you, {senderName}!
          </h4>
          <p className="text-gray-300 text-sm max-w-lg mx-auto leading-relaxed mb-4">
            Your inquiry regarding <strong className="text-secondary font-medium">"{submittedInquiry.subject}"</strong> has been sent directly to <strong className="text-white font-semibold">{submittedInquiry.recipientName}</strong>.
          </p>

          <div className="bg-gray-800/80 rounded-lg p-4 max-w-md mx-auto text-xs text-gray-400 mb-6 text-left border border-gray-700">
            <div className="flex justify-between py-1 border-b border-gray-700/60">
              <span>Reference Number:</span>
              <span className="font-mono text-secondary font-semibold">{submittedInquiry.id}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-700/60">
              <span>Confirmation Sent To:</span>
              <span className="text-white font-medium">{senderEmail}</span>
            </div>
            <div className="flex justify-between py-1">
              <span>Status:</span>
              <span className="text-yellow-400 font-medium">Pending Provider Response</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={handleReset}
              className="bg-secondary text-primary font-bold px-6 py-2.5 rounded-lg hover:bg-yellow-400 transition duration-200 shadow-md text-sm cursor-pointer"
            >
              Send Another Inquiry
            </button>
            {user ? (
              <Link
                to="/dashboard"
                className="bg-gray-700 hover:bg-gray-600 text-white font-medium px-6 py-2.5 rounded-lg transition duration-200 text-sm"
              >
                View in Dashboard
              </Link>
            ) : (
              <p className="text-xs text-gray-400 w-full mt-2">
                Tip: If you log in with <strong className="text-gray-300">{senderEmail}</strong>, you can track inquiries in your dashboard.
              </p>
            )}
          </div>
        </div>
      ) : (
        /* Form View */
        <form onSubmit={handleSubmit} className="space-y-5">
          {errorMessage && (
            <div className="bg-red-900/40 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg text-sm flex items-center space-x-2">
              <svg className="w-5 h-5 flex-shrink-0 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Quick templates chips */}
          <div className="bg-gray-900/50 p-3.5 rounded-xl border border-gray-700/50">
            <span className="text-xs text-gray-400 block mb-2 font-medium">Quick Inquiry Templates (Click to fill):</span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => applyTemplate('rental')}
                className="text-xs bg-gray-800 hover:bg-primary text-gray-300 hover:text-white px-3 py-1.5 rounded-md border border-gray-700 hover:border-primary transition duration-150 cursor-pointer"
              >
                🏍️ Motorbike Availability & Rates
              </button>
              <button
                type="button"
                onClick={() => applyTemplate('quote')}
                className="text-xs bg-gray-800 hover:bg-primary text-gray-300 hover:text-white px-3 py-1.5 rounded-md border border-gray-700 hover:border-primary transition duration-150 cursor-pointer"
              >
                💻 Web / App Project Quote
              </button>
              <button
                type="button"
                onClick={() => applyTemplate('visa')}
                className="text-xs bg-gray-800 hover:bg-primary text-gray-300 hover:text-white px-3 py-1.5 rounded-md border border-gray-700 hover:border-primary transition duration-150 cursor-pointer"
              >
                🛂 Visa Extension Requirements
              </button>
              <button
                type="button"
                onClick={() => applyTemplate('general')}
                className="text-xs bg-gray-800 hover:bg-primary text-gray-300 hover:text-white px-3 py-1.5 rounded-md border border-gray-700 hover:border-primary transition duration-150 cursor-pointer"
              >
                💬 General Inquiry
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Recipient Selector */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                Recipient / Service Provider <span className="text-secondary">*</span>
              </label>
              <select
                value={recipient}
                onChange={(e) => handleRecipientChange(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition duration-200"
              >
                <option value="all-partners">🌟 All Verified Providers (General Inquiry)</option>
                
                <optgroup label="Direct Providers">
                  {partners.map(p => (
                    <option key={p.id} value={p.id}>
                      👤 {p.name} {p.id === 'user-2' ? '(Motorbikes & Visas)' : p.id === 'user-3' ? '(Tech & App Design)' : '(Partner)'}
                    </option>
                  ))}
                </optgroup>

                {listings.length > 0 && (
                  <optgroup label="Specific Service Listings">
                    {listings.map(l => (
                      <option key={`listing-${l.id}`} value={`listing-${l.id}`}>
                        📌 {l.title} (${l.price} {l.currency})
                      </option>
                    ))}
                  </optgroup>
                )}
              </select>
              <span className="text-[11px] text-gray-500 mt-1 block">
                Messages go directly to the designated partner's inquiry inbox.
              </span>
            </div>

            {/* Category / Service Area */}
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                Service Category <span className="text-secondary">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition duration-200"
              >
                <option value="Motorbike Rental & Sales">Motorbike Rental & Sales</option>
                <option value="Web & Software Development">Web & Software Development</option>
                <option value="Mobile App UI/UX Design">Mobile App UI/UX Design</option>
                <option value="Visa Services">Visa Services</option>
                <option value="Guesthouse & Accommodation">Guesthouse & Accommodation</option>
                <option value="General Inquiry">General Inquiry / Other</option>
              </select>
              <span className="text-[11px] text-gray-500 mt-1 block">
                Helps route your inquiry to the right specialist.
              </span>
            </div>
          </div>

          {/* Sender Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                Your Full Name <span className="text-secondary">*</span>
              </label>
              <input
                type="text"
                required
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="e.g. John Doe"
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition duration-200"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                Your Email Address <span className="text-secondary">*</span>
              </label>
              <input
                type="email"
                required
                value={senderEmail}
                onChange={(e) => setSenderEmail(e.target.value)}
                placeholder="e.g. john@example.com"
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition duration-200"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                Phone / Telegram / WhatsApp <span className="text-gray-500 text-[10px]">(Optional)</span>
              </label>
              <input
                type="text"
                value={senderPhone}
                onChange={(e) => setSenderPhone(e.target.value)}
                placeholder="e.g. +855 12 345 678"
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition duration-200"
              />
            </div>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
              Subject / Topic <span className="text-secondary">*</span>
            </label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Inquiring about Honda Airblade rental for November"
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition duration-200"
            />
          </div>

          {/* Message Textarea */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Inquiry Message <span className="text-secondary">*</span>
              </label>
              <span className="text-[11px] text-gray-400">
                {message.length} characters
              </span>
            </div>
            <textarea
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Please describe your requirements, questions, requested dates, or budget specifications..."
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition duration-200 resize-y"
            ></textarea>
          </div>

          {/* Footer Options & Submit */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
            <label className="flex items-center space-x-2 text-xs text-gray-400 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={sendCopy}
                onChange={(e) => setSendCopy(e.target.checked)}
                className="rounded bg-gray-900 border-gray-700 text-secondary focus:ring-secondary h-4 w-4"
              />
              <span>Send me a confirmation copy of this inquiry</span>
            </label>

            <button
              type="submit"
              disabled={isSubmitting || loadingData}
              className="inline-flex items-center justify-center space-x-2 bg-secondary text-primary font-bold px-8 py-3 rounded-lg hover:bg-yellow-400 hover:shadow-lg hover:shadow-secondary/20 active:scale-98 transition-all duration-200 disabled:opacity-50 text-sm cursor-pointer whitespace-nowrap"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Sending Inquiry...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  <span>Send Message to Provider</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ContactUsForm;
