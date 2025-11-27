
import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import AuthModal from './AuthModal';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsMobileMenuOpen(false);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="bg-gray-900 text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Branding */}
            <Link to="/" className="flex items-center group flex-shrink-0 space-x-3" onClick={closeMobileMenu}>
              {/* Logo Icon */}
              <div className="relative w-10 h-10 md:w-12 md:h-12 flex-shrink-0 transform group-hover:scale-105 transition-transform duration-300">
                 <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
                    {/* Background Circle Effect */}
                    <circle cx="24" cy="24" r="22" className="stroke-secondary" strokeWidth="2" strokeOpacity="0.5" />
                    
                    {/* Buildings (Blue/CurrentColor) */}
                    <path d="M14 38V22L20 18V38H24V14L30 10V38H34V20L38 22V38H40V40H12V38H14Z" fill="currentColor" />
                    
                    {/* Circuit Lines (Secondary/Yellow) */}
                    <path d="M8 24C8 15.1634 15.1634 8 24 8" stroke="#FFC107" strokeWidth="3" strokeLinecap="round" />
                    <circle cx="24" cy="8" r="3" fill="#FFC107" />
                    <circle cx="8" cy="24" r="2" fill="#FFC107" />
                    <path d="M38 12L42 8" stroke="#FFC107" strokeWidth="2" strokeLinecap="round" />
                 </svg>
              </div>

              {/* Text */}
              <div className="flex flex-col justify-center">
                <span className="text-xl md:text-2xl font-bold tracking-wider leading-none uppercase">
                  Kampot
                </span>
                <span className="text-xs md:text-sm font-bold tracking-[0.2em] text-secondary leading-none uppercase">
                  Tech Hub
                </span>
              </div>
            </Link>

            {/* Desktop Search Bar */}
            <div className="flex-1 max-w-lg mx-4 hidden md:block">
              <form onSubmit={handleSearch} className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400 group-focus-within:text-secondary transition-colors duration-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-transparent rounded-lg leading-5 bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:bg-white focus:text-gray-900 focus:placeholder-gray-500 sm:text-sm transition duration-300 ease-in-out shadow-inner"
                  placeholder="Find services, tours, tech..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>
            </div>

            {/* Desktop Navigation & Auth */}
            <div className="hidden lg:flex items-center space-x-4">
              <nav className="flex items-center space-x-6 mr-4">
                <NavLink to="/" className={({ isActive }) => `text-lg hover:text-secondary transition duration-300 ${isActive ? 'text-secondary' : ''}`}>Home</NavLink>
                <NavLink to="/services/cat-tech" className={({ isActive }) => `text-lg hover:text-secondary transition duration-300 ${isActive ? 'text-secondary' : ''}`}>Tech Solutions</NavLink>
                {user && <NavLink to="/dashboard" className={({ isActive }) => `text-lg hover:text-secondary transition duration-300 ${isActive ? 'text-secondary' : ''}`}>Dashboard</NavLink>}
              </nav>

              <div className="flex items-center space-x-3">
                {user ? (
                  <>
                    <span className="hidden xl:inline">Welcome, {user.name.split(' ')[0]}!</span>
                    <button
                      onClick={logout}
                      className="bg-secondary text-primary hover:bg-yellow-400 font-bold py-2 px-4 rounded-lg transition duration-300 shadow-md"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="bg-secondary text-primary hover:bg-yellow-400 font-bold py-2 px-4 rounded-lg transition duration-300 shadow-md whitespace-nowrap"
                  >
                    Login
                  </button>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center">
              <button
                onClick={toggleMobileMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-secondary hover:bg-gray-800 focus:outline-none transition duration-150 ease-in-out"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                <svg className={`${isMobileMenuOpen ? 'hidden' : 'block'} h-8 w-8`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <svg className={`${isMobileMenuOpen ? 'block' : 'hidden'} h-8 w-8`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden transition-all duration-300 ease-in-out overflow-hidden ${isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="px-4 pt-2 pb-6 space-y-4 bg-gray-900 shadow-inner border-t border-gray-800">
            {/* Mobile Search */}
             <form onSubmit={handleSearch} className="relative group pt-2">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none top-2">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-transparent rounded-lg leading-5 bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:bg-white focus:text-gray-900 focus:placeholder-gray-500 sm:text-sm shadow-md"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>

            <nav className="flex flex-col space-y-3">
              <NavLink 
                to="/" 
                onClick={closeMobileMenu}
                className={({ isActive }) => `px-3 py-2 rounded-md text-base font-medium ${isActive ? 'bg-secondary text-primary' : 'text-white hover:bg-gray-800 hover:text-secondary'}`}
              >
                Home
              </NavLink>
              <NavLink 
                to="/services/cat-tech" 
                onClick={closeMobileMenu}
                className={({ isActive }) => `px-3 py-2 rounded-md text-base font-medium ${isActive ? 'bg-secondary text-primary' : 'text-white hover:bg-gray-800 hover:text-secondary'}`}
              >
                Tech Solutions
              </NavLink>
              {user && (
                 <NavLink 
                  to="/dashboard" 
                  onClick={closeMobileMenu}
                  className={({ isActive }) => `px-3 py-2 rounded-md text-base font-medium ${isActive ? 'bg-secondary text-primary' : 'text-white hover:bg-gray-800 hover:text-secondary'}`}
                >
                  Dashboard
                </NavLink>
              )}
            </nav>

            <div className="pt-4 border-t border-gray-800">
              {user ? (
                <div className="flex items-center justify-between px-3">
                  <span className="text-sm font-medium">Hello, {user.name}</span>
                  <button
                    onClick={() => { logout(); closeMobileMenu(); }}
                    className="bg-red-500 hover:bg-red-600 text-white text-sm font-bold py-2 px-4 rounded-lg shadow"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => { setIsAuthModalOpen(true); closeMobileMenu(); }}
                  className="w-full bg-secondary text-primary hover:bg-yellow-400 font-bold py-2 px-4 rounded-lg shadow text-center"
                >
                  Login / Register
                </button>
              )}
            </div>
          </div>
        </div>
      </header>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
};

export default Header;
