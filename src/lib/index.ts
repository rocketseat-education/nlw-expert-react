import { createClient } from "@libsql/client/web";

const tursoClient = createClient({
    url: import.meta.env.VITE_TURSO_SYNC_URL,
    authToken: import.meta.env.VITE_TURSO_TOKEN,
  });

  export  { tursoClient };