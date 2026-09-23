import React, { useState, useEffect } from 'react';
import { MOCK_SERVICE_CATEGORIES } from '../data/mockData';
import ServiceCard from '../components/ServiceCard';
import KampotMap from '../components/KampotMap';
import { useDB } from '../contexts/DatabaseContext';
import { getAll, STORES } from '../utils/db';
import { ServiceListing } from '../types';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const HomePage: React.FC = () => {
  const { db } = useDB();
  const { isGmailConnected } = useAuth();
  const [listings, setListings] = useState<ServiceListing[]>([]);

  useEffect(() => {
    if (db) {
      getAll<ServiceListing>(db, STORES.LISTINGS).then(setListings).catch(console.error);
    }
  }, [db]);

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center bg-gradient-to-b from-white to-gray-50 p-8 sm:p-12 rounded-2xl shadow-sm border border-gray-100">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary/15 text-primary-dark font-bold text-xs rounded-full mb-4">
          <span>🇰🇭 Krong Kampot Premier Service Platform</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-primary mb-4 tracking-tight">
          Your Gateway to Kampot Services
        </h1>
        <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed mb-6">
          Discover verified motorbike rentals, professional software & tech solutions, visa extensions, and local services in Kampot with interactive Google Maps navigation and direct Gmail inquiries.
        </p>

        {/* Quick Action Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/map"
            className="px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary-dark transition shadow-sm flex items-center gap-2"
          >
            <span>📍</span>
            <span>Explore Kampot Map</span>
          </Link>
          <Link
            to="/gmail-inbox"
            className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50 transition shadow-sm flex items-center gap-2"
          >
            <span>✉️</span>
            <span>{isGmailConnected ? 'Gmail Inquiries (Active)' : 'Direct Gmail Inquiries'}</span>
          </Link>
          <Link
            to="/about"
            className="px-5 py-2.5 bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm font-semibold rounded-xl hover:bg-emerald-100 transition shadow-sm flex items-center gap-2"
          >
            <span>📋</span>
            <span>About KTH & Architecture</span>
          </Link>
        </div>
      </section>

      {/* Interactive Google Map Showcase Section */}
      <section className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg text-sm">📍</span>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                Service Locations across Kampot
              </h2>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Locate trusted rental depots, tech studios, and visa desks on Google Maps.
            </p>
          </div>
          <Link
            to="/map"
            className="text-xs sm:text-sm font-bold text-primary hover:text-primary-dark flex items-center gap-1 self-start sm:self-auto hover:underline"
          >
            Open Fullscreen Map &rarr;
          </Link>
        </div>

        <KampotMap
          listings={listings}
          mapHeight="420px"
          zoom={14}
          showFilterBar={true}
        />
      </section>

      {/* Services Grid */}
      <section>
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Explore Service Categories</h2>
          <p className="text-sm text-gray-500 mt-1">Everything you need for living, traveling, and working in Kampot.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {MOCK_SERVICE_CATEGORIES.map(category => (
            <ServiceCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      {/* Gmail Communication Feature Callout */}
      <section className="bg-gradient-to-r from-slate-900 to-gray-900 text-white rounded-2xl p-6 sm:p-10 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/20 text-red-300 rounded-full text-xs font-semibold mb-3">
            <span>✉️ Integrated with Google Workspace Gmail</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold">Direct Partner Communications via Gmail</h3>
          <p className="text-slate-300 text-sm mt-2 leading-relaxed">
            Send booking inquiries and quote requests directly from your authenticated Gmail address. Providers receive instant notifications and you keep a clear thread in your Gmail sent mailbox.
          </p>
        </div>
        <Link
          to="/gmail-inbox"
          className="px-6 py-3 bg-secondary text-primary font-bold text-sm rounded-xl hover:bg-yellow-400 transition shadow-md whitespace-nowrap self-start md:self-center"
        >
          {isGmailConnected ? 'View Gmail Inbox' : 'Connect with Gmail'}
        </Link>
      </section>

      {/* Platform Architecture & Documentation Callout */}
      <section className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-wider">
            <span>📋 ABOUT.md Documentation</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>Comprehensive Markdown Formula</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
            Learn What KTH Is, What It Does & How It Works
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            Read our complete technical architecture guide covering React 19, Google Maps spatial intelligence, Google Workspace OAuth 2.0 Gmail dispatch, role-based controls, and client-side database persistence.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <Link
            to="/about"
            className="w-full sm:w-auto text-center px-6 py-3 bg-primary hover:bg-primary-dark text-white font-semibold text-sm rounded-xl transition shadow-sm whitespace-nowrap"
          >
            Read Architectural Guide &rarr;
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
