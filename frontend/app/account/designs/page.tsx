'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/authContext';
import { designsApi } from '@/lib/api';
import type { CustomDesignDto } from '@/lib/api/types';

export default function DesignsPage() {
  const { user, loading: authLoading } = useAuth();
  const [designs, setDesigns] = useState<CustomDesignDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState('');
  const [uploading, setUploading] = useState(false);

  const refresh = async () => {
    const res = await designsApi.listMine();
    setDesigns(res.data);
  };

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    setLoading(true);
    refresh()
      .catch((err: any) => {
        if (!cancelled) setError(err?.message ?? 'Failed to load designs');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center px-4 py-16">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center px-4 py-16">
        <Card className="w-full max-w-lg py-0">
          <CardContent className="p-8 text-center space-y-4">
            <h1 className="text-2xl font-black tracking-tight text-foreground">Please login</h1>
            <p className="text-muted-foreground">Login to manage your uploaded designs.</p>
            <Link href="/auth/login">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground w-full">Go to login</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="bg-background/30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12 space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-foreground">My designs</h1>
            <p className="text-muted-foreground mt-2">Upload artwork and reuse it in future orders.</p>
          </div>
          <Link href="/account/orders">
            <Button variant="outline">My orders</Button>
          </Link>
        </div>

        <Card className="py-0">
          <CardContent className="p-6 space-y-4">
            <div>
              <h2 className="text-lg font-black tracking-tight text-foreground">Upload new design</h2>
              <p className="text-sm text-muted-foreground mt-1">PNG/JPG/PDF supported (depending on backend storage).</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input placeholder="Name (optional)" value={name} onChange={(e) => setName(e.target.value)} />
              <Input type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button
              disabled={!file || uploading}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={async () => {
                if (!file) return;
                setError(null);
                setUploading(true);
                try {
                  await designsApi.upload({ file, name: name || undefined });
                  setFile(null);
                  setName('');
                  await refresh();
                } catch (err: any) {
                  setError(err?.message ?? 'Upload failed');
                } finally {
                  setUploading(false);
                }
              }}
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </Button>
          </CardContent>
        </Card>

        {loading ? (
          <p className="text-muted-foreground">Loading designs...</p>
        ) : designs.length === 0 ? (
          <Card className="py-0">
            <CardContent className="p-8 text-center text-muted-foreground">No designs uploaded yet.</CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {designs.map((d) => (
              <Card key={d.id} className="py-0">
                <CardContent className="p-4 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <p className="font-semibold text-foreground">{d.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {d.fileType} • {d.fileSizeKb} KB
                    </p>
                    <a href={d.fileUrl} className="text-xs text-primary hover:underline" target="_blank" rel="noreferrer">
                      Open file
                    </a>
                  </div>
                  <Button
                    variant="outline"
                    onClick={async () => {
                      setError(null);
                      try {
                        await designsApi.delete(d.id);
                        await refresh();
                      } catch (err: any) {
                        setError(err?.message ?? 'Delete failed');
                      }
                    }}
                  >
                    Delete
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

