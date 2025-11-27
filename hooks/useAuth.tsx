
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, Role } from '../types';
import { useDB } from '../contexts/DatabaseContext';
import { getAll, getById, addItem, STORES } from '../utils/db';

interface AuthContextType {
  user: User | null;
  login: (email: string, pass: string, name?: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { db } = useDB();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for persisted session
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

  const logout = () => {
    setUser(null);
    localStorage.removeItem('kth_user_id');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
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
