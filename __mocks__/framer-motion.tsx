/* eslint-disable no-undef */
// Mock for framer-motion to avoid warnings in Jest tests
// This resolves: "React does not recognize the `whileTap` prop on a DOM element"

import React from 'react';

const motionProps = [
  'initial',
  'animate',
  'exit',
  'transition',
  'variants',
  'whileHover',
  'whileTap',
  'whileFocus',
  'whileDrag',
  'layout',
  'layoutId',
  'onAnimationStart',
  'onAnimationComplete',
  'onLayoutAnimationStart',
  'onLayoutAnimationComplete',
  'drag',
  'dragConstraints',
  'dragElastic',
  'dragMomentum',
  'dragPropagation',
  'dragTransition',
  'onDrag',
  'onDragStart',
  'onDragEnd',
  'onMeasureDragConstraints',
  'viewport',
  'onViewportEnter',
  'onViewportLeave',
];

const createMockComponent = (Tag: string) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Component = React.forwardRef((props: any, ref) => {
    const validProps = { ...props };
    motionProps.forEach((prop) => delete validProps[prop]);
    return <Tag ref={ref} {...validProps} />;
  });
  Component.displayName = `Motion${Tag.charAt(0).toUpperCase() + Tag.slice(1)}`;
  return Component;
};

// Mock motion components
export const motion = {
  div: createMockComponent('div'),
  button: createMockComponent('button'),
  span: createMockComponent('span'),
  a: createMockComponent('a'),
  section: createMockComponent('section'),
  article: createMockComponent('article'),
  aside: createMockComponent('aside'),
  footer: createMockComponent('footer'),
  header: createMockComponent('header'),
  main: createMockComponent('main'),
  nav: createMockComponent('nav'),
  ul: createMockComponent('ul'),
  li: createMockComponent('li'),
  p: createMockComponent('p'),
  h1: createMockComponent('h1'),
  h2: createMockComponent('h2'),
  h3: createMockComponent('h3'),
  h4: createMockComponent('h4'),
  h5: createMockComponent('h5'),
  h6: createMockComponent('h6'),
  img: createMockComponent('img'),
  form: createMockComponent('form'),
  input: createMockComponent('input'),
  textarea: createMockComponent('textarea'),
  select: createMockComponent('select'),
  label: createMockComponent('label'),
};

// Mock AnimatePresence component
export const AnimatePresence: React.FC<{
  children?: React.ReactNode;
}> = ({ children }) => <>{children}</>;
// Mock useAnimation hook
export const useAnimation = () => ({
  start: jest.fn(),
  stop: jest.fn(),
  set: jest.fn(),
});

// Mock useMotionValue hook
// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
