import Header from '../components/Header';

export default function NewsPage({ news }) {
  if (!news) {
    return (
      <div>
        <Header />
        <main>
          <h1>Article Not Found</h1>
          <p>The requested article could not be found.</p>
        </main>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <main>
        <h1>{news.attributes.title}</h1>
        <p>{news.attributes.content}</p>
      </main>
    </div>
  );
}

export async function getServerSideProps({ params }) {
  try {
    const res = await fetch(`http://localhost:1337/api/news?filters[slug][$eq]=${params.slug}`);
    const data = await res.json();
    const news = data.data[0];

    if (!news) {
      return { notFound: true };
    }

    return {
      props: { news },
    };
  } catch (error) {
    return { notFound: true };
  }
}