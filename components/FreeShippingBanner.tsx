import React from 'react';
import { useSiteConfig } from '../hooks/useSiteConfig';
import { formatPrice } from '../utils/formatPrice';

const FreeShippingBanner: React.FC = () => {
  const { config } = useSiteConfig();

  if (!config.freeShippingEnabled) {
    return null;
  }

  const formattedThreshold = formatPrice(config.freeShippingThreshold);

  return (
    <div>
      Free Shipping in {config.freeShippingRegion} over {formattedThreshold}
    </div>
  );
};

export default FreeShippingBanner;
