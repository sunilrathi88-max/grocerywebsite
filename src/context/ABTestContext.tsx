import React, { createContext, useContext, useState, ReactNode } from 'react';
import { trackEvent } from '../../utils/analytics';

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
  const [variant, setVariant] = useState<Variant>('A'); // Always start with A (matching SSR)

  React.useEffect(() => {
    // 1. Check if user already has a variant assignment
    const storedVariant = localStorage.getItem('ab_test_variant') as Variant | null;

    if (storedVariant && (storedVariant === 'A' || storedVariant === 'B')) {
      setVariant(storedVariant);
    } else {
      // 2. Assign new variant (50/50 split)
      const newVariant: Variant = Math.random() < 0.5 ? 'A' : 'B';
      localStorage.setItem('ab_test_variant', newVariant);
      setVariant(newVariant);
    }
  }, []);

  // Track experiment view on mount (simplified)
  React.useEffect(() => {
    trackEvent({
      name: 'experiment_viewed',
      data: { variant, test: 'global_ab_test' },
    });
  }, [variant]);

  const trackConversion = (eventName: string, details?: Record<string, unknown>) => {
    trackEvent({
      name: 'purchase_completed', // Mapping generic conversion to specific event for now, or make flexible
      data: {
        variant,
        conversionEvent: eventName,
        ...details,
      },
    });
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
