// File: privacy.js
// Folder: /rwtnews/pages

import Head from "next/head"
import MainBanner from "../components/MainBanner"
import Header from "../components/Header"
import Sidebar from "../components/Sidebar"
import Footer from "../components/Footer"

export default function Privacy() {
  return (
    <>
      <Head>
        <title>Privacy Policy | Red, White and True News</title>
        <link rel="icon" href="/images/core/rwtn_favicon.jpg" />
      </Head>
      <Header />
      <main className="max-w-7xl mx-auto p-4 flex flex-col md:flex-row gap-4 bg-white">
        <section className="flex-1">
          <MainBanner />
          <h1 className="text-3xl font-bold text-[#3C3B6E] text-center my-4">Privacy Policy</h1>
          <p className="text-gray-600 mb-4 text-lg">
            Red, White and True News LLC is committed to protecting your privacy. This Privacy Policy explains how we
            collect, use, and safeguard your information when you visit https://redwhiteandtruenews.com/.
          </p>
          <h2 className="text-2xl font-bold text-[#3C3B6E] mb-3">1. Information We Collect</h2>
          <p className="text-gray-600 mb-4 text-lg">We may collect:</p>
          <ul className="text-gray-600 mb-4 text-lg list-disc list-inside space-y-1 ml-4">
            <li>
              <strong>Personal Information:</strong> Email addresses (via subscription form), names, and comments (via
              comment form)
            </li>
            <li>
              <strong>Non-Personal Information:</strong> Browser type, IP address, and site usage data (via analytics,
              if enabled)
            </li>
          </ul>
          <h2 className="text-2xl font-bold text-[#3C3B6E] mb-3">2. How We Use Your Information</h2>
          <ul className="text-gray-600 mb-4 text-lg list-disc list-inside space-y-1 ml-4">
            <li>To send newsletters (if subscribed)</li>
            <li>To display approved comments on articles</li>
            <li>To improve site functionality and user experience</li>
            <li>To respond to inquiries sent via contact forms</li>
          </ul>
          <h2 className="text-2xl font-bold text-[#3C3B6E] mb-3">3. Data Sharing</h2>
          <p className="text-gray-600 mb-4 text-lg">
            We do not sell or share your personal information with third parties, except:
          </p>
          <ul className="text-gray-600 mb-4 text-lg list-disc list-inside space-y-1 ml-4">
            <li>With service providers (e.g., SendGrid for emails) under strict confidentiality</li>
            <li>As required by law or to protect our rights</li>
          </ul>
          <h2 className="text-2xl font-bold text-[#3C3B6E] mb-3">4. Data Security</h2>
          <p className="text-gray-600 mb-4 text-lg">
            We use reasonable measures (e.g., HTTPS, secure database storage) to protect your information. However, no
            method is 100% secure, and we cannot guarantee absolute security.
          </p>
          <h2 className="text-2xl font-bold text-[#3C3B6E] mb-3">5. Cookies and Tracking</h2>
          <p className="text-gray-600 mb-4 text-lg">
            Our site does not currently use cookies. If analytics or ads (e.g., Google Analytics, AdSense) are enabled,
            cookies may be used to track usage. You can manage cookie preferences via your browser settings.
          </p>
          <h2 className="text-2xl font-bold text-[#3C3B6E] mb-3">6. Your Rights</h2>
          <p className="text-gray-600 mb-4 text-lg">You may:</p>
          <ul className="text-gray-600 mb-4 text-lg list-disc list-inside space-y-1 ml-4">
            <li>Unsubscribe from newsletters via the link in emails</li>
            <li>
              Request deletion of your comments or subscription data by contacting
              webpagecontact@redwhiteandtruenews.com
            </li>
          </ul>
          <h2 className="text-2xl font-bold text-[#3C3B6E] mb-3">7. Third-Party Links</h2>
          <p className="text-gray-600 mb-4 text-lg">
            Our site links to external sites (e.g., social media, news sources). We are not responsible for their
            privacy practices.
          </p>
          <h2 className="text-2xl font-bold text-[#3C3B6E] mb-3">8. Changes to Policy</h2>
          <p className="text-gray-600 mb-4 text-lg">
            We may update this Privacy Policy. Changes will be posted here, and your continued use of the site
            constitutes acceptance.
          </p>
          <h2 className="text-2xl font-bold text-[#3C3B6E] mb-3">9. Contact Us</h2>
          <p className="text-gray-600 mb-4 text-lg">
            For questions, contact us at{" "}
            <a
              href="mailto:webpagecontact@redwhiteandtruenews.com"
              className="text-[#B22234] hover:underline font-semibold"
            >
              webpagecontact@redwhiteandtruenews.com
            </a>
            .
          </p>
        </section>
        <Sidebar />
      </main>
      <Footer />
    </>
  )
}
