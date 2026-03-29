'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { authApi } from '@/lib/api';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const response = await authApi.getMe();
        if (response.data?.user?.role === 'ADMIN') {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
          router.push('/');
        }
      } catch (err) {
        setIsAdmin(false);
        router.push('/auth/login');
      }
    };
    checkAdmin();
  }, [router]);

  if (isAdmin === null) {
    return (
      <div className="min-h-screen bg-primary-bg flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-divider border-t-main rounded-full animate-spin" />
      </div>
    );
  }

  if (isAdmin === false) return null; // router redirect handles this

  const menuItems = [
    { name: 'Dashboard', href: '/admin', icon: 'M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z' },
    { name: 'Products', href: '/admin/products', icon: 'M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z' },
    { name: 'Orders', href: '/admin/orders', icon: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z' },
    { name: 'Designs', href: '/admin/designs', icon: 'M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.41 2.26-4.39C12.92 3.04 12.46 3 12 3zm4.5 14c-2.48 0-4.5-2.02-4.5-4.501C12 10.018 14.02 8 16.5 8c.55 0 1.07.1 1.56.28-.9 2.5-3.19 4.41-5.99 4.96.94 1.77 2.8 2.96 4.93 2.96.53 0 1.05-.09 1.54-.25-.38.64-.92 1.18-1.54 1.55z' }
  ];

  return (
    <div className="fixed inset-0 bg-[#f1f5f9] flex overflow-hidden font-sans z-[100]">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex-shrink-0 z-20 flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
             <div className="w-6 h-6 rounded bg-main text-white flex items-center justify-center font-black text-xs group-hover:bg-black transition-colors">P</div>
             <span className="font-black text-main tracking-tight">PrintWave Panel</span>
          </Link>
        </div>
        
        <div className="p-4 flex-1 overflow-y-auto">
          <h2 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 px-2">Analytics & App</h2>
          <nav className="space-y-1.5 flex flex-col pb-2">
            {menuItems.map(item => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg transition-all flex-shrink-0 ${
                    isActive 
                      ? 'bg-main text-white shadow-md shadow-main/20 scale-[0.98]' 
                      : 'text-slate-500 hover:bg-slate-50 hover:text-main'
                  }`}
                >
                  <svg className={`w-4 h-4 ${isActive ? 'fill-white' : 'fill-current'}`} viewBox="0 0 24 24"><path d={item.icon}/></svg>
                  <span className="text-xs font-bold tracking-tight">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50 mt-auto">
           <Link href="/" className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 text-main text-[10px] font-black uppercase tracking-widest rounded-lg hover:border-main transition-colors hover:text-main shrink-0">
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3"><path fillRule="evenodd" d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z" clipRule="evenodd" /></svg>
             Back to Store
           </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 w-full flex flex-col h-screen overflow-hidden relative">
         <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-10 flex items-center justify-between px-8">
            <h1 className="text-xs font-black text-slate-800 uppercase tracking-widest">Administrator View</h1>
            <div className="flex items-center gap-3">
               <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
               <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">System Online</span>
            </div>
         </header>
         <div className="flex-1 overflow-y-auto p-6 lg:p-10 w-full">
           <div className="max-w-6xl mx-auto w-full pb-20">
             {children}
           </div>
         </div>
      </main>
    </div>
  );
}
