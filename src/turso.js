import { createClient } from '@libsql/client/web';

const url = import.meta.env.VITE_TURSO_DATABASE_URL || '';
const authToken = import.meta.env.VITE_TURSO_AUTH_TOKEN || '';

export const turso = (url && authToken) 
  ? createClient({ url, authToken })
  : {
      // Dummy fallback jika token belum diset agar App tidak crash
      execute: async () => ({ rows: [] })
    };