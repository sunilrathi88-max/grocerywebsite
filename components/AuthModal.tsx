import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { User as UserType } from '../types';
import OAuthButtons from './OAuthButtons';
import { AuthService } from '../utils/authService';

interface AuthModalProps {
  onClose: () => void;
  onLogin: (user: UserType) => void;
  onSignUp: (name: string, email: string, password: string) => void;
}

const InputField = ({
  id,
  type,
  label,
  value,
  onChange,
  icon: Icon,
  showToggle = false,
}: {
  id: string;
  type: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  icon: React.FC<{ size?: number; className?: string }>;
  showToggle?: boolean;
}) => {
  const [visible, setVisible] = useState(false);
  const [focused, setFocused] = useState(false);
  const inputType = showToggle && visible ? 'text' : type;

  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="text-[11px] font-black uppercase tracking-widest text-stone-500 block"
      >
        {label}
      </label>
      <div
        className="relative h-12 rounded-xl overflow-hidden transition-all"
        style={{
          border: `1px solid ${focused ? 'rgba(179,139,89,0.5)' : 'rgba(255,255,255,0.08)'}`,
          background: 'rgba(255,255,255,0.04)',
          boxShadow: focused ? '0 0 0 3px rgba(179,139,89,0.1)' : 'none',
        }}
      >
        <Icon
          size={15}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-600 pointer-events-none"
        />
        <input
          id={id}
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          required
          className="w-full h-full bg-transparent pl-10 pr-10 text-sm text-white placeholder-stone-600 outline-none"
          placeholder={`Enter ${label.toLowerCase()}`}
        />
        {showToggle && (
          <button
            type="button"
            onClick={() => setVisible(!visible)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300 transition-colors"
          >
            {visible ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        )}
      </div>
    </div>
  );
};

const LoginForm = ({ onClose }: { onClose: () => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const response = await AuthService.login(email, password, false);
      if (response.success) {
        onClose();
      } else {
        setError(response.message || 'Invalid credentials. Please try again.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 bg-red-950/40 border border-red-800/40 text-red-300 text-sm rounded-xl px-4 py-3"
        >
          <AlertCircle size={14} className="shrink-0" />
          {error}
        </motion.div>
      )}
      <InputField
        id="email-login"
        type="email"
        label="Email"
        value={email}
        onChange={setEmail}
        icon={Mail}
      />
      <InputField
        id="password-login"
        type="password"
        label="Password"
        value={password}
        onChange={setPassword}
        icon={Lock}
        showToggle
      />
      <div className="text-right">
        <a
          href="/forgot-password"
          className="text-[11px] text-[#B38B59] font-bold hover:text-[#D4A96A] transition-colors uppercase tracking-widest"
        >
          Forgot Password?
        </a>
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3.5 rounded-2xl font-black text-sm uppercase tracking-widest text-white transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
        style={{
          background: 'linear-gradient(135deg,#B38B59,#8C6D45)',
          boxShadow: '0 8px 30px rgba(179,139,89,0.3)',
          opacity: isLoading ? 0.75 : 1,
        }}
      >
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          'Sign In'
        )}
      </button>
    </form>
  );
};

const RegisterForm = ({ onClose }: { onClose: () => void }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const response = await AuthService.signUp(name, email, password);
      if (response.success) {
        onClose();
      } else {
        setError(response.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 bg-red-950/40 border border-red-800/40 text-red-300 text-sm rounded-xl px-4 py-3"
        >
          <AlertCircle size={14} className="shrink-0" />
          {error}
        </motion.div>
      )}
      <InputField
        id="name-register"
        type="text"
        label="Full Name"
        value={name}
        onChange={setName}
        icon={User}
      />
      <InputField
        id="email-register"
        type="email"
        label="Email"
        value={email}
        onChange={setEmail}
        icon={Mail}
      />
      <InputField
        id="password-register"
        type="password"
        label="Password"
        value={password}
        onChange={setPassword}
        icon={Lock}
        showToggle
      />
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3.5 rounded-2xl font-black text-sm uppercase tracking-widest text-white transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
        style={{
          background: 'linear-gradient(135deg,#B38B59,#8C6D45)',
          boxShadow: '0 8px 30px rgba(179,139,89,0.3)',
          opacity: isLoading ? 0.75 : 1,
        }}
      >
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          'Create Account'
        )}
      </button>
    </form>
  );
};

const AuthModal: React.FC<AuthModalProps> = ({
  onClose,
  onLogin: _onLogin,
  onSignUp: _onSignUp,
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(10px)' }}
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-[2rem] overflow-hidden"
        style={{
          background: '#0F0704',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 40px 100px rgba(0,0,0,0.7), 0 0 0 1px rgba(179,139,89,0.08)',
        }}
      >
        {/* Header */}
        <div className="relative px-8 pt-8 pb-6">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-56 h-24 bg-[#B38B59]/10 rounded-full blur-[60px] pointer-events-none" />
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-stone-400 hover:text-white hover:bg-white/10 transition-all"
          >
            <X size={14} />
          </button>
          <div className="text-center relative z-10">
            <div
              className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg,#B38B59,#8C6D45)',
                boxShadow: '0 8px 30px rgba(179,139,89,0.35)',
              }}
            >
              <User size={24} className="text-white" />
            </div>
            <h2 className="font-display text-2xl font-black text-white">
              {activeTab === 'login' ? 'Welcome Back' : 'Join Rathi'}
            </h2>
            <p className="text-stone-500 text-sm mt-1">
              {activeTab === 'login' ? 'Sign in to your account' : 'Create your account today'}
            </p>
          </div>
        </div>

        {/* Tab switcher */}
        <div
          className="flex mx-8 mb-6 gap-1 p-1 rounded-xl"
          style={{ background: 'rgba(255,255,255,0.04)' }}
        >
          {(['login', 'register'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="flex-1 py-2.5 rounded-lg text-[11px] font-black uppercase tracking-widest transition-colors relative"
              style={{ color: activeTab === tab ? '#42210B' : 'rgba(255,255,255,0.35)' }}
            >
              {activeTab === tab && (
                <motion.div
                  layoutId="authTabBg"
                  className="absolute inset-0 rounded-lg"
                  style={{ background: 'linear-gradient(135deg,#B38B59,#8C6D45)' }}
                  transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                />
              )}
              <span className="relative z-10">{tab === 'login' ? 'Sign In' : 'Register'}</span>
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="px-8 pb-8 space-y-6">
          {/* OAuth */}
          <OAuthButtons onSuccess={() => onClose()} onError={(err) => console.error(err)} />

          {/* Divider */}
          <div className="relative flex items-center gap-3">
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
            <span className="text-[10px] font-bold uppercase tracking-widest text-stone-600">
              Or continue with email
            </span>
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
          </div>

          {/* Form */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: activeTab === 'login' ? -16 : 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: activeTab === 'login' ? 16 : -16 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'login' ? (
                <LoginForm onClose={onClose} />
              ) : (
                <RegisterForm onClose={onClose} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AuthModal;
