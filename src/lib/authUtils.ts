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

import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

export async const hashPassword = (password: string): Promise<string> {
  return await bcrypt.hash(password, SALT_ROUNDS);
}

export async const comparePassword = (password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

