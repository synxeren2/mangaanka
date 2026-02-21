import fs from 'fs';
import path from 'path';
import { useState } from 'react';

export async function getStaticPaths() {
  const base = path.join(process.cwd(), 'public', 'manga');
  let paths: any[] = [];
  try {
    const mangas = fs.readdirSync(base).filter(n => fs.statSync(path.join(base, n)).isDirectory());
    for (const m of mangas) {
      const mdir = path.join(base, m);
      const chapters = fs.readdirSync(mdir).filter(n => fs.statSync(path.join(mdir, n)).isDirectory());
      for (const c of chapters) {
        paths.push({ params: { slug: m, chapter: c }});
      }
    }
  } catch (e) {}
  return { paths, fallback: false };
}

export async function getStaticProps({ params }: any) {
  const { slug, chapter } = params;
  const dir = path.join(process.cwd(), 'public', 'manga', slug, chapter);
  const images = fs.readdirSync(dir).filter(f => /\.(jpe?g|png|webp)$/i.test(f)).sort();
  return { props: { slug, chapter, images } };
}

export default function Reader({ slug, chapter, images }: { slug: string; chapter: string; images: string[] }) {
  const [index, setIndex] = useState(0);
  const next = () => setIndex(i => Math.min(images.length - 1, i + 1));
  const prev = () => setIndex(i => Math.max(0, i - 1));

  return (
    <main className="p-4">
      <h2 className="text-xl mb-2">{slug} — {chapter}</h2>
      <div className="flex gap-2 mb-4">
        <button onClick={prev} className="px-3 py-1 bg-gray-700 rounded">Önceki</button>
        <button onClick={next} className="px-3 py-1 bg-gray-700 rounded">Sonraki</button>
        <span className="ml-4 text-sm text-gray-400">{index+1}/{images.length}</span>
      </div>
      <div className="max-w-3xl mx-auto">
        <img src={`/manga/${slug}/${chapter}/${images[index]}`} alt={`page ${index+1}`} className="w-full h-auto" />
      </div>
    </main>
  );
}