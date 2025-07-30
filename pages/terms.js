// File: terms.js
// Folder: /rwtnews/pages

import Head from "next/head"
import MainBanner from "../components/MainBanner"
import Header from "../components/Header"
import Sidebar from "../components/Sidebar"
import Footer from "../components/Footer"

export default function Terms() {
  return (
    <>
      <Head>
        <title>Terms of Service | Red, White and True News</title>
        <meta name="description" content="The RIGHT News For America" />
        <meta property="og:title" content="Red, White and True News" />
        <meta property="og:description" content="The RIGHT News For America" />
        <meta property="og:image" content="images\core\og-image.jpg" />
        <meta property="og:url" content="RWTNews.com" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Red, White and True News" />
        <meta name="twitter:description" content="The RIGHT News For America" />
        <meta name="twitter:image" content="images\core\og-image.jpg" />
        <meta name="twitter:url" content="RWTNews.com" />
        <link rel="icon" href="/images/core/rwtn_favicon.jpg" />
      </Head>
      <Header />
      <main className="max-w-7xl mx-auto p-4 flex flex-col md:flex-row gap-4 bg-white">
        <section className="flex-1">
          <MainBanner />
          <h1 className="text-3xl font-bold text-[#3C3B6E] text-center my-4">Terms of Service</h1>
          <p className="text-gray-600 mb-4 text-lg">
            Welcome to Red, White and True News, an RWT News LLC property. By accessing or using our website at
            https://redwhiteandtruenews.com/, you agree to comply with and be bound by the following terms and
            conditions.
          </p>
          <h2 className="text-2xl font-bold text-[#3C3B6E] mb-3">1. Acceptance of Terms</h2>
          <p className="text-gray-600 mb-4 text-lg">
            By using this website, you acknowledge that you have read, understood, and agree to be bound by these Terms
            of Service and our Privacy Policy.
          </p>
          <h2 className="text-2xl font-bold text-[#3C3B6E] mb-3">2. Use of the Website</h2>
          <p className="text-gray-600 mb-4 text-lg">
            You may use our website for lawful purposes only. You agree not to:
          </p>
          <ul className="text-gray-600 mb-4 text-lg list-disc list-inside space-y-1 ml-4">
            <li>Post or transmit any unlawful, threatening, defamatory, or obscene content</li>
            <li>Violate any applicable laws or regulations</li>
            <li>Interfere with the website's functionality or security</li>
            <li>Attempt to gain unauthorized access to our systems</li>
          </ul>
          <h2 className="text-2xl font-bold text-[#3C3B6E] mb-3">3. Content and Intellectual Property</h2>
          <p className="text-gray-600 mb-4 text-lg">
            All content on this website, including articles, images, and videos, is owned by Red, White and True News
            LLC or our content partners. You may not reproduce, distribute, or create derivative works without written
            permission.
          </p>
          <h2 className="text-2xl font-bold text-[#3C3B6E] mb-3">4. User Comments and Submissions</h2>
          <p className="text-gray-600 mb-4 text-lg">
            By submitting comments or other content, you grant us a non-exclusive, royalty-free license to use, modify,
            and display such content. We reserve the right to moderate and remove inappropriate content.
          </p>
          <h2 className="text-2xl font-bold text-[#3C3B6E] mb-3">5. Disclaimers</h2>
          <p className="text-gray-600 mb-4 text-lg">
            Our website and content are provided "as is" without warranties of any kind. We strive for accuracy but
            cannot guarantee that all information is error-free or current.
          </p>
          <h2 className="text-2xl font-bold text-[#3C3B6E] mb-3">6. Limitation of Liability</h2>
          <p className="text-gray-600 mb-4 text-lg">
            RWT News LLC shall not be liable for any direct, indirect, incidental, or consequential
            damages arising from your use of this website.
          </p>
          <h2 className="text-2xl font-bold text-[#3C3B6E] mb-3">7. External Links</h2>
          <p className="text-gray-600 mb-4 text-lg">
            Our website may contain links to third-party websites. We are not responsible for the content or practices
            of these external sites.
          </p>
          <h2 className="text-2xl font-bold text-[#3C3B6E] mb-3">8. Agreement to YouTube Terms of Service</h2>
          <p className="text-gray-600 mb-4 text-lg">
            Our website utilizes YouTube API Services to provide video content. By accessing or using our video features,
            you are agreeing to be bound by the{" "}
            <a href="https://www.youtube.com/t/terms" target="_blank" rel="noopener noreferrer" className="text-[#B22234]                         hover:underline font-medium"> YouTube Terms of Service</a>. We encourage you to review these terms carefully.
          </p>
          <h2 className="text-2xl font-bold text-[#3C3B6E] mb-3">9. Changes to Terms</h2>
          <p className="text-gray-600 mb-4 text-lg">
            We reserve the right to modify these terms at any time. Changes will be posted on this page, and your
            continued use constitutes acceptance of the modified terms.
          </p>
          <h2 className="text-2xl font-bold text-[#3C3B6E] mb-3">10. Contact Information</h2>
          <p className="text-gray-600 mb-4 text-lg">
            For questions about these Terms of Service, contact us by visiting our{" "}
            <a href="/contact" className="text-[#B22234] hover:underline font-semibold">Contact Page</a>
            .
          </p>
        </section>
        <Sidebar />
      </main>
      <Footer />
    </>
  )
}
