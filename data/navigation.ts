import { ChefHatIcon } from '../components/icons/ChefHatIcon';
import { ShoppingBagIcon } from '../components/icons/ShoppingBagIcon';
import { GiftIcon } from '../components/icons/GiftIcon';
import { LeafIcon } from '../components/icons/LeafIcon';
import { SunIcon } from '../components/icons/SunIcon';
import { GlobeIcon } from '../components/icons/GlobeIcon';
import { HeartIcon } from '../components/icons/HeartIcon';
import { SparklesIcon } from '../components/icons/SparklesIcon';
import { BeakerIcon } from '../components/icons/BeakerIcon';
import { StarIcon } from '../components/icons/StarIcon';
import { ShieldCheckIcon } from '../components/icons/ShieldCheckIcon';
import { CheckCircleIcon } from '../components/icons/CheckCircleIcon';

export const NAV_GROUPS = [
  {
    title: 'Shop by Intent',
    items: [
      {
        label: 'Making Dal?',
        sub: 'Turmeric, Jeera, Hing',
        icon: ChefHatIcon,
        id: 'Dal Essentials',
      },
      {
        label: 'Making Chai?',
        sub: 'Cardamom, Ginger, Clove',
        icon: SunIcon,
        id: 'Chai Essentials',
      },
      {
        label: 'Making Curry?',
        sub: 'Garam Masala, Coriander',
        icon: LeafIcon,
        id: 'Curry Essentials',
      },
      {
        label: 'Making Biryani?',
        sub: 'Whole Spices, Saffron',
        icon: StarIcon,
        id: 'Biryani Essentials',
      },
      {
        label: 'For Kids & Family',
        sub: 'Mild Spices, Immunity',
        icon: HeartIcon,
        id: 'Kids Friendly',
      },
    ],
  },
  {
    title: 'Shop by Needs',
    items: [
      { label: 'Immunity Boost', icon: ShieldCheckIcon, id: 'Immunity' },
      { label: 'Digestion Aid', icon: CheckCircleIcon, id: 'Digestion' },
      { label: 'Keto Friendly', icon: LeafIcon, id: 'Keto' },
      { label: 'Diabetic Friendly', icon: HeartIcon, id: 'Diabetic Friendly' },
    ],
  },
  {
    title: 'Shop by Category',
    items: [
      { label: 'Whole Spices', icon: GlobeIcon, id: 'Whole Spices' },
      { label: 'Spice Powders', icon: SparklesIcon, id: 'Powders' },
      { label: 'Masala Blends', icon: BeakerIcon, id: 'Masala Blends' },
      { label: 'Dry Fruits & Seeds', icon: SunIcon, id: 'Dry Fruits' },
    ],
  },
];
