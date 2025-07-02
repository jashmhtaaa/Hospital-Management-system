import { D1Database, D1PreparedStatement, D1Result } from '@cloudflare/workers-types';

declare global {
  interface CloudflareEnv {
    DB: D1Database;
    CACHE: KVNamespace;
    HMS_SECRET: string;
  }
}

export type { D1Database, D1PreparedStatement, D1Result };
