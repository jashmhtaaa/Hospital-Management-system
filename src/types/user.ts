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

// types/user.ts;

export interface User {
  userId: number,
  username: string;
  email: string;
  fullName?: string | null;
  roleId: number,
  roleName: string; // Added for convenience in session/frontend;
  isActive: boolean,
  permissions: string[]; // Added permissions property;
}

