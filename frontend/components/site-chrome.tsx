'use client';

import { usePathname } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { ThreeBackground } from '@/components/three-background';

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isStudioRoute = pathname?.startsWith('/admin') || pathname?.startsWith('/designer');

  if (isStudioRoute) {
    // Admin and Designer have their own full-page layouts
    return <>{children}</>;
  }

  return (
    <>
      <ThreeBackground />
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </>
  );
}
