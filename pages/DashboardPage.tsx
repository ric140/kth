
import React, { useMemo, useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Role, InquiryBookingStatus, InquiryBooking, ServiceListing } from '../types';
import { Link } from 'react-router-dom';
import { useDB } from '../contexts/DatabaseContext';
import { getAll, STORES, exportData, importData } from '../utils/db';
import CreateListingModal from '../components/CreateListingModal';

const getStatusChipClass = (status: InquiryBookingStatus) => {
  switch (status) {
    case InquiryBookingStatus.PENDING:
      return 'bg-yellow-200 text-yellow-800';
    case InquiryBookingStatus.APPROVED:
      return 'bg-green-200 text-green-800';
    case InquiryBookingStatus.REJECTED:
      return 'bg-red-200 text-red-800';
    case InquiryBookingStatus.COMPLETED:
      return 'bg-blue-200 text-blue-800';
    default:
      return 'bg-gray-200 text-gray-800';
  }
};

const CustomerDashboard: React.FC<{ userId: string }> = ({ userId }) => {
  const { db } = useDB();
  const [inquiries, setInquiries] = useState<InquiryBooking[]>([]);
  const [listings, setListings] = useState<ServiceListing[]>([]);

  useEffect(() => {
    if (db) {
        getAll<InquiryBooking>(db, STORES.INQUIRIES).then(allInq => {
            setInquiries(allInq.filter(i => i.customerId === userId));
        });
        getAll<ServiceListing>(db, STORES.LISTINGS).then(setListings);
    }
  }, [db, userId]);

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">My Inquiries & Bookings</h2>
      {inquiries.length > 0 ? (
        <div className="space-y-4">
          {inquiries.map(inquiry => {
             const listing = listings.find(l => l.id === inquiry.serviceListingId);
             return (
                <div key={inquiry.id} className="bg-white p-4 rounded-lg shadow-sm border flex items-center justify-between">
                    <div>
                        <Link to={`/service/${listing?.id}`} className="font-semibold text-primary hover:underline">{listing?.title || 'Unknown Service'}</Link>
                        <p className="text-sm text-gray-500">Date: {inquiry.createdAt.toLocaleDateString()}</p>
                    </div>
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusChipClass(inquiry.status)}`}>
                        {inquiry.status}
                    </span>
                </div>
             )
          })}
        </div>
      ) : (
        <p>You have not made any inquiries yet.</p>
      )}
    </div>
  );
};

const PartnerDashboard: React.FC<{ userId: string }> = ({ userId }) => {
  const { db } = useDB();
  const [listings, setListings] = useState<ServiceListing[]>([]);
  const [inquiries, setInquiries] = useState<InquiryBooking[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const fetchData = () => {
      if (db) {
        getAll<ServiceListing>(db, STORES.LISTINGS).then(all => {
             const myUserListings = all.filter(l => l.partnerId === userId);
             setListings(myUserListings);
             
             getAll<InquiryBooking>(db, STORES.INQUIRIES).then(allInq => {
                 const myListingIds = myUserListings.map(l => l.id);
                 setInquiries(allInq.filter(i => myListingIds.includes(i.serviceListingId)));
             });
        });
      }
  };

  useEffect(() => {
      fetchData();
  }, [db, userId]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div>
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">My Service Listings</h2>
            <button 
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-primary text-white px-4 py-2 rounded shadow hover:bg-primary-dark transition"
            >
                + Create Listing
            </button>
        </div>
        
        {listings.length > 0 ? (
          <div className="space-y-4">
            {listings.map(listing => (
              <div key={listing.id} className="bg-white p-4 rounded-lg shadow-sm border flex items-center justify-between">
                 <Link to={`/service/${listing.id}`} className="font-semibold text-primary hover:underline">{listing.title}</Link>
                 <button className="text-sm bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-1 px-3 rounded">Manage</button>
              </div>
            ))}
          </div>
        ) : <p>You have no service listings.</p>}
      </div>
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Incoming Inquiries</h2>
        {inquiries.length > 0 ? (
          <div className="space-y-4">
            {inquiries.map(inquiry => {
              const listing = listings.find(l => l.id === inquiry.serviceListingId);
              return (
                 <div key={inquiry.id} className="bg-white p-4 rounded-lg shadow-sm border">
                    <div className="flex justify-between items-start">
                        <Link to={`/service/${listing?.id}`} className="font-semibold text-primary hover:underline">{listing?.title || 'Unknown Service'}</Link>
                         <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusChipClass(inquiry.status)}`}>
                            {inquiry.status}
                        </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">{inquiry.messageFromCustomer}</p>
                 </div>
              )
            })}
          </div>
        ) : <p>You have no incoming inquiries.</p>}
      </div>
      
      <CreateListingModal 
        isOpen={isCreateModalOpen} 
        onClose={() => { setIsCreateModalOpen(false); fetchData(); }} 
      />
    </div>
  );
};

const DataManagement: React.FC = () => {
    const { db } = useDB();
    const [importStatus, setImportStatus] = useState('');
    
    const handleExport = async () => {
        if (!db) return;
        const json = await exportData(db);
        const blob = new Blob([json], {type: "application/json"});
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `kth_backup_${new Date().toISOString()}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!db || !e.target.files || !e.target.files[0]) return;
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                if (event.target?.result) {
                    await importData(db, event.target.result as string);
                    setImportStatus('Data imported successfully! Reloading...');
                    setTimeout(() => window.location.reload(), 1500);
                }
            } catch (err) {
                setImportStatus('Error importing data.');
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm mt-8 border-t-4 border-secondary">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Data Management</h2>
            <div className="flex flex-col sm:flex-row gap-4 items-center">
                <button onClick={handleExport} className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition w-full sm:w-auto">
                    Export Data (JSON)
                </button>
                <div className="relative overflow-hidden inline-block w-full sm:w-auto">
                     <button className="bg-accent text-white px-4 py-2 rounded hover:bg-green-600 transition w-full">Import Data (JSON)</button>
                     <input type="file" accept=".json" onChange={handleImport} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
                {importStatus && <span className="text-sm font-semibold text-primary">{importStatus}</span>}
            </div>
            <p className="text-sm text-gray-500 mt-2">Use this to backup your data or migrate to another browser.</p>
        </div>
    )
}

const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p className="mt-2">Please log in to view your dashboard.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
       <div className="bg-white p-6 rounded-lg shadow-sm">
        <h1 className="text-3xl font-bold text-primary">Welcome to your Dashboard, {user.name}</h1>
        <p className="text-gray-600 mt-2">Here you can manage your services and inquiries.</p>
      </div>

      {user.role === Role.CUSTOMER && <CustomerDashboard userId={user.id} />}
      {user.role === Role.PARTNER && <PartnerDashboard userId={user.id} />}
      
      <DataManagement />
    </div>
  );
};

export default DashboardPage;
