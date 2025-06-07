  var __DEV__: boolean;
  interface Window {
    [key: string]: any;
  }
  namespace NodeJS {
    interface Global {
      [key: string]: any;
    }
  }
}

/**
 * Utility function for merging class names with Tailwind CSS;
 */
export const cn = (...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
