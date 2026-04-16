import { Link, useLocation } from 'react-router-dom';

export default function Header() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <header className="bg-gray-900 text-white shadow-md">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <span className="text-2xl">🐧</span>
          <span className="font-bold text-lg tracking-tight">LPIC-1 Practice</span>
        </Link>
        {!isHome && (
          <Link
            to="/"
            className="text-sm text-gray-300 hover:text-white transition-colors"
          >
            ← Home
          </Link>
        )}
      </div>
    </header>
  );
}
