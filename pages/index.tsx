import fs from 'fs';
import path from 'path';
import Layout from '../components/Layout';
import MangaCard from '../components/MangaCard';

type Manga = { slug: string; title: string; chapterCount: number };

export async function getStaticProps() {
  const mangaDir = path.join(process.cwd(), 'public', 'manga');
  let mangas: Manga[] = [];
  try {
    const items = fs.readdirSync(mangaDir, { withFileTypes: true });
    mangas = items
      .filter(i => i.isDirectory())
      .map(d => {
        const mangaPath = path.join(mangaDir, d.name);
        let chapterCount = 0;
        try {
          chapterCount = fs.readdirSync(mangaPath, { withFileTypes: true })
            .filter(f => f.isDirectory()).length;
        } catch (_) {}
        return {
          slug: d.name,
          title: d.name.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
          chapterCount,
        };
      });
  } catch (_) {
    mangas = [];
  }
  return { props: { mangas } };
}

export default function Home({ mangas }: { mangas: Manga[] }) {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Tüm Mangalar</h1>
          <p className="text-gray-500">{mangas.length} manga mevcut</p>
        </div>

        {mangas.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {mangas.map(m => (
              <MangaCard key={m.slug} slug={m.slug} title={m.title} chapterCount={m.chapterCount} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-gray-600">
            <span className="text-6xl mb-4">📭</span>
            <p className="text-lg">Henüz manga eklenmemiş.</p>
            <p className="text-sm mt-2">
              <code className="bg-gray-800 px-2 py-1 rounded text-gray-400">public/manga/manga-adi/bolum-1/</code> dizinine sayfa görüntüleri ekleyin.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}