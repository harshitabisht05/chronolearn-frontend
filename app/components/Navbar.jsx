'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    router.push('/login');
  };

  const go = (path) => () => router.push(path);

  const navButton =
    'text-sm px-4 py-1.5 font-medium text-white border border-transparent rounded-md hover:text-violet-400 hover:border-violet-400 transition duration-200';

  const isPlaylistPage = /^\/playlist\/[^/]+(\/(calendar|analytics)?)?$/.test(pathname);

  const renderLinks = () => {
    if (isPlaylistPage) {
      return (
        <>
          <button onClick={go('/')} className={navButton}>Home</button>
          <button onClick={go('/dashboard')} className={navButton}>Dashboard</button>
          <button onClick={go('/import')} className={navButton}>Upload</button>
          <button onClick={logout} className="text-sm px-4 py-1.5 font-medium text-red-400 hover:text-red-600 transition">Logout</button>
        </>
      );
    }

    if (pathname === '/') {
      return (
        <>
          <button
            onClick={() =>
              document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
            }
            className={navButton}
          >
            Features
          </button>

          {isLoggedIn ? (
            <>
              <button onClick={go('/dashboard')} className={navButton}>Dashboard</button>
              <button onClick={go('/import')} className={navButton}>Upload</button>
              <button onClick={logout} className="text-sm px-4 py-1.5 font-medium text-red-400 hover:text-red-600 transition">Logout</button>
            </>
          ) : (
            <>
              <button onClick={go('/login')} className={navButton}>Login</button>
              <button onClick={go('/register')} className={navButton}>Register</button>
            </>
          )}
        </>
      );
    }

    if (pathname === '/login' || pathname === '/register') {
      return (
        <>
          <button onClick={go('/')} className={navButton}>Home</button>
          <button onClick={go(pathname === '/login' ? '/register' : '/login')} className={navButton}>
            {pathname === '/login' ? 'Register' : 'Login'}
          </button>
        </>
      );
    }

    if (pathname === '/import' || pathname === '/dashboard') {
      return (
        <>
          <button onClick={go('/')} className={navButton}>Home</button>
          <button onClick={go(pathname === '/import' ? '/dashboard' : '/import')} className={navButton}>
            {pathname === '/import' ? 'Dashboard' : 'Upload'}
          </button>
          <button onClick={logout} className="text-sm px-4 py-1.5 font-medium text-red-400 hover:text-red-600 transition">Logout</button>
        </>
      );
    }

    return null;
  };

  const links = useMemo(() => renderLinks(), [pathname, isLoggedIn]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const loggedIn = !!token;
    if (loggedIn !== isLoggedIn) setIsLoggedIn(loggedIn);
    if (!isAuthChecked) setIsAuthChecked(true);
    setIsMenuOpen(false); // Close menu on route change
  }, [pathname]);

  if (!isAuthChecked) return null;

  return (
    <nav className="flex justify-center px-4 py-4 sticky top-4 z-50">
      <div className="flex items-center justify-between gap-x-6 bg-white/10 backdrop-blur-md rounded-full border border-white/20 shadow-md px-6 py-2 max-w-fit">

        {/* Left side */}
        <h1
          onClick={go('/')}
          style={{ fontFamily: 'var(--font-manrope)' }}
          className="text-white font-bold text-lg cursor-pointer"
        >
          ChronoLearn
        </h1>

        {/* Desktop Menu */}
        <div style={{ fontFamily: 'var(--font-manrope)' }} className="hidden md:flex items-center gap-x-4">
          {links}
        </div>

        {/* Mobile Hamburger */}
        <div style={{ fontFamily: 'var(--font-manrope)' }} className="md:hidden relative">
          <button
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="text-white"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-black/50 backdrop-blur-md border border-white/20 rounded-xl shadow-xl p-4 flex flex-col gap-3 z-50 transition-all duration-200">
              {links}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
