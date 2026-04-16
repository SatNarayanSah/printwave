'use client';

import * as React from 'react';
import { Loader2 } from 'lucide-react';
import { useParams } from 'next/navigation';

import { adminApi } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { VariantManager } from '../../_components/variant-manager';

export default function ProductVariantsPage() {
  const params = useParams<{ id: string }>();
  const [product, setProduct] = React.useState<any | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  const loadProduct = React.useCallback(() => {
    setLoading(true);
    setError('');
    setProduct(null);
    adminApi
      .products()
      .then((res: any) => {
        const match = (res.data || []).find((entry: any) => entry.id === params.id);
        if (!match) {
          setError('Product not found');
          return;
        }
        setError('');
        setProduct(match);
      })
      .catch((err) => {
        console.error(err);
        setError(err?.message || 'Failed to load variants');
        setProduct(null);
      })
      .finally(() => setLoading(false));
  }, [params.id]);

  React.useEffect(() => {
    loadProduct();
  }, [loadProduct]);

  if (loading) {
    return (
      <Card className="admin-product-panel">
        <CardContent className="flex min-h-[320px] flex-col items-center justify-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading variant manager...</p>
        </CardContent>
      </Card>
    );
  }

  if (!product) {
    return (
      <Card className="admin-product-panel">
        <CardContent className="flex min-h-[240px] items-center justify-center text-sm text-destructive">
          {error || 'Product not found'}
        </CardContent>
      </Card>
    );
  }

  return <VariantManager product={product} onSaved={loadProduct} />;
}
