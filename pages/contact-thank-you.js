import Head from "next/head"
import Link from "next/link"
import MainBanner from "../components/MainBanner"
import Header from "../components/Header"
import Sidebar from "../components/Sidebar"
import Footer from "../components/Footer"

export default function ContactThankYou() {
  return (
    <>
      <Head>
        <title>Thank You | Red, White and True News</title>
        <link rel="icon" href="/images/core/rwtn_favicon.jpg" />
      </Head>
      <Header />
      <main className="max-w-7xl mx-auto p-4 flex flex-col md:flex-row gap-4 bg-white">
        <section className="flex-1">
          <MainBanner />
          <h1 className="text-3xl font-bold text-[#3C3B6E] text-center my-4">Thank You for Contacting Us</h1>
          <div className="text-center">
            <p className="text-gray-600 mb-4 text-lg">
              Your message has been sent successfully. We'll get back to you as soon as possible.
            </p>
            <Link href="/" className="text-[#B22234] hover:underline font-semibold text-lg">
              Return to Home
            </Link>
          </div>
        </section>
        <Sidebar />
      </main>
      <Footer />
    </>
  )
}
