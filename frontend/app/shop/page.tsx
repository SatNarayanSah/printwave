import { Suspense } from 'react';
import ShopClient from './shop-client';

export default function ShopPage() {
  return (
    <Suspense fallback={<p className="text-muted-foreground p-6">Loading...</p>}>
      <ShopClient />
    </Suspense>
  );
}

