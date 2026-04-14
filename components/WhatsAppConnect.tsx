import React, { useState, useEffect } from 'react';
import Button from './Button';
import { WhatsAppIcon, CheckIcon, SparklesIcon } from './IconComponents';
import { useToast } from '../src/contexts/ToastContext';

interface WhatsAppConnectProps {
    onConnected: () => void;
}

const WhatsAppConnect: React.FC<WhatsAppConnectProps> = ({ onConnected }) => {
    const [step, setStep] = useState<'initial' | 'qr' | 'connecting' | 'success'>('initial');
    const { showToast } = useToast();

    const startConnection = () => {
        setStep('qr');
    };

    const simulateScan = () => {
        setStep('connecting');
        setTimeout(() => {
            setStep('success');
            showToast("WhatsApp connected successfully!", "success");
            setTimeout(() => {
                onConnected();
            }, 2000);
        }, 3000);
    };

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md mx-auto text-center shadow-2xl">
            {step === 'initial' && (
                <div className="animate-fade-in">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/20">
                        <WhatsAppIcon className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Connect WhatsApp</h2>
                    <p className="text-slate-400 mb-6 leading-relaxed text-sm">
                        Link your WhatsApp Business account to enable AI-powered lead qualification and automated replies.
                    </p>

                    <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-4 mb-8 text-left">
                        <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3">How to connect:</h3>
                        <ul className="space-y-2">
                            <li className="flex items-start gap-3 text-xs text-slate-300">
                                <span className="flex-shrink-0 w-4 h-4 rounded-full bg-slate-800 flex items-center justify-center text-[9px] font-bold">1</span>
                                Open WhatsApp on your phone
                            </li>
                            <li className="flex items-start gap-3 text-xs text-slate-300">
                                <span className="flex-shrink-0 w-4 h-4 rounded-full bg-slate-800 flex items-center justify-center text-[9px] font-bold">2</span>
                                Tap Menu or Settings and select Linked Devices
                            </li>
                            <li className="flex items-start gap-3 text-xs text-slate-300">
                                <span className="flex-shrink-0 w-4 h-4 rounded-full bg-slate-800 flex items-center justify-center text-[9px] font-bold">3</span>
                                Tap on Link a Device and point your phone to the QR code
                            </li>
                        </ul>
                    </div>

                    <Button onClick={startConnection} className="w-full py-3 text-lg">
                        Get Started
                    </Button>
                </div>
            )}

            {step === 'qr' && (
                <div className="animate-fade-in">
                    <h2 className="text-xl font-bold text-white mb-2">Scan QR Code</h2>
                    <p className="text-slate-400 text-sm mb-6">Open WhatsApp on your phone {'->'} Settings {'->'} Linked Devices</p>

                    <div className="bg-white p-4 rounded-xl inline-block mb-6 relative group cursor-pointer" onClick={simulateScan}>
                        <img
                            src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=Afrimmo-AI-Connection-Sim"
                            alt="WhatsApp QR Code"
                            className="w-48 h-48"
                        />
                        <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-xl">
                            <p className="text-white font-bold text-sm bg-slate-900/80 px-3 py-1 rounded-full">Click to simulate scan</p>
                        </div>
                    </div>

                    <p className="text-[10px] text-slate-500 uppercase tracking-widest animate-pulse font-bold">Waiting for scan...</p>
                </div>
            )}

            {step === 'connecting' && (
                <div className="animate-fade-in py-12">
                    <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                    <h2 className="text-xl font-bold text-white mb-2">Authenticating...</h2>
                    <p className="text-slate-400 text-sm">Syncing your chats and contacts.</p>
                </div>
            )}

            {step === 'success' && (
                <div className="animate-fade-in py-8">
                    <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce shadow-lg shadow-emerald-500/20">
                        <CheckIcon className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">WhatsApp Connected!</h2>
                    <p className="text-slate-400 mb-6">Your AI agent is now active and ready to handle leads.</p>
                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3 flex items-center gap-3 text-left">
                        <SparklesIcon className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                        <p className="text-xs text-emerald-300">Tip: You can now chat with your AI agent directly by messaging your own number.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WhatsAppConnect;
