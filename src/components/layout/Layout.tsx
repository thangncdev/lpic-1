import { Outlet } from 'react-router-dom';
import Header from './Header';

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8">
        <Outlet />
      </main>
      <footer className="text-center text-xs text-gray-400 py-4">
        LPIC-1 Practice — 101 & 102
      </footer>
    </div>
  );
}
