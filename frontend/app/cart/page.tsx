'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/lib/cartContext';

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, clearCart } = useCart();
  const [promoCode, setPromoCode] = useState('');
  const discount = 0;

  const subtotal = total;
  const tax = subtotal * 0.08;
  const shipping = subtotal > 50 ? 0 : 10;
  const finalTotal = subtotal + tax + shipping;

  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center px-4 py-16">
        <Card className="w-full max-w-lg py-0">
          <CardContent className="p-8 text-center space-y-5">
            <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl md:text-3xl font-black tracking-tight text-foreground">Your cart is empty</h1>
              <p className="text-muted-foreground">Add products to your cart, then checkout securely.</p>
            </div>
            <Link href="/shop">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground w-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Continue shopping
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="bg-background/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12">
        <div className="flex items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-foreground">Cart</h1>
            <p className="text-muted-foreground mt-2">
              {items.length} item{items.length === 1 ? '' : 's'} in your cart
            </p>
          </div>
          <Button variant="outline" onClick={() => clearCart()} className="hidden sm:inline-flex">
            Clear cart
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 xl:col-span-8 space-y-4">
            {items.map((item) => (
              <Card key={item.id} className="py-0">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row gap-6">
                    <div className="flex-shrink-0 w-full sm:w-32 h-32 bg-muted rounded-xl overflow-hidden">
                      <Image src={item.image} alt={item.name} width={128} height={128} className="object-cover w-full h-full" />
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold text-lg text-foreground mb-1">{item.name}</h3>
                        {item.variant && (
                          <p className="text-sm text-muted-foreground mb-2">
                            {item.variant.color} • {item.variant.size}
                          </p>
                        )}
                        <p className="text-sm text-muted-foreground">SKU: {item.sku ?? item.id}</p>
                      </div>

                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4">
                        <div className="flex items-center space-x-3 border border-input rounded-xl p-1 bg-background/30">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-2 hover:bg-muted/60 rounded-lg">
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="text-sm font-semibold w-8 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-2 hover:bg-muted/60 rounded-lg">
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                          <span className="font-black text-lg text-foreground">${(item.price * item.quantity).toFixed(2)}</span>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-2 hover:bg-muted/60 rounded-lg text-destructive transition-colors"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Button variant="outline" onClick={() => clearCart()} className="w-full sm:hidden">
              Clear cart
            </Button>
          </div>

          <div className="lg:col-span-5 xl:col-span-4">
            <Card className="sticky top-20 py-0">
              <CardContent className="p-6">
                <h2 className="text-xl font-black tracking-tight text-foreground mb-6">Order summary</h2>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-foreground font-semibold">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-foreground font-semibold">{shipping === 0 ? <span className="text-green-600">FREE</span> : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax</span>
                    <span className="text-foreground font-semibold">${tax.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}
                </div>

                <Separator className="my-4" />

                <div className="flex justify-between mb-6">
                  <span className="font-bold text-lg text-foreground">Total</span>
                  <span className="font-black text-2xl text-primary">${finalTotal.toFixed(2)}</span>
                </div>

                <div className="mb-6">
                  <label className="text-sm font-semibold text-foreground block mb-2">Promo code</label>
                  <div className="flex gap-2">
                    <Input value={promoCode} onChange={(e) => setPromoCode(e.target.value)} placeholder="Enter code" />
                    <Button variant="outline" className="px-3">
                      Apply
                    </Button>
                  </div>
                </div>

                <Link href="/checkout" className="block">
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground mb-3">Proceed to checkout</Button>
                </Link>

                <Link href="/shop" className="block">
                  <Button variant="outline" className="w-full">Continue shopping</Button>
                </Link>

                {shipping > 0 && (
                  <div className="mt-4 p-3 bg-muted/60 rounded-xl text-xs text-muted-foreground">
                    Free shipping on orders over $50
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

