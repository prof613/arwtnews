import "../styles/globals.css"
import Head from "next/head"
import Script from "next/script" // Import Script from next/script

function MyApp({ Component, pageProps }) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "NewsMediaOrganization",
    name: "Red, White and True News",
    alternateName: "RWT News",
    url: "https://rwtnews.com",
    logo: {
      "@type": "ImageObject",
      url: "https://rwtnews.com/images/core/logo.png",
      width: 300,
      height: 60,
    },
    sameAs: ["https://twitter.com/RWTNews", "https://facebook.com/RWTNews"],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "editorial",
      email: "editorial@rwtnews.com",
    },
    address: {
      "@type": "PostalAddress",
      addressCountry: "US",
    },
    foundingDate: "2020",
    description: "Conservative news and political analysis from a patriotic perspective",
    keywords: "conservative news, politics, patriotic, America, political analysis",
    inLanguage: "en-US",
    publishingPrinciples: "https://rwtnews.com/editorial-standards",
  }

  return (
    <>
      <Head>
        {/* Basic meta tags for global settings */}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" /> {/* Assuming you have a favicon */}
        {/* No specific OG/Twitter tags here, they will be handled per page */}
        <meta name="facebook-domain-verification" content="w15cpa90l9h1j3wrrtbft8drm9uhvt" />
        {/* Global Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
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
