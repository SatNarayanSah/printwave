'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { designsApi } from '@/lib/api';

interface Design {
    id: string;
    imageUrl: string;
    name: string;
}

const DesignsPage = () => {
    const [designs, setDesigns] = useState<Design[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [uploadError, setUploadError] = useState<string | null>(null);

    const fetchDesigns = async () => {
        setLoading(true);
        try {
            const response = await designsApi.getCurrent();
            setDesigns(response.data || []);
            setIsAuthenticated(true);
        } catch (err: unknown) {
            // 401/403 means not logged in
            const errorObj = err as Error;
            if (errorObj.message?.toLowerCase().includes('auth') || errorObj.message?.toLowerCase().includes('log')) {
              setIsAuthenticated(false);
            } else {
              setIsAuthenticated(true); // Logged in but other error
              setDesigns([]);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDesigns();
    }, []);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setUploadError(null);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('name', file.name.replace(/\.[^/.]+$/, '')); // Clean name

        try {
            await designsApi.upload(formData);
            await fetchDesigns();
        } catch (err: unknown) {
            setUploadError(err instanceof Error ? err.message : 'Upload failed. Please try again.');
        } finally {
            setUploading(false);
            // Reset input so same file can be re-uploaded
            e.target.value = '';
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this design?')) return;
        try {
            await designsApi.delete(id);
            setDesigns(prev => prev.filter(d => d.id !== id));
        } catch (err: unknown) {
            alert(err instanceof Error ? err.message : 'Delete failed');
        }
    };

    // Not authenticated state  
    if (isAuthenticated === false) {
        return (
            <div className="min-h-screen bg-secondary-bg pt-24 flex items-center justify-center">
                <div className="bg-white rounded-2xl p-12 border border-divider shadow-sm max-w-sm w-full text-center">
                    <div className="w-12 h-12 rounded-xl bg-main flex items-center justify-center mx-auto mb-6">
                        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-black text-main mb-2 tracking-tight">Sign In Required</h2>
                    <p className="text-muted text-sm font-medium mb-8 leading-relaxed">
                        You need to be signed in to access your design studio.
                    </p>
                    <Link href="/auth/login" className="block w-full py-3.5 rounded-xl bg-main text-white font-bold text-sm hover:bg-black transition-all text-center">
                        Sign In to Continue
                    </Link>
                    <Link href="/auth/register" className="block mt-3 text-xs font-bold text-muted hover:text-main transition-colors">
                        Don't have an account? Sign up free →
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-secondary-bg pt-24 pb-20">
            <div className="container-wide">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-12">
                    <div>
                        <span className="text-[9px] font-black text-muted uppercase tracking-[0.3em]">My Studio</span>
                        <h1 className="text-3xl font-black text-main tracking-tight">Design Library</h1>
                        <p className="text-muted text-sm font-medium mt-1">{designs.length} artwork{designs.length !== 1 ? 's' : ''} in your collection</p>
                    </div>
                    
                    <label className={`relative group px-6 py-3.5 rounded-xl bg-main text-white font-bold text-sm shadow-sm cursor-pointer transition-all hover:bg-black active:scale-95 flex items-center gap-3 ${uploading ? 'opacity-60 pointer-events-none' : ''}`}>
                        <input type="file" className="hidden" onChange={handleUpload} accept="image/*,image/svg+xml" />
                        {uploading ? (
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                            </svg>
                        )}
                        {uploading ? 'Uploading...' : 'Upload Artwork'}
                    </label>
                </div>

                {/* Upload Error */}
                {uploadError && (
                    <div className="mb-8 p-4 rounded-xl bg-error/5 border border-error/20 text-error text-sm font-medium flex items-center gap-3">
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" /></svg>
                        {uploadError}
                        <button onClick={() => setUploadError(null)} className="ml-auto text-muted hover:text-main">✕</button>
                    </div>
                )}

                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="aspect-square bg-white rounded-2xl animate-pulse border border-divider" />
                        ))}
                    </div>
                ) : designs.length === 0 ? (
                    <div className="py-20 text-center bg-white rounded-2xl border border-dashed border-divider/80 flex flex-col items-center">
                        <div className="w-16 h-16 bg-secondary-bg rounded-2xl flex items-center justify-center text-muted mb-6 rotate-3">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor" className="w-8 h-8">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-black text-main mb-2 tracking-tight">Studio is Empty</h2>
                        <p className="text-muted text-sm font-medium max-w-sm mx-auto">
                            Upload your first artwork using the button above. Accepted formats: PNG, JPG, SVG, WebP.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {designs.map((design) => (
                            <div key={design.id} className="group relative aspect-square bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-divider">
                                <img src={design.imageUrl} alt={design.name} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                                {/* Hover Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent translate-y-full group-hover:translate-y-0 transition-all duration-400 flex flex-col justify-end p-4">
                                    <p className="text-white text-xs font-bold truncate mb-3">{design.name}</p>
                                    <div className="flex gap-2">
                                        <button className="flex-1 py-2 bg-white text-main rounded-lg text-xs font-bold hover:bg-secondary-bg transition-colors">
                                            Apply
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(design.id)}
                                            className="w-9 h-8 bg-error/20 text-error flex items-center justify-center rounded-lg hover:bg-error hover:text-white transition-all"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.34 6m-4.74 0-.34-6m4.53-6h2.25a2 2 0 0 1 2 2v.08a.5.5 0 0 1-.5.5H4.14a.5.5 0 0 1-.5-.5V5a2 2 0 0 1 2-2h2.25m4.86 0a1 1 0 0 0-1 -1h-2.72a1 1 0 0 0-1 1m9.32 0H5.28M19 9l-1 12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1L5 9" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DesignsPage;
