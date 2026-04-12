'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Search, ShoppingCart, LogIn, LogOut, User, LayoutDashboard, Settings } from 'lucide-react';
import { useCart } from '@/lib/cartContext';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/authContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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
            <div className="h-9 w-9 rounded-xl bg-background/70 ring-1 ring-border/40 shadow-sm overflow-hidden">
              <Image
                src="/logo.png"
                alt="Persomith"
                width={36}
                height={36}
                className="h-full w-full object-contain"
                priority
              />
            </div>
            <div className="hidden sm:block leading-tight">
              <div className="font-black text-lg tracking-tight text-foreground">Persomith</div>
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
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-muted/60 transition-colors focus:outline-none">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatarUrl || ''} alt={user.firstName} />
                        <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                          {user.firstName.charAt(0)}{user.lastName?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="hidden md:flex flex-col items-start leading-none gap-1">
                        <span className="text-sm font-medium leading-none">{user.firstName} {user.lastName}</span>
                        <span className="text-xs text-muted-foreground leading-none capitalize">{user.role}</span>
                      </div>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.firstName} {user.lastName}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link href="/account/dashboard">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link href="/account/settings">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => logout()} 
                      className="cursor-pointer text-destructive focus:bg-destructive/10"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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
