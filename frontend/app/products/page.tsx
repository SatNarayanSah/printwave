'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { productsApi } from '@/lib/api';

interface Product {
  id: string;
  name: string;
  slug: string;
  basePrice: number | string;
  baseImage?: string;
  category?: { name: string };
}

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { name: 'All Collection', id: 'all' },
    { name: 'T-Shirts', id: 't-shirts' },
    { name: 'Mugs', id: 'mugs' },
    { name: 'Posters', id: 'posters' },
    { name: 'Stickers', id: 'stickers' },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const category = activeCategory === 'all' ? undefined : activeCategory;
        const response = await productsApi.getAll(1, 24, category);
        setProducts(response.data.items || []);
        setError(null);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [activeCategory]);

  return (
    <div className="min-h-screen bg-primary-bg pb-20 pt-32">
       {/* Global Texture */}
       <div className="noise-texture" />

       <div className="container-wide">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 mb-20 reveal">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent font-black text-[10px] uppercase tracking-[0.2em] shadow-sm">
                 Studio Archive
              </div>
              <h1 className="text-6xl md:text-8xl font-black text-main tracking-tighter leading-none">The Collection</h1>
              <p className="text-xl md:text-2xl text-muted font-semibold max-w-2xl leading-relaxed opacity-80">
                 Immersive prints, high-definition materials. Browse our architectural library of premium physical canvases.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-3 glass p-1.5 rounded-[2.5rem] border-white shadow-premium no-scrollbar overflow-x-auto">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-10 py-4 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] transition-all whitespace-nowrap active:scale-95 ${
                    activeCategory === cat.id 
                      ? 'bg-main text-white shadow-2xl' 
                      : 'bg-transparent text-muted hover:text-main hover:bg-white/50'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
                {[...Array(8)].map((_, i) => (
                   <div key={i} className="aspect-[4/5] bg-white rounded-[3.5rem] animate-pulse border-4 border-white shadow-premium" />
                ))}
             </div>
          ) : error ? (
             <div className="py-20 text-center glass rounded-[4rem] border-divider shadow-premium max-w-2xl mx-auto">
                <div className="w-20 h-20 bg-error/10 text-error rounded-full flex items-center justify-center mx-auto mb-6">
                   <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" /></svg>
                </div>
                <h2 className="text-3xl font-black text-main mb-2">Sync Interrupted</h2>
                <p className="text-muted font-bold mb-8">We couldn't reach the design server. Please verify your connection.</p>
                <button onClick={() => window.location.reload()} className="px-12 py-5 rounded-[2rem] bg-main text-white font-black uppercase tracking-widest hover:bg-black transition-all shadow-premium">Reconnect</button>
             </div>
          ) : products.length === 0 ? (
             <div className="py-24 text-center glass rounded-[4rem] border-2 border-dashed border-divider/60 flex flex-col items-center max-w-4xl mx-auto px-10">
                <div className="w-24 h-24 bg-primary-bg rounded-3xl flex items-center justify-center mb-8 rotate-12">
                   <svg className="w-12 h-12 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m6 4.125l-2.25-2.25m0 0l-2.25-2.25M12 13.875l-2.25 2.25M12 13.875l2.25-2.25" /></svg>
                </div>
                <h2 className="text-4xl font-black text-main mb-2 tracking-tight">Archive is Empty</h2>
                <p className="text-xl text-muted font-semibold">No prints found in this category. Our designers are working on new drops. Check back in 24h.</p>
             </div>
          ) : (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
                {products.map((product, idx) => (
                   <Link 
                      key={product.id} 
                      href={`/products/${product.slug}`}
                      className="group relative block aspect-[4/5] perspective-1000 preserve-3d reveal"
                      style={{ animationDelay: `${idx * 0.05}s` }}
                   >
                      <div className="w-full h-full rounded-[4rem] overflow-hidden bg-white border-[10px] border-white shadow-premium transition-all duration-700 group-hover:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] group-hover:rotate-x-12 group-hover:rotate-y-[-10deg] group-hover:-translate-y-4 group-hover:scale-105">
                         <img src={product.baseImage || "https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&q=80&w=800"} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={product.name} />
                         <div className="absolute inset-0 bg-gradient-to-t from-main/90 via-main/0 to-transparent flex flex-col justify-end p-10 opacity-0 group-hover:opacity-100 transition-all duration-500">
                            <span className="text-[10px] font-black text-accent uppercase tracking-widest mb-1">{product.category?.name || "Original Design"}</span>
                            <h3 className="text-3xl font-black text-white mb-6 leading-none">{product.name}</h3>
                            <div className="flex items-center justify-between">
                               <span className="text-3xl font-black text-white decoration-accent decoration-4 underline underline-offset-8">${product.basePrice}</span>
                               <div className="w-14 h-14 bg-accent rounded-2xl flex items-center justify-center text-white shadow-xl transform translate-y-10 group-hover:translate-y-0 transition-all duration-500 delay-100">
                                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M12 4.5v15m7.5-7.5h-15" /></svg>
                               </div>
                            </div>
                         </div>
                      </div>
                   </Link>
                ))}
             </div>
          )}
       </div>
    </div>
  );
};

export default ProductsPage;
