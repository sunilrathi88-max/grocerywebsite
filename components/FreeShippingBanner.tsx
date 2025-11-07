import React from 'react';
import { useSiteConfig } from '../hooks/useSiteConfig';
import { formatPrice } from '../utils/formatPrice';

interface FreeShippingBannerProps {
  className?: string;
  style?: React.CSSProperties;
}

const FreeShippingBanner: React.FC<FreeShippingBannerProps> = ({
  className = '',
  style,
}) => {
  const { config } = useSiteConfig();

  if (!config.freeShippingEnabled) {
    return null;
  }

  const formattedThreshold = formatPrice(config.freeShippingThreshold);

  return (
    <div className={`free-shipping-banner ${className}`} style={style}>
      Free Shipping in {config.freeShippingRegion} over {formattedThreshold}
    </div>
  );
};

export default FreeShippingBanner;
