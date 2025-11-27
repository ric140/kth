
import React, { useState } from 'react';
import Modal from './Modal';
import { useAuth } from '../hooks/useAuth';
import { useDB } from '../contexts/DatabaseContext';
import { addItem, STORES } from '../utils/db';
import { InquiryBooking, InquiryBookingStatus, InquiryBookingType } from '../types';

interface RequestQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceListingId?: string; // Optional: if coming from a specific listing
  partnerId?: string;       // Optional: if known
  defaultTitle?: string;
}

const RequestQuoteModal: React.FC<RequestQuoteModalProps> = ({ 
  isOpen, 
  onClose, 
  serviceListingId = 'list-tech-1', // Default to generic tech listing if not provided
  partnerId = 'user-3',             // Default to tech partner if not provided
  defaultTitle = 'Custom Project'
}) => {
  const { user } = useAuth();
  const { db } = useDB();
  
  const [projectType, setProjectType] = useState('Website Development');
  const [budget, setBudget] = useState('');
  const [timeline, setTimeline] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !db) return;
    
    setIsSubmitting(true);

    // Format the message with detailed project info
    const formattedMessage = `
[QUOTE REQUEST]
Project Type: ${projectType}
Budget Range: ${budget}
Timeline: ${timeline}

Description:
${description}
    `.trim();

    const newInquiry: InquiryBooking = {
        id: `quote-${Date.now()}`,
        customerId: user.id,
        partnerId: partnerId,
        serviceListingId: serviceListingId,
        messageFromCustomer: formattedMessage,
        status: InquiryBookingStatus.PENDING,
        type: InquiryBookingType.INQUIRY,
        createdAt: new Date()
    };

    try {
        await addItem(db, STORES.INQUIRIES, newInquiry);
        setSuccess(true);
        setTimeout(() => {
            setSuccess(false);
            onClose();
            // Reset form
            setProjectType('Website Development');
            setBudget('');
            setTimeline('');
            setDescription('');
        }, 2000);
    } catch (e) {
        console.error("Failed to submit quote", e);
    }
    setIsSubmitting(false);
  };

  if (success) {
      return (
          <Modal isOpen={isOpen} onClose={onClose} title="Request Sent">
              <div className="text-center py-8">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                      <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                  </div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Quote Requested!</h3>
                  <p className="mt-2 text-sm text-gray-500">
                      Our team will review your project details and get back to you shortly.
                  </p>
              </div>
          </Modal>
      )
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Request Quote: ${defaultTitle}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
            <label className="block text-sm font-medium text-gray-700">Project Type</label>
            <select 
                value={projectType} 
                onChange={(e) => setProjectType(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 border p-2 shadow-sm focus:border-primary focus:ring-primary"
            >
                <option>Website Development</option>
                <option>Payment Integration</option>
                <option>Mobile App</option>
                <option>Custom Software</option>
                <option>IT Consultation</option>
            </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Budget Range (USD)</label>
                <input 
                    type="text" 
                    placeholder="e.g. 500 - 1000"
                    value={budget} 
                    onChange={(e) => setBudget(e.target.value)} 
                    className="mt-1 block w-full rounded-md border-gray-300 border p-2 shadow-sm focus:border-primary focus:ring-primary" 
                    required
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Expected Timeline</label>
                <input 
                    type="text" 
                    placeholder="e.g. 2 weeks"
                    value={timeline} 
                    onChange={(e) => setTimeline(e.target.value)} 
                    className="mt-1 block w-full rounded-md border-gray-300 border p-2 shadow-sm focus:border-primary focus:ring-primary" 
                    required
                />
            </div>
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700">Project Description & Requirements</label>
            <textarea 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                className="mt-1 block w-full rounded-md border-gray-300 border p-2 shadow-sm focus:border-primary focus:ring-primary" 
                rows={4}
                placeholder="Describe your project goals, features needed, and any specific technologies..."
                required
            ></textarea>
        </div>

        <div className="bg-gray-50 p-3 rounded text-xs text-gray-500">
            By submitting this form, you agree to share these details with our tech partners for the purpose of generating a quote.
        </div>

        <button 
            type="submit" 
            disabled={isSubmitting} 
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
        >
            {isSubmitting ? 'Sending...' : 'Submit Quote Request'}
        </button>
      </form>
    </Modal>
  );
};

export default RequestQuoteModal;
