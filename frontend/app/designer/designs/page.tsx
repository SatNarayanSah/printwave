'use client';

import * as React from 'react';
import {
  Upload,
  Trash2,
  ImageIcon,
  Loader2,
  CheckCircle2,
  Clock,
  Search,
  X,
  FileImage,
  AlertTriangle,
} from 'lucide-react';
import { designerApi } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

function UploadModal({ open, onClose, onUploaded }: { open: boolean; onClose: () => void; onUploaded: () => void }) {
  const [file, setFile] = React.useState<File | null>(null);
  const [name, setName] = React.useState('');
  const [uploading, setUploading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [dragOver, setDragOver] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const reset = () => { setFile(null); setName(''); setError(''); };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) { setFile(f); setName(f.name.replace(/\.[^/.]+$/, '')); }
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) { setFile(f); setName(f.name.replace(/\.[^/.]+$/, '')); }
  };

  const handleUpload = async () => {
    if (!file) { setError('Please select a file.'); return; }
    setError(''); setUploading(true);
    try {
      await designerApi.uploadDesign({ file, name: name || undefined });
      reset(); onClose(); onUploaded();
    } catch (e: any) {
      setError(e?.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) { reset(); onClose(); } }}>
      <DialogContent className="sm:max-w-md rounded-2xl border-border/40 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-black">Upload Design</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-1">
          {error && (
            <p className="text-[11px] text-destructive bg-destructive/10 px-3 py-2 rounded-lg font-bold flex items-center gap-2">
              <AlertTriangle className="h-3 w-3 flex-shrink-0" /> {error}
            </p>
          )}
          {/* Drop zone */}
          <div
            className={`relative flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-2xl p-8 cursor-pointer transition-all ${dragOver ? 'border-orange-500 bg-orange-500/5' : 'border-border/60 hover:border-orange-500/50 hover:bg-muted/20'}`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
          >
            <input ref={inputRef} type="file" accept="image/*,.pdf,.ai,.eps,.svg" className="hidden" onChange={handleFile} />
            {file ? (
              <>
                <div className="h-14 w-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                  <FileImage className="h-7 w-7 text-orange-500" />
                </div>
                <div className="text-center">
                  <p className="font-bold text-sm truncate max-w-[200px]">{file.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
                <button
                  type="button"
                  className="absolute top-3 right-3 h-6 w-6 rounded-full bg-muted hover:bg-destructive/10 hover:text-destructive flex items-center justify-center transition-colors"
                  onClick={(e) => { e.stopPropagation(); setFile(null); setName(''); }}
                >
                  <X className="h-3 w-3" />
                </button>
              </>
            ) : (
              <>
                <div className="h-14 w-14 rounded-2xl bg-muted/60 flex items-center justify-center">
                  <Upload className="h-7 w-7 text-muted-foreground" />
                </div>
                <div className="text-center">
                  <p className="font-bold text-sm">Drop your file here</p>
                  <p className="text-xs text-muted-foreground mt-1">PNG, JPG, SVG, PDF, AI, EPS — up to 10 MB</p>
                </div>
              </>
            )}
          </div>
          {/* Name */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Design Name</label>
            <Input
              placeholder="e.g. Summer Wave Logo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-9 px-3 text-sm rounded-xl"
            />
          </div>
          <div className="flex gap-2 pt-1">
            <Button variant="outline" onClick={() => { reset(); onClose(); }} className="flex-1 rounded-full font-bold h-10 text-xs">
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              disabled={uploading || !file}
              className="flex-1 rounded-full font-bold h-10 text-xs gap-2 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 border-0 text-white shadow-md shadow-orange-500/20"
            >
              {uploading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Upload className="h-3 w-3" />}
              {uploading ? 'Uploading...' : 'Upload'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function DesignerDesignsPage() {
  const [designs, setDesigns] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState('');
  const [tab, setTab] = React.useState('all');
  const [showUpload, setShowUpload] = React.useState(false);
  const [deleteTarget, setDeleteTarget] = React.useState<any | null>(null);
  const [deleting, setDeleting] = React.useState(false);

  const fetchDesigns = () => {
    setLoading(true);
    designerApi.designs()
      .then((res) => setDesigns(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  React.useEffect(() => { fetchDesigns(); }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await designerApi.deleteDesign(deleteTarget.id);
      setDeleteTarget(null);
      fetchDesigns();
    } catch (e) { console.error(e); }
    finally { setDeleting(false); }
  };

  const filtered = designs.filter((d) => {
    if (tab === 'approved' && !d.isApproved) return false;
    if (tab === 'pending' && d.isApproved) return false;
    if (search && !(d.name || '').toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <>
      <UploadModal open={showUpload} onClose={() => setShowUpload(false)} onUploaded={fetchDesigns} />

      <AlertDialog open={!!deleteTarget} onOpenChange={(v) => !v && setDeleteTarget(null)}>
        <AlertDialogContent className="rounded-2xl border-border/40">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-black">Delete design?</AlertDialogTitle>
            <AlertDialogDescription>
              <span className="font-bold text-foreground">{deleteTarget?.name || 'This design'}</span> will be permanently deleted. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-full font-bold text-xs h-9">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="rounded-full font-bold text-xs h-9 bg-destructive hover:bg-destructive/90 text-destructive-foreground gap-2"
            >
              {deleting ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}
              {deleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="space-y-6 animate-in fade-in duration-500">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h1 className="text-3xl font-black tracking-tight">My Designs</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Manage your uploaded artwork and track approval status.</p>
          </div>
          <Button
            onClick={() => setShowUpload(true)}
            className="gap-2 rounded-full font-bold px-6 h-10 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 border-0 text-white shadow-md shadow-orange-500/20"
          >
            <Upload className="h-4 w-4" /> Upload New Design
          </Button>
        </div>

        {/* Filters */}
        <Card className="border-border/40 shadow-sm overflow-hidden rounded-2xl">
          <CardHeader className="border-b border-border/40 bg-muted/20 py-3 px-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <Tabs value={tab} onValueChange={setTab} className="w-fit">
                <TabsList className="bg-muted/60 p-1 h-8 border border-border/40">
                  <TabsTrigger value="all" className="rounded-md px-3 py-1 text-[11px] font-bold data-[state=active]:bg-background">All</TabsTrigger>
                  <TabsTrigger value="approved" className="rounded-md px-3 py-1 text-[11px] font-bold data-[state=active]:bg-background">Approved</TabsTrigger>
                  <TabsTrigger value="pending" className="rounded-md px-3 py-1 text-[11px] font-bold data-[state=active]:bg-background">Pending</TabsTrigger>
                </TabsList>
              </Tabs>
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder="Search designs..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8 h-8 w-56 bg-background border-border/60 text-xs rounded-full"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-5">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-48 gap-3 text-muted-foreground">
                <Loader2 className="h-7 w-7 animate-spin text-orange-500" />
                <p className="text-sm">Loading designs...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 gap-3 text-muted-foreground">
                <ImageIcon className="h-10 w-10 opacity-25" />
                <p className="text-sm font-medium">
                  {search ? 'No designs match your search.' : 'No designs yet. Upload your first artwork!'}
                </p>
                {!search && (
                  <Button onClick={() => setShowUpload(true)} size="sm" className="gap-1.5 rounded-full font-bold text-xs bg-gradient-to-r from-orange-500 to-pink-500 border-0 text-white">
                    <Upload className="h-3.5 w-3.5" /> Upload Now
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filtered.map((d) => (
                  <div
                    key={d.id}
                    className="group relative rounded-2xl border border-border/40 bg-card hover:border-orange-500/30 hover:shadow-md transition-all overflow-hidden"
                  >
                    {/* Preview */}
                    <div className="h-40 bg-gradient-to-br from-orange-500/5 to-pink-500/5 border-b border-border/40 flex items-center justify-center relative">
                      {d.fileUrl && (d.fileType?.startsWith('image/') || d.thumbnailUrl) ? (
                        <img
                          src={d.thumbnailUrl || d.fileUrl}
                          alt={d.name}
                          className="h-full w-full object-contain p-4"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                      ) : (
                        <ImageIcon className="h-10 w-10 text-orange-500/30" />
                      )}
                      <Badge
                        variant="outline"
                        className={`absolute top-2 right-2 text-[9px] font-bold border-none px-2 h-5 rounded-full ${d.isApproved ? 'bg-emerald-500/15 text-emerald-600' : 'bg-amber-500/15 text-amber-600'}`}
                      >
                        {d.isApproved ? <><CheckCircle2 className="h-2.5 w-2.5 mr-0.5 inline" />Approved</> : <><Clock className="h-2.5 w-2.5 mr-0.5 inline" />Pending</>}
                      </Badge>
                    </div>
                    {/* Info */}
                    <div className="p-3">
                      <p className="font-bold text-sm truncate">{d.name || 'Untitled'}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{d.fileSizeKb} KB · {new Date(d.createdAt).toLocaleDateString()}</p>
                    </div>
                    {/* Actions */}
                    <div className="px-3 pb-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full h-7 text-[11px] font-bold rounded-full text-destructive hover:bg-destructive/10 hover:border-destructive/30 gap-1"
                        onClick={() => setDeleteTarget(d)}
                      >
                        <Trash2 className="h-3 w-3" /> Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Note on approval */}
        <Card className="border-border/40 bg-muted/10 shadow-none">
          <CardContent className="flex items-start gap-3 py-4">
            <Clock className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <p className="text-xs text-muted-foreground">
              Uploaded designs are reviewed by admins before they become eligible for orders. Approval typically takes 1–2 business days.
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
