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

import { useState, useEffect } from 'react';
import { supabase } from '../utils/api';

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
  const [config, setConfig] = useState<SiteConfig>(defaultConfig);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchConfig() {
      try {
        setLoading(true);
        const { data, error: fetchError } = await supabase
          .from('site_config')
          .select('key, value')
          .in('key', [
            'currency',
            'currency_symbol',
            'free_shipping_threshold',
            'free_shipping_enabled',
            'free_shipping_region',
          ]);

        if (fetchError) throw fetchError;

        if (data && data.length > 0) {
          const configMap: Partial<SiteConfig> = {};
          
          data.forEach((item) => {
            switch (item.key) {
              case 'currency':
                configMap.currency = item.value;
                break;
              case 'currency_symbol':
                configMap.currencySymbol = item.value;
                break;
              case 'free_shipping_threshold':
                configMap.freeShippingThreshold = parseFloat(item.value);
                break;
              case 'free_shipping_enabled':
                configMap.freeShippingEnabled = item.value === 'true';
                break;
              case 'free_shipping_region':
                configMap.freeShippingRegion = item.value;
                break;
            }
          });

          setConfig({ ...defaultConfig, ...configMap });
        }
      } catch (err) {
        console.error('Error fetching site config:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        // Keep using default config on error
      } finally {
        setLoading(false);
      }
    }

    fetchConfig();
  }, []);

  return { config, loading, error };
}

export default useSiteConfig;
