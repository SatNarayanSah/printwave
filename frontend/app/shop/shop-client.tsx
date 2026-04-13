'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { FilterSidebar } from '@/components/filter-sidebar';
import { ProductCard } from '@/components/product-card';
import { Separator } from '@/components/ui/separator';
import { productsApi } from '@/lib/api';
import type { ProductListItemDto } from '@/lib/api/types';

export default function ShopClient() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<ProductListItemDto[]>([]);
  const [loading, setLoading] = useState(true);

  const selectedCategories = useMemo(() => {
    const cats = searchParams.get('categories');
    return cats ? cats.split(',') : [];
  }, [searchParams]);

  const minPrice = useMemo(() => Number(searchParams.get('minPrice')) || 0, [searchParams]);
  const maxPrice = useMemo(() => Number(searchParams.get('maxPrice')) || 5000, [searchParams]);
  const sortBy = useMemo(() => searchParams.get('sort') || 'popular', [searchParams]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    productsApi
      .list({
        categories: selectedCategories,
        minPrice,
        maxPrice,
      })
      .then((res) => {
        if (!cancelled) setProducts(res.data);
      })
      .catch(() => {
        if (!cancelled) setProducts([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedCategories.join(','), minPrice, maxPrice]);

  const sortedProducts = useMemo(() => {
    const sorted = [...products];
    switch (sortBy) {
      case 'price-low':
        sorted.sort((a, b) => a.basePrice - b.basePrice);
        break;
      case 'price-high':
        sorted.sort((a, b) => b.basePrice - a.basePrice);
        break;
      case 'rating':
        sorted.sort((a, b) => b.avgRating - a.avgRating);
        break;
      case 'newest':
        // Backend already sorts newest first
        break;
      default:
        break;
    }

    return sorted;
  }, [products, sortBy]);

  return (
    <div className="bg-background/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12">
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground mb-2">Shop</h1>
            <p className="text-lg text-muted-foreground">
              Browse our collection of high-quality print-on-demand products.
            </p>
          </div>

          <Separator className="mb-8" />

          <div className="flex flex-col lg:flex-row gap-8">
            <aside className="hidden lg:block flex-shrink-0">
              <FilterSidebar />
            </aside>

            <div className="flex-1">
              <div className="lg:hidden mb-6">
                <details className="bg-muted rounded-lg p-4">
                  <summary className="cursor-pointer font-semibold text-foreground">Filters</summary>
                  <div className="mt-4">
                    <FilterSidebar />
                  </div>
                </details>
              </div>

              <div className="mb-6 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {loading
                    ? 'Loading products...'
                    : `Showing ${sortedProducts.length} ${sortedProducts.length === 1 ? 'product' : 'products'}`}
                </p>
              </div>

              {sortedProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sortedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <p className="text-lg text-muted-foreground mb-4">
                    {loading ? 'Loading...' : 'No products found matching your filters.'}
                  </p>
                  <button
                    onClick={() => {
                      window.location.href = '/shop';
                    }}
                    className="text-primary hover:underline font-semibold"
                  >
                    Clear filters and try again
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
    </div>
  );
}
