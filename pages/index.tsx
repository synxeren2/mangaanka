import Link from 'next/link';
import fs from 'fs';
import path from 'path';

type Manga = { slug: string; title: string };

export async function getStaticProps() {
  const mangaDir = path.join(process.cwd(), 'public', 'manga');
  let mangas: Manga[] = [];
  try {
    const items = fs.readdirSync(mangaDir, { withFileTypes: true });
    mangas = items
      .filter(i => i.isDirectory())
      .map(d => ({ slug: d.name, title: d.name.replace(/[-_]/g, ' ') }));
  } catch (e) {
    mangas = [];
  }
  return { props: { mangas } };
}

export default function Home({ mangas }: { mangas: Manga[] }) {
  return (
    <main className="p-6">
      <h1 className="text-3xl mb-4">mangaanka</h1>
      <ul className="space-y-2">
        {mangas.map(m => (
          <li key={m.slug}>
            <Link href={`/manga/${m.slug}`}> 
              <a className="text-blue-300 hover:underline">{m.title}</a>
            </Link>
          </li>
        ))}
      </ul>
      {mangas.length === 0 && <p className="mt-4 text-gray-400">public/manga içine örnek manga klasörleri ekleyin.</p>}
    </main>
  );
}