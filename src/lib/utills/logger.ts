const IS_PRODUCTION = process.env.NODE_ENV === 'production';

export const logger = {
  log: (...args: any[]) => {
    if (!IS_PRODUCTION) console.log(...args);
  },
  error: (...args: any[]) => {
    console.error(...args); // Error tetap log di production
  },
  warn: (...args: any[]) => {
    if (!IS_PRODUCTION) console.warn(...args);
  },
};