
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import ContactUsForm from './ContactUsForm';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const location = useLocation();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToContact = (e: React.MouseEvent) => {
    const contactElem = document.getElementById('contact-us');
    if (contactElem) {
      contactElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto relative" id="contact-us">
      {/* Dynamic Gradient Top Border */}
      <div className="h-1 w-full bg-gradient-to-r from-primary via-secondary to-primary"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        
        {/* Contact Us Section with Direct Provider Inquiry Form */}
        <section id="contact" className="scroll-mt-24 mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Contact info & value prop */}
            <div className="lg:col-span-4 space-y-6">
              <div>
                <span className="text-secondary font-mono text-xs uppercase tracking-widest bg-secondary/10 px-2.5 py-1 rounded">
                  Reach Out Directly
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mt-2 leading-tight">
                  Contact Our Service Providers
                </h2>
                <p className="text-gray-400 text-sm mt-3 leading-relaxed">
                  Have inquiries about renting a scooter, developing custom software, building a mobile app, or renewing your Cambodian visa?
                </p>
                <p className="text-gray-400 text-sm mt-2 leading-relaxed">
                  Use this form to message registered Kampot Tech Hub providers directly. Messages are sent immediately to the providers' dashboards.
                </p>
              </div>

              {/* Quick Info Cards */}
              <div className="space-y-3 pt-2">
                <div className="flex items-start space-x-3.5 bg-gray-800/60 p-3.5 rounded-xl border border-gray-800">
                  <div className="p-2 bg-primary/20 text-secondary rounded-lg flex-shrink-0 mt-0.5">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Hub Location</h4>
                    <p className="text-xs text-gray-400 mt-0.5">Riverside & Old Market Area, Kampot Province, Cambodia</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5 bg-gray-800/60 p-3.5 rounded-xl border border-gray-800">
                  <div className="p-2 bg-primary/20 text-secondary rounded-lg flex-shrink-0 mt-0.5">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Direct Email</h4>
                    <p className="text-xs text-gray-400 mt-0.5">providers@kampottechhub.com</p>
                    <p className="text-[11px] text-gray-500">Inquiries checked 7 days a week</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3.5 bg-gray-800/60 p-3.5 rounded-xl border border-gray-800">
                  <div className="p-2 bg-primary/20 text-secondary rounded-lg flex-shrink-0 mt-0.5">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Service Hours</h4>
                    <p className="text-xs text-gray-400 mt-0.5">Monday – Saturday: 08:00 – 18:00 ICT</p>
                    <p className="text-[11px] text-gray-500">Emergency rentals & visa support available</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Contact Us Form */}
            <div className="lg:col-span-8">
              <ContactUsForm />
            </div>

          </div>
        </section>

        {/* Directory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12 border-t border-gray-800/80 pt-12">
          
          {/* Column 1: Brand & About */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2 group">
                <div className="w-10 h-10 relative">
                     <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full transform group-hover:rotate-12 transition-transform duration-500">
                        <path d="M14 38V22L20 18V38H24V14L30 10V38H34V20L38 22V38H40V40H12V38H14Z" fill="currentColor" className="text-white" />
                        <path d="M8 24C8 15.1634 15.1634 8 24 8" stroke="#FFC107" strokeWidth="3" strokeLinecap="round" />
                        <circle cx="24" cy="8" r="3" fill="#FFC107" />
                        <circle cx="8" cy="24" r="2" fill="#FFC107" />
                     </svg>
                </div>
                <div>
                    <h3 className="text-xl font-bold text-white tracking-wider uppercase leading-none group-hover:text-secondary transition-colors duration-300">Kampot</h3>
                    <span className="text-xs font-bold text-secondary tracking-[0.2em] uppercase">Tech Hub</span>
                </div>
            </Link>
            <p className="text-sm leading-relaxed text-gray-400">
              Your central portal for discovering the best services in Kampot. From motorbike rentals to cutting-edge tech solutions, we connect you with trusted partners.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="bg-gray-800 p-2 rounded-full hover:bg-[#1877F2] hover:text-white transition-all duration-300 hover:-translate-y-1 shadow-md">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="bg-gray-800 p-2 rounded-full hover:bg-[#E1306C] hover:text-white transition-all duration-300 hover:-translate-y-1 shadow-md">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.416 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 014.185 3.36c.636-.247 1.363-.416 2.427-.465C7.674 2.845 8.017 2.833 10.42 2.833h.08c2.643 0 2.987.012 4.043.06.883.04 1.57.18 2.054.37.525.205 1.002.502 1.421.921.419.419.716.896.921 1.42.19.483.33.972.37 1.855.04.996.05 1.33.05 3.96s-.01 2.964-.05 3.96c-.04.883-.18 1.57-.37 2.054-.205.525-.502 1.002-.921 1.421-.419.419-.896.716-1.42.921-.483.19-.972.33-1.855.37-1.04.05-1.35.05-4.11.05h-.63c-2.76 0-3.07-.01-4.11-.05-.883-.04-1.57-.18-2.054-.37-.525-.205-1.002-.502-1.421-.921-.419-.419-.716-.896-.921-1.42-.19-.483-.33-.972-.37-1.855-.05-1.04-.05-1.35-.05-4.11v-.63c0-2.76.01-3.07.05-4.11.04-.883.18-1.57.37-2.054.205-.525.502-1.002.921-1.421.419-.419.896-.716 1.42-.921.483-.19.972-.33 1.855-.37 1.024-.047 1.379-.06 3.808-.06zm-1.87 5.166a5.166 5.166 0 100 10.332 5.166 5.166 0 000-10.332zm0 1.933a3.233 3.233 0 110 6.466 3.233 3.233 0 010-6.466zm5.333-3.766a1.2 1.2 0 100 2.4 1.2 1.2 0 000-2.4z"/></svg>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="bg-gray-800 p-2 rounded-full hover:bg-[#0A66C2] hover:text-white transition-all duration-300 hover:-translate-y-1 shadow-md">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white border-b-2 border-secondary inline-block pb-1">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/" className="hover:text-secondary transition-colors duration-300 flex items-center group">
                    <span className="text-secondary opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300 mr-2">›</span>
                    Home
                </Link>
              </li>
              <li>
                <a href="#contact-us" onClick={scrollToContact} className="hover:text-secondary transition-colors duration-300 flex items-center group cursor-pointer text-secondary/90 font-medium">
                    <span className="text-secondary opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300 mr-2">›</span>
                    Contact Us & Providers
                </a>
              </li>
              <li>
                <Link to="/about" className="hover:text-secondary transition-colors duration-300 flex items-center group text-secondary/90 font-medium">
                    <span className="text-secondary opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300 mr-2">›</span>
                    About & Architecture Guide
                </Link>
              </li>
              <li>
                <Link to="/map" className="hover:text-secondary transition-colors duration-300 flex items-center group">
                    <span className="text-secondary opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300 mr-2">›</span>
                    Interactive Kampot Map
                </Link>
              </li>
              <li>
                <Link to="/gmail-inbox" className="hover:text-secondary transition-colors duration-300 flex items-center group">
                    <span className="text-secondary opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300 mr-2">›</span>
                    Gmail Inquiries Hub
                </Link>
              </li>
              <li>
                <Link to="/search" className="hover:text-secondary transition-colors duration-300 flex items-center group">
                    <span className="text-secondary opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300 mr-2">›</span>
                    Search Services
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-secondary transition-colors duration-300 flex items-center group">
                    <span className="text-secondary opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300 mr-2">›</span>
                    My Dashboard
                </Link>
              </li>
              <li>
                <Link to="/services/cat-tech" className="hover:text-secondary transition-colors duration-300 flex items-center group">
                    <span className="text-secondary opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300 mr-2">›</span>
                    Tech Solutions
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Top Services */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white border-b-2 border-secondary inline-block pb-1">Top Services</h4>
             <ul className="space-y-3 text-sm">
              <li>
                <Link to="/services/cat-motorbike" className="hover:text-secondary transition-colors duration-300 block">
                  Motorbike Rental & Sales
                </Link>
              </li>
              <li>
                <Link to="/services/cat-tech" className="hover:text-secondary transition-colors duration-300 block">
                  Web & Software Development
                </Link>
              </li>
              <li>
                <Link to="/services/cat-app-design" className="hover:text-secondary transition-colors duration-300 block">
                  Mobile App Design
                </Link>
              </li>
              <li>
                <Link to="/services/cat-visa" className="hover:text-secondary transition-colors duration-300 block">
                  Visa Extension Services
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white border-b-2 border-secondary inline-block pb-1">Newsletter</h4>
            <p className="text-sm text-gray-400 mb-4">
              Subscribe to get the latest updates, tech trends, and special offers from Kampot partners.
            </p>
            <form className="flex flex-col space-y-3" onSubmit={(e) => e.preventDefault()}>
                <div className="relative">
                    <input 
                        type="email" 
                        placeholder="Your email address" 
                        className="w-full bg-gray-800 text-white pl-4 pr-10 py-3 rounded-md focus:outline-none focus:ring-1 focus:ring-secondary border border-gray-700 placeholder-gray-500 text-sm transition-all duration-300" 
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>
                </div>
                <button className="bg-secondary text-primary font-bold py-2 px-4 rounded-md hover:bg-yellow-400 hover:shadow-lg hover:scale-[1.02] active:scale-95 transition-all duration-300 uppercase tracking-wide text-sm">
                    Subscribe
                </button>
            </form>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500 relative gap-4">
          <div>
            <p>© {currentYear} Kampot Tech Hub. All rights reserved.</p>
            <p className="text-[11px] text-gray-600 mt-0.5">Connecting travelers, expats, and locals directly with trusted services in Kampot.</p>
          </div>

          <div className="flex items-center space-x-4">
            <a href="#contact-us" onClick={scrollToContact} className="hover:text-secondary transition-colors cursor-pointer">
              Direct Provider Inquiries
            </a>
            <span>•</span>
            <Link to="/services/cat-tech" className="hover:text-secondary transition-colors">
              Tech Solutions
            </Link>
            <span>•</span>
            <Link to="/services/cat-motorbike" className="hover:text-secondary transition-colors">
              Motorbike Rentals
            </Link>
          </div>
          
          {/* Back to Top Button */}
          <button 
            onClick={scrollToTop}
            className="bg-gray-800 text-gray-400 hover:text-white hover:bg-primary p-2.5 rounded-lg shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
            title="Back to Top"
            aria-label="Back to Top"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
