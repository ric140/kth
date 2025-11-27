
import React, { Suspense } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { DatabaseProvider } from './contexts/DatabaseContext';
import Header from './components/Header';
import Footer from './components/Footer';

const HomePage = React.lazy(() => import('./pages/HomePage'));
const ServiceListPage = React.lazy(() => import('./pages/ServiceListPage'));
const ServiceDetailPage = React.lazy(() => import('./pages/ServiceDetailPage'));
const DashboardPage = React.lazy(() => import('./pages/DashboardPage'));
const SearchPage = React.lazy(() => import('./pages/SearchPage'));
const NotFoundPage = React.lazy(() => import('./pages/NotFoundPage'));

// Dedicated Category Pages
const MotorbikePage = React.lazy(() => import('./pages/MotorbikePage'));
const TechPage = React.lazy(() => import('./pages/TechPage'));
const MobileAppPage = React.lazy(() => import('./pages/MobileAppPage'));
const VisaPage = React.lazy(() => import('./pages/VisaPage'));

const PageLoader: React.FC = () => (
  <div className="flex justify-center items-center p-20" aria-label="Loading page">
    <svg className="animate-spin h-10 w-10 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  </div>
);

function App() {
  return (
    <DatabaseProvider>
      <AuthProvider>
        <HashRouter>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/search" element={<SearchPage />} />
                  
                  {/* Specific Service Category Pages */}
                  <Route path="/services/cat-motorbike" element={<MotorbikePage />} />
                  <Route path="/services/cat-tech" element={<TechPage />} />
                  <Route path="/services/cat-app-design" element={<MobileAppPage />} />
                  <Route path="/services/cat-visa" element={<VisaPage />} />
                  
                  {/* Fallback/Generic Service List */}
                  <Route path="/services/:categoryId" element={<ServiceListPage />} />
                  
                  <Route path="/service/:listingId" element={<ServiceDetailPage />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </Suspense>
            </main>
            <Footer />
          </div>
        </HashRouter>
      </AuthProvider>
    </DatabaseProvider>
  );
}

export default App;
