'use client';

import React, { useState, useEffect } from 'react';
import { designsApi } from '@/lib/api';

const DesignsPage = () => {
    const [designs, setDesigns] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchDesigns = async () => {
        setLoading(true);
        try {
            const response = await designsApi.getCurrent();
            setDesigns(response.data || []);
            setError(null);
        } catch (err: any) {
            setError(err.message || "Failed to load designs. Are you logged in?");
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
        const formData = new FormData();
        formData.append('file', file);
        formData.append('name', file.name);

        try {
            await designsApi.upload(formData);
            fetchDesigns();
        } catch (err: any) {
            alert(err.message || "Upload failed");
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this design?")) return;
        try {
            await designsApi.delete(id);
            fetchDesigns();
        } catch (err: any) {
            alert(err.message || "Delete failed");
        }
    };

    return (
        <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-20 min-h-screen">
            <div className="flex flex-col md:flex-row items-center justify-between gap-12 mb-20">
                <div>
                   <h1 className="text-4xl font-bold text-main mb-2">My Designs</h1>
                   <p className="text-muted font-medium">Manage and upload your custom artwork</p>
                </div>
                
                <label className={`relative group px-10 py-5 rounded-2xl bg-white border-2 border-dashed border-accent flex flex-col items-center justify-center gap-2 cursor-pointer transition-all hover:bg-accent/5 hover:border-accent-hover ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                   <input type="file" className="hidden" onChange={handleUpload} accept="image/*" />
                   <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
                      {uploading ? (
                          <span className="w-6 h-6 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
                      ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                          </svg>
                      )}
                   </div>
                   <span className="font-bold text-accent">{uploading ? "Uploading..." : "New Artwork"}</span>
                </label>
            </div>

            {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                   {[...Array(5)].map((_, i) => (
                       <div key={i} className="aspect-square bg-white rounded-3xl animate-pulse shadow-sm" />
                   ))}
                </div>
            ) : error ? (
                <div className="p-16 text-center bg-white rounded-3xl border border-error/20 flex flex-col items-center shadow-lg">
                   <div className="w-16 h-16 bg-error/10 text-error rounded-full flex items-center justify-center mb-6">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                         <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                      </svg>
                   </div>
                   <p className="text-xl font-bold text-main mb-2">Login Required</p>
                   <p className="text-muted mb-8">You need to be signed in to access your designs.</p>
                   <button onClick={() => window.location.href='/auth/login'} className="px-8 py-3 rounded-full bg-accent text-white font-bold shadow-xl shadow-accent/20 hover:scale-105 transform transition-all">Sign In Now</button>
                </div>
            ) : designs.length === 0 ? (
                <div className="p-20 text-center bg-white/50 rounded-[2.5rem] border border-dashed border-divider flex flex-col items-center shadow-inner">
                   <div className="w-20 h-20 bg-secondary-bg rounded-full flex items-center justify-center text-muted mb-6 opacity-60">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor" className="w-10 h-10">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                      </svg>
                   </div>
                   <h2 className="text-2xl font-bold text-main mb-2">No designs yet</h2>
                   <p className="text-muted mb-6 font-medium">Looking for inspiration? Check our products first or upload your artwork above.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 xl:gap-8">
                   {designs.map((design) => (
                       <div key={design.id} className="group relative aspect-square bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-divider">
                          <img src={design.imageUrl} alt={design.name} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400">
                             <p className="text-white text-sm font-bold truncate mb-3">{design.name}</p>
                             <div className="flex gap-2">
                                <button className="flex-1 py-2 bg-accent text-white rounded-lg text-xs font-bold hover:bg-accent-hover transition-colors shadow-lg shadow-accent/10">Apply Design</button>
                                <button 
                                  onClick={() => handleDelete(design.id)}
                                  className="w-10 h-8 bg-error/20 backdrop-blur-md text-error-light text-red-500 flex items-center justify-center rounded-lg hover:bg-red-500 hover:text-white transition-all font-bold"
                                >
                                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.34 6m-4.74 0-.34-6m4.74-6-.34 6m4.74 0-.34 6m4.74-6-.34 6M4.5 5.038l1.378 14.12A1.121 1.121 0 0 0 6.96 20.25h10.08a1.121 1.121 0 0 0 1.082-1.092l1.378-14.12M4.5 5.038V5.038A1.121 1.121 0 0 1 5.621 4h12.758a1.121 1.121 0 0 1 1.12 1.038zM9 4.5l3-3 3 3H9z" />
                                   </svg>
                                </button>
                             </div>
                          </div>
                       </div>
                   ))}
                </div>
            )}
        </div>
    );
};

export default DesignsPage;

