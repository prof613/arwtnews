// File: 404.js
// Folder: /rwtnews/pages

import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function NotFound() {
  return (
    <>
      <Head>
        <title>Page Not Found | Red, White and True News</title>
        <link rel="icon" href="/images/core/rwtn_favicon.jpg" />
      </Head>
      <Header />
      <main className="max-w-7xl mx-auto p-4 text-center bg-white">
        <h1 className="text-2xl text-[#3C3B6E] mb-4">Page Not Found</h1>
        <p className="text-gray-600 mb-4">The page you are looking for does not exist.</p>
        <Link href="/" className="text-[#B22234] text-sm hover:underline">Return to Homepage</Link>
      </main>
      <Footer />
    </>
  );
}