"use client"

import "../styles/globals.css"
import Head from "next/head"
import Script from "next/script"
import { useRouter } from "next/router"
import { useEffect } from "react"

function MyApp({ Component, pageProps }) {
  const router = useRouter()

  useEffect(() => {
    const handleRouteChangeComplete = () => {
      if (window.FB) {
        console.log("Route change complete, parsing XFBML...")
        window.FB.XFBML.parse()
      } else {
        console.log("Route change complete, but window.FB is not available yet for XFBML.parse.")
      }
    }

    router.events.on("routeChangeComplete", handleRouteChangeComplete)

    return () => {
      router.events.off("routeChangeComplete", handleRouteChangeComplete)
    }
  }, [router.events])

  // Define window.fbAsyncInit globally before the SDK script loads
  // This function will be called by the Facebook SDK when it's fully loaded and initialized.
  useEffect(() => {
    window.fbAsyncInit = () => {
      console.log("Facebook SDK (fbAsyncInit) is fully loaded and initialized.")
      window.FB.XFBML.parse() // Initial parse after SDK is ready

      // Subscribe to Facebook SDK debug listeners
      window.FB.Event.subscribe("xfbml.render", (response) => {
        console.log("Facebook XFBML Render Event:", response)
        if (response.error) {
          console.error("Facebook XFBML Render Error:", response.error)
        }
      })
      window.FB.Event.subscribe("xfbml.parse", () => {
        console.log("Facebook XFBML Parse Event triggered.")
      })
      window.FB.Event.subscribe("auth.statusChange", (response) => {
        console.log("Facebook Auth Status Change:", response.status)
      })
    }
  }, []) // Empty dependency array ensures this runs once on mount

  return (
    <>
      <Head>
        {/* Basic meta tags for global settings */}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" /> {/* Assuming you have a favicon */}
        {/* No specific OG/Twitter tags here, they will be handled per page */}
      </Head>

      {/* Use next/script with strategy="afterInteractive" and the fbAsyncInit callback */}
      <Script
        src={`https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v23.0&appId=${process.env.NEXT_PUBLIC_FACEBOOK_APP_ID}`}
        strategy="afterInteractive" // Load after the page is interactive
        crossOrigin="anonymous"
        // No onLoad prop needed here, as fbAsyncInit handles the initialization callback
      />

      {/* Plausible Analytics Script using next/script - This is its original and correct form */}
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
