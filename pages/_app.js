import "../styles/globals.css"
import Head from "next/head"

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        {/* Plausible Analytics Script */}
        <script defer data-domain="rwtnews.com" src="https://plausible.io/js/script.js"></script>

        <meta property="og:title" content="Red, White and True News" />
        <meta property="og:description" content="The RIGHT News for America." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.redwhiteandtruenews.com" />
        <meta
          property="og:image"
          content="https://rwtnews-live-frontend-s7ibg.ondigitalocean.app/images/core/og-image.jpg"
        />
        <meta property="og:site_name" content="Red, White and True News" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Red, White and True News" />
        <meta name="twitter:description" content="The RIGHT News for America." />
        <meta name="twitter:image" content="https://rwtnews-live-frontend-s7ibg.ondigitalocean.app/images/core/og-image.jpg" />
        <meta name="twitter:site" content="@RWTNews" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}

export default MyApp