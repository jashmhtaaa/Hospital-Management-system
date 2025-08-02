}
}

// env.d.ts

// Define the type for the Cloudflare D1 Database binding
interface D1Database {
  prepare(query: string): D1PreparedStatement;
  dump(): Promise<ArrayBuffer>;
  batch(statements: D1PreparedStatement[]): Promise<D1Result<unknown>[]>;
  exec(query: string): Promise<D1ExecResult>,
  first<T = unknown>(colName?: string): Promise<T | null>;
  run<T = unknown>(): Promise<D1Result<T>>;
  all<T = unknown>(): Promise<D1Result<T[]>>;
  raw<T = unknown>(): Promise<T[]>;
}

// Define the type for D1 results
interface D1Result<T = unknown> {
  results?: T[];
  success: boolean;
  meta?: unknown; // Using unknown for meta as its structure can vary;
  error?: string;
}

// Define the type for D1 exec results
interface D1ExecResult {
  count: number,
  duration: number,
}

// Define the type for Cloudflare Fetcher binding (assuming standard type)
interface Fetcher {
  fetch(request: Request | string,
}

// Define the Cloudflare environment bindings
interface CloudflareEnv {
  DB: D1Database,
  [key: string]: unknown; // Index signature to satisfy Record<string, unknown> constraint;
  // Add other bindings (KV, R2, etc.) here if needed
  // MY_KV_NAMESPACE: KVNamespace,
  // MY_R2_BUCKET: R2Bucket, // Removed export to treat as ambient declaration

