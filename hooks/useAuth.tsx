
import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { User, Role } from '../types';
import { useDB } from '../contexts/DatabaseContext';
import { getAll, getById, addItem, STORES } from '../utils/db';
import { 
  connectGoogleGmail, 
  disconnectGmail, 
  subscribeToTokenChanges, 
  getCachedAccessToken, 
  sendGmail,
  auth as firebaseAuth,
  SendEmailPayload
} from '../services/gmailService';

interface AuthContextType {
  user: User | null;
  login: (email: string, pass: string, name?: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  isGmailConnected: boolean;
  gmailUserEmail: string | null;
  connectGmailAccount: () => Promise<boolean>;
  sendGmailInquiry: (payload: SendEmailPayload) => Promise<{ success: boolean; id?: string; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { db } = useDB();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasGmailToken, setHasGmailToken] = useState<boolean>(!!getCachedAccessToken());
  const [gmailUserEmail, setGmailUserEmail] = useState<string | null>(null);

  // Subscribe to in-memory Gmail access token changes
  useEffect(() => {
    const unsubscribe = subscribeToTokenChanges((token) => {
      setHasGmailToken(!!token);
      if (token && firebaseAuth.currentUser?.email) {
        setGmailUserEmail(firebaseAuth.currentUser.email);
      } else if (!token) {
        setGmailUserEmail(null);
      }
    });
    return unsubscribe;
  }, []);

  // Check for persisted session in DB
  useEffect(() => {
    const checkSession = async () => {
      const storedUserId = localStorage.getItem('kth_user_id');
      if (storedUserId && db) {
        try {
          const foundUser = await getById<User>(db, STORES.USERS, storedUserId);
          if (foundUser) {
            setUser(foundUser);
          } else {
             localStorage.removeItem('kth_user_id');
          }
        } catch (e) {
          console.error("Session check failed", e);
        }
      }
      setIsLoading(false);
    };
    
    if (db) {
        checkSession();
    }
  }, [db]);

  const login = async (email: string, pass: string, name?: string): Promise<boolean> => {
    if (!db) return false;

    try {
        const users = await getAll<User>(db, STORES.USERS);
        const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
        
        if (foundUser) {
          setUser(foundUser);
          localStorage.setItem('kth_user_id', foundUser.id);
          return true;
        }
        
        // Registration
        if (name) {
            const newUser: User = { id: `user-${Date.now()}`, name, email, role: Role.CUSTOMER };
            await addItem(db, STORES.USERS, newUser);
            setUser(newUser);
            localStorage.setItem('kth_user_id', newUser.id);
            return true;
        }
    } catch (e) {
        console.error("Auth error", e);
    }
    
    return false;
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    try {
      const { user: gUser } = await connectGoogleGmail();
      if (!gUser || !gUser.email) return false;

      setGmailUserEmail(gUser.email);

      if (db) {
        const users = await getAll<User>(db, STORES.USERS);
        let foundUser = users.find(u => u.email.toLowerCase() === gUser.email!.toLowerCase());
        
        if (!foundUser) {
          foundUser = {
            id: `google-${gUser.uid}`,
            name: gUser.displayName || gUser.email.split('@')[0],
            email: gUser.email,
            role: Role.CUSTOMER
          };
          await addItem(db, STORES.USERS, foundUser);
        }

        setUser(foundUser);
        localStorage.setItem('kth_user_id', foundUser.id);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Google sign-in error:", error);
      return false;
    }
  };

  const connectGmailAccount = async (): Promise<boolean> => {
    try {
      const { user: gUser } = await connectGoogleGmail();
      if (gUser && gUser.email) {
        setGmailUserEmail(gUser.email);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Failed to connect Gmail:", err);
      return false;
    }
  };

  const sendGmailInquiry = useCallback(async (payload: SendEmailPayload) => {
    return await sendGmail(payload);
  }, []);

  const logout = () => {
    setUser(null);
    localStorage.removeItem('kth_user_id');
    disconnectGmail().catch(console.error);
    setGmailUserEmail(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      loginWithGoogle,
      logout, 
      isLoading,
      isGmailConnected: hasGmailToken,
      gmailUserEmail,
      connectGmailAccount,
      sendGmailInquiry
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
