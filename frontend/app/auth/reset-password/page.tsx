import { Suspense } from 'react';
import ResetPasswordClient from './reset-password-client';

export default function ResetPasswordPage() {
  return (
    <div className="flex items-center justify-center px-4 py-12">
      <Suspense fallback={<p className="text-muted-foreground">Loading...</p>}>
        <ResetPasswordClient />
      </Suspense>
    </div>
  );
}
