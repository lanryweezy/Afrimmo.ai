
import React, { useState, useRef } from 'react';
import Button from './Button';
import { generateSocialBundle, generateListingVideo } from '../services/geminiService';
import { SocialBundle, Listing } from '../types';
import { SparklesIcon, CheckIcon, InstagramIcon, WhatsAppIcon, VideoIcon, ImageIcon } from './IconComponents';

interface AddListingWizardProps {
    onClose: () => void;
    onPublish: (listing: Listing) => void;
}

const AddListingWizard: React.FC<AddListingWizardProps> = ({ onClose, onPublish }) => {
    const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
    const [address, setAddress] = useState('');
    const [price, setPrice] = useState('');
    const [beds, setBeds] = useState('');
    const [baths, setBaths] = useState('');
    const [size, setSize] = useState('');
    const [features, setFeatures] = useState('');
    
    // Multiple image handling
    const [selectedImages, setSelectedImages] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [isProcessing, setIsProcessing] = useState(false);
    const [processingStage, setProcessingStage] = useState('');
    const [socialBundle, setSocialBundle] = useState<SocialBundle | null>(null);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            files.forEach(file => {
                const reader = new FileReader();
                reader.onload = (ev) => {
                    const result = ev.target?.result as string;
                    if (result) {
                        setSelectedImages(prev => [...prev, result]);
                    }
                };
                reader.readAsDataURL(file as Blob);
            });
        }
    };

    const handleGenerate = async () => {
        if (!address || !price || selectedImages.length === 0) return;
        
        setStep(3);
        setIsProcessing(true);
        
        const propertyDetails = `${beds} bedroom, ${baths} bath house at ${address}. ${features}. Size: ${size}sqm.`;

        try {
            setProcessingStage('Analyzing visuals...');
            // 1. Generate Text Bundle
            setProcessingStage('Drafting viral captions...');
            const bundlePromise = generateSocialBundle(propertyDetails, price);
            
            // 2. Generate Video (Veo)
            setProcessingStage('Animating photos into video tour (Veo)...');
            // Pass the array of images to the service
            const videoPromise = generateListingVideo(selectedImages, propertyDetails);

            const [bundle, video] = await Promise.all([bundlePromise, videoPromise]);
            
            setSocialBundle(bundle);
            setVideoUrl(video);
            
            setStep(4);
        } catch (error) {
            console.error(error);
            alert("Error generating content. Please ensure you have uploaded valid photos.");
            setStep(2);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleFinalPublish = () => {
        // Create the listing object
        const newListing: Listing = {
            id: Date.now().toString(),
            address,
            price,
            status: 'Available',
            imageUrl: selectedImages[0] || '', // Use the first image as the cover
            beds: parseInt(beds) || 0,
            baths: parseInt(baths) || 0,
            size: parseInt(size) || 0,
            amenities: features.split(',').map(f => f.trim()).filter(f => f.length > 0)
        };
        onPublish(newListing);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <SparklesIcon className="w-5 h-5 text-emerald-400" />
                        Instant Listing Wizard
                    </h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white">&times;</button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    {step === 1 && (
                        <div className="space-y-4 animate-fade-in">
                            <h3 className="text-xl font-semibold text-white text-center mb-6">Property Essentials</h3>
                            <div className="space-y-4">
                                <input type="text" placeholder="Property Address" value={address} onChange={e => setAddress(e.target.value)} className="w-full bg-slate-800 border-slate-700 rounded-lg p-3 text-white focus:ring-emerald-500 focus:border-emerald-500" />
                                <input type="text" placeholder="Price (e.g., ₦150,000,000)" value={price} onChange={e => setPrice(e.target.value)} className="w-full bg-slate-800 border-slate-700 rounded-lg p-3 text-white focus:ring-emerald-500 focus:border-emerald-500" />
                                <div className="grid grid-cols-3 gap-4">
                                    <input type="number" placeholder="Beds" value={beds} onChange={e => setBeds(e.target.value)} className="bg-slate-800 border-slate-700 rounded-lg p-3 text-white" />
                                    <input type="number" placeholder="Baths" value={baths} onChange={e => setBaths(e.target.value)} className="bg-slate-800 border-slate-700 rounded-lg p-3 text-white" />
                                    <input type="number" placeholder="Size (sqm)" value={size} onChange={e => setSize(e.target.value)} className="bg-slate-800 border-slate-700 rounded-lg p-3 text-white" />
                                </div>
                                <textarea placeholder="Key Amenities (comma separated, e.g., Pool, Cinema, Gym)" value={features} onChange={e => setFeatures(e.target.value)} rows={3} className="w-full bg-slate-800 border-slate-700 rounded-lg p-3 text-white" />
                            </div>
                            <div className="pt-4">
                                <Button onClick={() => setStep(2)} className="w-full" disabled={!address || !price}>Next: Upload Visuals</Button>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6 animate-fade-in text-center">
                            <h3 className="text-xl font-semibold text-white">Upload Property Photos</h3>
                            <p className="text-slate-400 text-sm">Upload at least 1 photo (up to 5 recommended). AI will stitch them into a video tour.</p>
                            
                            <div 
                                onClick={() => fileInputRef.current?.click()}
                                className="border-2 border-dashed border-slate-600 hover:border-emerald-500 bg-slate-800/50 rounded-2xl p-8 cursor-pointer transition-all group"
                            >
                                {selectedImages.length > 0 ? (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                        {selectedImages.map((img, idx) => (
                                            <img key={idx} src={img} alt={`Upload ${idx}`} className="h-24 w-full object-cover rounded-lg shadow-sm" />
                                        ))}
                                        <div className="h-24 flex items-center justify-center bg-slate-800 rounded-lg border border-slate-700 text-slate-400 text-xs">
                                            + Add More
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center">
                                        <ImageIcon className="w-16 h-16 text-slate-500 group-hover:text-emerald-400 mb-4" />
                                        <p className="text-slate-300 font-medium">Click to upload photos</p>
                                    </div>
                                )}
                                <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" multiple />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <Button variant="secondary" onClick={() => setStep(1)} className="flex-1">Back</Button>
                                <Button onClick={handleGenerate} className="flex-1" disabled={selectedImages.length === 0}>
                                    Generate Viral Bundle <SparklesIcon className="w-4 h-4 ml-2" />
                                </Button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="flex flex-col items-center justify-center py-12 animate-fade-in space-y-6">
                            <div className="relative w-24 h-24">
                                <div className="absolute inset-0 border-4 border-slate-700 rounded-full"></div>
                                <div className="absolute inset-0 border-4 border-emerald-500 rounded-full border-t-transparent animate-spin"></div>
                                <SparklesIcon className="absolute inset-0 m-auto w-10 h-10 text-emerald-400 animate-pulse" />
                            </div>
                            <div className="text-center space-y-2">
                                <h3 className="text-xl font-bold text-white">AI is at work</h3>
                                <p className="text-emerald-400 font-medium animate-pulse">{processingStage}</p>
                                <p className="text-slate-500 text-sm max-w-xs mx-auto">Animating your photos, writing captions, and optimizing for hashtags...</p>
                            </div>
                        </div>
                    )}

                    {step === 4 && socialBundle && (
                        <div className="space-y-6 animate-fade-in">
                            <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl text-center mb-4">
                                <h3 className="text-emerald-400 font-bold text-lg">Ready to Launch! 🚀</h3>
                                <p className="text-slate-400 text-sm">Your listing is ready for all platforms.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Video Preview */}
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Generated Video Tour</label>
                                    <div className="aspect-[9/16] bg-black rounded-lg overflow-hidden relative shadow-lg border border-slate-700">
                                        {videoUrl ? (
                                            <video src={videoUrl} controls autoPlay loop className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-slate-500">Video failed to load</div>
                                        )}
                                        <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-white flex items-center gap-1">
                                            <VideoIcon className="w-3 h-3" /> AI Animated
                                        </div>
                                    </div>
                                </div>

                                {/* Captions Preview */}
                                <div className="space-y-4 overflow-y-auto max-h-[400px] pr-2">
                                    <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                                        <div className="flex items-center gap-2 mb-2 text-pink-500 font-bold text-sm">
                                            <InstagramIcon className="w-4 h-4" /> Instagram
                                        </div>
                                        <p className="text-sm text-slate-300 whitespace-pre-wrap">{socialBundle.instagramCaption}</p>
                                        <div className="mt-2 flex flex-wrap gap-1">
                                            {socialBundle.hashtags.map(tag => <span key={tag} className="text-xs text-blue-400">{tag} </span>)}
                                        </div>
                                    </div>

                                    <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                                        <div className="flex items-center gap-2 mb-2 text-green-500 font-bold text-sm">
                                            <WhatsAppIcon className="w-4 h-4" /> WhatsApp Status
                                        </div>
                                        <p className="text-sm text-slate-300 whitespace-pre-wrap">{socialBundle.whatsappMessage}</p>
                                    </div>

                                    <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                                        <div className="flex items-center gap-2 mb-2 text-red-500 font-bold text-sm">
                                            <VideoIcon className="w-4 h-4" /> YouTube Shorts
                                        </div>
                                        <p className="text-sm font-bold text-white">{socialBundle.youtubeTitle}</p>
                                        <p className="text-xs text-slate-400 mt-1">{socialBundle.youtubeDescription}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4 border-t border-slate-800">
                                <Button variant="secondary" onClick={() => setStep(2)} className="flex-1">Edit</Button>
                                <Button onClick={handleFinalPublish} className="flex-[2] bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500">
                                    Post to All Platforms
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AddListingWizard;
