"use client"

import "../styles/globals.css"
import Head from "next/head"
import Script from "next/script"
import { useRouter } from "next/router" // Import useRouter
import { useEffect } from "react" // Import useEffect

function MyApp({ Component, pageProps }) {
  const router = useRouter() // Initialize useRouter

  useEffect(() => {
    const handleRouteChangeComplete = () => {
      if (window.FB) {
        window.FB.XFBML.parse()
      }
    }

    // Listen for route changes to re-parse Facebook XFBML
    router.events.on("routeChangeComplete", handleRouteChangeComplete)

    // Clean up the event listener when the component unmounts
    return () => {
      router.events.off("routeChangeComplete", handleRouteChangeComplete)
    }
  }, [router.events]) // Depend on router.events to ensure listener is correctly managed

  return (
    <>
      <Head>
        {/* Basic meta tags for global settings */}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" /> {/* Assuming you have a favicon */}
        {/* No specific OG/Twitter tags here, they will be handled per page */}
        <Script
          strategy="lazyOnload"
          src={`https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v20.0&appId=${process.env.NEXT_PUBLIC_FACEBOOK_APP_ID}`} // Use environment variable
          onLoad={() => {
            if (window.FB) {
              window.FB.XFBML.parse()
            }
          }}
        />
      </Head>

      {/* Plausible Analytics Script using next/script */}
      <Script
        src="https://plausible.io/js/script.js"
        data-domain="rwtnews.com"
        strategy="afterInteractive" // Load after the page is interactive
      />

      <Component {...pageProps} />
    </>
  )
}

export default MyApp
