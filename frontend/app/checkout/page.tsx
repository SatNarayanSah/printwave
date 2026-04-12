'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useCart } from '@/lib/cartContext';
import { useAuth } from '@/lib/authContext';
import { addressesApi, ordersApi, paymentsApi } from '@/lib/api';
import type { ESewaInitiateDto, OrderDto } from '@/lib/api/types';

export default function CheckoutPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { items, total, clearCart, refresh } = useCart();

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [order, setOrder] = useState<OrderDto | null>(null);
  const [payment, setPayment] = useState<ESewaInitiateDto | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    label: 'Shipping',
    street: '',
    city: '',
    district: '',
    province: '',
    notes: '',
  });

  const subtotal = total;
  const shipping = subtotal > 0 ? 100 : 0;
  const finalTotal = subtotal + shipping;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const canCheckout = useMemo(() => items.length > 0 && !!user, [items.length, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setError(null);
    setSubmitting(true);
    try {
      const addressRes = await addressesApi.create({
        label: formData.label,
        street: formData.street,
        city: formData.city,
        district: formData.district,
        province: formData.province,
        isDefault: true,
      });

      const orderRes = await ordersApi.create({
        addressId: addressRes.data.id,
        notes: formData.notes || undefined,
      });
      setOrder(orderRes.data);

      const paymentRes = await paymentsApi.initiateESewa({ orderId: orderRes.data.id });
      setPayment(paymentRes.data);

      setSubmitted(true);

      await refresh().catch(() => {});
      await clearCart();
    } catch (err: any) {
      setError(err?.message ?? 'Checkout failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center px-4 py-16">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center px-4 py-16">
        <Card className="w-full max-w-lg py-0">
          <CardContent className="p-8 text-center space-y-5">
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-foreground">Login required</h1>
            <p className="text-muted-foreground">Please login to checkout and place orders.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/auth/login">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto">
                  Go to login
                </Button>
              </Link>
              <Link href="/cart">
                <Button variant="outline" className="w-full sm:w-auto">Back to cart</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (items.length === 0 && !submitted) {
    return (
      <div className="flex items-center justify-center px-4 py-16">
        <Card className="w-full max-w-lg py-0">
          <CardContent className="p-8 text-center space-y-5">
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-foreground">Your cart is empty</h1>
            <p className="text-muted-foreground">Add items to your cart before checking out.</p>
            <Link href="/shop">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground w-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to shop
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="flex items-center justify-center px-4 py-16">
        <Card className="w-full max-w-xl py-0">
          <CardContent className="p-8 space-y-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">Order created</h1>
              <p className="text-muted-foreground">Continue to payment to complete checkout.</p>
            </div>

            {order?.orderNumber && (
              <div className="bg-muted/60 rounded-2xl p-4 text-left">
                <p className="text-xs text-muted-foreground mb-1">Order number</p>
                <p className="font-black text-lg text-foreground">{order.orderNumber}</p>
              </div>
            )}

            {payment ? (
              <form action={payment.url} method="POST" className="space-y-3">
                {Object.entries(payment.fields).map(([k, v]) => (
                  <input key={k} type="hidden" name={k} value={String(v)} />
                ))}
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                  Pay with eSewa
                </Button>
              </form>
            ) : (
              <p className="text-muted-foreground">Preparing payment...</p>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="outline" onClick={() => router.push('/account/orders')}>View orders</Button>
              <Button variant="outline" onClick={() => router.push('/')}>Back home</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="bg-background/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12">
        <Link href="/cart" className="inline-flex items-center text-primary hover:underline mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to cart
        </Link>

        <div className="flex items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-foreground">Checkout</h1>
            <p className="text-muted-foreground mt-2">Shipping address + order summary</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 xl:col-span-8">
            <Card className="py-0">
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <h2 className="text-lg font-black tracking-tight text-foreground">Shipping address</h2>
                    <p className="text-sm text-muted-foreground mt-1">This will be used for delivery.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input name="label" placeholder="Label (e.g. Home)" value={formData.label} onChange={handleInputChange} required />
                    <Input name="city" placeholder="City" value={formData.city} onChange={handleInputChange} required />
                  </div>
                  <Input name="street" placeholder="Street" value={formData.street} onChange={handleInputChange} required />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input name="district" placeholder="District" value={formData.district} onChange={handleInputChange} required />
                    <Input name="province" placeholder="Province" value={formData.province} onChange={handleInputChange} required />
                  </div>
                  <Input name="notes" placeholder="Order notes (optional)" value={formData.notes} onChange={handleInputChange} />

                  {error && <p className="text-sm text-destructive">{error}</p>}

                  <Button
                    type="submit"
                    size="lg"
                    disabled={!canCheckout || submitting}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    {submitting ? 'Placing order...' : 'Place order'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-5 xl:col-span-4">
            <Card className="sticky top-20 py-0">
              <CardContent className="p-6 space-y-6">
                <h2 className="text-lg font-black tracking-tight text-foreground">Order summary</h2>

                <div className="space-y-3 max-h-96 overflow-y-auto border-b border-border/60 pb-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="relative w-16 h-16 bg-muted rounded-xl overflow-hidden flex-shrink-0">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-foreground line-clamp-1">{item.name}</p>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                        <p className="text-sm font-black text-foreground mt-1">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Shipping</span>
                    <span>${shipping.toFixed(2)}</span>
                  </div>
                </div>

                <div className="border-t border-border/60 pt-4 flex justify-between font-black text-lg">
                  <span className="text-foreground">Total</span>
                  <span className="text-primary">${finalTotal.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

