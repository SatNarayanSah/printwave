'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { productsApi, cartApi } from '@/lib/api';

const ProductDetailPage = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await productsApi.getBySlug(slug as string);
        const data = response.data;
        setProduct(data);
        if (data?.sizes?.length > 0) setSelectedSize(data.sizes[0]);
        if (data?.colors?.length > 0) setSelectedColor(data.colors[0].name);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchProduct();
  }, [slug]);

  const handleAddToCart = async () => {
    setAddingToCart(true);
    setSuccessMsg(null);
    try {
      await cartApi.addItem({
        productId: product.id,
        quantity,
        variantInfo: { size: selectedSize, color: selectedColor }
      });
      setSuccessMsg("Added to your cart!");
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      alert(err.message || "Please sign in to add items to your cart.");
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-24 min-h-screen flex flex-col lg:flex-row gap-20 animate-pulse">
        <div className="flex-[1.2] aspect-[4/5] bg-surface rounded-[3.5rem] border border-divider/40" />
        <div className="flex-1 space-y-10 pt-10">
            <div className="space-y-4">
               <div className="h-6 bg-surface rounded-full w-1/4" />
               <div className="h-16 bg-surface rounded-2xl w-3/4" />
            </div>
            <div className="h-8 bg-surface rounded-xl w-1/3" />
            <div className="h-40 bg-surface rounded-3xl w-full" />
            <div className="h-20 bg-surface rounded-2xl w-full" />
        </div>
    </div>
  );

  if (error || !product) return (
    <div className="w-full max-w-7xl mx-auto px-4 py-32 text-center">
        <div className="w-24 h-24 bg-error/10 text-error rounded-full flex items-center justify-center mx-auto mb-10 shadow-2xl">
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-12 h-12">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
           </svg>
        </div>
        <h2 className="text-5xl font-black text-main tracking-tighter mb-4">Product Not Found</h2>
        <p className="text-xl text-muted font-medium mb-12 leading-relaxed">{error || "The product you are looking for doesn't exist."}</p>
        <Link href="/products" className="px-12 py-5 rounded-2xl bg-accent text-white font-black uppercase tracking-widest shadow-2xl shadow-accent/20 hover:scale-105 transition-all inline-block">Back to Showcase</Link>
    </div>
  );

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-20">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-3 text-sm font-bold text-muted mb-12">
         <Link href="/" className="hover:text-accent transition-colors">Home</Link>
         <div className="w-1 h-1 bg-divider rounded-full" />
         <Link href="/products" className="hover:text-accent transition-colors">Products</Link>
         <div className="w-1 h-1 bg-divider rounded-full" />
         <span className="text-main truncate max-w-[200px]">{product.name}</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-16 xl:gap-24">
        {/* Gallery */}
        <div className="flex-[1.2] space-y-8">
           <div className="aspect-[4/5] bg-white rounded-[3.5rem] overflow-hidden shadow-2xl border-4 border-white relative group">
              <img 
                src={product.baseImage || "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=1200"} 
                alt={product.name} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute top-8 left-8 p-4 bg-white/80 backdrop-blur-md rounded-2xl border border-white/50 text-[10px] font-black uppercase tracking-widest text-text-main shadow-lg">
                 Professional Grade
              </div>
           </div>
           
           <div className="grid grid-cols-4 gap-6">
              {[1,2,3,4].map(i => (
                  <div key={i} className="aspect-square bg-white rounded-3xl overflow-hidden border-2 border-divider/20 cursor-pointer hover:border-accent transition-all hover:scale-105 shadow-sm">
                     <img 
                       src={product.baseImage || "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=200"} 
                       alt={`View ${i}`} 
                       className="w-full h-full object-cover opacity-60 hover:opacity-100 transition-opacity"
                     />
                  </div>
              ))}
           </div>
        </div>

        {/* Info Area */}
        <div className="flex-1 flex flex-col pt-4">
           <div className="space-y-6 mb-12">
              <div className="flex items-center gap-3">
                 <span className="px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent font-black text-[10px] uppercase tracking-widest">{product.category?.name || "Premium"}</span>
                 <div className="h-1 w-1 bg-border rounded-full" />
                 <span className="text-xs font-bold text-success uppercase tracking-widest">In Stock</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-black text-text-main leading-[1.1] tracking-tighter">{product.name}</h1>
              
              <div className="flex flex-wrap items-center gap-8">
                 <span className="text-4xl font-black text-text-main tracking-tighter">${product.basePrice}</span>
                 <div className="h-10 w-px bg-border hidden sm:block" />
                 <div className="flex items-center gap-3">
                    <div className="flex items-center text-accent">
                       {[...Array(5)].map((_, i) => (
                           <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                              <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                           </svg>
                       ))}
                    </div>
                    <span className="text-sm text-text-secondary font-black uppercase tracking-tighter">120+ Verified Reviews</span>
                 </div>
              </div>
              
              <p className="text-lg text-text-secondary leading-relaxed font-medium pt-4 border-t border-border/60">
                 {product.description || "Our premium quality items are designed to feel comfortable and look great. Made with soft materials for ultimate comfort and high-definition printing for vibrant colors that won't fade."}
              </p>
           </div>

           <div className="space-y-12 mb-12">
              {/* Color Picker */}
              <div className="space-y-4">
                 <label className="text-xs font-black text-text-main uppercase tracking-widest block">Choose Variant Color</label>
                 <div className="flex flex-wrap items-center gap-4">
                    {['#1F2937', '#4ECDC4', '#FFFFFF', '#64748B'].map(color => (
                        <button 
                          key={color} 
                          className={`w-12 h-12 rounded-2xl border-4 p-1.5 transition-all hover:scale-110 shadow-sm ${selectedColor === color ? 'border-accent rotate-6 shadow-xl' : 'border-transparent'}`}
                          onClick={() => setSelectedColor(color)}
                        >
                           <div className="w-full h-full rounded-xl shadow-inner border border-black/5" style={{ backgroundColor: color }} />
                        </button>
                    ))}
                 </div>
              </div>

              {/* Size Selector */}
              <div className="space-y-4">
                 <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-black text-text-main uppercase tracking-widest">Select Size</label>
                    <button className="text-[10px] font-black text-accent uppercase tracking-widest underline underline-offset-4 hover:text-accent-hover transition-colors">Size Guide</button>
                 </div>
                 <div className="flex flex-wrap gap-3">
                    {['XS', 'S', 'M', 'L', 'XL', '2XL'].map(size => (
                        <button 
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${
                            selectedSize === size 
                              ? 'bg-accent text-white shadow-2xl shadow-accent/20 scale-105' 
                              : 'bg-white text-text-secondary hover:bg-primary-bg border-2 border-divider/50'
                          }`}
                        >
                           {size}
                        </button>
                    ))}
                 </div>
              </div>

              {/* Quantity and CTA */}
              <div className="flex flex-col sm:flex-row items-stretch gap-6 pt-6 border-t border-divider/60">
                 <div className="flex items-center bg-white rounded-2xl border-2 border-divider/50 p-2 shadow-sm min-w-[160px]">
                    <button 
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="w-12 h-12 flex items-center justify-center rounded-xl bg-primary-bg hover:bg-border transition-colors text-text-main"
                    >
                       <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M18 12H6" />
                       </svg>
                    </button>
                    <span className="w-12 text-center font-black text-xl text-text-main">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(q => q + 1)}
                      className="w-12 h-12 flex items-center justify-center rounded-xl bg-primary-bg hover:bg-border transition-colors text-text-main"
                    >
                       <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                       </svg>
                    </button>
                 </div>

                 <button 
                    onClick={handleAddToCart}
                    disabled={addingToCart}
                    className="flex-grow py-5 px-10 rounded-2xl bg-text-main text-white font-black text-xl hover:bg-black transition-all transform active:scale-95 flex items-center justify-center gap-4 disabled:opacity-75 shadow-2xl shadow-black/20"
                 >
                    {addingToCart ? (
                        <span className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                           <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                        </svg>
                    )}
                    {addingToCart ? "Adding to Cart..." : "Add to Cart Now"}
                 </button>
              </div>

              {successMsg && (
                 <div className="p-5 rounded-[2rem] bg-success/10 border border-success/20 text-success text-sm font-black flex items-center justify-center gap-4 animate-bounce">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-6 h-6">
                       <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                    {successMsg}
                 </div>
              )}
           </div>

           {/* Features Grid */}
           <div className="grid grid-cols-2 gap-6 mt-auto">
              <div className="flex items-center gap-4 p-6 bg-white rounded-3xl border border-divider/40 shadow-sm group">
                 <div className="w-12 h-12 rounded-2xl bg-primary-bg flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                       <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.129-1.125V11.25c0-4.446-3.505-8.103-7.75-8.103a7.712 7.712 0 0 0-4.636 1.547M15.75 18.75H8.25m8.25-11.25H12m8.531 6H12m8.531-3H12M8.25 7.5l-3 3M8.25 7.5l3 3m-3-3v11.25" />
                    </svg>
                 </div>
                 <div>
                    <span className="block font-black text-sm text-text-main uppercase tracking-tighter">Free Shipping</span>
                    <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest leading-none">On orders over $50</span>
                 </div>
              </div>
              <div className="flex items-center gap-4 p-6 bg-white rounded-3xl border border-divider/40 shadow-sm group">
                 <div className="w-12 h-12 rounded-2xl bg-primary-bg flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                   </svg>
                 </div>
                 <div>
                    <span className="block font-black text-sm text-text-main uppercase tracking-tighter">Quality Guarantee</span>
                    <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest leading-none">Premium Materials</span>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
