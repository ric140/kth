import React, { useState, useMemo } from 'react';
import { marked } from 'marked';
import { ABOUT_MARKDOWN } from '../data/aboutContent';
import { Link } from 'react-router-dom';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  const [viewMode, setViewMode] = useState<'rendered' | 'raw'>('rendered');
  const [copied, setCopied] = useState(false);

  const htmlContent = useMemo(() => {
    return marked.parse(ABOUT_MARKDOWN, {
      gfm: true,
      breaks: true,
    });
  }, []);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(ABOUT_MARKDOWN);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div 
        className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-primary text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-lg">
              📋
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold">About Kampot Tech Hub</h2>
              <p className="text-xs text-emerald-200">System Architecture, Features & Implementation Guide</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/about"
              onClick={onClose}
              className="text-xs bg-white/10 hover:bg-white/20 text-white px-2.5 py-1.5 rounded font-medium transition hidden sm:inline-block"
            >
              Full Page &rarr;
            </Link>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-base transition"
              aria-label="Close"
            >
              &times;
            </button>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="bg-gray-50 border-b border-gray-200 px-4 py-2.5 flex items-center justify-between text-xs">
          <div className="flex bg-gray-200 p-0.5 rounded-md font-semibold">
            <button
              onClick={() => setViewMode('rendered')}
              className={`px-3 py-1 rounded transition-all ${
                viewMode === 'rendered' ? 'bg-white text-primary shadow-xs' : 'text-gray-600'
              }`}
            >
              📖 Rendered View
            </button>
            <button
              onClick={() => setViewMode('raw')}
              className={`px-3 py-1 rounded transition-all ${
                viewMode === 'raw' ? 'bg-white text-primary shadow-xs' : 'text-gray-600'
              }`}
            >
              📄 Raw Markdown (.md)
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="px-2.5 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100 text-gray-700 font-medium transition flex items-center gap-1 cursor-pointer"
          >
            {copied ? '✓ Copied' : '📋 Copy Markdown'}
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="p-5 sm:p-8 overflow-y-auto flex-grow text-gray-800 text-sm leading-relaxed">
          {viewMode === 'rendered' ? (
            <div className="prose max-w-none font-sans">
              <style>{`
                .prose h1 { color: #004D40; font-size: 1.5rem; font-weight: 800; border-bottom: 2px solid #E0F2F1; padding-bottom: 0.4rem; margin-top: 0; }
                .prose h2 { color: #00251A; font-size: 1.25rem; font-weight: 700; margin-top: 1.5rem; margin-bottom: 0.5rem; border-bottom: 1px solid #eee; padding-bottom: 0.2rem; }
                .prose h3 { color: #004D40; font-size: 1.05rem; font-weight: 600; margin-top: 1.25rem; margin-bottom: 0.4rem; }
                .prose blockquote { border-left: 4px solid #004D40; background-color: #F0FDF4; padding: 0.5rem 1rem; font-style: italic; color: #166534; border-radius: 0 6px 6px 0; margin: 0.75rem 0; }
                .prose ul { list-style-type: disc; padding-left: 1.25rem; margin: 0.5rem 0; }
                .prose ol { list-style-type: decimal; padding-left: 1.25rem; margin: 0.5rem 0; }
                .prose li { margin-bottom: 0.25rem; }
                .prose pre { background-color: #0F172A; color: #38BDF8; padding: 0.75rem; border-radius: 6px; overflow-x: auto; font-family: monospace; font-size: 0.8rem; }
                .prose code { background-color: #F1F5F9; color: #0F172A; padding: 0.1rem 0.3rem; border-radius: 4px; font-family: monospace; font-size: 0.85em; }
                .prose pre code { background-color: transparent; color: inherit; padding: 0; }
              `}</style>
              <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
            </div>
          ) : (
            <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg font-mono text-xs overflow-x-auto whitespace-pre-wrap">
              {ABOUT_MARKDOWN}
            </pre>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-gray-50 border-t border-gray-200 p-3 sm:px-5 flex items-center justify-between">
          <span className="text-[11px] text-gray-500">
            Source file: <code className="font-mono text-gray-700 bg-gray-200 px-1 py-0.5 rounded">ABOUT.md</code>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-gray-800 text-white rounded-lg text-xs font-semibold hover:bg-gray-900 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutModal;
