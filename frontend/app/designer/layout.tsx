'use client';

import * as React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Home } from 'lucide-react';

import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { DesignerSidebar } from '@/components/designer-sidebar';
import { useAuth } from '@/lib/authContext';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

const PAGE_NAMES: Record<string, string> = {
  '/designer': 'Dashboard',
  '/designer/designs': 'My Designs',
  '/designer/orders': 'Orders',
  '/designer/settings': 'Profile & Settings',
};

export default function DesignerLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  React.useEffect(() => {
    if (!loading) {
      if (!user || !['DESIGNER', 'ADMIN'].includes(String(user.role).toUpperCase())) {
        router.push('/');
      } else if (user.mustChangePassword) {
        router.push('/auth/onboarding');
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
          <p className="text-sm text-muted-foreground font-medium">Loading Designer Studio...</p>
        </div>
      </div>
    );
  }

  if (!user || !['DESIGNER', 'ADMIN'].includes(String(user.role).toUpperCase()) || user.mustChangePassword) {
    return null;
  }

  const pageName =
    PAGE_NAMES[pathname] ??
    PAGE_NAMES[Object.keys(PAGE_NAMES).find((k) => k !== '/designer' && pathname.startsWith(k)) ?? ''] ??
    'Designer';

  return (
    <SidebarProvider>
      <DesignerSidebar />
      <SidebarInset className="bg-background">
        <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 border-b border-border/20 bg-background/60 backdrop-blur-md px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="h-4 w-[1px] bg-border/40 mx-1" />
          <div className="hidden md:flex flex-1 items-center">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/designer" className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 hover:text-primary transition-colors">
                    <Home className="h-3 w-3" />
                    Studio
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {pathname !== '/designer' && (
                  <>
                    <BreadcrumbSeparator className="opacity-40" />
                    <BreadcrumbItem>
                      <BreadcrumbPage className="text-[10px] font-black uppercase tracking-widest text-foreground/80">{pageName}</BreadcrumbPage>
                    </BreadcrumbItem>
                  </>
                )}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="flex flex-1 md:hidden" />
          <div className="flex items-center gap-3">
            <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-[10px] font-black shadow-inner ring-1 ring-primary/20 cursor-pointer">
              {user.firstName?.charAt(0) || 'D'}
            </div>
          </div>
        </header>
        <main className="p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-[1600px] animate-in fade-in slide-in-from-bottom-2 duration-500">
            {children}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
