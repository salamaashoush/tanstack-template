/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_HOME_URL: string;
  readonly VITE_REDIRECT_ZOHO_URL: string;
  readonly VITE_STRIPE_PK: string;
  readonly VITE_SESSION_SECRET: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
