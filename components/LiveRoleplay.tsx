
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality, Blob } from '@google/genai';
import Card from './Card';
import Button from './Button';
import { MicrophoneIcon, StopIcon, SpeakerWaveIcon, SparklesIcon } from './IconComponents';

const LiveRoleplay: React.FC = () => {
    const [isActive, setIsActive] = useState(false);
    const [status, setStatus] = useState('Ready');
    const [volume, setVolume] = useState(0);
    const [error, setError] = useState('');
    
    // Audio Context & Processing Refs
    const inputAudioContextRef = useRef<AudioContext | null>(null);
    const outputAudioContextRef = useRef<AudioContext | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const processorRef = useRef<ScriptProcessorNode | null>(null);
    const sessionPromiseRef = useRef<Promise<any> | null>(null);
    const nextStartTimeRef = useRef<number>(0);
    const audioSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
    const animationFrameRef = useRef<number | null>(null);

    // Initializer for the Google GenAI Client
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    // --- Audio Helpers ---
    function createBlob(data: Float32Array): Blob {
        const l = data.length;
        const int16 = new Int16Array(l);
        for (let i = 0; i < l; i++) {
            int16[i] = data[i] * 32768;
        }
        
        let binary = '';
        const bytes = new Uint8Array(int16.buffer);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        const b64 = btoa(binary);

        return {
            data: b64,
            mimeType: 'audio/pcm;rate=16000',
        };
    }

    function decode(base64: string) {
        const binaryString = atob(base64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes;
    }

    async function decodeAudioData(
        data: Uint8Array,
        ctx: AudioContext,
        sampleRate: number,
        numChannels: number,
    ): Promise<AudioBuffer> {
        const dataInt16 = new Int16Array(data.buffer);
        const frameCount = dataInt16.length / numChannels;
        const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

        for (let channel = 0; channel < numChannels; channel++) {
            const channelData = buffer.getChannelData(channel);
            for (let i = 0; i < frameCount; i++) {
                channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
            }
        }
        return buffer;
    }

    const startSession = async () => {
        setError('');
        setStatus('Connecting...');
        try {
            // 1. Setup Audio Contexts
            const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
            inputAudioContextRef.current = new AudioContextClass({ sampleRate: 16000 });
            outputAudioContextRef.current = new AudioContextClass({ sampleRate: 24000 });
            
            // 2. Get User Media
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaStreamRef.current = stream;

            // 3. Connect to Gemini Live
            const sessionPromise = ai.live.connect({
                model: 'gemini-2.5-flash-native-audio-preview-09-2025',
                callbacks: {
                    onopen: () => {
                        setStatus('Live');
                        setIsActive(true);
                        
                        // Setup Input Stream processing inside onopen
                        if (!inputAudioContextRef.current) return;
                        const source = inputAudioContextRef.current.createMediaStreamSource(stream);
                        const processor = inputAudioContextRef.current.createScriptProcessor(4096, 1, 1);
                        processorRef.current = processor;

                        processor.onaudioprocess = (e) => {
                            const inputData = e.inputBuffer.getChannelData(0);
                            
                            // Simple visualizer logic
                            let sum = 0;
                            for(let i=0; i<inputData.length; i++) sum += Math.abs(inputData[i]);
                            setVolume(Math.min(100, (sum / inputData.length) * 500));

                            const pcmBlob = createBlob(inputData);
                            sessionPromise.then((session: any) => {
                                session.sendRealtimeInput({ media: pcmBlob });
                            });
                        };

                        source.connect(processor);
                        processor.connect(inputAudioContextRef.current.destination);
                    },
                    onmessage: async (message: LiveServerMessage) => {
                        const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
                        
                        if (base64Audio && outputAudioContextRef.current) {
                            const ctx = outputAudioContextRef.current;
                            nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
                            
                            const audioBytes = decode(base64Audio);
                            const audioBuffer = await decodeAudioData(audioBytes, ctx, 24000, 1);
                            
                            const source = ctx.createBufferSource();
                            source.buffer = audioBuffer;
                            source.connect(ctx.destination);
                            
                            source.addEventListener('ended', () => {
                                audioSourcesRef.current.delete(source);
                            });
                            
                            source.start(nextStartTimeRef.current);
                            nextStartTimeRef.current += audioBuffer.duration;
                            audioSourcesRef.current.add(source);
                        }
                        
                        const interrupted = message.serverContent?.interrupted;
                        if (interrupted) {
                            audioSourcesRef.current.forEach(src => src.stop());
                            audioSourcesRef.current.clear();
                            nextStartTimeRef.current = 0;
                        }
                    },
                    onclose: () => {
                        setStatus('Disconnected');
                        setIsActive(false);
                    },
                    onerror: (e) => {
                        console.error(e);
                        setError('Connection error');
                        stopSession();
                    }
                },
                config: {
                    responseModalities: [Modality.AUDIO],
                    speechConfig: {
                        voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
                    },
                    systemInstruction: "You are a tough negotiator looking to buy a property in Lagos. You think the price is too high and are skeptical about the value. The user is a real estate agent trying to convince you. Be conversational, keep responses short (under 2 sentences), and react naturally to what the agent says. Do not be easily convinced.",
                },
            });
            sessionPromiseRef.current = sessionPromise;

        } catch (err: any) {
            console.error(err);
            setError('Failed to start audio session. Please allow microphone access.');
            stopSession();
        }
    };

    const stopSession = () => {
        setIsActive(false);
        setStatus('Ready');
        setVolume(0);

        // Close Gemini Session
        if (sessionPromiseRef.current) {
            sessionPromiseRef.current.then((session: any) => {
               try { session.close(); } catch(e) {} 
            });
            sessionPromiseRef.current = null;
        }

        // Stop Media Stream
        if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach(track => track.stop());
            mediaStreamRef.current = null;
        }

        // Disconnect Processor
        if (processorRef.current) {
            processorRef.current.disconnect();
            processorRef.current = null;
        }

        // Close Audio Contexts
        if (inputAudioContextRef.current) {
            inputAudioContextRef.current.close();
            inputAudioContextRef.current = null;
        }
        if (outputAudioContextRef.current) {
            outputAudioContextRef.current.close();
            outputAudioContextRef.current = null;
        }
        
        audioSourcesRef.current.forEach(src => src.stop());
        audioSourcesRef.current.clear();
        nextStartTimeRef.current = 0;
    };

    useEffect(() => {
        return () => stopSession();
    }, []);

    return (
        <div className="space-y-6 max-w-4xl mx-auto animate-fade-in">
            <div className="text-center">
                <h1 className="text-2xl sm:text-3xl font-bold text-white">Live Negotiation Coach</h1>
                <p className="text-gray-400 mt-2">Practice your sales pitch with a realistic AI buyer in real-time.</p>
            </div>

            <Card className="flex flex-col items-center justify-center min-h-[400px] relative overflow-hidden border-teal-500/30">
                {/* Visualizer Background */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                     <div 
                        className="bg-emerald-500 rounded-full blur-3xl transition-all duration-100 ease-out"
                        style={{
                            width: `${200 + volume * 5}px`,
                            height: `${200 + volume * 5}px`,
                            opacity: isActive ? 0.4 : 0
                        }}
                     />
                </div>

                <div className={`relative z-10 w-32 h-32 rounded-full flex items-center justify-center transition-all duration-500 ${isActive ? 'bg-gradient-to-br from-emerald-500 to-teal-600 shadow-[0_0_50px_rgba(16,185,129,0.5)]' : 'bg-slate-800 border-4 border-slate-700'}`}>
                    {isActive ? (
                        <SpeakerWaveIcon className="w-16 h-16 text-white animate-pulse" />
                    ) : (
                        <MicrophoneIcon className="w-12 h-12 text-slate-500" />
                    )}
                </div>

                <div className="mt-8 text-center relative z-10">
                    <h3 className="text-2xl font-bold text-white mb-2">{status}</h3>
                    <p className="text-slate-400 max-w-md mx-auto">
                        {isActive 
                            ? "AI is listening... Speak naturally to negotiate the deal." 
                            : "Press Start to begin a roleplay session with a skeptical buyer."}
                    </p>
                </div>

                <div className="mt-10 relative z-10">
                    {!isActive ? (
                        <Button onClick={startSession} className="px-8 py-4 text-lg rounded-full shadow-xl shadow-emerald-900/40">
                            <MicrophoneIcon className="w-6 h-6 mr-2" /> Start Roleplay
                        </Button>
                    ) : (
                        <Button onClick={stopSession} variant="danger" className="px-8 py-4 text-lg rounded-full shadow-xl shadow-rose-900/40">
                            <StopIcon className="w-6 h-6 mr-2" /> End Session
                        </Button>
                    )}
                </div>

                {error && <p className="mt-4 text-red-400 text-sm bg-red-500/10 px-4 py-2 rounded-full">{error}</p>}
                
                <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-700 text-xs text-slate-400 flex items-center gap-2">
                    <SparklesIcon className="w-3 h-3 text-emerald-400"/> Powered by Gemini Live
                </div>
            </Card>
        </div>
    );
};

export default LiveRoleplay;
