
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import Modal from './Modal';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthMode = 'login' | 'register';

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [mode, setMode] = useState<AuthMode>('login');
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuthAction = async () => {
    setError('');
    setLoading(true);
    if (mode === 'login') {
      if (!email || !password) {
        setError('Please enter email and password.');
        setLoading(false);
        return;
      }
      
      const success = await login(email, password);
      if (success) {
        onClose();
        // Reset fields
        setEmail('');
        setPassword('');
      } else {
        setError('Invalid credentials or user not found.');
      }
    } else {
      if (!name || !email || !password) {
        setError('Please fill in all fields.');
        setLoading(false);
        return;
      }
      
      const success = await login(email, password, name);
       if (success) {
        onClose();
        setEmail('');
        setPassword('');
        setName('');
      } else {
        setError('Registration failed. Please try again.');
      }
    }
    setLoading(false);
  };
  
  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setError('');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={mode === 'login' ? 'Welcome Back!' : 'Create Account'}>
      <div className="space-y-4">
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {mode === 'register' && (
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        )}
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          onClick={handleAuthAction}
          disabled={loading}
          className={`w-full bg-primary text-white py-2 rounded-md hover:bg-primary-dark transition duration-300 font-semibold ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Processing...' : (mode === 'login' ? 'Login' : 'Register')}
        </button>
        <p className="text-center text-sm text-gray-600">
          {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
          <button onClick={toggleMode} className="text-primary font-semibold ml-1 hover:underline">
            {mode === 'login' ? 'Sign up' : 'Log in'}
          </button>
        </p>
      </div>
    </Modal>
  );
};

export default AuthModal;
