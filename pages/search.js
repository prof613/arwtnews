// File: search.js
// Folder: /rwtnews/pages

import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import axios from 'axios';
import MainBanner from '../components/MainBanner';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import Link from 'next/link';

export default function Search() {
  const router = useRouter();
  const { query } = router.query;
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (query) {
      async function fetchResults() {
        try {
          const [articleRes, externalRes] = await Promise.all([
            axios.get(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/articles?filters[$or][0][title][$containsi]=${query}&filters[$or][1][author][$containsi]=${query}&populate=*&pagination[page]=${page}&pagination[pageSize]=20`),
            axios.get(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/external-articles?filters[$or][0][title][$containsi]=${query}&filters[$or][1][author][$containsi]=${query}&populate=*&pagination[page]=${page}&pagination[pageSize]=20`)
          ]);
          const combinedResults = [
            ...articleRes.data.data.map(item => ({ ...item, type: 'article' })),
            ...externalRes.data.data.map(item => ({ ...item, type: 'external' }))
          ];
          setResults(combinedResults);
          setTotalPages(Math.max(articleRes.data.meta.pagination.pageCount, externalRes.data.meta.pagination.pageCount));
        } catch (error) {
          console.error('Error fetching search results:', error);
        }
      }
      fetchResults();
    }
  }, [query, page]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo(0, 0);
    }
  };

  return (
    <>
      <Head>
        <title>Search Results | Red, White and True News</title>
        <link rel="icon" href="/images/core/rwtn_favicon.jpg" />
      </Head>
      <Header />
      <main className="max-w-7xl mx-auto p-4 flex flex-wrap gap-4 bg-white">
        <section className="w-full md:w-3/4">
          <MainBanner />
          <h1 className="text-2xl text-[#3C3B6E] text-center my-4">Search Results for "{query}"</h1>
          {results.length === 0 ? (
            <p>No results found.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {results.map((item) => (
                <div key={item.id} className="flex gap-4 p-2">
                  <img
                    src={item.attributes.image?.data?.attributes?.url || '/images/core/placeholder.jpg'}
                    alt={item.attributes.title}
                    className="w-1/4 h-24 object-cover rounded"
                  />
                  <div className="w-3/4">
                    {item.type === 'article' ? (
                      <Link href={`/articles/${item.attributes.slug}`}>
                        <h3 className="text-lg text-[#3C3B6E] hover:text-[#B22234]">{item.attributes.title}</h3>
                      </Link>
                    ) : (
                      <a
                        href={item.attributes.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => {
                          e.preventDefault();
                          if (confirm("You're about to visit an external site. Continue?")) window.open(item.attributes.link, '_blank');
                        }}
                        className="text-lg text-[#3C3B6E] hover:text-[#B22234]"
                      >
                        {item.attributes.title}
                      </a>
                    )}
                    <p className="text-sm text-gray-600">
                      {item.attributes.category?.data?.attributes?.name || 'None'} / {item.attributes.author || 'Unknown'} / 
                      {new Date(item.attributes.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'America/Los_Angeles' })}
                    </p>
                    <p className="text-sm text-gray-500">{item.attributes.quote?.substring(0, 100)}...</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="text-center mt-4">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="px-4 py-2 bg-[#3C3B6E] text-white rounded disabled:bg-gray-300 hover:bg-[#B22234]"
            >
              Previous
            </button>
            <span className="mx-2">Page {page} of {totalPages}</span>
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className="px-4 py-2 bg-[#3C3B6E] text-white rounded disabled:bg-gray-300 hover:bg-[#B22234]"
            >
              Next
            </button>
          </div>
        </section>
        <Sidebar />
      </main>
      <Footer />
    </>
  );
}