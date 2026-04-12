'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Search, ShoppingCart, LogIn, LogOut, User, Sparkles } from 'lucide-react';
import { useCart } from '@/lib/cartContext';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/authContext';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { itemCount } = useCart();
  const { user, logout } = useAuth();

  const menuItems = [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/shop' },
    { label: 'Categories', href: '/shop?tab=categories' },
    { label: 'Blog', href: '/blog' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/40 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-sm">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <div className="hidden sm:block leading-tight">
              <div className="font-black text-lg tracking-tight text-foreground">PrintWave</div>
              <div className="text-[11px] text-muted-foreground -mt-0.5">Studio-quality printing</div>
            </div>
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <Link
                key={`${item.label}-${item.href}`}
                href={item.href}
                className="text-sm text-foreground hover:text-primary transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-muted/60 rounded-lg transition-colors hidden sm:block">
              <Search className="w-5 h-5 text-foreground" />
            </button>

            {user ? (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  href="/account/orders"
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted/60 text-sm"
                >
                  <User className="w-4 h-4" />
                  <span className="max-w-28 truncate">{user.firstName}</span>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => logout()}
                  className="hidden md:inline-flex"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <Link href="/auth/login" className="hidden sm:inline-flex">
                <Button variant="outline" size="sm">
                  <LogIn className="w-4 h-4 mr-2" />
                  Login
                </Button>
              </Link>
            )}

            <Link href="/cart" className="relative p-2 hover:bg-muted/60 rounded-lg transition-colors">
              <ShoppingCart className="w-5 h-5 text-foreground" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

          {/* Mobile menu button */}
          <button
              className="p-2 md:hidden hover:bg-muted/60 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-foreground" />
              ) : (
                <Menu className="w-5 h-5 text-foreground" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden pb-4 space-y-2">
            {menuItems.map((item) => (
              <Link
                key={`${item.label}-${item.href}`}
                href={item.href}
                className="block px-4 py-2 text-sm text-foreground hover:bg-muted/60 rounded transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}

            <div className="pt-2 border-t border-border">
              {user ? (
                <>
                  <Link
                    href="/account/orders"
                    className="block px-4 py-2 text-sm text-foreground hover:bg-muted/60 rounded transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    My Account
                  </Link>
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted/60 rounded transition-colors"
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  href="/auth/login"
                  className="block px-4 py-2 text-sm text-foreground hover:bg-muted/60 rounded transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
