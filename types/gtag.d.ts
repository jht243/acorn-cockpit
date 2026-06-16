// Minimal ambient type for the global gtag function injected by Google Tag Manager.
// Only the shapes used in this codebase are declared.

type GtagConsentArg = 'default' | 'update'
type GtagConsentParams = {
  analytics_storage?: 'granted' | 'denied'
  ad_storage?: 'granted' | 'denied'
  wait_for_update?: number
}

interface Window {
  gtag: (
    command: 'consent',
    action: GtagConsentArg,
    params: GtagConsentParams,
  ) => void
  dataLayer: unknown[]
}
