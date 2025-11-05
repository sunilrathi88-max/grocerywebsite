/* eslint-disable no-undef */
// Mock for framer-motion to avoid warnings in Jest tests
// This resolves: "React does not recognize the `whileTap` prop on a DOM element"

import React from 'react';

// Mock motion components as regular HTML elements
export const motion = {
  div: 'div' as any,
  button: 'button' as any,
  span: 'span' as any,
  a: 'a' as any,
  section: 'section' as any,
  article: 'article' as any,
  aside: 'aside' as any,
  footer: 'footer' as any,
  header: 'header' as any,
  main: 'main' as any,
  nav: 'nav' as any,
  ul: 'ul' as any,
  li: 'li' as any,
  p: 'p' as any,
  h1: 'h1' as any,
  h2: 'h2' as any,
  h3: 'h3' as any,
  h4: 'h4' as any,
  h5: 'h5' as any,
  h6: 'h6' as any,
  img: 'img' as any,
  form: 'form' as any,
  input: 'input' as any,
  textarea: 'textarea' as any,
  select: 'select' as any,
  label: 'label' as any,
};

// Mock AnimatePresence component
export const AnimatePresence: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => (
  <>{children}</>
);

// Mock useAnimation hook
export const useAnimation = () => ({
  start: jest.fn(),
  stop: jest.fn(),
  set: jest.fn(),
});

// Mock useMotionValue hook
export const useMotionValue = (initial: any) => ({
  get: () => initial,
  set: jest.fn(),
  onChange: jest.fn(),
});

// Mock useTransform hook
export const useTransform = () => ({
  get: jest.fn(),
  set: jest.fn(),
  onChange: jest.fn(),
});

export default motion;
