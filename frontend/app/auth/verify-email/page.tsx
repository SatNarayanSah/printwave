import { Suspense } from 'react';
import VerifyEmailClient from './verify-email-client';

export default function VerifyEmailPage() {
  return (
    <div className="flex items-center justify-center px-4 py-12">
      <Suspense fallback={<p className="text-muted-foreground">Loading...</p>}>
        <VerifyEmailClient />
      </Suspense>
    </div>
  );
}
