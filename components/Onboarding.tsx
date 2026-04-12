
import React, { useState } from 'react';
import Button from './Button';
import { SparklesIcon, WhatsAppIcon, ListingsIcon, MarketingIcon, CheckIcon, ChevronRightIcon } from './IconComponents';
import WhatsAppConnect from './WhatsAppConnect';
import OnboardingVideoStep from './OnboardingVideoStep';
import { Listing } from '../types';

interface OnboardingProps {
    onComplete: () => void;
    connectWhatsApp: (status: boolean) => void;
    listings: Listing[];
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete, connectWhatsApp, listings }) => {
    const [step, setStep] = useState(0);
    const [isWhatsAppConnected, setIsWhatsAppConnected] = useState(false);

    const steps = [
        {
            title: "Welcome to Afrimmo AI",
            description: "Your new AI-powered real estate assistant is ready to help you close more deals.",
            icon: <SparklesIcon className="w-12 h-12 text-emerald-400" />,
            color: "emerald"
        },
        {
            title: "Automate Your Pipeline",
            description: "Afrimmo qualifies leads from WhatsApp and Instagram automatically, so you focus on closings.",
            icon: <ListingsIcon className="w-12 h-12 text-blue-400" />,
            color: "blue"
        },
        {
            title: "Generate Viral Content",
            description: "Create video tours, social media posts, and ad campaigns with a single click.",
            icon: <MarketingIcon className="w-12 h-12 text-purple-400" />,
            color: "purple"
        },
        {
            title: "Create Your First Video",
            description: "Let's try generating an AI video tour for one of your listings.",
            isVideoStep: true
        },
        {
            title: "Connect WhatsApp",
            description: "This is the most important step. Link your WhatsApp to enable AI replies.",
            isWhatsAppStep: true
        },
        {
            title: "You're Ready!",
            description: "Your dashboard is ready. Start by adding your first listing or checking your leads.",
            icon: <CheckIcon className="w-12 h-12 text-emerald-500" />,
            color: "emerald"
        }
    ];

    const nextStep = () => {
        if (step < steps.length - 1) {
            setStep(step + 1);
        } else {
            onComplete();
        }
    };

    const handleWhatsAppConnected = () => {
        setIsWhatsAppConnected(true);
        connectWhatsApp(true);
        // Show success for a bit longer
    };

    const currentStep = steps[step];

    return (
        <div className="fixed inset-0 z-[100] bg-slate-950 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-20"></div>

            <div className="w-full max-w-2xl relative z-10">
                {/* Progress Bar */}
                <div className="flex gap-2 mb-8 justify-center">
                    {steps.map((_, i) => (
                        <div
                            key={i}
                            className={`h-1.5 rounded-full transition-all duration-500 ${
                                i === step ? 'w-8 bg-emerald-500' : i < step ? 'w-4 bg-emerald-800' : 'w-4 bg-slate-800'
                            }`}
                        />
                    ))}
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 md:p-12 shadow-2xl overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-24 opacity-5 rounded-full -mr-12 -mt-12 bg-emerald-500"></div>

                    {currentStep.isWhatsAppStep ? (
                        <div className="animate-fade-in">
                            {isWhatsAppConnected ? (
                                <div className="text-center py-12">
                                    <div className="w-20 h-20 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <CheckIcon className="w-10 h-10" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-white mb-2">WhatsApp Connected!</h2>
                                    <p className="text-slate-400 mb-8">Your AI assistant is now ready to chat.</p>
                                    <Button onClick={nextStep}>Continue</Button>
                                </div>
                            ) : (
                                <WhatsAppConnect onConnected={handleWhatsAppConnected} />
                            )}
                        </div>
                    ) : currentStep.isVideoStep ? (
                        <OnboardingVideoStep listings={listings} onComplete={nextStep} />
                    ) : (
                        <div className="text-center animate-fade-in">
                            <div className="flex justify-center mb-8 transform hover:scale-110 transition-transform duration-500">
                                <div className={`p-6 rounded-2xl bg-slate-950 border border-white/5 shadow-xl`}>
                                    {currentStep.icon}
                                </div>
                            </div>

                            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
                                {currentStep.title}
                            </h1>
                            <p className="text-slate-400 text-lg mb-10 leading-relaxed max-w-md mx-auto font-light">
                                {currentStep.description}
                            </p>

                            <Button onClick={nextStep} className="px-10 py-4 text-lg group">
                                {step === steps.length - 1 ? "Enter Dashboard" : "Continue"}
                                <ChevronRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </div>
                    )}
                </div>

                {step < steps.length - 1 && !currentStep.isWhatsAppStep && (
                    <button
                        onClick={onComplete}
                        className="mt-6 text-slate-500 hover:text-white text-sm font-medium transition-colors mx-auto block"
                    >
                        Skip Onboarding
                    </button>
                )}
            </div>
        </div>
    );
};

export default Onboarding;
