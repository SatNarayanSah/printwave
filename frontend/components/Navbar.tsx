'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { authApi } from '@/lib/api';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [userLoading, setUserLoading] = useState(true);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);

    // Fetch current user from the server using the httpOnly cookie
    const fetchUser = async () => {
      try {
        const response = await authApi.getMe();
        setUser(response.data?.user || null);
      } catch {
        setUser(null); // Not logged in or cookie expired
      } finally {
        setUserLoading(false);
      }
    };
    fetchUser();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]); // Re-fetch when route changes

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch { /* ignore */ }
    setUser(null);
    router.push('/');
    router.refresh();
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
    { name: 'Custom Design', href: '/designs' },
    { name: 'Cart', href: '/cart' },
  ];

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
      isScrolled ? 'bg-white/95 backdrop-blur-md py-4 shadow-sm border-b border-divider' : 'bg-transparent py-8'
    }`}>
      <div className="container-wide flex items-center justify-between">
        <Link href="/" className="group flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-main flex items-center justify-center shadow-premium group-hover:bg-black transition-colors">
            <span className="text-white text-xl font-black">P</span>
          </div>
          <div className="flex flex-col -space-y-0.5">
             <span className="text-xl font-black tracking-tighter text-main">PrintWave</span>
             <span className="text-[8px] font-black text-muted uppercase tracking-[0.4em]">Essential Prints</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-1">
          <div className="flex items-center gap-2">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                className={`px-5 py-2 rounded-md text-[11px] font-bold uppercase tracking-widest transition-all ${
                  pathname === link.href 
                    ? 'text-main bg-secondary-bg shadow-sm' 
                    : 'text-muted hover:text-main hover:bg-neutral-50'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
          
          <div className="w-px h-6 bg-divider mx-4" />
          
          <div className="flex items-center gap-4">
            {userLoading ? (
              <div className="w-24 h-8 bg-secondary-bg rounded-lg animate-pulse" />
            ) : user ? (
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-main">{user.firstName}</span>
                {user.role === 'ADMIN' && (
                  <Link 
                    href="/admin"
                    className="px-5 py-2 rounded-lg bg-main text-white text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all"
                  >
                    Admin
                  </Link>
                )}
                <button 
                  onClick={handleLogout}
                  className="px-5 py-2 rounded-lg bg-white text-main text-[10px] font-black uppercase tracking-widest border border-divider hover:border-main transition-all"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link 
                href="/auth/login" 
                className="px-8 py-2.5 rounded-lg bg-main text-white text-[11px] font-black uppercase tracking-widest hover:bg-black transition-all"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Toggle */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden w-10 h-10 rounded-lg bg-white border border-divider text-main shadow-sm flex items-center justify-center transition-all"
        >
          {mobileMenuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-t border-divider shadow-2xl p-6 flex flex-col gap-2">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-6 py-4 rounded-xl text-sm font-bold tracking-tight transition-all ${
                pathname === link.href ? 'bg-main text-white' : 'bg-secondary-bg text-main'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-4 mt-2 border-t border-divider flex flex-col gap-2">
            {user ? (
              <>
                {user.role === 'ADMIN' && (
                  <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="block w-full py-4 text-center rounded-xl bg-secondary-bg text-main font-bold text-sm">
                    Admin Dashboard
                  </Link>
                )}
                <button onClick={handleLogout} className="block w-full py-4 text-center rounded-xl bg-main text-white font-bold text-sm">Logout</button>
              </>
            ) : (
              <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)} className="block w-full py-4 text-center rounded-xl bg-main text-white font-bold text-sm">Sign In</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
