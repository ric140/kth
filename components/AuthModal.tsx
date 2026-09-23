
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
  const { login, loginWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setError('');
    setGoogleLoading(true);
    try {
      const success = await loginWithGoogle();
      if (success) {
        onClose();
      } else {
        setError('Google sign-in was not completed or was cancelled.');
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to authenticate with Google');
    } finally {
      setGoogleLoading(false);
    }
  };

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
          disabled={loading || googleLoading}
          className={`w-full bg-primary text-white py-2 rounded-md hover:bg-primary-dark transition duration-300 font-semibold ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Processing...' : (mode === 'login' ? 'Login' : 'Register')}
        </button>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-500 font-medium">Or continue with</span>
          </div>
        </div>

        {/* Google & Gmail Sign-In Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={googleLoading || loading}
          className="w-full flex items-center justify-center gap-3 py-2.5 px-4 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50 text-gray-700 font-medium text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary cursor-pointer disabled:opacity-60"
        >
          {googleLoading ? (
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <svg className="w-5 h-5" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
              <path fill="none" d="M0 0h48v48H0z"></path>
            </svg>
          )}
          <span>Sign in with Google</span>
        </button>

        <p className="text-[11px] text-gray-500 text-center leading-normal">
          Connecting with Google allows you to send direct inquiries and quote requests to service providers via Gmail with your permission.
        </p>

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
