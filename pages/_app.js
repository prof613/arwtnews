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
        window.FB.XFBML.parse()
      }
    }

    router.events.on("routeChangeComplete", handleRouteChangeComplete)

    return () => {
      router.events.off("routeChangeComplete", handleRouteChangeComplete)
    }
  }, [router.events])

  // Construct the Facebook SDK URL explicitly
  const facebookSdkSrc = `https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v20.0&appId=${process.env.NEXT_PUBLIC_FACEBOOK_APP_ID}`

  return (
    <>
      <Head>
        {/* Basic meta tags for global settings */}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" /> {/* Assuming you have a favicon */}
        {/* No specific OG/Twitter tags here, they will be handled per page */}
        <Script
          strategy="beforeInteractive" // Changed strategy for earlier loading
          src={facebookSdkSrc} // Pass the pre-constructed URL
          onLoad={() => {
            if (window.FB) {
              window.FB.XFBML.parse()
            }
          }}
        />
      </Head>

      {/* Plausible Analytics Script using next/script */}
      <Script src="https://plausible.io/js/script.js" data-domain="rwtnews.com" strategy="afterInteractive" />

      <Component {...pageProps} />
    </>
  )
}

export default MyApp
