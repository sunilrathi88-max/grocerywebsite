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

export function useSiteConfig() {
  return { config: defaultConfig, loading: false, error: null };
}

export default useSiteConfig;
