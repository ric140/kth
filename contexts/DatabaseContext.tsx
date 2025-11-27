
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { initDB, seedDB } from '../utils/db';

interface DatabaseContextType {
  db: IDBDatabase | null;
  isReady: boolean;
}

const DatabaseContext = createContext<DatabaseContextType>({ db: null, isReady: false });

export const DatabaseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [db, setDb] = useState<IDBDatabase | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const setupDB = async () => {
      try {
        const database = await initDB();
        await seedDB(database);
        setDb(database);
        setIsReady(true);
      } catch (error) {
        console.error('Failed to initialize database', error);
      }
    };

    setupDB();
  }, []);

  if (!isReady) {
      return (
          <div className="flex h-screen w-full justify-center items-center">
              <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-gray-600">Initializing Database...</p>
              </div>
          </div>
      );
  }

  return (
    <DatabaseContext.Provider value={{ db, isReady }}>
      {children}
    </DatabaseContext.Provider>
  );
};

export const useDB = () => useContext(DatabaseContext);
