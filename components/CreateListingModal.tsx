
import React, { useState } from 'react';
import Modal from './Modal';
import { useAuth } from '../hooks/useAuth';
import { useDB } from '../contexts/DatabaseContext';
import { addItem, STORES } from '../utils/db';
import { ServiceListing, ServiceStatus, Motorbike } from '../types';

interface CreateListingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateListingModal: React.FC<CreateListingModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { db } = useDB();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !db) return;
    setIsSubmitting(true);

    let imageUrl = 'https://picsum.photos/800/600'; // Default
    
    // Handle File Upload
    if (imageFile) {
        const reader = new FileReader();
        await new Promise<void>((resolve) => {
            reader.onload = (e) => {
                if (e.target?.result) {
                    imageUrl = e.target.result as string;
                }
                resolve();
            };
            reader.readAsDataURL(imageFile);
        });
    }

    // Simplified creation: Defaults to Motorbike category for demo purposes
    const newListing: ServiceListing = {
        id: `list-${Date.now()}`,
        categoryId: 'cat-motorbike', 
        partnerId: user.id,
        title,
        description,
        price,
        currency: 'USD',
        imagesUrls: [imageUrl],
        status: ServiceStatus.ACTIVE,
        details: { 
            type: 'motorbike', 
            make: 'Generic', 
            model: 'Standard', 
            year: 2024, 
            condition: 'New', 
            rentalPricePerDay: parseInt(price) || 10 
        } as Motorbike
    };

    try {
        await addItem(db, STORES.LISTINGS, newListing);
        onClose();
        setTitle('');
        setDescription('');
        setPrice('');
        setImageFile(null);
    } catch (e) {
        console.error("Failed to create listing", e);
    }
    setIsSubmitting(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Listing">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input type="text" required value={title} onChange={e => setTitle(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 border p-2 shadow-sm focus:border-primary focus:ring-primary" />
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea required value={description} onChange={e => setDescription(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 border p-2 shadow-sm focus:border-primary focus:ring-primary" rows={3}></textarea>
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700">Price (USD)</label>
            <input type="number" required value={price} onChange={e => setPrice(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 border p-2 shadow-sm focus:border-primary focus:ring-primary" />
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700">Upload Image</label>
            <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files ? e.target.files[0] : null)} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-dark" />
        </div>
        <button type="submit" disabled={isSubmitting} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
            {isSubmitting ? 'Saving...' : 'Create Listing'}
        </button>
      </form>
    </Modal>
  );
};

export default CreateListingModal;
