import "../styles/globals.css"
import Head from "next/head"
import Script from "next/script" // Import Script from next/script

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        {/* Basic meta tags for global settings */}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" /> {/* Assuming you have a favicon */}
        {/* No specific OG/Twitter tags here, they will be handled per page */}
        <meta name="facebook-domain-verification" content="w15cpa90l9h1j3wrrtbft8drm9uhvt" />
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
