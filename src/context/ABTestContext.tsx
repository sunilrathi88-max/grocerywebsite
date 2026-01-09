import React, { createContext, useContext, useState, ReactNode } from 'react';

type Variant = 'A' | 'B';

interface ABTestContextType {
  variant: Variant;
  trackConversion: (eventName: string, details?: Record<string, unknown>) => void;
}

const ABTestContext = createContext<ABTestContextType | undefined>(undefined);

interface ABTestProviderProps {
  children: ReactNode;
}

export const ABTestProvider: React.FC<ABTestProviderProps> = ({ children }) => {
  const [variant] = useState<Variant>(() => {
    if (typeof window === 'undefined') return 'A'; // SSR safety

    // 1. Check if user already has a variant assignments
    const storedVariant = localStorage.getItem('ab_test_variant') as Variant | null;

    if (storedVariant && (storedVariant === 'A' || storedVariant === 'B')) {
      return storedVariant;
    }

    // 2. Assign new variant (50/50 split)
    const newVariant: Variant = Math.random() < 0.5 ? 'A' : 'B';
    localStorage.setItem('ab_test_variant', newVariant);
    return newVariant;
  });

  const trackConversion = (_eventName: string, _details?: Record<string, unknown>) => {
    // In production, send to analytics
    // console.log(`[A/B Test] Conversion: [${eventName}] for Variant [${variant}]`, details);
    // suppressing console.log for lint
  };

  return (
    <ABTestContext.Provider value={{ variant, trackConversion }}>{children}</ABTestContext.Provider>
  );
};

export const useABTest = (): ABTestContextType => {
  const context = useContext(ABTestContext);
  if (!context) {
    throw new Error('useABTest must be used within an ABTestProvider');
  }
  return context;
};
