import { User } from '../types';

export const MOCK_USER: User = {
  id: '1',
  name: 'Anika Sharma',
  email: 'anika.sharma@example.com',
  isAdmin: true,
  addresses: [
    {
      id: '1',
      type: 'Shipping',
      street: '42, Lotus Boulevard',
      city: 'Mumbai',
      state: 'MH',
      zip: '400001',
      country: 'India',
      isDefault: true,
    },
    {
      id: '2',
      type: 'Billing',
      street: '15, Park Avenue',
      city: 'Delhi',
      state: 'DL',
      zip: '110001',
      country: 'India',
    },
  ],
};
