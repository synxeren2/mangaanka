import Link from 'next/link';

type MangaCardProps = {
  slug: string;
  title: string;
  chapterCount: number;
};

export default function MangaCard({ slug, title, chapterCount }: MangaCardProps) {
  return (
    <Link href={`/manga/${slug}`} className="group block bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-red-700 transition-all duration-200 hover:shadow-lg hover:shadow-red-900/20">
      <div className="relative aspect-[2/3] overflow-hidden bg-gray-800">
        <img
          src={`/manga/${slug}/cover.svg`}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const parent = target.parentElement!;
            parent.style.background = 'linear-gradient(135deg, #1f2937, #111827)';
            const fallback = document.createElement('div');
            fallback.className = 'absolute inset-0 flex items-center justify-center text-6xl';
            fallback.textContent = '📖';
            parent.appendChild(fallback);
          }}
        />
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-sm text-white leading-tight line-clamp-2 group-hover:text-red-400 transition-colors">
          {title}
        </h3>
        <p className="text-xs text-gray-500 mt-1">{chapterCount} bölüm</p>
      </div>
    </Link>
  );
}
