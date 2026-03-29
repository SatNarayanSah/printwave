'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { productsApi } from '@/lib/api';

const Home = () => {
   const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const fetchFeatured = async () => {
         try {
            const response = await productsApi.getAll(1, 4);
            setFeaturedProducts(response.data.items || []);
         } catch (err) {
            console.error("Error fetching featured products", err);
         } finally {
            setLoading(false);
         }
      };
      fetchFeatured();
   }, []);

   return (
      <div className="min-h-screen bg-primary-bg relative overflow-hidden font-sans">
         {/* Minimal Texture Overlay */}
         <div className="noise-texture opacity-20" />

         {/* Hero Section - Professional Scale */}
         <section className="relative min-h-[85vh] flex items-center justify-center pt-20 pb-12">
            <div className="container-wide relative z-10">
               <div className="flex flex-col lg:grid lg:grid-cols-12 gap-12 items-center">
                  {/* Content Side - Smaller, Professional Typography */}
                  <div className="lg:col-span-6 space-y-8 text-center lg:text-left reveal">
                     <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-md bg-secondary-bg border border-divider text-main font-bold text-[10px] uppercase tracking-widest shadow-sm">
                        <span>EST. 2026</span>
                        <div className="w-1 h-1 bg-divider rounded-full" />
                        <span>Professional Studio</span>
                     </div>

                     <h1 className="text-5xl md:text-6xl lg:text-[4.5rem] font-black tracking-tight text-main leading-[1.05]">
                        Professional Design <br />
                        <span className="opacity-40 font-bold italic">Curated Quality</span>.
                     </h1>

                     <p className="text-lg md:text-xl text-muted max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
                        High-definition professional printing for discerning creators. Transform your visionary ideas into premium, durable physical products.
                     </p>

                     <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                        <Link href="/products" className="group w-full sm:w-auto px-8 py-4 rounded-xl bg-main text-white font-bold text-sm shadow-premium hover:bg-black transition-all flex items-center justify-center gap-2">
                           Explore Collection
                           <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="m13 5 7 7-7 7M5 5l7 7-7 7" /></svg>
                        </Link>
                        <Link href="/designs" className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white text-main font-bold text-sm border-2 border-divider hover:border-main transition-all text-center">
                           Design Studio
                        </Link>
                     </div>

                     {/* Metrics Row - Refined Scale */}
                     <div className="grid grid-cols-3 gap-6 pt-10 border-t border-divider">
                        <div className="space-y-0.5">
                           <span className="block text-2xl font-bold text-main tracking-tighter">25k+</span>
                           <span className="text-[9px] font-bold text-muted uppercase tracking-widest block leading-none">Global Clients</span>
                        </div>
                        <div className="space-y-0.5">
                           <span className="block text-2xl font-bold text-main tracking-tighter">99%</span>
                           <span className="text-[9px] font-bold text-muted uppercase tracking-widest block leading-none">Accuracy</span>
                        </div>
                        <div className="space-y-0.5">
                           <span className="block text-2xl font-bold text-main tracking-tighter">48h</span>
                           <span className="text-[9px] font-bold text-muted uppercase tracking-widest block leading-none">Fulfillment</span>
                        </div>
                     </div>
                  </div>

                  {/* Visual Side - Structural & Professional */}
                  <div className="lg:col-span-6 relative flex items-center justify-center reveal reveal-delay-2 perspective-1000">
                     <div className="relative w-full max-w-[480px] aspect-[4/5] group">
                        <div className="w-full h-full bg-white rounded-3xl shadow-premium overflow-hidden border border-divider group-hover:shadow-2xl transition-all duration-700 hover:scale-[1.02]">
                           <img src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=1000" className="w-full h-full object-cover" alt="Elite Print Showcase" />
                           {/* Label Overlay */}
                           <div className="absolute top-8 left-8 p-4 glass rounded-xl border border-divider shadow-sm z-30">
                              <span className="text-[9px] font-black uppercase tracking-widest text-main opacity-50 block mb-1">Current Collection</span>
                              <span className="text-xs font-bold text-main">Premium Cotton Series 01</span>
                           </div>
                        </div>
                        {/* Decorative background shape */}
                        <div className="absolute inset-0 -translate-x-6 translate-y-6 bg-secondary-bg rounded-3xl -z-10 border border-divider shadow-sm" />
                     </div>
                  </div>
               </div>
            </div>
         </section>

         {/* Collection Grid - Minimal Professional Layout */}
         <section className="py-20 bg-white border-t border-divider relative z-20">
            <div className="container-wide">
               <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                  <div className="space-y-3">
                     <span className="text-[9px] font-black text-muted uppercase tracking-[0.3em]">Studio Showcase</span>
                     <h2 className="text-3xl md:text-4xl font-black text-main tracking-tighter">Featured Works</h2>
                  </div>
                  <Link href="/products" className="text-xs font-black uppercase tracking-widest hover:text-muted transition-colors border-b-2 border-main pb-1">
                     View Complete Collection
                  </Link>
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {loading ? (
                     [...Array(4)].map((_, i) => (
                        <div key={i} className="aspect-[4/5] rounded-2xl bg-secondary-bg animate-pulse border border-divider" />
                     ))
                  ) : (
                     featuredProducts.map((p, idx) => (
                        <Link 
                           key={p.id} 
                           href={`/products/${p.slug}`} 
                           className="group flex flex-col space-y-4 reveal" 
                           style={{ animationDelay: `${idx * 0.1}s` }}
                        >
                           <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-secondary-bg border border-divider transition-all duration-500 hover:shadow-2xl group-hover:-translate-y-1">
                              <img src={p.baseImage || "https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&q=80&w=600"} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt={p.name} />
                           </div>
                           <div className="flex flex-col space-y-1 px-1">
                              <div className="flex items-center justify-between">
                                 <span className="text-[9px] font-bold text-muted uppercase tracking-widest">{p.category?.name || "Original Design"}</span>
                                 <span className="text-xs font-bold text-main">${p.basePrice}</span>
                              </div>
                              <h3 className="text-sm font-bold text-main truncate hover:text-muted transition-colors">{p.name}</h3>
                           </div>
                        </Link>
                     ))
                  )}
               </div>
            </div>
         </section>

         {/* Studio Invitation - Refined Professional Scale */}
         <section className="bg-secondary-bg py-20 border-t border-divider">
            <div className="container-wide">
               <div className="max-w-4xl mx-auto text-center space-y-8 reveal">
                  <h3 className="text-10 font-black text-main uppercase tracking-[0.4em] opacity-40">The Workshop</h3>
                  <h2 className="text-4xl md:text-5xl font-black text-main tracking-tighter leading-none">Your Artwork. <br /> Our Standard.</h2>
                  <p className="text-lg text-muted font-medium max-w-2xl mx-auto leading-relaxed">
                     Zero compromise quality. Upload your designs to our studio and we'll handle the architectural precision of the physical print. 
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                     <Link href="/designs" className="px-10 py-4 rounded-xl bg-main text-white font-bold text-sm shadow-premium hover:bg-black transition-all">
                        Design Now
                     </Link>
                     <Link href="/help/quality" className="px-10 py-4 rounded-xl border-2 border-divider text-main font-bold text-sm bg-white hover:border-main transition-all">
                        Quality Report
                     </Link>
                  </div>
               </div>
            </div>
         </section>

         {/* Trust Section - Static & Clean */}
         <div className="bg-white py-12 border-t border-divider overflow-hidden">
            <div className="container-wide flex flex-wrap justify-between items-center gap-10 opacity-30 grayscale pointer-events-none select-none">
               {['VOGUE', 'ADIDAS', 'NIQUE', 'PRADA', 'SPOT_MODERN'].map(brand => (
                  <span key={brand} className="text-base font-black tracking-[0.3em]">{brand}</span>
               ))}
            </div>
         </div>
      </div>
   );
};

export default Home;
