// File: about.js
// Folder: /rwtnews/pages

import Head from "next/head"
import MainBanner from "../components/MainBanner"
import Header from "../components/Header"
import Sidebar from "../components/Sidebar"
import Footer from "../components/Footer"

export default function About() {
  return (
    <>
      <Head>
        <title>About | Red, White and True News</title>
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
          <h1 className="text-3xl font-bold text-[#3C3B6E] text-center my-4">About Red, White and True News</h1>
          <p className="text-gray-600 mb-4 text-lg">
            Red, White and True News is the unyielding voice of conservative truth, delivering hard-hitting news and
            commentary that upholds the core of American values. We’re 100% conservative, fiercely committed to
            dismantling leftist propaganda and mainstream media spin. Our mission is to equip patriotic Americans with
            accurate, unfiltered stories that honor the principles that built this nation.
          </p>
          <h2 className="text-2xl font-bold text-[#3C3B6E] mb-3">Our Mission</h2>
          <p className="text-gray-600 mb-4 text-lg">
            We are driven by a relentless pursuit of truth, rooted in the timeless ideals that make America exceptional:
            freedom, liberty, and Judeo-Christian values. Our team of steadfast journalists and commentators slices
            through leftist narratives, exposing lies and delivering stories that matter to conservatives and
            libertarians who demand integrity over agenda.
          </p>
          <h2 className="text-2xl font-bold text-[#3C3B6E] mb-3">What We Stand For</h2>
          <ul className="text-gray-600 mb-4 text-lg list-disc list-inside space-y-2">
            <li>
              <strong>Truth in Journalism:</strong> We rigorously fact-check every story, backing our claims with
              credible sources for accuracy and trust.
            </li>
            <li>
              <strong>Constitutional Values:</strong> We defend the Constitution and Bill of Rights, especially the
              Second Amendment, as the foundation of our freedom.
            </li>
            <li>
              <strong>Judeo-Christian Values:</strong> We champion family and community, guided by the moral framework
              that shaped America.
            </li>
            <li>
              <strong>Economic Freedom:</strong> We stand for free market capitalism, minimal government, and the
              entrepreneurial spirit that fuels prosperity.
            </li>
            <li>
              <strong>No Big Government:</strong> We oppose bloated bureaucracies and overreach, advocating for
              individual liberty and personal responsibility.
            </li>
            <li>
              <strong>National Security:</strong> We support a strong defense, secure borders, and an America-first
              approach to protect our sovereignty.
            </li>
          </ul>
          <h2 className="text-2xl font-bold text-[#3C3B6E] mb-3">Our Team</h2>
          <p className="text-gray-600 mb-4 text-lg">
            Our editorial team consists of experienced journalists and concerned citizens who are
            passionate about preserving American values and delivering the truth. We come from diverse backgrounds but
            share a common love for this great nation.
          </p>
          <h2 className="text-2xl font-bold text-[#3C3B6E] mb-3">Contact Us</h2>
          <p className="text-gray-600 mb-4 text-lg">
            Have a story tip, feedback about the page, or want to report a bug? Visit our{" "}
            <a
              href="/contact"
              className="text-[#B22234] hover:underline font-semibold"
            >
              contact page
            </a>
          </p>
        </section>
        <Sidebar />
      </main>
      <Footer />
    </>
  )
}