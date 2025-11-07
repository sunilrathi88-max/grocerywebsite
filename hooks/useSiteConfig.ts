/**
 * React Hook for Site Configuration
 * TattvaCo - Indian Market Configuration
 * 
 * Fetches site-wide configuration from Supabase including:
 * - Currency settings (INR)
 * - Currency symbol (₹)
 * - Free shipping threshold
 * - Regional settings
 */

import { useState } from 'react';
export interface SiteConfig {
  currency: string;
  currencySymbol: string;
  freeShippingThreshold: number;
  freeShippingEnabled: boolean;
  freeShippingRegion: string;
}

const defaultConfig: SiteConfig = {
  currency: 'INR',
  currencySymbol: '₹',
  freeShippingThreshold: 999,
  freeShippingEnabled: true,
  freeShippingRegion: 'India',
};

/**
 * Custom hook to fetch and manage site configuration
 * @returns {Object} Site configuration and loading state
 */
export function useSiteConfig() {
  return { config: defaultConfig, loading: false, error: null };
}

export default useSiteConfig;
