
import React, { useState } from 'react';
import { Listing } from '../types';
import Card from './Card';
import Button from './Button';
import { VideoIcon, SparklesIcon, CheckIcon } from './IconComponents';

interface OnboardingVideoStepProps {
    listings: Listing[];
    onComplete: (videoUrl: string) => void;
}

const OnboardingVideoStep: React.FC<OnboardingVideoStepProps> = ({ listings, onComplete }) => {
    const [selectedListingId, setSelectedListingId] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);

    const handleGenerate = () => {
        if (!selectedListingId) return;
        setIsGenerating(true);

        // Mock video generation
        setTimeout(() => {
            setIsGenerating(false);
            setGeneratedVideo("https://www.w3schools.com/html/mov_bbb.mp4"); // Sample video
        }, 3000);
    };

    return (
        <div className="animate-fade-in text-center">
            {!generatedVideo ? (
                <>
                    <h2 className="text-2xl font-bold text-white mb-2">Create Your First AI Video</h2>
                    <p className="text-slate-400 mb-6 text-sm">Select one of your listings to generate a high-converting AI video tour.</p>

                    <div className="grid grid-cols-2 gap-3 mb-6 max-h-60 overflow-y-auto p-1">
                        {listings.map(listing => (
                            <button
                                key={listing.id}
                                onClick={() => setSelectedListingId(listing.id)}
                                className={`relative rounded-xl overflow-hidden border-2 transition-all ${
                                    selectedListingId === listing.id ? 'border-purple-500 scale-[0.98]' : 'border-transparent opacity-70 grayscale hover:grayscale-0'
                                }`}
                            >
                                <img src={listing.imageUrl} alt="" className="w-full h-24 object-cover" />
                                <div className="absolute inset-x-0 bottom-0 bg-black/60 p-1">
                                    <p className="text-[10px] text-white truncate">{listing.address}</p>
                                </div>
                                {selectedListingId === listing.id && (
                                    <div className="absolute top-1 right-1 bg-purple-500 rounded-full p-1">
                                        <CheckIcon className="w-3 h-3 text-white" />
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>

                    <Button
                        onClick={handleGenerate}
                        disabled={!selectedListingId || isGenerating}
                        isLoading={isGenerating}
                        className="w-full bg-purple-600 hover:bg-purple-500"
                        icon={<VideoIcon className="w-5 h-5" />}
                    >
                        {isGenerating ? "AI is creating your video..." : "Generate AI Video Tour"}
                    </Button>
                </>
            ) : (
                <div className="animate-fade-in">
                    <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <SparklesIcon className="w-10 h-10 text-purple-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Video Ready!</h2>
                    <p className="text-slate-400 mb-6 text-sm">Your AI-generated tour is ready to be shared on Instagram and WhatsApp.</p>

                    <div className="aspect-video bg-black rounded-xl overflow-hidden mb-6 shadow-2xl border border-white/10">
                        <video src={generatedVideo} autoPlay loop muted className="w-full h-full object-cover" />
                    </div>

                    <Button onClick={() => onComplete(generatedVideo)} className="w-full">
                        Continue
                    </Button>
                </div>
            )}
        </div>
    );
};

export default OnboardingVideoStep;
