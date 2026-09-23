
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
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [photoUrlsText, setPhotoUrlsText] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !db) return;
    setIsSubmitting(true);

    const uploadedUrls: string[] = [];
    
    // Handle Multiple File Uploads
    if (imageFiles.length > 0) {
      for (const file of imageFiles) {
        const reader = new FileReader();
        await new Promise<void>((resolve) => {
          reader.onload = (event) => {
            if (event.target?.result) {
              uploadedUrls.push(event.target.result as string);
            }
            resolve();
          };
          reader.readAsDataURL(file);
        });
      }
    }

    // Also include any comma or newline separated image URLs entered
    if (photoUrlsText.trim()) {
      const extraUrls = photoUrlsText
        .split(/[\n,]+/)
        .map(u => u.trim())
        .filter(u => u.startsWith('http://') || u.startsWith('https://'));
      uploadedUrls.push(...extraUrls);
    }

    const finalImages = uploadedUrls.length > 0 ? uploadedUrls : [
      'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1525160354320-545e39edee96?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=1200&auto=format&fit=crop'
    ];

    // Simplified creation: Defaults to Motorbike category for demo purposes
    const newListing: ServiceListing = {
        id: `list-${Date.now()}`,
        categoryId: 'cat-motorbike', 
        partnerId: user.id,
        title,
        description,
        price,
        currency: 'USD',
        imagesUrls: finalImages,
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
        setImageFiles([]);
        setPhotoUrlsText('');
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
            <label className="block text-sm font-medium text-gray-700">Upload Photos (Select Multiple)</label>
            <input 
              type="file" 
              accept="image/*" 
              multiple 
              onChange={e => setImageFiles(Array.from(e.target.files || []))} 
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-dark cursor-pointer" 
            />
            {imageFiles.length > 0 && (
              <p className="text-xs text-primary font-medium mt-1">
                ✓ {imageFiles.length} photo{imageFiles.length > 1 ? 's' : ''} selected
              </p>
            )}
        </div>
        <div>
            <label className="block text-xs font-medium text-gray-500">Or Paste Image URLs (Optional, comma or line separated)</label>
            <textarea
              value={photoUrlsText}
              onChange={e => setPhotoUrlsText(e.target.value)}
              placeholder="https://images.unsplash.com/...&#10;https://images.unsplash.com/..."
              rows={2}
              className="mt-1 block w-full rounded-md border-gray-300 border p-2 text-xs text-gray-700 font-mono shadow-sm focus:border-primary focus:ring-primary"
            />
        </div>
        <button type="submit" disabled={isSubmitting} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
            {isSubmitting ? 'Saving...' : 'Create Listing'}
        </button>
      </form>
    </Modal>
  );
};

export default CreateListingModal;
