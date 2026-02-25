import Link from 'next/link';
import { ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-950 text-gray-100">
      <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-red-500 hover:text-red-400 transition-colors">
            <span className="text-2xl">📚</span>
            <span>MangaAnka</span>
          </Link>
          <nav className="flex items-center gap-4 text-sm text-gray-400">
            <Link href="/" className="hover:text-white transition-colors">Ana Sayfa</Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        {children}
      </main>
      <footer className="bg-gray-900 border-t border-gray-800 py-4 text-center text-sm text-gray-600">
        MangaAnka &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}
