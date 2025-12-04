

import React, { useState } from 'react';
import Card from './Card';
import Button from './Button';
import AddListingWizard from './AddListingWizard';
import { Listing, ListingStatus } from '../types';
import { ArrowLeftIcon, SparklesIcon, MarketingIcon, ShareIcon } from './IconComponents';

interface ListingsProps {
    listings: Listing[];
    onSelectForMarketing: (listing: Listing) => void;
}

const statusColors: Record<ListingStatus, string> = {
    Available: 'bg-green-500/20 text-green-300',
    'Under Offer': 'bg-yellow-500/20 text-yellow-300',
    Sold: 'bg-red-500/20 text-red-300',
};

const Listings: React.FC<ListingsProps> = ({ listings: initialListings, onSelectForMarketing }) => {
    const [listings, setListings] = useState<Listing[]>(initialListings);
    const [isWizardOpen, setIsWizardOpen] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    
    // Preview State
    const [previewListing, setPreviewListing] = useState<Listing | null>(null);
    const [activeImage, setActiveImage] = useState<string>('');

    const handlePublishNewListing = (newListing: Listing) => {
        setListings(prev => [newListing, ...prev]);
        setIsWizardOpen(false);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 4000);
    };

    const handlePreview = (listing: Listing) => {
        setPreviewListing(listing);
        setActiveImage(listing.imageUrl);
    };

    if (previewListing) {
        return (
            <div className="animate-fade-in max-w-6xl mx-auto pb-10">
                 <button 
                    onClick={() => setPreviewListing(null)} 
                    className="flex items-center text-slate-400 hover:text-white mb-6 transition-colors font-medium text-sm"
                >
                    <ArrowLeftIcon className="w-5 h-5 mr-2" /> Back to Portfolio
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Images Column */}
                    <div className="space-y-4">
                        <div className="aspect-video bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 relative shadow-2xl">
                             <img src={activeImage} alt={previewListing.address} className="w-full h-full object-cover transition-all duration-500" />
                        </div>
                        {previewListing.images && previewListing.images.length > 0 && (
                            <div className="grid grid-cols-4 gap-2">
                                 <button 
                                    onClick={() => setActiveImage(previewListing.imageUrl)}
                                    className={`aspect-video rounded-lg overflow-hidden border-2 transition-all ${activeImage === previewListing.imageUrl ? 'border-emerald-500 opacity-100 scale-95' : 'border-transparent opacity-70 hover:opacity-100'}`}
                                 >
                                    <img src={previewListing.imageUrl} className="w-full h-full object-cover" alt="Main" />
                                 </button>
                                 {previewListing.images.map((img, idx) => (
                                    <button 
                                        key={idx}
                                        onClick={() => setActiveImage(img)}
                                        className={`aspect-video rounded-lg overflow-hidden border-2 transition-all ${activeImage === img ? 'border-emerald-500 opacity-100 scale-95' : 'border-transparent opacity-70 hover:opacity-100'}`}
                                    >
                                        <img src={img} className="w-full h-full object-cover" alt={`Gallery ${idx}`} />
                                    </button>
                                 ))}
                            </div>
                        )}
                    </div>

                    {/* Details Column */}
                    <div className="flex flex-col h-full">
                        <div className="mb-6">
                             <div className="flex justify-between items-start mb-2">
                                <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight">{previewListing.address}</h1>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold border whitespace-nowrap ml-4 ${statusColors[previewListing.status]}`}>
                                    {previewListing.status}
                                </span>
                            </div>
                            <p className="text-emerald-400 text-3xl font-bold tracking-tight">{previewListing.price}</p>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mb-8">
                             <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700 text-center hover:bg-slate-800 transition-colors">
                                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-1">Bedrooms</p>
                                <p className="text-2xl font-bold text-white">{previewListing.beds}</p>
                             </div>
                             <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700 text-center hover:bg-slate-800 transition-colors">
                                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-1">Bathrooms</p>
                                <p className="text-2xl font-bold text-white">{previewListing.baths}</p>
                             </div>
                             <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700 text-center hover:bg-slate-800 transition-colors">
                                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-1">Size</p>
                                <p className="text-2xl font-bold text-white">{previewListing.size} <span className="text-xs text-slate-500 font-normal">sqm</span></p>
                             </div>
                        </div>

                        <div className="mb-8 flex-grow">
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center">Key Amenities</h3>
                            <div className="flex flex-wrap gap-2">
                                 {previewListing.amenities.map((amenity, i) => (
                                    <span key={i} className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg text-sm border border-slate-700 flex items-center">
                                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2"></span>
                                        {amenity}
                                    </span>
                                 ))}
                            </div>
                        </div>

                        {/* Actions Section */}
                        <div className="bg-slate-900/80 rounded-2xl p-5 border border-slate-700/60 backdrop-blur-sm">
                            <h3 className="font-bold text-white mb-3 text-sm uppercase tracking-wider text-slate-400">Quick Actions</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <Button 
                                    onClick={() => onSelectForMarketing(previewListing)}
                                    icon={<SparklesIcon className="w-4 h-4"/>}
                                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 border-none"
                                >
                                    Create Campaign
                                </Button>
                                <Button 
                                    variant="secondary"
                                    onClick={() => {/* Placeholder for edit */}}
                                    icon={<ShareIcon className="w-4 h-4"/>}
                                    className="w-full"
                                >
                                    Share Listing
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6 max-w-6xl mx-auto animate-fade-in relative">
            {/* Success Toast */}
            {showSuccess && (
                <div className="fixed top-20 right-4 md:right-10 z-50 bg-emerald-500 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-fade-in">
                    <div className="bg-white/20 p-2 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <div>
                        <p className="font-bold">Published Successfully!</p>
                        <p className="text-sm opacity-90">Listing added & posted to social media.</p>
                    </div>
                </div>
            )}

            {isWizardOpen && <AddListingWizard onClose={() => setIsWizardOpen(false)} onPublish={handlePublishNewListing} />}

            <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white">My Property Portfolio</h1>
                    <p className="text-gray-400 mt-1">Manage listings and launch instant marketing campaigns.</p>
                </div>
                <Button onClick={() => setIsWizardOpen(true)} className="shadow-lg shadow-emerald-500/20">
                    + Add New Listing
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings.map(listing => (
                    <Card key={listing.id} className="p-0 overflow-hidden flex flex-col group hover:border-emerald-500/50 transition-all duration-300">
                        <div 
                            className="relative overflow-hidden cursor-pointer h-48"
                            onClick={() => handlePreview(listing)}
                        >
                            <img src={listing.imageUrl} alt={listing.address} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                             <div className={`absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full backdrop-blur-md border border-white/10 ${statusColors[listing.status]}`}>
                                {listing.status}
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60"></div>
                            
                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                <span className="bg-white/20 backdrop-blur border border-white/30 text-white px-4 py-2 rounded-full text-sm font-semibold">View Details</span>
                            </div>
                        </div>
                        
                        <div className="p-5 flex flex-col flex-1">
                            <div onClick={() => handlePreview(listing)} className="cursor-pointer flex-1">
                                <p className="font-medium text-white truncate text-lg group-hover:text-emerald-400 transition-colors">{listing.address}</p>
                                <p className="text-2xl font-bold text-emerald-400 my-2">{listing.price}</p>
                                
                                <div className="flex items-center text-sm text-slate-400 space-x-3 mb-4">
                                    <span className="flex items-center gap-1"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> {listing.beds} Beds</span>
                                    <span className="text-slate-600">|</span>
                                    <span className="flex items-center gap-1"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> {listing.baths} Baths</span>
                                    <span className="text-slate-600">|</span>
                                    <span className="flex items-center gap-1"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg> {listing.size} sqm</span>
                                </div>
                            </div>

                            <div className="mt-2 pt-4 border-t border-slate-800 flex justify-between items-center">
                                <span className="text-xs text-slate-500 font-mono">ID: {listing.id}</span>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onSelectForMarketing(listing);
                                    }}
                                    className="flex items-center gap-2 text-xs font-bold text-emerald-400 hover:text-white bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 px-3 py-1.5 rounded-lg transition-all group/btn"
                                >
                                    <SparklesIcon className="w-3 h-3 group-hover/btn:animate-pulse" />
                                    Promote
                                </button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default Listings;
