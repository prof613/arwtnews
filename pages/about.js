// File: about.js
// Folder: /rwtnews/pages

import Head from 'next/head';
import MainBanner from '../components/MainBanner';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

export default function About() {
  return (
    <>
      <Head>
        <title>About | Red, White and True News</title>
        <link rel="icon" href="/images/core/rwtn_favicon.jpg" />
      </Head>
      <Header />
      <main className="max-w-7xl mx-auto p-4 flex gap-4 bg-white">
        <section className="flex-1">
          <MainBanner />
          <h1 className="text-3xl font-bold text-[#3C3B6E] text-center my-4">About Red, White and True News</h1>
          <p className="text-gray-600 mb-4 text-lg">
            Red, White and True News is dedicated to providing accurate, unbiased news and commentary that reflects traditional American values. Our mission is to cut through the noise of mainstream media and deliver the truth to patriotic Americans who deserve better.
          </p>
          <h2 className="text-2xl font-bold text-[#3C3B6E] mb-3">Our Mission</h2>
          <p className="text-gray-600 mb-4 text-lg">
            We believe in the principles that made America great: freedom, liberty, and the pursuit of truth. Our team of dedicated journalists and commentators work tirelessly to bring you news that matters, without the liberal bias that plagues so much of today's media landscape.
          </p>
          <h2 className="text-2xl font-bold text-[#3C3B6E] mb-3">What We Stand For</h2>
          <ul className="text-gray-600 mb-4 text-lg list-disc list-inside space-y-2">
            <li><strong>Truth in Journalism:</strong> We fact-check our stories and provide sources for our claims</li>
            <li><strong>Constitutional Values:</strong> We support the Constitution and Bill of Rights</li>
            <li><strong>Traditional Values:</strong> We believe in family, faith, and community</li>
            <li><strong>Economic Freedom:</strong> We support free market capitalism and limited government</li>
            <li><strong>National Security:</strong> We believe in a strong defense and secure borders</li>
          </ul>
          <h2 className="text-2xl font-bold text-[#3C3B6E] mb-3">Our Team</h2>
          <p className="text-gray-600 mb-4 text-lg">
            Our editorial team consists of experienced journalists, military veterans, and concerned citizens who are passionate about preserving American values and delivering the truth. We come from diverse backgrounds but share a common love for this great nation.
          </p>
          <h2 className="text-2xl font-bold text-[#3C3B6E] mb-3">Contact Us</h2>
          <p className="text-gray-600 mb-4 text-lg">
            Have a story tip or want to get in touch? Email us at <a href="mailto:webpagecontact@redwhiteandtruenews.com" className="text-[#B22234] hover:underline font-semibold">webpagecontact@redwhiteandtruenews.com</a>
          </p>
        </section>
        <Sidebar />
      </main>
      <Footer />
    </>
  );
}