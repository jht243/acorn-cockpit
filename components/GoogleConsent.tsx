// Server component — no 'use client' needed.
// Renders the two <Script> tags required for Google Consent Mode v2.

import Script from 'next/script'

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

export default function GoogleConsent() {
  if (!GA_ID) return null

  return (
    <>
      {/*
        1. Consent Mode v2 default — MUST execute before gtag.js loads.
           Sets analytics_storage and ad_storage to 'denied' for all first-time
           visitors. The CookieBanner component fires gtag('consent','update',…)
           to flip these to 'granted' if the user accepts.
      */}
      <Script id="google-consent-default" strategy="beforeInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('consent', 'default', {
            analytics_storage: 'denied',
            ad_storage:        'denied',
            wait_for_update:   500,
          });
          gtag('js', new Date());
        `}
      </Script>

      {/*
        2. Load the GA tag itself after the page is interactive.
           Because consent defaults to denied above, no measurement data
           is sent until the user explicitly accepts via CookieBanner.
      */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('config', '${GA_ID}');
        `}
      </Script>
    </>
  )
}
