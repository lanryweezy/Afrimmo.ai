
import React, { useState, useRef } from 'react';
import Card from './Card';
import Button from './Button';
import { generateListingVideo } from '../services/geminiService';
import { VideoIcon, ImageIcon, SparklesIcon, CheckIcon } from './IconComponents';

const VideoStudio: React.FC = () => {
    const [images, setImages] = useState<string[]>([]);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            // We will take the first few images for generation but can show more.
            const newImages: string[] = [];
             let processedCount = 0;

            files.forEach(file => {
                const reader = new FileReader();
                reader.onload = (ev) => {
                    const result = ev.target?.result as string;
                    if (result) {
                        newImages.push(result);
                    }
                    processedCount++;
                    if (processedCount === files.length) {
                         setImages(prev => [...prev, ...newImages].slice(0, 5)); // Limit to 5 total
                    }
                };
                reader.readAsDataURL(file as Blob);
            });
        }
    };

    const handleGenerate = async () => {
        if (images.length === 0) {
            setError("Please upload at least one image.");
            return;
        }
        setIsGenerating(true);
        setError('');
        setVideoUrl(null);

        try {
            const url = await generateListingVideo(images, "Luxury property showcase.");
            setVideoUrl(url);
        } catch (err: any) {
            setError(err.message || "Failed to generate video.");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto animate-fade-in">
             <div className="text-center">
                <h1 className="text-2xl sm:text-3xl font-bold text-white">AI Video Studio</h1>
                <p className="text-gray-400 mt-2">Turn property photos into cinematic video tours.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card>
                    <h2 className="text-lg font-bold text-white mb-4">1. Upload Photos</h2>
                     <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-slate-600 hover:border-emerald-500 bg-slate-800/50 rounded-xl p-8 cursor-pointer transition-all group text-center"
                    >
                        <ImageIcon className="w-12 h-12 mx-auto text-slate-500 group-hover:text-emerald-400 mb-3" />
                        <p className="text-slate-300 font-medium text-sm">Click to upload photos</p>
                        <p className="text-slate-500 text-xs mt-1">Select up to 5 images</p>
                        <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" multiple />
                    </div>

                    {images.length > 0 && (
                        <div className="mt-4 grid grid-cols-3 gap-2">
                            {images.map((img, i) => (
                                <div key={i} className="relative aspect-square">
                                    <img src={img} alt="" className="w-full h-full object-cover rounded-lg" />
                                    <div className="absolute top-1 right-1 bg-black/50 text-white text-[10px] px-1.5 rounded-full">{i + 1}</div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="mt-6">
                         <Button onClick={handleGenerate} isLoading={isGenerating} disabled={images.length === 0} className="w-full">
                            <SparklesIcon className="w-4 h-4 mr-2" /> Generate Video
                        </Button>
                        {error && <p className="text-red-400 text-sm mt-2 text-center">{error}</p>}
                    </div>
                </Card>

                <Card className="flex flex-col">
                    <h2 className="text-lg font-bold text-white mb-4">2. Generated Video</h2>
                    <div className="flex-1 bg-black/40 rounded-xl border border-slate-700 flex items-center justify-center overflow-hidden min-h-[300px]">
                        {isGenerating ? (
                            <div className="text-center p-6">
                                <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                                <p className="text-emerald-400 font-medium animate-pulse">Creating cinematic tour...</p>
                                <p className="text-slate-500 text-xs mt-2">Stitching photos • Adding transitions</p>
                            </div>
                        ) : videoUrl ? (
                            <video src={videoUrl} controls autoPlay loop className="w-full h-full object-contain" />
                        ) : (
                            <div className="text-center text-slate-500">
                                <VideoIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                <p className="text-sm">Generated video will appear here</p>
                            </div>
                        )}
                    </div>
                    {videoUrl && (
                        <div className="mt-4">
                             <Button variant="secondary" className="w-full" onClick={() => {
                                 const a = document.createElement('a');
                                 a.href = videoUrl;
                                 a.download = 'property_tour.mp4';
                                 a.click();
                             }}>
                                Download Video
                            </Button>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default VideoStudio;
