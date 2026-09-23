
import React from 'react';
import { ServiceCategory, ServiceCategoryType, User, Role, ServiceListing, ServiceStatus, InquiryBooking, InquiryBookingType, InquiryBookingStatus } from '../types';

// Icons
const BuildingOfficeIcon: React.FC<{ className?: string }> = (props) => (
  React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
    React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h6.375a.75.75 0 01.75.75v1.5a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v-1.5A.75.75 0 019 6.75zM9 12.75h6.375a.75.75 0 01.75.75v1.5a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v-1.5a.75.75 0 01.75-.75z" })
  )
);

const HomeModernIcon: React.FC<{ className?: string }> = (props) => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
        React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m-3-1l-3-1m3-1l-3-1m-3 1l3 1m-3-1l3-1M9.75 9.06l3-1.09l3 1.09m-3-1.09V6.455m-3 2.605v2.606m6-2.606v2.606" })
    )
);

const CommandLineIcon: React.FC<{ className?: string }> = (props) => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
        React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 15" })
    )
);

const KeyIcon: React.FC<{ className?: string }> = (props) => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
        React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" })
    )
);

const IdentificationIcon: React.FC<{ className?: string }> = (props) => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
        React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z" })
    )
);

const DevicePhoneMobileIcon: React.FC<{ className?: string }> = (props) => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", ...props },
        React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" })
    )
);



export const MOCK_USERS: User[] = [
  { id: 'user-1', name: 'Alice Customer', email: 'alice@example.com', role: Role.CUSTOMER },
  { id: 'user-2', name: 'Bob Partner', email: 'bob@example.com', role: Role.PARTNER },
  { id: 'user-3', name: 'Charlie Partner', email: 'charlie@example.com', role: Role.PARTNER }
];

export const MOCK_SERVICE_CATEGORIES: ServiceCategory[] = [
  { id: 'cat-guesthouse', name: 'Guesthouse', description: 'Find cozy and affordable places to stay. Perfect for travelers seeking comfort and local charm.', type: ServiceCategoryType.EXTERNAL, externalUrl: 'https://example-guesthouse.com', icon: HomeModernIcon },
  { id: 'cat-real-estate', name: 'Real Estate', description: 'Explore a wide range of properties for sale or rent. Your dream home is just a click away.', type: ServiceCategoryType.EXTERNAL, externalUrl: 'https://example-realestate.com', icon: BuildingOfficeIcon },
  { id: 'cat-motorbike', name: 'Motorbike Rental/Sales', description: 'Rent a motorbike for your adventures or find a reliable vehicle for purchase.', type: ServiceCategoryType.INTERNAL, icon: KeyIcon },
  { id: 'cat-app-design', name: 'Mobile App Design', description: 'Transform your ideas into stunning mobile experiences with professional UI/UX design.', type: ServiceCategoryType.INTERNAL, icon: DevicePhoneMobileIcon },
  { id: 'cat-visa', name: 'Visa Services', description: 'Simplify your visa application process with our expert assistance and guidance.', type: ServiceCategoryType.INTERNAL, icon: IdentificationIcon },
  { id: 'cat-tech', name: 'Tech Solutions', description: 'Custom websites, payment solutions, and other tech services to elevate your business.', type: ServiceCategoryType.INTERNAL, icon: CommandLineIcon },
];

export const MOCK_SERVICE_LISTINGS: ServiceListing[] = [
  {
    id: 'list-moto-airblade', 
    categoryId: 'cat-motorbike', 
    partnerId: 'user-2', 
    title: 'Honda Airblade',
    description: 'A powerful and reliable scooter, perfect for both city commuting and countryside exploration. Available for rent at $6 a day or $65 a month.',
    price: '6', 
    currency: 'USD / Day (or $65/month)', 
    imagesUrls: [
      'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1525160354320-545e39edee96?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1558980664-769d59546b3d?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1508974239320-0a029497e820?q=80&w=1200&auto=format&fit=crop'
    ], 
    status: ServiceStatus.ACTIVE,
    location: {
      lat: 10.6105,
      lng: 104.1812,
      address: 'Durian Roundabout Depot, Krong Kampot',
      landmark: 'Near Kampot Durian Monument'
    },
    details: { type: 'motorbike', make: 'Honda', model: 'Airblade', year: 2020, condition: 'Excellent', rentalPricePerDay: 6 }
  },
  {
    id: 'list-moto-rebel', 
    categoryId: 'cat-motorbike', 
    partnerId: 'user-2', 
    title: 'Honda Rebel - For Sale',
    description: 'Stylish cruiser in great condition. For sale at $799. Includes a 3-month mechanical warranty.',
    price: '799', 
    currency: 'USD', 
    imagesUrls: [
      'https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1558980664-3a031cf67ea8?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1558981408-db0ecd8a1ee4?q=80&w=1200&auto=format&fit=crop'
    ], 
    status: ServiceStatus.ACTIVE,
    location: {
      lat: 10.5982,
      lng: 104.1801,
      address: 'Old Market St. Garage, Kampot Riverside',
      landmark: 'Old French Bridge Approach'
    },
    details: { type: 'motorbike', make: 'Honda', model: 'Rebel', year: 2017, condition: 'Used - Good', salePrice: 799 }
  },
  {
    id: 'list-moto-beat', 
    categoryId: 'cat-motorbike', 
    partnerId: 'user-2', 
    title: 'Honda Beat',
    description: 'Compact, agile, and fuel-efficient. Available for rent at $6 a day or $65 a month.',
    price: '6', 
    currency: 'USD / Day (or $65/month)', 
    imagesUrls: [
      'https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1509285605230-056294b45595?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1520695287272-b7f8af46d367?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=1200&auto=format&fit=crop'
    ], 
    status: ServiceStatus.ACTIVE,
    location: {
      lat: 10.6055,
      lng: 104.1795,
      address: 'Riverside Walkway Station, Kampot',
      landmark: 'Opposite Night Market'
    },
    details: { type: 'motorbike', make: 'Honda', model: 'Beat', year: 2021, condition: 'Very Good', rentalPricePerDay: 6 }
  },
  {
    id: 'list-app-1', categoryId: 'cat-app-design', partnerId: 'user-3', title: 'E-Commerce Mobile App Design',
    description: 'Complete UI/UX design package for an e-commerce mobile application. Includes user research, wireframing, and high-fidelity prototypes.',
    price: '1500', currency: 'USD / Project', 
    imagesUrls: [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1200&auto=format&fit=crop'
    ], 
    status: ServiceStatus.ACTIVE,
    location: {
      lat: 10.5873,
      lng: 104.1755,
      address: 'Fish Island Creative Studio, Traeuy Kaoh, Kampot',
      landmark: 'Kampot Arts & Digital Cluster'
    },
    details: { type: 'mobile-app', platforms: ['iOS', 'Android'], designTools: ['Figma', 'Adobe XD'], prototypeIncluded: true, estimatedDuration: '3 Weeks' }
  },
  {
    id: 'list-tech-1', categoryId: 'cat-tech', partnerId: 'user-3', title: 'Professional Website Development',
    description: 'Get a stunning, responsive, and SEO-optimized website for your business. From portfolios to e-commerce, we build solutions that drive growth.',
    price: 'Starting at 500', currency: 'USD', 
    imagesUrls: [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=1200&auto=format&fit=crop'
    ], 
    status: ServiceStatus.ACTIVE,
    location: {
      lat: 10.5937,
      lng: 104.1784,
      address: 'Kampot Tech Hub Office, Street 724, Krong Kampot',
      landmark: 'Old Market Historic Quarter'
    },
    details: { type: 'tech', solutionType: 'website_dev', coreOfferings: ['Responsive Design', 'CMS Integration', 'SEO Basics'], pricingModel: 'Per Project' }
  },
  {
    id: 'list-tech-2', categoryId: 'cat-tech', partnerId: 'user-3', title: 'POS & Online Payment Integration',
    description: 'Streamline your business transactions with our secure POS systems and online payment gateway integrations. Supports major cards and QR codes.',
    price: '200', currency: 'USD / Setup', 
    imagesUrls: [
      'https://images.unsplash.com/photo-1556742049-0a67e5572293?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1556742111-a301076d9d18?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=1200&auto=format&fit=crop'
    ], 
    status: ServiceStatus.ACTIVE,
    location: {
      lat: 10.5960,
      lng: 104.1830,
      address: 'Fintech Solutions Center, National Road 3, Kampot',
      landmark: 'Near Kampot Provincial Hall'
    },
    details: { type: 'tech', solutionType: 'payment_solutions', coreOfferings: ['QR Payments', 'Card Terminals', 'API Integration'], pricingModel: 'One-time Setup + Monthly' }
  },
  {
    id: 'list-visa-1', categoryId: 'cat-visa', partnerId: 'user-2', title: 'Tourist Visa Extension Service',
    description: 'Extend your stay without the hassle. We handle all the paperwork and appointments for your tourist visa extension.',
    price: '150', currency: 'USD', 
    imagesUrls: [
      'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=1200&auto=format&fit=crop'
    ], 
    status: ServiceStatus.ACTIVE,
    location: {
      lat: 10.6015,
      lng: 104.1772,
      address: 'Expat Services Desk, Riverside Road, Kampot',
      landmark: 'Near Lotus Pond'
    },
    details: { type: 'visa', visaType: 'Tourist (TR)', processingTimeDays: 5, requirements: 'Passport, recent photo, and current visa details.' }
  }
];

export const MOCK_INQUIRIES: InquiryBooking[] = [
    { 
        id: 'inq-1', serviceListingId: 'list-moto-airblade', customerId: 'user-1', partnerId: 'user-2', 
        type: InquiryBookingType.INQUIRY, status: InquiryBookingStatus.APPROVED, 
        messageFromCustomer: "Hi, I'd like to rent this for 3 days next week. Is it available from Monday?",
        createdAt: new Date('2024-07-28T10:00:00Z')
    },
    { 
        id: 'inq-2', serviceListingId: 'list-tech-1', customerId: 'user-1', partnerId: 'user-3', 
        type: InquiryBookingType.INQUIRY, status: InquiryBookingStatus.PENDING, 
        messageFromCustomer: "I'm interested in a website for my coffee shop. Can we schedule a call to discuss the details?",
        createdAt: new Date('2024-07-29T11:30:00Z')
    }
];
