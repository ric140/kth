import React, { useState, useMemo } from 'react';
import { marked } from 'marked';
import { ABOUT_MARKDOWN } from '../data/aboutContent';
import { Link } from 'react-router-dom';

const AboutPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'rendered' | 'raw'>('rendered');
  const [copied, setCopied] = useState(false);

  // Configure marked for clean HTML rendering
  const htmlContent = useMemo(() => {
    return marked.parse(ABOUT_MARKDOWN, {
      gfm: true,
      breaks: true,
    });
  }, []);

  const handleCopyMarkdown = async () => {
    try {
      await navigator.clipboard.writeText(ABOUT_MARKDOWN);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.error('Failed to copy markdown', e);
    }
  };

  const handleDownloadMarkdown = () => {
    const blob = new Blob([ABOUT_MARKDOWN], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'ABOUT.md';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-primary to-primary-dark text-white rounded-2xl p-6 sm:p-10 shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-semibold tracking-wider text-secondary mb-3 backdrop-blur-sm">
            <span>📋 System Architecture & Specification</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            About Kampot Tech Hub
          </h1>
          <p className="text-emerald-100 text-sm sm:text-base mt-2 leading-relaxed">
            A comprehensive overview explaining what Kampot Tech Hub is, what it does, and how it is engineered with Google Maps Platform and Google Workspace APIs.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              to="/map"
              className="px-4 py-2 bg-secondary text-primary font-bold text-xs rounded-lg hover:bg-yellow-400 transition shadow-sm flex items-center gap-1.5"
            >
              <span>📍</span>
              <span>Open Interactive Map</span>
            </Link>
            <Link
              to="/gmail-inbox"
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-lg transition backdrop-blur-sm flex items-center gap-1.5 border border-white/20"
            >
              <span>✉️</span>
              <span>Gmail Inquiries Hub</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Summary Feature Cards (What is it, What it does, How it does it) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1 */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
          <div className="w-12 h-12 rounded-lg bg-emerald-50 text-primary flex items-center justify-center text-xl mb-4 font-bold">
            01
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">What It Is</h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            The unified digital ecosystem and marketplace for Krong Kampot, Cambodia. Bridges essential physical logistics (motorbikes, visas) and digital solutions (software, UI/UX).
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
          <div className="w-12 h-12 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center text-xl mb-4 font-bold">
            02
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">What It Does</h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            Empowers travelers, nomads, and businesses to discover verified providers, examine photo galleries, calculate routes, and transmit formal Gmail quotes in real-time.
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
          <div className="w-12 h-12 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center text-xl mb-4 font-bold">
            03
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">How It Does It</h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            Engineered with React 19, TypeScript, Google Maps Platform (@vis.gl/react-google-maps), Google Workspace Gmail OAuth 2.0 API, and resilient client-side IndexedDB persistence.
          </p>
        </div>
      </div>

      {/* Markdown Document Container */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Toolbar */}
        <div className="bg-gray-50 border-b border-gray-200 p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex bg-gray-200/80 p-1 rounded-lg text-xs font-semibold">
              <button
                onClick={() => setViewMode('rendered')}
                className={`px-3 py-1.5 rounded-md transition-all ${
                  viewMode === 'rendered'
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                📖 Rendered Guide
              </button>
              <button
                onClick={() => setViewMode('raw')}
                className={`px-3 py-1.5 rounded-md transition-all ${
                  viewMode === 'raw'
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                📄 Raw Markdown Formula (.md)
              </button>
            </div>
            <span className="text-xs text-gray-400 hidden sm:inline">| ABOUT.md</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyMarkdown}
              className="px-3 py-1.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-lg shadow-sm transition flex items-center gap-1.5 cursor-pointer"
              title="Copy markdown text to clipboard"
            >
              {copied ? (
                <>
                  <span className="text-emerald-600">✓</span>
                  <span className="text-emerald-700">Copied!</span>
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                  <span>Copy Markdown</span>
                </>
              )}
            </button>
            <button
              onClick={handleDownloadMarkdown}
              className="px-3 py-1.5 bg-primary hover:bg-primary-dark text-white text-xs font-semibold rounded-lg shadow-sm transition flex items-center gap-1.5 cursor-pointer"
              title="Download ABOUT.md file"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>Download .md</span>
            </button>
          </div>
        </div>

        {/* View Mode Content */}
        {viewMode === 'rendered' ? (
          <div className="p-6 sm:p-10 prose max-w-none text-gray-800 leading-relaxed font-sans text-sm sm:text-base">
            <style>{`
              .prose h1 { color: #004D40; font-size: 1.85rem; font-weight: 800; border-bottom: 2px solid #E0F2F1; padding-bottom: 0.5rem; margin-top: 0; }
              .prose h2 { color: #00251A; font-size: 1.4rem; font-weight: 700; margin-top: 2rem; margin-bottom: 0.75rem; border-bottom: 1px solid #eee; padding-bottom: 0.3rem; }
              .prose h3 { color: #004D40; font-size: 1.15rem; font-weight: 600; margin-top: 1.5rem; margin-bottom: 0.5rem; }
              .prose blockquote { border-left: 4px solid #004D40; background-color: #F0FDF4; padding: 0.75rem 1.25rem; font-style: italic; color: #166534; border-radius: 0 8px 8px 0; margin: 1rem 0; }
              .prose ul { list-style-type: disc; padding-left: 1.5rem; margin: 0.75rem 0; }
              .prose ol { list-style-type: decimal; padding-left: 1.5rem; margin: 0.75rem 0; }
              .prose li { margin-bottom: 0.35rem; }
              .prose pre { background-color: #0F172A; color: #38BDF8; padding: 1rem; border-radius: 8px; overflow-x: auto; font-family: monospace; font-size: 0.85rem; }
              .prose code { background-color: #F1F5F9; color: #0F172A; padding: 0.15rem 0.35rem; border-radius: 4px; font-family: monospace; font-size: 0.9em; }
              .prose pre code { background-color: transparent; color: inherit; padding: 0; }
              .prose strong { color: #0F172A; font-weight: 600; }
              .prose hr { border: none; border-top: 1px solid #E2E8F0; margin: 2rem 0; }
            `}</style>
            <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
          </div>
        ) : (
          <div className="p-4 sm:p-6 bg-slate-900 text-slate-100 font-mono text-xs sm:text-sm overflow-x-auto leading-normal select-text">
            <pre className="whitespace-pre-wrap">{ABOUT_MARKDOWN}</pre>
          </div>
        )}
      </div>

      {/* Footer Navigation Back to App */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-white rounded-xl border border-gray-100 shadow-sm">
        <div>
          <h4 className="text-sm font-bold text-gray-900">Ready to test the live platform?</h4>
          <p className="text-xs text-gray-500">Jump directly to the interactive Google Map or send a live test inquiry via Gmail.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/map"
            className="px-4 py-2 bg-primary hover:bg-primary-dark text-white text-xs font-semibold rounded-lg transition shadow-sm"
          >
            Explore Map &rarr;
          </Link>
          <Link
            to="/"
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold rounded-lg transition"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
