"use client"

import { DiscussionEmbed } from 'disqus-react'

export default function DisqusComments({ title, slug, url, type = 'article' }) {
  const disqusShortname = process.env.NEXT_PUBLIC_DISQUS_SHORTNAME
  
  const disqusConfig = {
    url: url,
    identifier: `${type}-${slug}`,
    title: title,
  }

  return (
    <section className="mt-12 border-t pt-8">
      <h3 className="text-2xl font-bold text-[#3C3B6E] mb-6">Comments</h3>
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <DiscussionEmbed
          shortname={disqusShortname}
          config={disqusConfig}
        />
      </div>
    </section>
  )
}