import Link from 'next/link';
import Image from 'next/image';
import { Star, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ProductListItemDto } from '@/lib/api/types';
import { formatNPR, getMediaUrl } from '@/lib/utils';

interface ProductCardProps {
  product: ProductListItemDto;
}

export function ProductCard({ product }: ProductCardProps) {
  const rating = Number.isFinite(product.avgRating) ? product.avgRating : 0;
  const imageUrl = getMediaUrl(product.primaryImageUrl ?? '/placeholder.svg');

  return (
    <Link href={`/products/${product.slug}`}>
      <div className="group cursor-pointer h-full">
        <div className="relative overflow-hidden rounded-lg bg-muted aspect-square mb-4">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-bold">Out of Stock</span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
            {product.name}
          </h3>

          <p className="text-sm text-muted-foreground line-clamp-1">{product.description ?? ''}</p>

          <div className="flex items-center space-x-1">
            <div className="flex items-center space-x-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(rating)
                      ? 'fill-accent text-accent'
                      : 'text-muted-foreground'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-baseline space-x-2">
              <span className="font-bold text-lg text-foreground">{formatNPR(product.basePrice)}</span>
            </div>
          </div>

          <Button
            className="w-full mt-4 bg-primary hover:bg-primary/90 text-primary-foreground"
            disabled={!product.inStock}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            {product.inStock ? 'View Details' : 'Out of Stock'}
          </Button>
        </div>
      </div>
    </Link>
  );
}
