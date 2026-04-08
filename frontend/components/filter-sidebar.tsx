'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { categories } from '@/lib/mockData';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';

interface FilterSidebarProps {
  onFiltersChange?: (filters: FilterState) => void;
}

export interface FilterState {
  categories: string[];
  priceRange: [number, number];
  sortBy: string;
}

export function FilterSidebar({ onFiltersChange }: FilterSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedCategories = searchParams.get('categories')?.split(',') || [];
  const minPrice = Number(searchParams.get('minPrice')) || 0;
  const maxPrice = Number(searchParams.get('maxPrice')) || 100;
  const sortBy = searchParams.get('sort') || 'popular';

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    const newCategories = checked
      ? [...selectedCategories, categoryId]
      : selectedCategories.filter((c) => c !== categoryId);

    const params = new URLSearchParams();
    if (newCategories.length > 0) {
      params.set('categories', newCategories.join(','));
    }
    if (minPrice > 0) params.set('minPrice', minPrice.toString());
    if (maxPrice < 100) params.set('maxPrice', maxPrice.toString());
    if (sortBy) params.set('sort', sortBy);

    router.push(`/shop?${params.toString()}`);
  };

  const handlePriceChange = (value: number[]) => {
    const params = new URLSearchParams();
    if (selectedCategories.length > 0) {
      params.set('categories', selectedCategories.join(','));
    }
    params.set('minPrice', value[0].toString());
    params.set('maxPrice', value[1].toString());
    if (sortBy) params.set('sort', sortBy);

    router.push(`/shop?${params.toString()}`);
  };

  const handleSortChange = (newSort: string) => {
    const params = new URLSearchParams();
    if (selectedCategories.length > 0) {
      params.set('categories', selectedCategories.join(','));
    }
    if (minPrice > 0) params.set('minPrice', minPrice.toString());
    if (maxPrice < 100) params.set('maxPrice', maxPrice.toString());
    params.set('sort', newSort);

    router.push(`/shop?${params.toString()}`);
  };

  const handleClearFilters = () => {
    router.push('/shop');
  };

  return (
    <div className="w-full lg:w-64 space-y-6">
      {/* Sort */}
      <div className="space-y-3">
        <h3 className="font-semibold text-foreground">Sort By</h3>
        <div className="space-y-2">
          {[
            { value: 'popular', label: 'Most Popular' },
            { value: 'newest', label: 'Newest' },
            { value: 'price-low', label: 'Price: Low to High' },
            { value: 'price-high', label: 'Price: High to Low' },
            { value: 'rating', label: 'Highest Rated' },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => handleSortChange(option.value)}
              className={`w-full text-left px-3 py-2 rounded transition-colors ${
                sortBy === option.value
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted text-foreground'
              }`}
            >
              <span className="text-sm">{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-3">
        <h3 className="font-semibold text-foreground">Categories</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox
                id={category.id}
                checked={selectedCategories.includes(category.id)}
                onCheckedChange={(checked) => handleCategoryChange(category.id, !!checked)}
              />
              <Label htmlFor={category.id} className="text-sm cursor-pointer">
                {category.name} ({category.productCount})
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-3">
        <h3 className="font-semibold text-foreground">Price Range</h3>
        <Slider
          min={0}
          max={100}
          step={5}
          value={[minPrice, maxPrice]}
          onValueChange={handlePriceChange}
          className="w-full"
        />
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">${minPrice}</span>
          <span className="text-muted-foreground">${maxPrice}</span>
        </div>
      </div>

      {/* Clear Filters */}
      {(selectedCategories.length > 0 || minPrice > 0 || maxPrice < 100 || sortBy !== 'popular') && (
        <Button variant="outline" onClick={handleClearFilters} className="w-full">
          Clear Filters
        </Button>
      )}
    </div>
  );
}
