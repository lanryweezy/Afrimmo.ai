
import React, { useState } from 'react';
import Card from './Card';
import Button from './Button';
import { MarketingObjective, AdCopy, AdCampaign, TargetIncome } from '../types';
import { generateAdCampaign, getGoogleKeywords } from '../services/geminiService';
import { 
    SparklesIcon, TargetIcon, MoneyIcon, KeyIcon, EyeIcon, CursorArrowRaysIcon, 
    PresentationChartLineIcon, FacebookIcon, GoogleIcon, GlobeIcon, 
    DotsHorizontalIcon, DotsVerticalIcon, ThumbUpIcon, ChatAltIcon, ShareIcon 
} from './IconComponents';

interface AutomatedAdsProps {
    generatedAssets: {
        propertyDetails: string;
        objective: MarketingObjective;
        text: string[];
        image: string | null;
        video: string | null;
    } | null;
}

const StatItem: React.FC<{ icon: React.ReactNode, label: string, value: string | number | undefined }> = ({ icon, label, value }) => (
    <div>
        {icon}
        <p className="text-xs text-gray-400">{label}</p>
        <p className="font-semibold text-white text-sm">{value || 'N/A'}</p>
    </div>
);

const AutomatedAds: React.FC<AutomatedAdsProps> = ({ generatedAssets }) => {
    const [budget, setBudget] = useState(50);
    const [duration, setDuration] = useState(7);
    const [location, setLocation] = useState('Lagos, Nigeria');
    const [targetIncome, setTargetIncome] = useState<TargetIncome>('Any');
    const [targetInterests, setTargetInterests] = useState('');
    const [googleKeywords, setGoogleKeywords] = useState<string[]>([]);
    
    const [adPreviews, setAdPreviews] = useState<{ metaAd: AdCopy, googleAd: AdCopy } | null>(null);
    const [campaigns, setCampaigns] = useState<AdCampaign[]>([]);

    const [isLoading, setIsLoading] = useState(false);
    const [isGeneratingKeywords, setIsGeneratingKeywords] = useState(false);
    const [isLaunching, setIsLaunching] = useState(false);
    const [error, setError] = useState('');

    const handleGeneratePreviews = async () => {
        if (!generatedAssets) {
            setError("First, create some content in the 'Create Content' tab.");
            return;
        }
        setError('');
        setIsLoading(true);
        setAdPreviews(null);
        try {
            const previews = await generateAdCampaign(
                generatedAssets.propertyDetails, 
                generatedAssets.objective,
                targetIncome,
                targetInterests.split(',').map(i => i.trim()).filter(Boolean)
            );
            setAdPreviews(previews);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleGenerateKeywords = async () => {
        if (!generatedAssets) return;
        setIsGeneratingKeywords(true);
        setError('');
        try {
            const keywords = await getGoogleKeywords(generatedAssets.propertyDetails);
            setGoogleKeywords(keywords);
        } catch(err: any) {
            setError(err.message);
        } finally {
            setIsGeneratingKeywords(false);
        }
    };

    const handleLaunchCampaign = () => {
        if (!adPreviews || !generatedAssets) return;
        
        setIsLaunching(true);

        const mockMetaImpressions = Math.floor(Math.random() * 8000) + 2000;
        const mockMetaClicks = Math.floor(mockMetaImpressions * (Math.random() * 0.02 + 0.005)); // CTR between 0.5% and 2.5%
        
        const newMetaCampaign: AdCampaign = {
            id: `meta-${Date.now()}`,
            platform: 'Meta',
            status: 'Active',
            budget: budget / 2,
            duration,
            location,
            adCopy: adPreviews.metaAd,
            propertyDetails: generatedAssets.propertyDetails,
            imageUrl: generatedAssets.image,
            targetIncome,
            targetInterests: targetInterests.split(',').map(i => i.trim()).filter(Boolean),
            impressions: mockMetaImpressions,
            clicks: mockMetaClicks,
            ctr: `${((mockMetaClicks / mockMetaImpressions) * 100).toFixed(2)}%`,
            spend: Math.floor((budget/2) * (Math.random() * 0.3 + 0.6)) // spend 60-90% of budget
        };
        
        const mockGoogleImpressions = Math.floor(Math.random() * 6000) + 1500;
        const mockGoogleClicks = Math.floor(mockGoogleImpressions * (Math.random() * 0.04 + 0.01)); // CTR between 1% and 5%

        const newGoogleCampaign: AdCampaign = {
            id: `google-${Date.now()}`,
            platform: 'Google',
            status: 'Active',
            budget: budget / 2,
            duration,
            location,
            adCopy: adPreviews.googleAd,
            propertyDetails: generatedAssets.propertyDetails,
            imageUrl: generatedAssets.image,
            keywords: googleKeywords,
            targetIncome,
            targetInterests: targetInterests.split(',').map(i => i.trim()).filter(Boolean),
            impressions: mockGoogleImpressions,
            clicks: mockGoogleClicks,
            ctr: `${((mockGoogleClicks / mockGoogleImpressions) * 100).toFixed(2)}%`,
            spend: Math.floor((budget/2) * (Math.random() * 0.3 + 0.65)) // spend 65-95% of budget
        };

        setTimeout(() => {
            setCampaigns(prev => [newMetaCampaign, newGoogleCampaign, ...prev]);
            setAdPreviews(null); // Clear previews after launch
            setGoogleKeywords([]);
            setIsLaunching(false);
        }, 1000);
    };

    if (!generatedAssets) {
        return (
            <Card className="text-center">
                <SparklesIcon className="w-12 h-12 mx-auto text-gray-600"/>
                <h3 className="mt-4 text-lg font-semibold text-gray-400">Ready to run ads?</h3>
                <p className="mt-1 text-sm text-gray-500">Go to the "Create Content" tab first to generate your marketing assets. They will appear here, ready for an ad campaign.</p>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            <Card>
                <h2 className="text-xl font-semibold text-white mb-4">Set Up Your Ad Campaign</h2>
                <div className="space-y-4">
                     <Card className="bg-gray-900/50 flex items-center gap-4">
                        {generatedAssets.image && <img src={generatedAssets.image} alt="property" className="w-16 h-16 rounded-lg object-cover"/>}
                        <div>
                            <p className="text-sm text-gray-400">Campaign for:</p>
                            <p className="font-semibold text-white truncate">{generatedAssets.propertyDetails}</p>
                        </div>
                     </Card>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1 flex items-center"><MoneyIcon className="w-4 h-4 mr-1"/> Daily Budget ($)</label>
                            <input type="number" value={budget} onChange={e => setBudget(Number(e.target.value))} className="w-full bg-gray-700 border-gray-600 text-white rounded-lg p-2 focus:ring-teal-500 focus:border-teal-500"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Duration (Days)</label>
                            <input type="number" value={duration} onChange={e => setDuration(Number(e.target.value))} className="w-full bg-gray-700 border-gray-600 text-white rounded-lg p-2 focus:ring-teal-500 focus:border-teal-500"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1 flex items-center"><TargetIcon className="w-4 h-4 mr-1"/> Target Location</label>
                            <input type="text" value={location} onChange={e => setLocation(e.target.value)} className="w-full bg-gray-700 border-gray-600 text-white rounded-lg p-2 focus:ring-teal-500 focus:border-teal-500"/>
                        </div>
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Target Income Level</label>
                            <select value={targetIncome} onChange={e => setTargetIncome(e.target.value as TargetIncome)} className="w-full bg-gray-700 border-gray-600 text-white rounded-lg p-2 focus:ring-teal-500 focus:border-teal-500">
                                <option>Any</option>
                                <option>Mid-Income</option>
                                <option>High-Income</option>
                                <option>Luxury/HNWI</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Target Interests</label>
                            <input type="text" value={targetInterests} onChange={e => setTargetInterests(e.target.value)} placeholder="e.g. golf, investing, luxury" className="w-full bg-gray-700 border-gray-600 text-white rounded-lg p-2 focus:ring-teal-500 focus:border-teal-500"/>
                        </div>
                    </div>
                    
                    <Card className="bg-gray-900/50">
                        <h3 className="font-semibold text-white mb-2">Google Ads Setup</h3>
                        <Button onClick={handleGenerateKeywords} isLoading={isGeneratingKeywords} icon={<KeyIcon className="w-5 h-5"/>} className="w-full" variant="secondary">
                            Generate Keywords with AI
                        </Button>
                        {isGeneratingKeywords && <p className="text-sm text-center text-gray-400 mt-2">Finding the best keywords...</p>}
                        {googleKeywords.length > 0 && (
                            <div className="mt-3">
                                <p className="text-xs font-semibold text-gray-300 mb-2">TARGETED KEYWORDS:</p>
                                <div className="flex flex-wrap gap-2">
                                    {googleKeywords.map((kw, i) => (
                                        <span key={i} className="bg-gray-700 text-teal-300 text-xs font-medium px-2 py-1 rounded-full">{kw}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </Card>

                    <Button onClick={handleGeneratePreviews} isLoading={isLoading} icon={<SparklesIcon className="w-5 h-5"/>} className="w-full">
                        Generate Ad Previews
                    </Button>
                    {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                </div>
            </Card>

            {isLoading && <Card className="text-center text-gray-400">Generating ad previews...</Card>}

            {adPreviews && (
                <div className="space-y-8">
                    <h2 className="text-xl font-semibold text-white text-center">Ad Previews</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        
                        {/* Meta (Facebook) Preview */}
                        <div className="mx-auto w-full max-w-md">
                             <div className="flex items-center justify-between mb-2">
                                <p className="text-sm font-medium text-gray-400 flex items-center"><FacebookIcon className="w-4 h-4 mr-1 text-blue-500"/> Facebook Feed</p>
                             </div>
                            <div className="bg-[#242526] rounded-xl border border-[#3e4042] overflow-hidden shadow-lg font-sans">
                                {/* Header */}
                                <div className="p-3 flex items-start justify-between">
                                    <div className="flex items-center gap-2">
                                        <img src="https://i.pravatar.cc/150?u=afrimmo" alt="Afrimmo" className="w-10 h-10 rounded-full border border-gray-700" />
                                        <div>
                                            <h4 className="text-[15px] font-semibold text-[#e4e6eb] leading-tight">Afrimmo Real Estate</h4>
                                            <div className="flex items-center text-[13px] text-[#b0b3b8]">
                                                <span>Sponsored</span>
                                                <span className="mx-1">·</span>
                                                <GlobeIcon className="w-3 h-3" />
                                            </div>
                                        </div>
                                    </div>
                                    <DotsHorizontalIcon className="w-5 h-5 text-[#b0b3b8]" />
                                </div>
                                
                                {/* Ad Copy */}
                                <div className="px-3 pb-3 text-[15px] text-[#e4e6eb] whitespace-pre-wrap leading-normal">
                                    {adPreviews.metaAd.primaryText}
                                </div>

                                {/* Media */}
                                <div className="relative bg-black">
                                     <img 
                                        src={generatedAssets.image || `https://picsum.photos/seed/${generatedAssets.propertyDetails.slice(0,5)}/600/600`} 
                                        alt="Ad Visual" 
                                        className="w-full h-auto object-cover max-h-[400px]" 
                                    />
                                </div>

                                {/* CTA Section */}
                                <div className="bg-[#323436] p-3 flex justify-between items-center border-t border-[#3e4042]">
                                    <div className="flex-1 min-w-0 pr-4">
                                        <p className="text-[12px] text-[#b0b3b8] uppercase truncate">afrimmo.ai</p>
                                        <h5 className="text-[16px] font-bold text-[#e4e6eb] truncate leading-tight mt-0.5">{adPreviews.metaAd.headline}</h5>
                                    </div>
                                    <button className="bg-[#4b4c4f] hover:bg-[#5c5e61] text-[#e4e6eb] text-[15px] font-semibold px-4 py-1.5 rounded transition-colors whitespace-nowrap">
                                        Learn More
                                    </button>
                                </div>

                                {/* Engagement Footer */}
                                <div className="px-3 py-2 flex items-center justify-between border-t border-[#3e4042] text-[#b0b3b8]">
                                     <div className="flex items-center gap-1.5 text-[14px] font-medium hover:bg-[#3a3b3c] px-2 py-1 rounded cursor-pointer flex-1 justify-center transition-colors">
                                        <ThumbUpIcon className="w-5 h-5" /> <span>Like</span>
                                     </div>
                                     <div className="flex items-center gap-1.5 text-[14px] font-medium hover:bg-[#3a3b3c] px-2 py-1 rounded cursor-pointer flex-1 justify-center transition-colors">
                                        <ChatAltIcon className="w-5 h-5" /> <span>Comment</span>
                                     </div>
                                     <div className="flex items-center gap-1.5 text-[14px] font-medium hover:bg-[#3a3b3c] px-2 py-1 rounded cursor-pointer flex-1 justify-center transition-colors">
                                        <ShareIcon className="w-5 h-5" /> <span>Share</span>
                                     </div>
                                </div>
                            </div>
                        </div>

                        {/* Google Search Preview */}
                        <div className="mx-auto w-full max-w-md">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm font-medium text-gray-400 flex items-center"><GoogleIcon className="w-4 h-4 mr-1"/> Google Search</p>
                             </div>
                            <div className="bg-[#202124] rounded-xl border border-[#3c4043] p-4 font-sans shadow-lg">
                                <div className="flex items-center gap-3 mb-1">
                                    <div className="bg-[#303134] p-1.5 rounded-full">
                                        <img src="https://i.pravatar.cc/150?u=afrimmo" className="w-4 h-4 rounded-full" alt="icon" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[14px] text-[#dadce0] leading-snug">Afrimmo Real Estate</span>
                                        <span className="text-[12px] text-[#bdc1c6] leading-snug truncate">afrimmo.ai › listings › luxury-homes</span>
                                    </div>
                                    <div className="ml-auto">
                                        <DotsVerticalIcon className="w-4 h-4 text-[#9aa0a6]" />
                                    </div>
                                </div>
                                
                                <div className="mb-1">
                                     <span className="text-[12px] font-bold text-[#dadce0]">Sponsored</span>
                                </div>

                                <div className="mb-2">
                                    <h3 className="text-[20px] text-[#8ab4f8] hover:underline cursor-pointer leading-snug">
                                        {adPreviews.googleAd.headline}
                                    </h3>
                                </div>

                                <div className="text-[14px] text-[#bdc1c6] leading-relaxed">
                                    {adPreviews.googleAd.primaryText}
                                </div>
                                
                                {/* Sitelinks Simulation */}
                                <div className="mt-3 pt-3 border-t border-[#3c4043] flex flex-wrap gap-x-4 gap-y-2">
                                    <span className="text-[14px] text-[#8ab4f8] hover:underline cursor-pointer">View Photos</span>
                                    <span className="text-[14px] text-[#8ab4f8] hover:underline cursor-pointer">Schedule Viewing</span>
                                    <span className="text-[14px] text-[#8ab4f8] hover:underline cursor-pointer">Contact Agent</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Button onClick={handleLaunchCampaign} isLoading={isLaunching} className="w-full max-w-md mx-auto block shadow-lg shadow-emerald-900/20">
                        Launch Campaign (${budget * duration} Total)
                    </Button>
                </div>
            )}

             {campaigns.length > 0 && (
                <Card>
                    <h2 className="text-xl font-semibold text-white mb-4">Active Campaigns</h2>
                    <div className="space-y-3">
                        {campaigns.map(c => (
                            <div key={c.id} className="p-3 bg-gray-900/50 rounded-lg">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-bold text-teal-400">{c.platform} Ad Campaign</p>
                                        <p className="text-xs text-gray-400">{c.location} &middot; ${c.budget}/day for {c.duration} days</p>
                                         {(c.targetIncome && c.targetIncome !== 'Any' || (c.targetInterests && c.targetInterests.length > 0)) && (
                                            <p className="text-xs text-gray-500 mt-1">
                                                Targeting: {c.targetIncome !== 'Any' ? c.targetIncome : ''} {c.targetInterests && c.targetInterests.length > 0 ? `with interests in ${c.targetInterests.slice(0, 3).join(', ')}` : ''}
                                                {c.targetInterests && c.targetInterests.length > 3 ? '...' : ''}
                                            </p>
                                        )}
                                    </div>
                                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${c.status === 'Active' ? 'bg-green-500/20 text-green-300' : 'bg-gray-500/20 text-gray-300'}`}>{c.status}</span>
                                </div>
                                <p className="text-sm text-gray-300 mt-2 truncate"><strong>{c.adCopy.headline}:</strong> {c.adCopy.primaryText}</p>
                                
                                <div className="mt-3 pt-3 border-t border-gray-700/50 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                                    <StatItem icon={<MoneyIcon className="w-5 h-5 mx-auto" />} label="Spend" value={`$${c.spend?.toFixed(2)}`} />
                                    <StatItem icon={<EyeIcon className="w-5 h-5 mx-auto" />} label="Impressions" value={c.impressions?.toLocaleString()} />
                                    <StatItem icon={<CursorArrowRaysIcon className="w-5 h-5 mx-auto" />} label="Clicks" value={c.clicks?.toLocaleString()} />
                                    <StatItem icon={<PresentationChartLineIcon className="w-5 h-5 mx-auto" />} label="CTR" value={c.ctr} />
                                </div>

                                {c.platform === 'Google' && c.keywords && c.keywords.length > 0 && (
                                    <div className="mt-2 pt-2 border-t border-gray-700/50">
                                        <p className="text-xs font-semibold text-gray-400 mb-1">Keywords:</p>
                                        <div className="flex flex-wrap gap-1">
                                            {c.keywords.slice(0, 5).map((kw, i) => (
                                                <span key={i} className="bg-gray-700 text-gray-300 text-xs px-1.5 py-0.5 rounded">{kw}</span>
                                            ))}
                                            {c.keywords.length > 5 && <span className="text-xs text-gray-500">+{c.keywords.length - 5} more</span>}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </Card>
            )}

        </div>
    );
};

export default AutomatedAds;
