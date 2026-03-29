'use client';

import Link from 'next/link';
import React from 'react';
import { usePathname } from 'next/navigation';

const Footer = () => {
    const pathname = usePathname();
    if (pathname?.startsWith('/admin')) return null;

    return (
        <footer className="bg-white pt-20 pb-12 border-t border-divider relative overflow-hidden">
            <div className="container-wide relative z-10 text-main">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-20">
                    <div className="lg:col-span-5 space-y-8">
                        <Link href="/" className="group flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-lg bg-main flex items-center justify-center shadow-premium group-hover:bg-black transition-colors">
                                <span className="text-white text-xl font-black">P</span>
                            </div>
                            <div className="flex flex-col -space-y-0.5">
                                <span className="text-xl font-black tracking-tighter">PrintWave</span>
                                <span className="text-[8px] font-black text-muted uppercase tracking-[0.4em]">Essential Prints</span>
                            </div>
                        </Link>
                        
                        <p className="text-muted text-base leading-relaxed max-w-sm font-medium">
                            Professional custom printing services for creators and businesses. We bring structural precision to every physical canvas.
                        </p>
                        
                        <div className="flex items-center gap-2">
                            {['TW', 'IG', 'FB', 'YT'].map((social) => (
                                <a key={social} href="#" className="w-10 h-10 rounded-lg border border-divider flex items-center justify-center text-main hover:bg-main hover:text-white transition-all">
                                    <span className="text-[10px] font-black">{social}</span>
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="lg:col-span-2 space-y-6">
                        <h3 className="text-[10px] font-black text-main uppercase tracking-[0.3em] opacity-40">Collection</h3>
                        <ul className="space-y-4">
                            {['T-Shirts', 'Mugs', 'Posters', 'Stickers'].map((item) => (
                                <li key={item}>
                                    <Link href={`/products?category=${item.toLowerCase()}`} className="text-muted font-bold text-sm hover:text-main transition-colors inline-block">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="lg:col-span-2 space-y-6">
                        <h3 className="text-[10px] font-black text-main uppercase tracking-[0.3em] opacity-40">Support</h3>
                        <ul className="space-y-4">
                            {['Help Center', 'Shipping', 'Returns', 'Contact'].map((item) => (
                                <li key={item}>
                                    <Link href={`/${item.toLowerCase().replace(' ', '-')}`} className="text-muted font-bold text-sm hover:text-main transition-colors inline-block">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="lg:col-span-3 space-y-6">
                        <h3 className="text-[10px] font-black text-main uppercase tracking-[0.3em] opacity-40">Newsletter</h3>
                        <p className="text-muted text-sm font-bold leading-relaxed">
                            Join our inner circle for exclusive professional drops.
                        </p>
                        <form className="space-y-3">
                            <input 
                                type="email" 
                                placeholder="Email address" 
                                className="w-full px-5 py-3.5 rounded-xl bg-secondary-bg border-2 border-transparent focus:border-main text-sm font-bold transition-all outline-none"
                            />
                            <button className="w-full px-5 py-3.5 rounded-xl bg-main text-white text-[11px] font-black uppercase tracking-[0.2em] hover:bg-black transition-all shadow-premium">
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>

                <div className="pt-12 border-t border-divider flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-[10px] font-bold text-muted uppercase tracking-[0.2em]">
                        © {new Date().getFullYear()} PrintWave Studio. Built for Creators.
                    </p>
                    <div className="flex items-center gap-8">
                        <Link href="/privacy" className="text-[10px] font-bold text-muted hover:text-main uppercase tracking-widest transition-colors">Privacy Information</Link>
                        <Link href="/terms" className="text-[10px] font-bold text-muted hover:text-main uppercase tracking-widest transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
