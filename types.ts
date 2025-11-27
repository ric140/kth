
import React from 'react';

export enum Role {
  CUSTOMER = 'customer',
  PARTNER = 'partner',
  ADMIN = 'admin',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export enum ServiceCategoryType {
  INTERNAL = 'internal',
  EXTERNAL = 'external',
}

export interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  type: ServiceCategoryType;
  externalUrl?: string;
}

export enum ServiceStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export interface ServiceListing {
  id: string;
  categoryId: string;
  partnerId: string;
  title: string;
  description: string;
  price: string;
  currency: string;
  imagesUrls: string[];
  status: ServiceStatus;
  details: Motorbike | MobileAppDesign | VisaService | TechSolution;
}

export interface Motorbike {
  type: 'motorbike';
  make: string;
  model: string;
  year: number;
  condition: string;
  rentalPricePerDay?: number;
  salePrice?: number;
}

export interface MobileAppDesign {
  type: 'mobile-app';
  platforms: ('iOS' | 'Android' | 'Cross-Platform')[];
  designTools: string[];
  prototypeIncluded: boolean;
  estimatedDuration: string;
}

export interface VisaService {
  type: 'visa';
  visaType: string;
  processingTimeDays: number;
  requirements: string;
}

export interface TechSolution {
  type: 'tech';
  solutionType: 'website_dev' | 'payment_solutions' | 'wifi_media_stick';
  coreOfferings: string[];
  pricingModel: string;
}

export enum InquiryBookingType {
  INQUIRY = 'inquiry',
  BOOKING = 'booking',
}

export enum InquiryBookingStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  COMPLETED = 'completed',
}

export interface InquiryBooking {
  id: string;
  serviceListingId: string;
  customerId: string;
  partnerId: string;
  type: InquiryBookingType;
  status: InquiryBookingStatus;
  messageFromCustomer: string;
  createdAt: Date;
}
