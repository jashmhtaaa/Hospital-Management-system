var __DEV__: boolean;
  interface Window {
    [key: string]: any
  }
  namespace NodeJS {
    interface Global {
      [key: string]: any
    }
  }
}

import { useToast } from '@/hooks/use-toast';

export { useToast };
