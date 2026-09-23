import { MOCK_USERS, MOCK_SERVICE_LISTINGS, MOCK_INQUIRIES } from '../data/mockData';

const DB_NAME = 'KampotTechHubDB';
const DB_VERSION = 8;

export const STORES = {
  USERS: 'users',
  LISTINGS: 'listings',
  INQUIRIES: 'inquiries',
};

export const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => {
      console.error('IndexedDB error:', request.error);
      reject(request.error);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Force clear stores on version upgrade to re-seed mock data with rich locations and multi-photo galleries
      if (event.oldVersion < 8) {
         if (db.objectStoreNames.contains(STORES.USERS)) db.deleteObjectStore(STORES.USERS);
         if (db.objectStoreNames.contains(STORES.LISTINGS)) db.deleteObjectStore(STORES.LISTINGS);
         if (db.objectStoreNames.contains(STORES.INQUIRIES)) db.deleteObjectStore(STORES.INQUIRIES);
      }

      if (!db.objectStoreNames.contains(STORES.USERS)) {
        db.createObjectStore(STORES.USERS, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORES.LISTINGS)) {
        const listingStore = db.createObjectStore(STORES.LISTINGS, { keyPath: 'id' });
        listingStore.createIndex('categoryId', 'categoryId', { unique: false });
        listingStore.createIndex('partnerId', 'partnerId', { unique: false });
      }
      if (!db.objectStoreNames.contains(STORES.INQUIRIES)) {
        const inquiryStore = db.createObjectStore(STORES.INQUIRIES, { keyPath: 'id' });
        inquiryStore.createIndex('customerId', 'customerId', { unique: false });
        inquiryStore.createIndex('partnerId', 'partnerId', { unique: false });
      }
    };

    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      resolve(db);
    };
  });
};

const getCount = (db: IDBDatabase, storeName: string): Promise<number> => {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    const request = store.count();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const seedDB = async (db: IDBDatabase) => {
  const usersCount = await getCount(db, STORES.USERS);
  if (usersCount === 0) {
    const tx = db.transaction([STORES.USERS, STORES.LISTINGS, STORES.INQUIRIES], 'readwrite');
    
    MOCK_USERS.forEach(user => tx.objectStore(STORES.USERS).add(user));
    MOCK_SERVICE_LISTINGS.forEach(listing => tx.objectStore(STORES.LISTINGS).add(listing));
    MOCK_INQUIRIES.forEach(inquiry => tx.objectStore(STORES.INQUIRIES).add(inquiry));
    
    return new Promise<void>((resolve) => {
      tx.oncomplete = () => {
        console.log('Database seeded with mock data');
        resolve();
      };
    });
  }
};

// Generic CRUD
export const getAll = <T>(db: IDBDatabase, storeName: string): Promise<T[]> => {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const getById = <T>(db: IDBDatabase, storeName: string, id: string): Promise<T | undefined> => {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    const request = store.get(id);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const addItem = <T>(db: IDBDatabase, storeName: string, item: T): Promise<void> => {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    const request = store.put(item); // Using put to support upserts
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

export const exportData = async (db: IDBDatabase): Promise<string> => {
  const exportObj: Record<string, any[]> = {};
  const objectStoreNames = Array.from(db.objectStoreNames);
  
  for (const storeName of objectStoreNames) {
      exportObj[storeName] = await getAll(db, storeName);
  }
  
  return JSON.stringify(exportObj, null, 2);
};

export const importData = async (db: IDBDatabase, jsonString: string): Promise<void> => {
  const data = JSON.parse(jsonString);
  const objectStoreNames = Array.from(db.objectStoreNames);
  
  const tx = db.transaction(objectStoreNames, 'readwrite');
  
  for (const storeName of objectStoreNames) {
      if (data[storeName] && Array.isArray(data[storeName])) {
           const store = tx.objectStore(storeName);
           store.clear(); // Clear existing data for clean import
           data[storeName].forEach((item: any) => {
               store.put(item);
           });
      }
  }
  
  return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onabort = () => reject(tx.error);
      tx.onerror = () => reject(tx.error);
  });
};