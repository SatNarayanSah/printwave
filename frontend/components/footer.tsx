import Image from 'next/image';
import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border/60 bg-background/40 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="h-9 w-9 rounded-xl bg-background/70 ring-1 ring-border/40 shadow-sm overflow-hidden">
                <Image
                  src="/logo.png"
                  alt="Persomith"
                  width={36}
                  height={36}
                  className="h-full w-full object-contain"
                />
              </div>
              <span className="font-black text-lg tracking-tight">Persomith</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              High-quality print-on-demand products for your business and creative needs.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <Phone className="w-4 h-4" />
                <a href="tel:+1234567890" className="hover:underline">
                  +1 (234) 567-890
                </a>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Mail className="w-4 h-4" />
                <a href="mailto:info@printwave.com" className="hover:underline">
                  info@printwave.com
                </a>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <MapPin className="w-4 h-4" />
                <span>123 Print Street, NY 10001</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold mb-4">Shop</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/shop" className="hover:underline">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/shop?categories=tshirts" className="hover:underline">
                  T-Shirts
                </Link>
              </li>
              <li>
                <Link href="/shop?categories=mugs" className="hover:underline">
                  Mugs
                </Link>
              </li>
              <li>
                <Link href="/shop?categories=hoodies" className="hover:underline">
                  Hoodies
                </Link>
              </li>
              <li>
                <Link href="/shop?categories=hats" className="hover:underline">
                  Hats
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-bold mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/blog" className="hover:underline">
                  Blog
                </Link>
              </li>
              <li>
                <a href="#about" className="hover:underline">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-bold mb-4">Newsletter</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Subscribe to get special offers and updates.
            </p>
            <div className="flex flex-col space-y-2">
              <Input
                type="email"
                placeholder="Your email"
                className="bg-background/50"
              />
              <Button
                size="sm"
                className="bg-primary hover:bg-primary/90 text-primary-foreground w-full"
              >
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-border/60 pt-8 flex flex-col sm:flex-row items-center justify-between">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Persomith. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <a href="#" className="hover:underline text-sm">
              Facebook
            </a>
            <a href="#" className="hover:underline text-sm">
              Instagram
            </a>
            <a href="#" className="hover:underline text-sm">
              Twitter
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
