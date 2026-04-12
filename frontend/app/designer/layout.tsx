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
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-2 border-b border-border/40 bg-background/80 backdrop-blur-md px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="h-4 w-[1px] bg-border/60 mx-1" />
          <div className="hidden md:flex flex-1 items-center">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/designer" className="flex items-center gap-1">
                    <Home className="h-3.5 w-3.5" />
                    Designer
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {pathname !== '/designer' && (
                  <>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>{pageName}</BreadcrumbPage>
                    </BreadcrumbItem>
                  </>
                )}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="flex flex-1 md:hidden" />
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold shadow ring-2 ring-orange-500/20 cursor-pointer">
              {user.name?.charAt(0) || 'D'}
            </div>
          </div>
        </header>
        <main className="p-6 md:p-8">
          <div className="mx-auto max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
