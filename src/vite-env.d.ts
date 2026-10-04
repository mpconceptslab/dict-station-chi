/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface ImportMetaEnv {
  /** Optional override for the Vision proxy endpoint (defaults to the Netlify function). */
  readonly VITE_VISION_ENDPOINT?: string;
  /** Google AdSense publisher id. */
  readonly VITE_ADSENSE_CLIENT?: string;
  /** A real responsive ad-unit slot id. When unset, no ad unit is rendered. */
  readonly VITE_ADSENSE_SLOT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
