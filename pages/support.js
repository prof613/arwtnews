// File: support.js
// Folder: /rwtnews/pages

import Head from "next/head"
import MainBanner from "../components/MainBanner"
import Header from "../components/Header"
import Sidebar from "../components/Sidebar"
import Footer from "../components/Footer"

export default function Support() {
  return (
    <>
      <Head>
        <title>Support Our Mission | Red, White and True News</title>
        <link rel="icon" href="/images/core/rwtn_favicon.jpg" />
      </Head>
      <Header />
      <main className="max-w-7xl mx-auto p-4 flex flex-col md:flex-row gap-4 bg-white">
        <section className="flex-1">
          <MainBanner />
          <h1 className="text-3xl font-bold text-[#3C3B6E] text-center my-4">Support Our Mission</h1>
          <p className="text-gray-600 mb-4 text-lg">
            Red, White and True News is committed to delivering honest, unbiased journalism that reflects traditional
            American values. As an independent news organization, we rely on the support of patriots like you to
            continue our important work.
          </p>
          <h2 className="text-2xl font-bold text-[#3C3B6E] mb-3">Why Your Support Matters</h2>
          <p className="text-gray-600 mb-4 text-lg">
            In today's media landscape, it's increasingly difficult to find news sources that aren't influenced by
            corporate interests or political agendas. Your support helps us maintain our independence and continue
            providing the truth that mainstream media won't tell you.
          </p>
          <h2 className="text-2xl font-bold text-[#3C3B6E] mb-3">How You Can Help</h2>
          <ul className="text-gray-600 mb-4 text-lg list-disc list-inside space-y-2">
            <li>
              <strong>Share Our Articles:</strong> Help spread the truth by sharing our content on social media
            </li>
            <li>
              <strong>Subscribe to Our Newsletter:</strong> Stay informed with our weekly updates
            </li>
            <li>
              <strong>Submit Story Tips:</strong> Help us uncover stories that matter to Americans
            </li>
            <li>
              <strong>Engage with Our Content:</strong> Leave comments and participate in discussions
            </li>
            <li>
              <strong>Financial Support:</strong> Consider making a donation to support our operations
            </li>
          </ul>
          <h2 className="text-2xl font-bold text-[#3C3B6E] mb-3">Our Commitment to You</h2>
          <p className="text-gray-600 mb-4 text-lg">
            We promise to use your support responsibly and transparently. Every dollar goes toward maintaining our
            website, supporting our journalists, and expanding our reach to bring the truth to more Americans.
          </p>
          <h2 className="text-2xl font-bold text-[#3C3B6E] mb-3">Contact Us</h2>
          <p className="text-gray-600 mb-4 text-lg">
            Questions about supporting our mission? Reach out to us at{" "}
            <a
              href="mailto:webpagecontact@redwhiteandtruenews.com"
              className="text-[#B22234] hover:underline font-semibold"
            >
              webpagecontact@redwhiteandtruenews.com
            </a>
          </p>
          <div className="bg-gray-100 p-6 rounded-lg mt-6">
            <h3 className="text-xl font-bold text-[#3C3B6E] mb-3">Thank You</h3>
            <p className="text-gray-600 text-lg">
              Thank you for being part of the Red, White and True News community. Together, we can ensure that the truth
              prevails and American values are preserved for future generations.
            </p>
          </div>
        </section>
        <Sidebar />
      </main>
      <Footer />
    </>
  )
}
