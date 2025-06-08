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

"use client";

import * as React from "react";

export const ThemeProvider = ({ children, ...props }: ThemeProviderProps) => {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

