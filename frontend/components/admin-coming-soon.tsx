'use client';

import * as React from 'react';
import { Construction } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ComingSoonPage({ title = "Section" }: { title?: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
      <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
        <Construction className="h-10 w-10 text-primary animate-bounce-slow" />
      </div>
      <div className="space-y-2">
        <h1 className="text-3xl font-black tracking-tight">{title} Coming Soon</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          We are currently building this section to give you the best experience in managing your print-on-demand platform.
        </p>
      </div>
      <Link href="/admin">
        <Button className="rounded-full font-bold px-8 shadow-lg shadow-primary/20">
          Back to Dashboard
        </Button>
      </Link>
    </div>
  );
}
