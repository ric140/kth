import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { fetchRecentGmailMessages } from '../services/gmailService';
import { GmailEmailMessage, ServiceListing } from '../types';
import { useDB } from '../contexts/DatabaseContext';
import { getAll, STORES } from '../utils/db';

const GmailInquiriesPage: React.FC = () => {
  const { user, isGmailConnected, gmailUserEmail, connectGmailAccount, sendGmailInquiry } = useAuth();
  const { db } = useDB();

  const [messages, setMessages] = useState<GmailEmailMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [activeTab, setActiveTab] = useState<'inbox' | 'compose'>('inbox');
  
  // Compose form state
  const [listings, setListings] = useState<ServiceListing[]>([]);
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('partners@kampot-techhub.com');
  const [subject, setSubject] = useState('Service Inquiry - Kampot Tech Hub');
  const [emailBody, setEmailBody] = useState('');
  const [sending, setSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState<string | null>(null);
  const [sendError, setSendError] = useState<string | null>(null);

  // Load listings for provider picker
  useEffect(() => {
    if (db) {
      getAll<ServiceListing>(db, STORES.LISTINGS).then(setListings).catch(console.error);
    }
  }, [db]);

  // Load Gmail messages if connected
  useEffect(() => {
    if (isGmailConnected) {
      loadMessages();
    }
  }, [isGmailConnected]);

  const loadMessages = async () => {
    setLoadingMessages(true);
    try {
      const msgs = await fetchRecentGmailMessages('Kampot Tech Hub');
      setMessages(msgs);
    } catch (e) {
      console.error('Failed to load Gmail messages', e);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleConnectGmail = async () => {
    setConnecting(true);
    try {
      await connectGmailAccount();
      await loadMessages();
    } catch (e) {
      console.error('Failed to connect Gmail', e);
    } finally {
      setConnecting(false);
    }
  };

  const handleServiceSelect = (id: string) => {
    setSelectedServiceId(id);
    const service = listings.find(l => l.id === id);
    if (service) {
      setSubject(`Inquiry regarding: ${service.title}`);
      setEmailBody(`Hi,\n\nI am interested in ${service.title} listed on Kampot Tech Hub.\nCould you please provide more details on availability and scheduling?\n\nThank you!`);
    }
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setSendSuccess(null);
    setSendError(null);
    setSending(true);

    try {
      const res = await sendGmailInquiry({
        to: recipientEmail,
        subject: subject || 'Kampot Tech Hub Service Request',
        body: emailBody,
        partnerName: 'Kampot Service Provider',
      });

      if (res.success) {
        setSendSuccess('Your message was sent successfully via your Gmail account!');
        setEmailBody('');
        setActiveTab('inbox');
        setTimeout(() => loadMessages(), 1500);
      } else {
        setSendError(res.error || 'Failed to send message via Gmail.');
      }
    } catch (err: any) {
      setSendError(err.message || 'An unexpected error occurred.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 text-red-700 rounded-full text-xs font-semibold mb-2">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
            </svg>
            <span>Google Workspace Gmail Integration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            Gmail Inquiries & Quotes
          </h1>
          <p className="text-gray-500 text-sm mt-1 max-w-xl">
            Send inquiries, quote requests, and booking correspondence directly to local Kampot partners through your official Gmail account.
          </p>
        </div>

        {/* Connection Status Card */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex flex-col sm:flex-row items-center gap-3">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${isGmailConnected ? 'bg-emerald-500 ring-4 ring-emerald-100' : 'bg-amber-400'}`}></div>
            <div className="text-left">
              <p className="text-xs font-bold text-gray-900">
                {isGmailConnected ? 'Gmail Connected' : 'Gmail Not Connected'}
              </p>
              <p className="text-[11px] text-gray-500">
                {isGmailConnected ? (gmailUserEmail || user?.email) : 'Connect with Google to enable email features'}
              </p>
            </div>
          </div>
          {!isGmailConnected && (
            <button
              onClick={handleConnectGmail}
              disabled={connecting}
              className="px-4 py-2 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary-dark transition shadow-sm flex items-center gap-2 disabled:opacity-60 cursor-pointer"
            >
              {connecting ? 'Connecting...' : 'Connect Gmail'}
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 bg-white rounded-t-xl px-4 pt-2">
        <button
          onClick={() => setActiveTab('inbox')}
          className={`px-5 py-3 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'inbox'
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <span>📬 Recent Gmail Inquiries</span>
          {messages.length > 0 && (
            <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-bold">
              {messages.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('compose')}
          className={`px-5 py-3 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'compose'
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <span>✍️ Compose Gmail Inquiry</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-b-xl shadow-sm border border-gray-100 p-6">
        {activeTab === 'inbox' && (
          <div className="space-y-4">
            {!isGmailConnected ? (
              <div className="text-center py-12 px-4">
                <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900">Connect Your Gmail to View Messages</h3>
                <p className="text-sm text-gray-500 max-w-md mx-auto mt-1 mb-6">
                  With your permission, Kampot Tech Hub can read your service inquiries and send email correspondence directly to partners.
                </p>
                <button
                  onClick={handleConnectGmail}
                  disabled={connecting}
                  className="px-6 py-2.5 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-dark transition shadow inline-flex items-center gap-2"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                  </svg>
                  <span>Connect Gmail Account</span>
                </button>
              </div>
            ) : loadingMessages ? (
              <div className="py-12 flex flex-col items-center justify-center text-gray-500">
                <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin mb-2"></div>
                <p className="text-xs">Fetching inquiry emails from Gmail...</p>
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-500 text-sm">No recent Kampot Tech Hub inquiries found in your Gmail inbox.</p>
                <button
                  onClick={() => setActiveTab('compose')}
                  className="mt-4 px-4 py-2 bg-primary text-white text-xs font-semibold rounded-md hover:bg-primary-dark transition"
                >
                  Send Your First Inquiry
                </button>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {messages.map((msg) => (
                  <div key={msg.id} className="py-3.5 hover:bg-gray-50 px-2 rounded-lg transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-900 truncate max-w-[200px] sm:max-w-xs">
                        {msg.from || 'Direct Partner'}
                      </span>
                      <span className="text-[11px] text-gray-400">{msg.date}</span>
                    </div>
                    <p className="text-sm font-semibold text-primary mt-0.5">{msg.subject}</p>
                    <p className="text-xs text-gray-500 line-clamp-2 mt-1">{msg.snippet}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'compose' && (
          <form onSubmit={handleSendEmail} className="space-y-4 max-w-2xl">
            {sendSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center gap-2">
                <span>✓</span>
                <span>{sendSuccess}</span>
              </div>
            )}
            {sendError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded-lg flex items-center gap-2">
                <span>⚠️</span>
                <span>{sendError}</span>
              </div>
            )}

            {!isGmailConnected && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-xs flex items-center justify-between">
                <span>Please connect your Gmail account to send direct messages to partners.</span>
                <button
                  type="button"
                  onClick={handleConnectGmail}
                  disabled={connecting}
                  className="px-3 py-1 bg-amber-600 text-white rounded text-xs font-semibold hover:bg-amber-700 cursor-pointer"
                >
                  Connect Now
                </button>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Select Service (Optional)
              </label>
              <select
                value={selectedServiceId}
                onChange={(e) => handleServiceSelect(e.target.value)}
                className="w-full text-xs border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="">-- Choose a Kampot service --</option>
                {listings.map(l => (
                  <option key={l.id} value={l.id}>{l.title} (${l.price})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Recipient Partner Email
              </label>
              <input
                type="email"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                required
                className="w-full text-xs border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Email Subject
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
                className="w-full text-xs border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Message Body
              </label>
              <textarea
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                rows={5}
                required
                placeholder="Write your booking dates, questions, or specific project requirements here..."
                className="w-full text-xs border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-1 focus:ring-primary"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={sending || !isGmailConnected}
              className="px-6 py-2.5 bg-primary text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-primary-dark transition shadow disabled:opacity-50 flex items-center gap-2 cursor-pointer"
            >
              {sending ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Sending via Gmail API...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                  </svg>
                  <span>Send via Gmail</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default GmailInquiriesPage;
