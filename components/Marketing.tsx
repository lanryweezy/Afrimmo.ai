
import React, { useState } from 'react';
import ContentStudio from './ContentStudio';
import SocialPublisher from './SocialPublisher';
import AutomatedAds from './AutomatedAds';
import { MarketingObjective, Listing } from '../types';

type MarketingTab = 'create' | 'schedule' | 'ads';

interface GeneratedAssets {
    propertyDetails: string;
    objective: MarketingObjective;
    text: string[];
    image: string | null;
    video: string | null;
}

interface MarketingProps {
    selectedListing: Listing | null;
    clearSelectedListing: () => void;
}

const Marketing: React.FC<MarketingProps> = ({ selectedListing, clearSelectedListing }) => {
    const [activeTab, setActiveTab] = useState<MarketingTab>('create');
    const [generatedAssets, setGeneratedAssets] = useState<GeneratedAssets | null>(null);
    const [contentToSchedule, setContentToSchedule] = useState<string | null>(null);

    const handleContentGenerated = (assets: GeneratedAssets) => {
        setGeneratedAssets(assets);
    };
    
    const handleScheduleContent = (text: string) => {
        setContentToSchedule(text);
        setActiveTab('schedule');
    };

    const clearGeneratedContentForScheduler = () => {
        setContentToSchedule(null);
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto animate-fade-in">
            <div className="text-center">
                <h1 className="text-2xl sm:text-3xl font-bold text-white">Marketing Suite</h1>
                <p className="text-gray-400 mt-2">Your AI-powered content, scheduling, and advertising hub.</p>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-2">
                <div className="grid grid-cols-3 items-center justify-center gap-x-2">
                    <TabButton name="Create Content" tab="create" activeTab={activeTab} onClick={setActiveTab} />
                    <TabButton name="Schedule & Publish" tab="schedule" activeTab={activeTab} onClick={setActiveTab} />
                    <TabButton name="Automated Ads" tab="ads" activeTab={activeTab} onClick={setActiveTab} />
                </div>
            </div>

            <div>
                {activeTab === 'create' && (
                    <ContentStudio 
                        onContentGenerated={handleContentGenerated} 
                        onSchedule={handleScheduleContent}
                        selectedListing={selectedListing} 
                        clearSelectedListing={clearSelectedListing} 
                    />
                )}
                {activeTab === 'schedule' && (
                    <SocialPublisher 
                        initialContent={contentToSchedule} 
                        clearInitialContent={clearGeneratedContentForScheduler} 
                    />
                )}
                {activeTab === 'ads' && <AutomatedAds generatedAssets={generatedAssets} />}
            </div>
        </div>
    );
};

const TabButton: React.FC<{name: string, tab: MarketingTab, activeTab: MarketingTab, onClick: (tab: MarketingTab) => void}> = ({ name, tab, activeTab, onClick }) => (
    <button 
        onClick={() => onClick(tab)}
        className={`w-full px-2 py-2 text-xs sm:text-sm font-semibold rounded-md transition-colors ${
            activeTab === tab ? 'bg-teal-500 text-white' : 'bg-transparent text-gray-400 hover:bg-gray-700'
        }`}
    >
        {name}
    </button>
);


export default Marketing;
