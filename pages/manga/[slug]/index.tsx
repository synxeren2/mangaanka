import fs from 'fs';
import path from 'path';
import Link from 'next/link';

export async function getStaticPaths() {
  const mangaDir = path.join(process.cwd(), 'public', 'manga');
  let slugs: string[] = [];
  try {
    slugs = fs.readdirSync(mangaDir).filter(name => fs.statSync(path.join(mangaDir, name)).isDirectory());
  } catch (e) {
    slugs = [];
  }
  return { paths: slugs.map(s => ({ params: { slug: s } })), fallback: false };
}

export async function getStaticProps({ params }: any) {
  const slug = params.slug;
  const dir = path.join(process.cwd(), 'public', 'manga', slug);
  const chapters = fs.readdirSync(dir).filter(f => fs.statSync(path.join(dir, f)).isDirectory());
  return { props: { slug, chapters } };
}

export default function MangaIndex({ slug, chapters }: { slug: string; chapters: string[] }) {
  return (
    <main className="p-6">
      <h1 className="text-2xl mb-4">{slug.replace(/[-_]/g, ' ')}</h1>
      <ul>
        {chapters.map(c => (
          <li key={c}>
            <Link href={`/manga/${slug}/${c}`}> 
              <a className="text-blue-300">{c}</a>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}