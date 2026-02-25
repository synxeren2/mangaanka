import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import Layout from '../../../components/Layout';

export async function getStaticPaths() {
  const mangaDir = path.join(process.cwd(), 'public', 'manga');
  let slugs: string[] = [];
  try {
    slugs = fs.readdirSync(mangaDir).filter(name =>
      fs.statSync(path.join(mangaDir, name)).isDirectory()
    );
  } catch (_) {
    slugs = [];
  }
  return { paths: slugs.map(s => ({ params: { slug: s } })), fallback: false };
}

export async function getStaticProps({ params }: { params: { slug: string } }) {
  const slug = params.slug;
  const dir = path.join(process.cwd(), 'public', 'manga', slug);
  const chapters = fs
    .readdirSync(dir)
    .filter(f => fs.statSync(path.join(dir, f)).isDirectory())
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  const title = slug.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  return { props: { slug, title, chapters } };
}

export default function MangaIndex({ slug, title, chapters }: { slug: string; title: string; chapters: string[] }) {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Manga Header */}
        <div className="flex gap-6 mb-8">
          <div className="flex-shrink-0 w-32 h-48 rounded-lg overflow-hidden bg-gray-800 border border-gray-700">
            <img
              src={`/manga/${slug}/cover.svg`}
              alt={title}
              className="w-full h-full object-cover"
              onError={(e) => {
                const t = e.target as HTMLImageElement;
                t.style.display = 'none';
              }}
            />
          </div>
          <div className="flex-1">
            <Link href="/" className="text-sm text-gray-500 hover:text-red-400 transition-colors mb-2 inline-block">
              ← Ana Sayfa
            </Link>
            <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>
            <p className="text-gray-500">{chapters.length} bölüm</p>
          </div>
        </div>

        {/* Chapter List */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-800">
            <h2 className="font-semibold text-white">Bölümler</h2>
          </div>
          <ul className="divide-y divide-gray-800">
            {chapters.map((c, i) => (
              <li key={c}>
                <Link
                  href={`/manga/${slug}/${c}`}
                  className="flex items-center justify-between px-4 py-3 hover:bg-gray-800 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-gray-800 group-hover:bg-red-900 flex items-center justify-center text-sm text-gray-400 group-hover:text-red-400 transition-colors font-mono">
                      {chapters.length - i}
                    </span>
                    <span className="text-gray-300 group-hover:text-white transition-colors">
                      {c.replace(/[-_]/g, ' ').replace(/\b\w/g, ch => ch.toUpperCase())}
                    </span>
                  </div>
                  <span className="text-gray-600 group-hover:text-red-500 transition-colors text-xl">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Layout>
  );
}