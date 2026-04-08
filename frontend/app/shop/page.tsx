'use client';

import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { FilterSidebar } from '@/components/filter-sidebar';
import { ProductCard } from '@/components/product-card';
import { products } from '@/lib/mockData';
import { Separator } from '@/components/ui/separator';

export default function ShopPage() {
  const searchParams = useSearchParams();

  const selectedCategories = useMemo(() => {
    const cats = searchParams.get('categories');
    return cats ? cats.split(',') : [];
  }, [searchParams]);

  const minPrice = useMemo(() => Number(searchParams.get('minPrice')) || 0, [searchParams]);
  const maxPrice = useMemo(() => Number(searchParams.get('maxPrice')) || 100, [searchParams]);
  const sortBy = useMemo(() => searchParams.get('sort') || 'popular', [searchParams]);

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Filter by category
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((p) => selectedCategories.includes(p.category));
    }

    // Filter by price
    filtered = filtered.filter((p) => p.price >= minPrice && p.price <= maxPrice);

    // Sort
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.reverse();
        break;
      default:
        // popular - no change
        break;
    }

    return filtered;
  }, [selectedCategories, minPrice, maxPrice, sortBy]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">Shop Our Products</h1>
            <p className="text-lg text-muted-foreground">
              Browse our collection of high-quality print-on-demand products.
            </p>
          </div>

          <Separator className="mb-8" />

          {/* Filters and Products Grid */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar - Hidden on mobile, shown on desktop */}
            <aside className="hidden lg:block flex-shrink-0">
              <FilterSidebar />
            </aside>

            {/* Products Grid */}
            <div className="flex-1">
              {/* Mobile Filters - Hidden on desktop */}
              <div className="lg:hidden mb-6">
                <details className="bg-muted rounded-lg p-4">
                  <summary className="cursor-pointer font-semibold text-foreground">Filters</summary>
                  <div className="mt-4">
                    <FilterSidebar />
                  </div>
                </details>
              </div>

              {/* Results Count */}
              <div className="mb-6 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
                </p>
              </div>

              {/* Products */}
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <p className="text-lg text-muted-foreground mb-4">No products found matching your filters.</p>
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
      </main>

      <Footer />
    </div>
  );
}
