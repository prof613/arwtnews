"use client"

import "../styles/globals.css"
import Head from "next/head"
import Script from "next/script" // Import Script from "next/script"
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

  return (
    <>
      <Head>
        {/* Basic meta tags for global settings */}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" /> {/* Assuming you have a favicon */}
        {/* No specific OG/Twitter tags here, they will be handled per page */}
        {/* TEMPORARY: Direct HTML script tag for Facebook SDK */}
        <script
          async
          defer
          crossOrigin="anonymous"
          src={`https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v20.0&appId=1181307003800550`}
          onLoad={() => {
            if (window.FB) {
              window.FB.XFBML.parse()
            }
          }}
        ></script>
        {/* Plausible Analytics Script using next/script */}
        {/* Keep this one as it was, as it's not the source of the current problem */}
        <Script src="https://plausible.io/js/script.js" data-domain="rwtnews.com" strategy="afterInteractive" />
      </Head>

      <Component {...pageProps} />
    </>
  )
}

export default MyApp
