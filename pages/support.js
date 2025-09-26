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
        <meta name="description" content="Support Red, White and True News in our mission to deliver truthful conservative news, fact-check propaganda, and amplify marginalized stories." />
        <meta name="keywords" content="conservative news, Red White and True News, support mission, truth in media, fact-checking" />
        <meta name="author" content="Tommy Flynn" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta property="og:title" content="Support Our Mission | Red, White and True News" />
        <meta property="og:description" content="Join Red, White and True News in our mission to provide accurate conservative news and combat media bias." />
        <meta property="og:image" content="https://rwtnews.com/images/core/og-image.jpg" />
        <meta property="og:url" content="https://rwtnews.com/support" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Red, White and True News" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Support Our Mission | Red, White and True News" />
        <meta name="twitter:description" content="Join Red, White and True News in our mission to provide accurate conservative news and combat media bias." />
        <meta name="twitter:image" content="https://rwtnews.com/images/core/og-image.jpg" />
        <meta name="twitter:site" content="@RWTNews" />
        <meta name="robots" content="index, follow" />
        <link rel="icon" href="/images/core/rwtn_favicon.jpg" />
        <link rel="canonical" href="https://rwtnews.com/support" />
      </Head>
      <Header />
      <main className="max-w-7xl mx-auto p-4 flex flex-col md:flex-row gap-4 bg-white">
        <section className="flex-1">
          <MainBanner />
          <h1 className="text-3xl font-bold text-[#3C3B6E] text-center my-4">Our Mission and Future Plans</h1>
          <p className="text-gray-600 mb-4 text-lg">
            At Red, White and True News, our mission is to amplify the stories that are marginalized, or outright buried by the Corporate Media, as well as fact check to debunk the propaganda that is so prolific today. We aim to accomplish this not just through our original content, but also by sharing articles by other Conservative media that many might not otherwise see. We don't view other Conservative media as competition but rather allies.
          </p>
          <p className="text-gray-600 mb-4 text-lg">
            With so much of today's media and big tech owned by Liberal organizations with Leftist agendas, it can often be difficult to weed through the spin and propaganda to get at the truth. While we certainly present News and Commentary from a Conservative point of view, we aim for Truth and accuracy in all our reporting. If you ever think we got something wrong, missed an important detail or aren't covering something you think we should be reporting on, you can reach out to us through our 
<a href="/contact" class="text-[#B22234] hover:underline font-semibold"> contact page</a>.
          </p>
          <p className="text-gray-600 mb-4 text-lg">
            Currently our mediums for getting you the True News are through the Webpage and Social Media. Eventually, we will be expanding into more video. Hopefully, a weekly podcast with other short videos on specific stories in between. While we are equipped for the video aspect, time is the main constraint right now. As of this moment, the entire team is just one person doing most of the writing, the Website development, content, Social Media and nearly every aspect solo. We hope to be rolling out the podcast and other video over the course of the next 6 months as we expand the team.
          </p>
          <p className="text-gray-600 mb-4 text-lg">
            Long-term, we aim to build RWT News into a lasting brand delivering the news and commentary Conservatives are hungry for, far into the future. If you are a staunch Conservative looking for a way to get involved and make a difference in today's political world, you should consider joining the RWT News team. If you just have one story you would like to share, would like to write for us on a regular basis, or want to be more involved in anything from website design, graphics or the video aspect, let us know by sending an email from the 
<a href="/contact" class="text-[#B22234] hover:underline font-semibold"> contact page</a>.
 If you appreciate what we do but don't have the time or skills to get directly involved, sharing our page and stories on Social Media is also a great way you can help us expand our reach.
          </p>
          <div className="bg-gray-100 p-6 rounded-lg mt-6">
            <p className="text-gray-600 text-lg">
             <b> Thank you,<br /> Tommy Flynn</b>
            </p>
          </div>
        </section>
        <Sidebar />
      </main>
      <Footer />
    </>
  )
}