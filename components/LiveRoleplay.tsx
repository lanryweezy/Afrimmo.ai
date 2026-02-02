
// LiveRoleplay component requires Google GenAI API
// This component will not work without a valid API key
import React from 'react';
import Card from './Card';
import Button from './Button';
import { MicrophoneIcon, StopIcon, SpeakerWaveIcon, SparklesIcon } from './IconComponents';

const LiveRoleplay: React.FC = () => {
    return (
        <div className="space-y-6 max-w-4xl mx-auto animate-fade-in">
            <div className="text-center">
                <h1 className="text-2xl sm:text-3xl font-bold text-white">Live Negotiation Coach</h1>
                <p className="text-gray-400 mt-2">Practice your sales pitch with a realistic AI buyer in real-time.</p>
            </div>

            <Card className="flex flex-col items-center justify-center min-h-[400px] relative overflow-hidden border-teal-500/30">
                <div className="text-center relative z-10">
                    <h3 className="text-2xl font-bold text-white mb-2">Feature Not Available</h3>
                    <p className="text-slate-400 max-w-md mx-auto">
                        This feature requires a Google GenAI API key. To enable it, please set the GEMINI_API_KEY environment variable.
                    </p>
                </div>
            </Card>
        </div>
    );
};

export default LiveRoleplay;
