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

      <div className="space-y-4 animate-in fade-in duration-500">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-foreground">Art Library</h1>
            <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">Manage your uploaded designs & status</p>
          </div>
          <Button
            size="sm"
            onClick={() => setShowUpload(true)}
            className="gap-2 rounded-xl font-bold px-4 h-9 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/10 border-0"
          >
            <Upload className="h-3.5 w-3.5" /> Upload Art
          </Button>
        </div>

        {/* Filters */}
        <Card className="border-border/40 bg-card/30 backdrop-blur-sm shadow-sm rounded-2xl overflow-hidden">
          <CardHeader className="border-b border-border/20 py-2 px-4 bg-muted/20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <Tabs value={tab} onValueChange={setTab} className="w-fit">
                <TabsList className="bg-muted/40 p-0.5 h-7 border border-border/40">
                  <TabsTrigger value="all" className="rounded-md px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-background">All</TabsTrigger>
                  <TabsTrigger value="approved" className="rounded-md px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-background">Live</TabsTrigger>
                  <TabsTrigger value="pending" className="rounded-md px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-background">Review</TabsTrigger>
                </TabsList>
              </Tabs>
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground/60" />
                <Input
                  placeholder="Filter library..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8 h-7 w-48 bg-background/50 border-border/40 text-[11px] font-medium rounded-lg focus-visible:ring-1 focus-visible:ring-primary/40"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-48 gap-3 text-muted-foreground">
                <Loader2 className="h-6 w-6 animate-spin text-primary/60" />
                <p className="text-[11px] font-bold uppercase tracking-widest">Loading Library...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 gap-3 text-muted-foreground/40 text-center">
                <ImageIcon className="h-10 w-10 opacity-10" />
                <p className="text-[11px] font-black uppercase tracking-widest">
                  {search ? 'No Matches' : 'Library Empty'}
                </p>
                {!search && (
                  <Button onClick={() => setShowUpload(true)} size="sm" variant="outline" className="h-8 rounded-full text-[10px] font-black uppercase tracking-widest mt-2 border-border/60 hover:bg-muted/50">
                    <Upload className="h-3 w-3 mr-1" /> Start Here
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                {filtered.map((d) => (
                  <div
                    key={d.id}
                    className="group relative flex flex-col rounded-xl border border-border/40 bg-card/60 hover:border-primary/40 hover:shadow-lg transition-all overflow-hidden"
                  >
                    {/* Preview Area */}
                    <div className="aspect-square bg-muted/30 border-b border-border/20 flex items-center justify-center relative overflow-hidden">
                      {d.fileUrl && (d.fileType?.startsWith('image/') || d.thumbnailUrl) ? (
                        <div className="w-full h-full p-2 group-hover:p-1 transition-all duration-300">
                          <img
                            src={d.thumbnailUrl || d.fileUrl}
                            alt={d.name}
                            className="h-full w-full object-contain mix-blend-multiply opacity-90 group-hover:opacity-100"
                          />
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-1 opacity-20">
                          <FileImage className="h-6 w-6" />
                          <span className="text-[8px] font-black uppercase">{d.fileType?.split('/')[1] || 'FILE'}</span>
                        </div>
                      )}
                      
                      <div className="absolute top-1.5 left-1.5 flex gap-1">
                        <Badge
                          className={`text-[8px] font-black uppercase tracking-tighter border-none px-1.5 h-4 rounded-sm shadow-sm ${d.isApproved ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'}`}
                        >
                          {d.isApproved ? 'Live' : 'Review'}
                        </Badge>
                      </div>
                      
                      {/* Hover Overlay Actions */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                         <Button
                          variant="destructive"
                          size="icon"
                          className="h-8 w-8 rounded-full shadow-xl"
                          onClick={() => setDeleteTarget(d)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Compact Info Section */}
                    <div className="p-2 min-w-0">
                      <p className="font-bold text-[11px] truncate leading-tight">{d.name || 'Untitled'}</p>
                      <div className="flex items-center justify-between mt-1 text-[9px] text-muted-foreground/60 font-bold tracking-tighter uppercase whitespace-nowrap">
                        <span>{d.fileSizeKb} KB</span>
                        <span>{new Date(d.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Compact Help Note */}
        <div className="flex items-center gap-2 px-2 opacity-50">
          <Clock className="h-3 w-3 text-muted-foreground" />
          <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
             Approval process typically takes 24-48 business hours.
          </p>
        </div>
      </div>

    </>
  );
}
