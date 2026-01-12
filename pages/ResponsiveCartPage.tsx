import React from 'react';
import { useIsMobile } from '../hooks/useIsMobile';

import CartPage from './CartPage';
import MobileCartPage from './MobileCartPage';

const ResponsiveCartPage: React.FC = () => {
  const isMobile = useIsMobile(1024);

  return isMobile ? <MobileCartPage /> : <CartPage />;
};

export default ResponsiveCartPage;
