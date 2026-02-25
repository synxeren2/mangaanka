import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { useState } from 'react';
import Layout from '../../../components/Layout';

export async function getStaticPaths() {
  const base = path.join(process.cwd(), 'public', 'manga');
  const paths: { params: { slug: string; chapter: string } }[] = [];
  try {
    const mangas = fs.readdirSync(base).filter(n => fs.statSync(path.join(base, n)).isDirectory());
    for (const m of mangas) {
      const mdir = path.join(base, m);
      const chapters = fs.readdirSync(mdir).filter(n => fs.statSync(path.join(mdir, n)).isDirectory());
      for (const c of chapters) {
        paths.push({ params: { slug: m, chapter: c } });
      }
    }
  } catch (_) {}
  return { paths, fallback: false };
}

export async function getStaticProps({ params }: { params: { slug: string; chapter: string } }) {
  const { slug, chapter } = params;
  const dir = path.join(process.cwd(), 'public', 'manga', slug, chapter);

  // get all chapters for navigation
  const mangaDir = path.join(process.cwd(), 'public', 'manga', slug);
  const allChapters = fs
    .readdirSync(mangaDir)
    .filter(f => fs.statSync(path.join(mangaDir, f)).isDirectory())
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  const images = fs
    .readdirSync(dir)
    .filter(f => /\.(jpe?g|png|webp|svg)$/i.test(f))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  const chapterIndex = allChapters.indexOf(chapter);
  const prevChapter = chapterIndex > 0 ? allChapters[chapterIndex - 1] : null;
  const nextChapter = chapterIndex < allChapters.length - 1 ? allChapters[chapterIndex + 1] : null;
  const title = slug.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  return { props: { slug, title, chapter, images, prevChapter, nextChapter } };
}

type Props = {
  slug: string;
  title: string;
  chapter: string;
  images: string[];
  prevChapter: string | null;
  nextChapter: string | null;
};

export default function Reader({ slug, title, chapter, images, prevChapter, nextChapter }: Props) {
  const [pageIndex, setPageIndex] = useState(0);
  const [mode, setMode] = useState<'page' | 'scroll'>('scroll');

  const chapterTitle = chapter.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  const prev = () => setPageIndex(i => Math.max(0, i - 1));
  const next = () => setPageIndex(i => Math.min(images.length - 1, i + 1));

  return (
    <Layout>
      {/* Reader Topbar */}
      <div className="sticky top-14 z-40 bg-gray-900/95 backdrop-blur border-b border-gray-800 px-4 py-2">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3 min-w-0">
            <Link href={`/manga/${slug}`} className="text-gray-500 hover:text-white transition-colors text-sm shrink-0">
              ← {title}
            </Link>
            <span className="text-gray-700">|</span>
            <span className="text-white font-medium text-sm truncate">{chapterTitle}</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Mode toggle */}
            <div className="flex rounded-lg overflow-hidden border border-gray-700 text-xs">
              <button
                onClick={() => setMode('scroll')}
                className={`px-3 py-1.5 transition-colors ${mode === 'scroll' ? 'bg-red-700 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
              >
                Kaydır
              </button>
              <button
                onClick={() => { setMode('page'); setPageIndex(0); }}
                className={`px-3 py-1.5 transition-colors ${mode === 'page' ? 'bg-red-700 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
              >
                Sayfa
              </button>
            </div>

            {/* Chapter nav */}
            <div className="flex items-center gap-1">
              {prevChapter ? (
                <Link href={`/manga/${slug}/${prevChapter}`} className="px-2 py-1.5 text-xs bg-gray-800 hover:bg-gray-700 rounded text-gray-400 hover:text-white transition-colors">
                  ‹ Önceki
                </Link>
              ) : (
                <span className="px-2 py-1.5 text-xs text-gray-700 rounded cursor-not-allowed">‹ Önceki</span>
              )}
              {nextChapter ? (
                <Link href={`/manga/${slug}/${nextChapter}`} className="px-2 py-1.5 text-xs bg-gray-800 hover:bg-gray-700 rounded text-gray-400 hover:text-white transition-colors">
                  Sonraki ›
                </Link>
              ) : (
                <span className="px-2 py-1.5 text-xs text-gray-700 rounded cursor-not-allowed">Sonraki ›</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Reader Content */}
      <div className="max-w-3xl mx-auto px-2 py-4">
        {images.length === 0 ? (
          <div className="text-center py-24 text-gray-600">
            <span className="text-5xl mb-4 block">🖼️</span>
            <p>Bu bölümde görüntü bulunamadı.</p>
          </div>
        ) : mode === 'scroll' ? (
          /* Scroll Mode – all pages stacked */
          <div className="space-y-2">
            {images.map((img, i) => (
              <img
                key={img}
                src={`/manga/${slug}/${chapter}/${img}`}
                alt={`Sayfa ${i + 1}`}
                className="w-full h-auto block"
                loading={i < 2 ? 'eager' : 'lazy'}
              />
            ))}
          </div>
        ) : (
          /* Page Mode */
          <div>
            <div className="relative">
              <img
                src={`/manga/${slug}/${chapter}/${images[pageIndex]}`}
                alt={`Sayfa ${pageIndex + 1}`}
                className="w-full h-auto block"
              />
            </div>
            <div className="flex items-center justify-between mt-4">
              <button
                onClick={prev}
                disabled={pageIndex === 0}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg text-sm transition-colors"
              >
                ← Önceki Sayfa
              </button>
              <span className="text-sm text-gray-500">
                {pageIndex + 1} / {images.length}
              </span>
              <button
                onClick={next}
                disabled={pageIndex === images.length - 1}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg text-sm transition-colors"
              >
                Sonraki Sayfa →
              </button>
            </div>
          </div>
        )}

        {/* Bottom chapter nav */}
        <div className="flex justify-between mt-8 pt-4 border-t border-gray-800">
          {prevChapter ? (
            <Link href={`/manga/${slug}/${prevChapter}`} className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition-colors">
              ← {prevChapter.replace(/[-_]/g, ' ')}
            </Link>
          ) : <div />}
          {nextChapter ? (
            <Link href={`/manga/${slug}/${nextChapter}`} className="flex items-center gap-2 px-4 py-2 bg-red-800 hover:bg-red-700 rounded-lg text-sm transition-colors">
              {nextChapter.replace(/[-_]/g, ' ')} →
            </Link>
          ) : <div />}
        </div>
      </div>
    </Layout>
  );
}