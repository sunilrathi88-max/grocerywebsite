/**
 * Free Shipping Banner Component
 * TattvaCo - Indian Market
 * 
 * Displays promotional banner for free shipping threshold
 * Shows "Free Shipping in India over ₹999"
 */

import React from 'react';
import useSiteConfig from '../hooks/useSiteConfig';
import { formatPrice } from '../utils/formatPrice';

interface FreeShippingBannerProps {
  className?: string;
  style?: React.CSSProperties;
}

const FreeShippingBanner: React.FC<FreeShippingBannerProps> = ({
  className = '',
  style,
}) => {
  const { config, loading } = useSiteConfig();

  // Don't show banner if free shipping is disabled or still loading
  if (loading || !config.freeShippingEnabled) {
    return null;
  }

  const formattedThreshold = formatPrice(
    config.freeShippingThreshold
  );

  return (
    <div
      className={`free-shipping-banner ${className}`}
      style={{
        backgroundColor: '#2E7D32',
        color: 'white',
        padding: '8px 16px',
        textAlign: 'center',
        fontSize: '14px',
        fontWeight: '500',
        ...style,
      }}
      role="banner"
      aria-label="Free shipping promotion"
    >
      <span className="shipping-icon" style={{ marginRight: '8px' }}>
        🚚
      </span>
      <span className="shipping-text">
        Free Shipping in {config.freeShippingRegion} over {formattedThreshold}
      </span>
    </div>
  );
};

export default FreeShippingBanner;
