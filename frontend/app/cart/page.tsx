'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { cartApi } from '@/lib/api';

interface CartItem {
    id: string;
    quantity: number;
    product: {
        name: string;
        basePrice: number | string;
        baseImage?: string;
    };
    variantInfo?: { size?: string; color?: string };
}

interface Cart {
    id: string;
    items: CartItem[];
}

const CartPage = () => {
    const [cart, setCart] = useState<Cart | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCart = async () => {
        setLoading(true);
        try {
            const response = await cartApi.get();
            setCart(response.data);
            setError(null);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Failed to load cart. Are you logged in?");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const handleRemove = async (id: string) => {
        try {
            await cartApi.removeItem(id);
            fetchCart();
        } catch (err: unknown) {
            alert(err instanceof Error ? err.message : "Could not remove item");
        }
    };

    if (loading) return (
        <div className="w-full max-w-7xl mx-auto px-4 py-20 text-center">
            <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted font-medium text-lg">Updating Your Cart...</p>
        </div>
    );

    if (error) return (
        <div className="w-full max-w-7xl mx-auto px-4 py-20 text-center bg-white rounded-[2.5rem] shadow-2xl border border-divider">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-error opacity-50 mx-auto mb-4">
               <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
            </svg>
            <h2 className="text-2xl font-bold text-main mb-2">Cart Error</h2>
            <p className="text-muted mb-8">{error}</p>
            <Link href="/auth/login" className="px-8 py-3 rounded-full bg-accent text-white font-bold inline-block">Go to Login</Link>
        </div>
    );

    const items: CartItem[] = cart?.items || [];
    const total = items.reduce((acc: number, item: CartItem) => acc + (Number(item.product.basePrice) * item.quantity), 0);

    return (
        <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-20 min-h-screen">
            <h1 className="text-5xl md:text-6xl font-black mb-16 text-main tracking-tighter">Shopping Cart</h1>

            {items.length === 0 ? (
                <div className="p-20 text-center bg-white rounded-[2.5rem] border border-dashed border-divider shadow-sm">
                   <div className="w-24 h-24 bg-primary-bg rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-muted">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                      </svg>
                   </div>
                   <h2 className="text-2xl font-bold text-main mb-2">Your cart is empty</h2>
                   <p className="text-muted mb-8">Looks like you haven't added anything yet.</p>
                   <Link href="/products" className="px-8 py-4 rounded-full bg-accent text-white font-bold transition-transform hover:scale-105 active:scale-95 shadow-xl shadow-accent/30 inline-block font-sans">Start Shopping</Link>
                </div>
            ) : (
                <div className="flex flex-col lg:grid lg:grid-cols-12 gap-10">
                    <div className="lg:col-span-8 space-y-4">
                        {items.map((item: CartItem) => (
                            <div key={item.id} className="bg-white rounded-3xl p-6 flex flex-col sm:flex-row items-center gap-6 shadow-sm border border-divider group transition-all hover:shadow-xl hover:translate-x-1">
                                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl overflow-hidden bg-primary-bg flex-shrink-0 border border-divider/50">
                                   <img src={item.product.baseImage || "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=200"} alt={item.product.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-grow text-center sm:text-left">
                                   <h3 className="font-bold text-lg text-main">{item.product.name}</h3>
                                   <div className="flex flex-wrap justify-center sm:justify-start gap-4 mt-2">
                                       <span className="text-sm font-medium text-muted flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-accent" /> Size: {item.variantInfo?.size || 'N/A'}</span>
                                       <span className="text-sm font-medium text-muted flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-accent" /> Color: {item.variantInfo?.color || 'Original'}</span>
                                   </div>
                                   <div className="flex items-center justify-center sm:justify-start gap-3 mt-4">
                                      <button className="text-sm font-bold text-accent hover:underline">Edit Details</button>
                                      <div className="w-1 h-1 bg-divider rounded-full" />
                                      <button 
                                        className="text-sm font-bold text-error hover:underline transition-color"
                                        onClick={() => handleRemove(item.id)}
                                      >
                                        Remove
                                      </button>
                                   </div>
                                </div>
                                <div className="text-center sm:text-right flex flex-col items-center sm:items-end gap-2">
                                   <div className="px-4 py-2 rounded-xl bg-primary-bg font-bold border border-divider">Qty: {item.quantity}</div>
                                   <span className="text-xl font-bold text-main">${(Number(item.product.basePrice) * item.quantity).toFixed(2)}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="lg:col-span-4">
                        <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl border border-white/50 sticky top-24">
                           <h3 className="text-2xl font-bold text-main mb-6">Order Summary</h3>
                           <div className="space-y-4 mb-6">
                              <div className="flex justify-between text-muted">
                                 <span>Subtotal</span>
                                 <span className="font-semibold text-main">${total.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between text-muted">
                                 <span>Shipping Cost</span>
                                 <span className="font-semibold text-main">$0.00</span>
                              </div>
                              <div className="flex justify-between text-muted">
                                 <span>Estimated Taxes</span>
                                 <span className="font-semibold text-main">$0.00</span>
                              </div>
                           </div>
                           <div className="pt-6 border-t border-divider flex justify-between items-baseline mb-8">
                               <span className="text-xl font-bold text-main">Total cost</span>
                               <span className="text-3xl font-extrabold text-accent">${total.toFixed(2)}</span>
                           </div>
                           <button className="w-full py-4 rounded-xl bg-accent text-white font-bold text-lg hover:bg-accent-hover transition-all transform hover:scale-105 active:scale-95 shadow-xl shadow-accent/20">
                             Go to Checkout
                           </button>
                           
                           <div className="mt-6 flex flex-col gap-4 text-center">
                              <div className="flex items-center justify-center gap-2">
                                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-success">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                                 </svg>
                                 <span className="text-xs font-semibold text-muted uppercase tracking-wider">Secure Payment Processing</span>
                              </div>
                           </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPage;

