/**
 * Environment variable accessor
 * Abstracts direct import.meta.env access to allow mocking in Jest/CJS environments
 */

export const getEnv = (key: string): string | undefined => {
  return import.meta.env[key];
};

export const getMode = (): string => {
  return import.meta.env.MODE;
};

export const isDev = (): boolean => {
  return import.meta.env.DEV;
};

export const isProd = (): boolean => {
  return import.meta.env.PROD;
};
