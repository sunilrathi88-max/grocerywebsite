import React, { useState } from 'react';
import { XIcon } from './icons/XIcon';
import { UserIcon } from './icons/UserIcon';
import { User } from '../types';
import OAuthButtons from './OAuthButtons';

interface AuthModalProps {
  onClose: () => void;
  onLogin: (user: User) => void;
  onSignUp: (name: string, email: string, password: string) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose, onLogin, onSignUp }) => {
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const handleSimulatedAuth = (e: React.FormEvent) => {
    // Deprecated in favor of subcomponents
  };
  /* eslint-enable @typescript-eslint/no-unused-vars */

  const LoginForm = ({
    onLogin,
    onClose,
  }: {
    onLogin: (user: User) => void;
    onClose: () => void;
  }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      // Simulate login or call API
      const mockUser: User = {
        id: Date.now().toString(),
        name: email.split('@')[0],
        email: email,
        isAdmin: false,
        addresses: [],
        wishlist: [],
        orders: [],
      };
      onLogin(mockUser);
      onClose();
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email-login" className="block text-sm font-medium text-gray-700">
            Email Address
          </label>
          <input
            type="email"
            id="email-login"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 input-field"
            required
          />
        </div>
        <div>
          <label htmlFor="password-login" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            id="password-login"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 input-field"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-brand-dark text-white font-bold py-3 rounded-full shadow-lg hover:bg-opacity-90 transition-all duration-300"
        >
          Login
        </button>
      </form>
    );
  };

  const RegisterForm = ({
    onSignUp,
    onClose,
  }: {
    onSignUp: (name: string, email: string, password: string) => void;
    onClose: () => void;
  }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSignUp(name, email, password);
      onClose();
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name-register" className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            type="text"
            id="name-register"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 input-field"
            required
          />
        </div>
        <div>
          <label htmlFor="email-register" className="block text-sm font-medium text-gray-700">
            Email Address
          </label>
          <input
            type="email"
            id="email-register"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 input-field"
            required
          />
        </div>
        <div>
          <label htmlFor="password-register" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            id="password-register"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 input-field"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-brand-dark text-white font-bold py-3 rounded-full shadow-lg hover:bg-opacity-90 transition-all duration-300"
        >
          Create Account
        </button>
      </form>
    );
  };

  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 z-[100] flex justify-center items-center p-4 animate-fade-in"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="bg-white rounded-lg shadow-2xl w-full max-w-sm flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <div className="flex items-center gap-3">
            <UserIcon className="h-8 w-8 text-brand-primary" />
            <h2 className="text-xl font-serif font-bold">My Account</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200"
            aria-label="Close"
          >
            <XIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="border-b border-gray-200">
          <nav className="-mb-px flex" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('login')}
              className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm ${activeTab === 'login' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              Login
            </button>
            <button
              onClick={() => setActiveTab('register')}
              className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm ${activeTab === 'register' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              Register
            </button>
          </nav>
        </div>

        <div className="p-6">
          <OAuthButtons
            onSuccess={(_user) => {
              // Note: This might not run due to redirect, but required for type check
              // If we were handling popup flow, we would call onLogin here.
              // For now, we rely on the Supabase auth listener in App.tsx
            }}
            onError={(error) => console.error(error)}
          />

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          {activeTab === 'login' ? (
            <LoginForm onLogin={onLogin} onClose={onClose} />
          ) : (
            <RegisterForm onSignUp={onSignUp} onClose={onClose} />
          )}
        </div>
      </div>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in { animation: fade-in 0.2s ease-out forwards; }
        .input-field {
          display: block; width: 100%; padding: 0.5rem 0.75rem; border: 1px solid #D1D5DB; border-radius: 0.375rem;
        }
        .input-field:focus {
          outline: none; --tw-ring-color: #FFB7C1; box-shadow: 0 0 0 2px var(--tw-ring-color); border-color: #FFB7C1;
        }
      `}</style>
    </div>
  );
};

export default AuthModal;
