'use client';

import { useEffect, useMemo, useState, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Minus, Plus, ShoppingCart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/lib/cartContext';
import { useAuth } from '@/lib/authContext';
import { productsApi, reviewsApi } from '@/lib/api';
import type { ProductDetailDto, ReviewDto } from '@/lib/api/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { formatNPR, getMediaUrl } from '@/lib/utils';

interface ProductDetailPageProps {
  params: Promise<{
    id: string; // product slug
  }>;
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = use(params);
  const { addItem } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState<ProductDetailDto | null>(null);
  const [reviews, setReviews] = useState<ReviewDto[]>([]);
  const [loading, setLoading] = useState(true);

  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [added, setAdded] = useState(false);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    title: '',
    body: '',
  });

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    productsApi
      .getBySlug(id)
      .then((res) => {
        if (cancelled) return;
        setProduct(res.data);
        const first = res.data.variants?.[0];
        if (first) {
          setSelectedColor(first.color);
          setSelectedSize(first.size);
        }
      })
      .catch(() => {
        if (!cancelled) setProduct(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    if (!product?.id) return;
    let cancelled = false;
    reviewsApi
      .listForProduct(product.id)
      .then((res) => {
        if (!cancelled) setReviews(res.data);
      })
      .catch(() => {
        if (!cancelled) setReviews([]);
      });
    return () => {
      cancelled = true;
    };
  }, [product?.id]);

  const refreshReviews = async () => {
    if (!product?.id) return;
    const res = await reviewsApi.listForProduct(product.id);
    setReviews(res.data);
  };

  const images = product?.images ?? [];
  const primaryImage = getMediaUrl(
    product?.primaryImageUrl ||
    images.find((i) => i.isPrimary)?.url ||
    [...images].sort((a, b) => a.sortOrder - b.sortOrder)[0]?.url
  );

  const colors = useMemo(() => {
    const seen = new Map<string, string>();
    for (const v of product?.variants ?? []) {
      if (!seen.has(v.color)) seen.set(v.color, v.colorHex);
    }
    return Array.from(seen.entries()).map(([color, colorHex]) => ({ color, colorHex }));
  }, [product?.variants]);

  const sizesForColor = useMemo(() => {
    const sizes = (product?.variants ?? [])
      .filter((v) => v.color === selectedColor)
      .map((v) => v.size);
    return Array.from(new Set(sizes));
  }, [product?.variants, selectedColor]);

  const selectedVariant = useMemo(() => {
    return (product?.variants ?? []).find((v) => v.color === selectedColor && v.size === selectedSize) ?? null;
  }, [product?.variants, selectedColor, selectedSize]);

  const basePrice = product?.basePrice ?? 0;
  const variantAdjustment = selectedVariant?.priceAdj ?? 0;
  const unitPrice = useMemo(() => {
    return basePrice + variantAdjustment;
  }, [basePrice, variantAdjustment]);

  const displayImage = selectedVariant?.imageUrl
    ? getMediaUrl(selectedVariant.imageUrl)
    : primaryImage || '/placeholder.svg';

  const handleAddToCart = () => {
    if (!product || !selectedVariant) return;
    addItem({
      id: `${product.id}:${selectedVariant.id}`,
      productId: product.id,
      variantId: selectedVariant.id,
      slug: product.slug,
      sku: selectedVariant.sku,
      name: product.name,
      price: unitPrice,
      quantity,
      image: selectedVariant.imageUrl || primaryImage,
      variant: { color: selectedColor, size: selectedSize },
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (!product) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-foreground">{loading ? 'Loading product...' : 'Product not found'}</h1>
          <Link href="/shop">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Shop
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12">
        <Link href="/shop" className="inline-flex items-center text-primary hover:underline mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Shop
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          <div className="lg:col-span-7">
            <Card className="overflow-hidden py-0">
              <CardContent className="p-0">
                <div className="relative bg-muted aspect-square">
                  <Image
                    src={displayImage}
                    alt={product.name}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </CardContent>
            </Card>
            </div>

          <div className="lg:col-span-5">
            <Card className="py-0">
              <CardContent className="p-6 space-y-5">
                <div>
                  <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">{product.name}</h1>

                  <div className="flex items-center space-x-2 mt-3">
                  <div className="flex items-center space-x-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${i < Math.floor(product.avgRating ?? 0) ? 'fill-accent text-accent' : 'text-muted-foreground'}`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {(product.avgRating ?? 0).toFixed(1)} ({product.reviewCount ?? 0} reviews)
                  </span>
                </div>
                </div>

                <p className="text-muted-foreground">{product.description ?? ''}</p>

                <div className="flex items-baseline space-x-2">
                  <span className="text-4xl font-bold text-foreground">{formatNPR(basePrice)}</span>
                </div>

                {variantAdjustment !== 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Variant adjustment: {variantAdjustment > 0 ? '+' : '-'} {formatNPR(Math.abs(variantAdjustment))}
                  </p>
                ) : null}

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-foreground block mb-2">Color</label>
                    <Select
                      value={selectedColor}
                      onValueChange={(value) => {
                        setSelectedColor(value);
                        const nextSize = (product.variants ?? []).find((v) => v.color === value)?.size;
                        if (nextSize) setSelectedSize(nextSize);
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select color" />
                      </SelectTrigger>
                      <SelectContent>
                        {colors.map((c) => (
                          <SelectItem key={c.color} value={c.color}>
                            {c.color}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-foreground block mb-2">Size</label>
                    <Select value={selectedSize} onValueChange={setSelectedSize}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent>
                        {sizesForColor.map((size) => (
                          <SelectItem key={size} value={size}>
                            {size}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-foreground block mb-2">Quantity</label>
                  <div className="flex items-center space-x-3 border border-input rounded-lg p-2 w-fit">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-1 hover:bg-muted rounded">
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-lg font-semibold w-8 text-center">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="p-1 hover:bg-muted rounded">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <Button
                  onClick={handleAddToCart}
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground w-full"
                  disabled={!selectedVariant || selectedVariant.stock <= 0}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  {added ? 'Added to Cart!' : 'Add to Cart'}
                </Button>

                {selectedVariant && selectedVariant.stock > 0 ? (
                  <p className="text-sm text-green-600 font-semibold">✓ In Stock</p>
                ) : (
                  <p className="text-sm text-red-600 font-semibold">Out of Stock</p>
                )}

                <div className="border-t border-border/60 pt-6 space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                    <span className="text-primary font-bold">✓</span>
                  </div>
                  <span className="text-sm text-foreground">Fast turnaround time</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                    <span className="text-primary font-bold">✓</span>
                  </div>
                  <span className="text-sm text-foreground">High-quality printing</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                    <span className="text-primary font-bold">✓</span>
                  </div>
                  <span className="text-sm text-foreground">Satisfaction guaranteed</span>
                </div>
              </div>
              </CardContent>
            </Card>
          </div>

        </div>

        <div className="mt-12 md:mt-16">
          <h2 className="text-2xl font-black tracking-tight text-foreground mb-6">Reviews</h2>
            <div className="border border-border rounded-lg bg-card p-4 mb-6">
              {user ? (
                <form
                  className="space-y-3"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!product?.id) return;
                    setReviewError(null);
                    setReviewSubmitting(true);
                    try {
                      await reviewsApi.add({
                        productId: product.id,
                        rating: reviewForm.rating,
                        title: reviewForm.title,
                        body: reviewForm.body,
                      });
                      setReviewForm({ rating: 5, title: '', body: '' });
                      await refreshReviews();
                    } catch (err: any) {
                      setReviewError(err?.message ?? 'Failed to submit review');
                    } finally {
                      setReviewSubmitting(false);
                    }
                  }}
                >
                  <p className="font-semibold text-foreground">Write a review</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Select
                      value={String(reviewForm.rating)}
                      onValueChange={(v) => setReviewForm((p) => ({ ...p, rating: Number(v) }))}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Rating" />
                      </SelectTrigger>
                      <SelectContent>
                        {[5, 4, 3, 2, 1].map((r) => (
                          <SelectItem key={r} value={String(r)}>
                            {r} stars
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <input
                      className="w-full px-3 py-2 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background"
                      placeholder="Title"
                      value={reviewForm.title}
                      onChange={(e) => setReviewForm((p) => ({ ...p, title: e.target.value }))}
                      required
                    />
                  </div>
                  <textarea
                    className="w-full px-3 py-2 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background min-h-24"
                    placeholder="Your review"
                    value={reviewForm.body}
                    onChange={(e) => setReviewForm((p) => ({ ...p, body: e.target.value }))}
                    required
                  />
                  {reviewError && <p className="text-sm text-destructive">{reviewError}</p>}
                  <Button type="submit" disabled={reviewSubmitting} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
                  </Button>
                </form>
              ) : (
                <div className="space-y-2">
                  <p className="text-muted-foreground">Login to write a review.</p>
                  <Link href="/auth/login">
                    <Button variant="outline">Go to Login</Button>
                  </Link>
                </div>
              )}
            </div>
            {reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.slice(0, 6).map((r) => (
                  <div key={r.id} className="border border-border rounded-lg p-4 bg-card">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-foreground">{r.title}</p>
                      <div className="flex items-center space-x-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < r.rating ? 'fill-accent text-accent' : 'text-muted-foreground'}`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">{r.body}</p>
                    {r.user && (
                      <p className="text-xs text-muted-foreground mt-3">
                        By {r.user.firstName} {r.user.lastName}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No reviews yet.</p>
            )}
        </div>
      </div>
    </div>
  );
}
