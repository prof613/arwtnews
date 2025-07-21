"use client"

import "../styles/globals.css"
import Head from "next/head"
import Script from "next/script"
import { useRouter } from "next/router"
import { useEffect, useRef } from "react" // Import useRef

function MyApp({ Component, pageProps }) {
  const router = useRouter()
  const fbSdkInitialized = useRef(false) // Ref to track if FB SDK has been fully initialized and listeners set

  useEffect(() => {
    const handleRouteChangeComplete = () => {
      if (window.FB) {
        console.log("Route change complete, parsing XFBML...")
        window.FB.XFBML.parse()
      } else {
        console.log("Route change complete, but window.FB is not available yet.")
      }
    }

    router.events.on("routeChangeComplete", handleRouteChangeComplete)

    return () => {
      router.events.off("routeChangeComplete", handleRouteChangeComplete)
    }
  }, [router.events])

  const handleFacebookSDKLoad = () => {
    // Use a timeout to give FB object a moment to fully populate,
    // and ensure this logic runs only once.
    setTimeout(() => {
      if (window.FB && !fbSdkInitialized.current) {
        console.log("Facebook SDK loaded and ready for the first time.")
        window.FB.XFBML.parse() // Initial parse on load

        // Subscribe to Facebook SDK debug listeners only once
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

        fbSdkInitialized.current = true // Mark as initialized
      } else if (window.FB && fbSdkInitialized.current) {
        console.log("Facebook SDK onLoad fired again (already initialized).")
      } else {
        console.log("Facebook SDK onLoad fired, but window.FB is still not available after timeout.")
      }
    }, 100) // Small delay to ensure FB object is fully ready
  }

  return (
    <>
      <Head>
        {/* Basic meta tags for global settings */}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" /> {/* Assuming you have a favicon */}
        {/* No specific OG/Twitter tags here, they will be handled per page */}
        {/* Direct HTML script tag for Facebook SDK - This is the working solution */}
        <script
          async
          defer
          crossOrigin="anonymous"
          src={`https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v23.0&appId=${process.env.NEXT_PUBLIC_FACEBOOK_APP_ID}`}
          onLoad={handleFacebookSDKLoad} // Call the new handler on load
        ></script>
        {/* Plausible Analytics Script using next/script - This is its original and correct form */}
        <Script
          src="https://plausible.io/js/script.js"
          data-domain="rwtnews.com"
          strategy="afterInteractive" // Load after the page is interactive
        />
      </Head>

      <Component {...pageProps} />
    </>
  )
}

export default MyApp
