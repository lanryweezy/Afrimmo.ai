
import React, { useState } from 'react';
import Card from './Card';
import Button from './Button';
import AddListingWizard from './AddListingWizard';
import { Listing, ListingStatus } from '../types';

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

    const handlePublishNewListing = (newListing: Listing) => {
        setListings(prev => [newListing, ...prev]);
        setIsWizardOpen(false);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 4000);
    };

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
                        <div className="relative overflow-hidden">
                            <img src={listing.imageUrl} alt={listing.address} className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-110" />
                             <div className={`absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full backdrop-blur-md border border-white/10 ${statusColors[listing.status]}`}>
                                {listing.status}
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60"></div>
                        </div>
                        <div className="p-5 flex flex-col flex-1">
                            <p className="font-medium text-white truncate text-lg">{listing.address}</p>
                            <p className="text-2xl font-bold text-emerald-400 my-2">{listing.price}</p>
                            
                            <div className="flex items-center text-sm text-slate-400 space-x-3 mb-4">
                                <span className="flex items-center gap-1"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> {listing.beds} Beds</span>
                                <span className="text-slate-600">|</span>
                                <span className="flex items-center gap-1"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> {listing.baths} Baths</span>
                                <span className="text-slate-600">|</span>
                                <span className="flex items-center gap-1"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg> {listing.size} sqm</span>
                            </div>

                            <div className="flex flex-wrap gap-1 mb-4">
                                {listing.amenities.slice(0, 3).map((amenity, i) => (
                                    <span key={i} className="text-[10px] bg-slate-800 text-slate-400 px-2 py-1 rounded-full border border-slate-700">
                                        {amenity}
                                    </span>
                                ))}
                                {listing.amenities.length > 3 && <span className="text-[10px] text-slate-500 px-1 py-1">+{listing.amenities.length - 3} more</span>}
                            </div>

                             <button 
                                onClick={() => onSelectForMarketing(listing)}
                                className="w-full mt-auto bg-slate-800 hover:bg-emerald-600 border border-slate-700 hover:border-emerald-500 text-white font-semibold py-2.5 px-4 rounded-xl transition-all text-sm shadow-sm"
                             >
                                Open Marketing Studio
                            </button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default Listings;