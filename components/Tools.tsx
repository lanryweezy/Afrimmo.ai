
import React, { useState } from 'react';
import Card from './Card';
import PropertyValuator from './PropertyValuator';
import MarketInsights from './MarketInsights';
import VideoStudio from './VideoStudio';
import LiveRoleplay from './LiveRoleplay';
import { PropertyValuatorIcon, MarketInsightsIcon, VideoIcon, MicrophoneIcon } from './IconComponents';

type Tool = 'valuator' | 'insights' | 'video-studio' | 'roleplay';

const Tools: React.FC = () => {
    const [activeTool, setActiveTool] = useState<Tool | null>(null);

    const renderContent = () => {
        if (activeTool === 'valuator') {
            return <PropertyValuator />;
        }
        if (activeTool === 'insights') {
            return <MarketInsights />;
        }
        if (activeTool === 'video-studio') {
            return <VideoStudio />;
        }
        if (activeTool === 'roleplay') {
            return <LiveRoleplay />;
        }

        return (
             <div className="space-y-6 text-center animate-fade-in">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white">AI Tools</h1>
                    <p className="text-gray-400 mt-2">Access powerful AI utilities to enhance your work.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
                    <button onClick={() => setActiveTool('valuator')} className="text-left w-full h-full">
                        <Card className="hover:bg-gray-700 hover:border-teal-500 border-2 border-transparent transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col min-h-[200px]">
                            <div className="flex items-center justify-center bg-gray-900 rounded-lg w-12 h-12 mb-4">
                               <PropertyValuatorIcon className="w-6 h-6 text-yellow-400" />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">AI Property Valuator</h3>
                            <p className="text-gray-400 text-sm flex-grow">Get an AI-powered valuation report for any property, including market analysis and comps.</p>
                        </Card>
                    </button>
                    <button onClick={() => setActiveTool('insights')} className="text-left w-full h-full">
                        <Card className="hover:bg-gray-700 hover:border-teal-500 border-2 border-transparent transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col min-h-[200px]">
                             <div className="flex items-center justify-center bg-gray-900 rounded-lg w-12 h-12 mb-4">
                               <MarketInsightsIcon className="w-6 h-6 text-blue-400" />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">Market Insights Engine</h3>
                            <p className="text-gray-400 text-sm flex-grow">Get AI-driven analysis on property trends, pricing, and neighborhood data.</p>
                        </Card>
                    </button>
                    <button onClick={() => setActiveTool('video-studio')} className="text-left w-full h-full">
                        <Card className="hover:bg-gray-700 hover:border-teal-500 border-2 border-transparent transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col min-h-[200px]">
                             <div className="flex items-center justify-center bg-gray-900 rounded-lg w-12 h-12 mb-4">
                               <VideoIcon className="w-6 h-6 text-purple-400" />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">AI Video Studio</h3>
                            <p className="text-gray-400 text-sm flex-grow">Generate cinematic video tours from property photos instantly.</p>
                        </Card>
                    </button>
                     <button onClick={() => setActiveTool('roleplay')} className="text-left w-full h-full">
                        <Card className="hover:bg-gray-700 hover:border-teal-500 border-2 border-transparent transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col min-h-[200px] relative overflow-hidden group">
                             <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                             <div className="flex items-center justify-center bg-gray-900 rounded-lg w-12 h-12 mb-4 relative z-10">
                               <MicrophoneIcon className="w-6 h-6 text-emerald-400" />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2 relative z-10">Live Negotiation Coach</h3>
                            <p className="text-gray-400 text-sm flex-grow relative z-10">Practice your sales pitch with a real-time voice AI buyer.</p>
                            <span className="absolute top-4 right-4 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">NEW</span>
                        </Card>
                    </button>
                </div>
            </div>
        );
    };

    return <>{renderContent()}</>;
};

export default Tools;
