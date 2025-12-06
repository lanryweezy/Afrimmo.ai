import React, { useState, useEffect } from 'react';
import Button from './Button';
import { 
    SparklesIcon, VideoIcon, MicrophoneIcon, MarketInsightsIcon, 
    CheckIcon, PlayIcon, MenuIcon, XIcon, ChevronRightIcon,
    SocialPublisherIcon, LeadsIcon, TodayIcon, ListingsIcon, 
    MarketingIcon, BellIcon, MoneyIcon, WhatsAppIcon, StarIcon
} from './IconComponents';

interface LandingPageProps {
    onLogin: () => void;
}

// Mock components for the dashboard preview
const MockStatCard: React.FC<{ title: string; value: string; subtext: string; color: string; icon: React.ReactNode }> = ({ title, value, subtext, color, icon }) => (
    <div className="bg-slate-900/50 border border-slate-800 p-3 sm:p-4 rounded-xl relative overflow-hidden group hover:bg-slate-800/80 transition-colors">
         <div className={`absolute top-0 right-0 p-12 sm:p-16 opacity-5 rounded-full -mr-6 -mt-6 sm:-mr-8 sm:-mt-8 transition-transform group-hover:scale-110 ${color.replace('text-', 'bg-')}`}></div>
        <div className="flex justify-between items-start mb-2">
            <div>
                <p className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">{title}</p>
                <h3 className="text-lg sm:text-xl font-bold text-white mt-1">{value}</h3>
            </div>
            <div className={`p-1.5 sm:p-2 rounded-lg bg-slate-950/50 ${color} border border-white/5`}>
                {icon}
            </div>
        </div>
        <p className="text-[10px] text-slate-400 truncate">{subtext}</p>
    </div>
);

const MockCircularProgress: React.FC<{ percentage: number; color: string; label: string }> = ({ percentage, color, label }) => {
     const radius = 25;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;
    return (
        <div className="flex flex-col items-center">
            <div className="relative w-16 h-16 mb-2">
                 <svg className="w-full h-full transform -rotate-90">
                     <circle cx="50%" cy="50%" r={radius} stroke="currentColor" strokeWidth="4" fill="transparent" className="text-slate-800" />
                     <circle 
                        cx="50%" cy="50%" r={radius} 
                        stroke="currentColor" strokeWidth="4" fill="transparent" 
                        strokeDasharray={circumference} 
                        strokeDashoffset={strokeDashoffset} 
                        strokeLinecap="round"
                        className={color}
                     />
                 </svg>
                 <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                     {percentage}%
                 </div>
            </div>
            <span className="text-[10px] text-slate-400 font-medium">{label}</span>
        </div>
    )
}

const TestimonialCard: React.FC<{ quote: string; author: string; role: string; image: string }> = ({ quote, author, role, image }) => (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative">
        <div className="flex text-yellow-400 mb-4">
            {[...Array(5)].map((_, i) => <StarIcon key={i} className="w-4 h-4" />)}
        </div>
        <p className="text-slate-300 mb-6 italic text-sm leading-relaxed">"{quote}"</p>
        <div className="flex items-center gap-3">
            <img src={image} alt={author} className="w-10 h-10 rounded-full border border-slate-700 object-cover" />
            <div>
                <p className="text-white font-bold text-sm">{author}</p>
                <p className="text-slate-500 text-xs">{role}</p>
            </div>
        </div>
    </div>
);

const FAQItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-slate-800 last:border-0">
            <button 
                className="flex justify-between items-center w-full py-4 text-left text-white hover:text-emerald-400 transition-colors"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="font-medium text-sm sm:text-base">{question}</span>
                <ChevronRightIcon className={`w-5 h-5 text-slate-500 transition-transform duration-300 ${isOpen ? 'rotate-90 text-emerald-400' : ''}`} />
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-48 pb-4 opacity-100' : 'max-h-0 opacity-0'}`}>
                <p className="text-slate-400 text-sm leading-relaxed pr-8">{answer}</p>
            </div>
        </div>
    );
}

const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    // SEO Implementation
    useEffect(() => {
        const originalTitle = document.title;
        
        // Set Title
        document.title = "Afrimmo AI - The #1 AI Real Estate Agent for Africa";

        // Helper to set meta tags
        const setMetaTag = (name: string, content: string) => {
            let element = document.querySelector(`meta[name="${name}"]`);
            if (!element) {
                element = document.createElement('meta');
                element.setAttribute('name', name);
                document.head.appendChild(element);
            }
            element.setAttribute('content', content);
        };

        // Set Description
        setMetaTag('description', 'Afrimmo AI is the ultimate assistant for real estate agents in Africa. Automate listings, generate viral marketing content, qualify leads on WhatsApp, and access hyper-local market data.');

        // Set Keywords
        setMetaTag('keywords', 'AI real estate agent, African real estate software, property marketing automation, WhatsApp lead qualification, Lagos real estate, Nairobi real estate, Accra real estate, real estate CRM, automated property listings');

        return () => {
            document.title = originalTitle;
        };
    }, []);

    const features = [
        {
            icon: <MicrophoneIcon className="w-6 h-6 text-rose-400" />,
            title: "Live Negotiation Coach",
            description: "Practice your sales pitch with an AI buyer that reacts in real-time with human voice."
        },
        {
            icon: <VideoIcon className="w-6 h-6 text-purple-400" />,
            title: "Instant Video Studio",
            description: "Turn static property photos into cinematic video tours for Instagram & TikTok in seconds."
        },
        {
            icon: <SocialPublisherIcon className="w-6 h-6 text-blue-400" />,
            title: "Auto-Social Publishing",
            description: "Generate viral captions and schedule posts to Instagram, WhatsApp, and Facebook."
        },
        {
            icon: <MarketInsightsIcon className="w-6 h-6 text-emerald-400" />,
            title: "Hyper-Local Data",
            description: "Access real-time rental yields, price trends, and demand data for Lekki, Accra, & Nairobi."
        },
    ];

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-emerald-500 selection:text-white overflow-x-hidden">
            
            {/* Navigation */}
            <nav className="fixed w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-white/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        {/* Logo */}
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-900/20">
                                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21l18 0"></path><path d="M5 21v-14l8 -4l8 4v14"></path><path d="M19 10l-8 -4l-8 4"></path><path d="M9 21v-8h6v8"></path></svg>
                            </div>
                            <span className="text-xl font-bold tracking-tight">Afrimmo<span className="text-emerald-400">.ai</span></span>
                        </div>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center space-x-8">
                            <a href="#features" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Features</a>
                            <a href="#how-it-works" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">How It Works</a>
                            <a href="#pricing" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Pricing</a>
                             <a href="#faq" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">FAQ</a>
                            <button onClick={onLogin} className="text-sm font-bold text-white hover:text-emerald-400 transition-colors">Sign In</button>
                            <Button onClick={onLogin} size="small" className="shadow-lg shadow-emerald-500/20">Get Started Free</Button>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden">
                            <button onClick={toggleMenu} className="text-slate-300 hover:text-white">
                                {isMenuOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu Overlay */}
                {isMenuOpen && (
                    <div className="md:hidden bg-slate-900 border-b border-slate-800 absolute w-full">
                        <div className="px-4 pt-2 pb-6 space-y-2">
                            <a href="#features" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg">Features</a>
                             <a href="#how-it-works" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg">How It Works</a>
                            <a href="#pricing" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg">Pricing</a>
                            <div className="pt-4 flex flex-col gap-2">
                                <Button onClick={onLogin} variant="secondary" className="w-full justify-center">Sign In</Button>
                                <Button onClick={onLogin} className="w-full justify-center">Get Started</Button>
                            </div>
                        </div>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                {/* Hero Background Image */}
                <div className="absolute inset-0 z-0">
                    <img 
                        src="https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2700&auto=format&fit=crop" 
                        alt="Modern Luxury Real Estate Background" 
                        className="w-full h-full object-cover opacity-20"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-950/90 to-slate-950"></div>
                </div>
                
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-emerald-500/20 blur-[120px] rounded-full opacity-30 pointer-events-none z-0"></div>
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/50 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-6 animate-fade-in backdrop-blur-sm">
                        <SparklesIcon className="w-3 h-3" />
                        The #1 AI Agent for Real Estate
                    </div>
                    
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.1]">
                        Supercharge Your <br className="hidden md:block" />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-500">Real Estate Business</span>
                    </h1>
                    
                    <p className="mt-4 text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
                        Automate listings, generate viral video content, and qualify leads on WhatsApp 24/7. 
                        Built specifically for the dynamic African property market.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                        <Button onClick={onLogin} className="px-8 py-4 text-lg w-full sm:w-auto shadow-xl shadow-emerald-500/20">
                            Start Free Trial <ChevronRightIcon className="w-5 h-5 ml-1" />
                        </Button>
                        <button onClick={onLogin} className="flex items-center gap-2 px-8 py-4 text-lg font-semibold text-white bg-slate-800/80 hover:bg-slate-700 backdrop-blur-sm rounded-xl transition-all w-full sm:w-auto justify-center border border-slate-700">
                            <PlayIcon className="w-5 h-5 text-emerald-400" /> Watch Demo
                        </button>
                    </div>

                    {/* Dashboard Realistic Mockup */}
                    <div className="relative mx-auto max-w-5xl rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl backdrop-blur-sm overflow-hidden flex animate-fade-in text-left aspect-[16/10] md:aspect-auto md:h-[600px]" style={{animationDelay: '0.2s'}}>
                        {/* Sidebar */}
                        <div className="w-16 md:w-64 bg-slate-900 border-r border-slate-800 flex flex-col p-4 hidden sm:flex">
                             <div className="flex items-center gap-2 mb-8 px-2">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
                                     <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 21l18 0"></path><path d="M5 21v-14l8 -4l8 4v14"></path></svg>
                                </div>
                                <span className="text-lg font-bold text-white hidden md:block tracking-tight">Afrimmo<span className="text-emerald-400">.ai</span></span>
                             </div>
                             <div className="space-y-1">
                                <div className="flex items-center gap-3 px-3 py-2 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/20">
                                    <TodayIcon className="w-5 h-5" /> <span className="hidden md:block text-sm font-medium">Dashboard</span>
                                </div>
                                 <div className="flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                                    <LeadsIcon className="w-5 h-5" /> <span className="hidden md:block text-sm font-medium">CRM</span>
                                </div>
                                 <div className="flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                                    <ListingsIcon className="w-5 h-5" /> <span className="hidden md:block text-sm font-medium">Listings</span>
                                </div>
                                 <div className="flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                                    <MarketingIcon className="w-5 h-5" /> <span className="hidden md:block text-sm font-medium">Marketing</span>
                                </div>
                             </div>
                             <div className="mt-auto flex items-center gap-3 px-2 pt-4 border-t border-slate-800">
                                <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="User" className="w-8 h-8 rounded-full border border-slate-700" />
                                <div className="hidden md:block">
                                    <p className="text-xs font-bold text-white">Tunde Bakare</p>
                                    <p className="text-[10px] text-slate-500">Pro Agent</p>
                                </div>
                             </div>
                        </div>

                        {/* Main Content */}
                        <div className="flex-1 bg-slate-950 p-6 overflow-hidden flex flex-col">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h3 className="text-xl font-bold text-white tracking-tight">Command Center</h3>
                                    <p className="text-xs text-slate-500">Welcome back, Tunde.</p>
                                </div>
                                <div className="flex gap-3">
                                     <div className="h-9 w-9 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors"><BellIcon className="w-5 h-5"/></div>
                                </div>
                            </div>

                            {/* Stats Row */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                 <MockStatCard title="Active Listings" value="12" subtext="2 Pending" color="text-blue-400" icon={<ListingsIcon className="w-4 h-4"/>} />
                                 <MockStatCard title="New Leads" value="28" subtext="+5 today" color="text-emerald-400" icon={<LeadsIcon className="w-4 h-4"/>} />
                                 <MockStatCard title="Revenue" value="₦45M" subtext="On track" color="text-amber-400" icon={<MoneyIcon className="w-4 h-4"/>} />
                                 <MockStatCard title="Tasks" value="4" subtext="1 Urgent" color="text-rose-400" icon={<CheckIcon className="w-4 h-4"/>} />
                            </div>

                            <div className="flex gap-6 flex-1 min-h-0">
                                {/* Main Area */}
                                <div className="flex-1 flex flex-col gap-4">
                                     <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex-1">
                                        <div className="flex justify-between items-center mb-4">
                                             <h4 className="font-bold text-white text-sm">Recent Activity</h4>
                                             <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-bold uppercase tracking-wider animate-pulse">Live</span>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex items-start gap-3 p-2 hover:bg-slate-800/50 rounded-lg transition-colors cursor-default">
                                                 <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400"><WhatsAppIcon className="w-4 h-4"/></div>
                                                 <div>
                                                    <p className="text-sm text-white font-medium">New inquiry from Amara</p>
                                                    <p className="text-xs text-slate-500">"Is the Lekki duplex still available?"</p>
                                                 </div>
                                                 <span className="ml-auto text-[10px] text-slate-500 font-mono">2m</span>
                                            </div>
                                            <div className="flex items-start gap-3 p-2 hover:bg-slate-800/50 rounded-lg transition-colors cursor-default">
                                                 <div className="w-8 h-8 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400"><VideoIcon className="w-4 h-4"/></div>
                                                 <div>
                                                    <p className="text-sm text-white font-medium">Video Tour Generated</p>
                                                    <p className="text-xs text-slate-500">Banana Island Mansion - 4K Ready</p>
                                                 </div>
                                                 <span className="ml-auto text-[10px] text-slate-500 font-mono">1h</span>
                                            </div>
                                            <div className="flex items-start gap-3 p-2 hover:bg-slate-800/50 rounded-lg transition-colors cursor-default">
                                                 <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400"><CheckIcon className="w-4 h-4"/></div>
                                                 <div>
                                                    <p className="text-sm text-white font-medium">Viewing Completed</p>
                                                    <p className="text-xs text-slate-500">Client: Chinedu Eze</p>
                                                 </div>
                                                 <span className="ml-auto text-[10px] text-slate-500 font-mono">3h</span>
                                            </div>
                                        </div>
                                     </div>
                                </div>

                                {/* Right Side - Goals */}
                                <div className="w-48 hidden md:flex flex-col gap-4">
                                     <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex flex-col items-center justify-center flex-1">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Monthly Goal</p>
                                        <MockCircularProgress percentage={75} color="text-emerald-500" label="Revenue" />
                                     </div>
                                     <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 flex-1">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Hot Leads</p>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.6)]"></div>
                                                <span className="text-xs text-white font-medium">Amara N.</span>
                                            </div>
                                             <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                                                <span className="text-xs text-white font-medium">David O.</span>
                                            </div>
                                             <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                                                <span className="text-xs text-white font-medium">Sarah K.</span>
                                            </div>
                                        </div>
                                     </div>
                                </div>
                            </div>
                        </div>

                        {/* Overlay Card - Floating Notification */}
                        <div className="absolute bottom-8 right-8 md:bottom-12 md:right-12 bg-slate-900/90 backdrop-blur-md border border-emerald-500/30 p-4 rounded-xl shadow-2xl max-w-xs animate-bounce hidden sm:block" style={{animationDuration: '3s'}}>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                                    <SparklesIcon className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">AI Insight</p>
                                    <p className="text-sm font-bold text-white">Lead Qualified 🔥</p>
                                </div>
                            </div>
                            <p className="text-xs text-slate-300 leading-relaxed">"Amara is ready to view the Lekki property. Schedule for Saturday?"</p>
                        </div>
                    </div>
                </div>
            </section>

             {/* Trusted By Section */}
            <div className="py-10 border-y border-white/5 bg-slate-900/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <p className="text-center text-slate-500 text-xs font-bold uppercase tracking-widest mb-8">Trusted by 500+ Top Agents & Agencies</p>
                    <div className="flex justify-center items-center gap-8 md:gap-16 opacity-50 grayscale mix-blend-screen flex-wrap">
                        <span className="text-xl font-serif font-bold tracking-wider">FINE & COUNTRY</span>
                        <span className="text-xl font-sans font-black tracking-tighter">Pam Golding</span>
                        <span className="text-xl font-serif italic font-bold">Knight Frank</span>
                        <span className="text-xl font-bold tracking-[0.2em]">JIDE TAIWO</span>
                         <span className="text-xl font-sans font-bold">ESTATE LINKS</span>
                    </div>
                </div>
            </div>

            {/* How It Works Section */}
            <section id="how-it-works" className="py-24 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-extrabold text-white">How It Works</h2>
                        <p className="mt-4 text-slate-400">Three simple steps to automate your real estate business.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                         {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-emerald-500/0 via-emerald-500/30 to-emerald-500/0 z-0"></div>

                        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 relative z-10 text-center group hover:border-emerald-500/30 transition-colors">
                            <div className="w-20 h-20 mx-auto bg-slate-900 rounded-full flex items-center justify-center border-4 border-slate-950 shadow-xl mb-6 group-hover:scale-110 transition-transform">
                                <span className="text-2xl font-bold text-emerald-400">1</span>
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">Connect Your Apps</h3>
                            <p className="text-sm text-slate-400 leading-relaxed">Sync your WhatsApp Business and Instagram Professional accounts in one click.</p>
                        </div>

                         <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 relative z-10 text-center group hover:border-emerald-500/30 transition-colors">
                            <div className="w-20 h-20 mx-auto bg-slate-900 rounded-full flex items-center justify-center border-4 border-slate-950 shadow-xl mb-6 group-hover:scale-110 transition-transform">
                                <span className="text-2xl font-bold text-emerald-400">2</span>
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">AI Takes Over</h3>
                            <p className="text-sm text-slate-400 leading-relaxed">Our AI qualifies leads, answers questions, and generates marketing content for you.</p>
                        </div>

                         <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 relative z-10 text-center group hover:border-emerald-500/30 transition-colors">
                            <div className="w-20 h-20 mx-auto bg-slate-900 rounded-full flex items-center justify-center border-4 border-slate-950 shadow-xl mb-6 group-hover:scale-110 transition-transform">
                                <span className="text-2xl font-bold text-emerald-400">3</span>
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">Close More Deals</h3>
                            <p className="text-sm text-slate-400 leading-relaxed">Focus on viewings and closings with pre-vetted, high-intent buyers.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 bg-slate-900/30 border-y border-white/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-base text-emerald-400 font-semibold tracking-wide uppercase">Capabilities</h2>
                        <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-white sm:text-4xl">
                            Everything you need to close deals faster
                        </p>
                        <p className="mt-4 max-w-2xl text-xl text-slate-400 mx-auto">
                            Replace 5 different tools with one AI-powered command center.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <div key={index} className="bg-slate-950 border border-slate-800 p-6 rounded-2xl hover:border-emerald-500/50 transition-colors group relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center mb-4 border border-slate-800 group-hover:scale-110 transition-transform">
                                    {feature.icon}
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-24 bg-slate-950 relative overflow-hidden">
                 {/* Decorative background elements */}
                <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-emerald-500/5 to-transparent"></div>
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-extrabold text-white">Agents Love Afrimmo</h2>
                        <p className="mt-4 text-slate-400">Join the community of top performers across the continent.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <TestimonialCard 
                            quote="I used to spend 4 hours a day on Instagram captions. Now Afrimmo does it in seconds. My engagement has tripled."
                            author="Chidi Okeke"
                            role="Lead Agent, Lagos"
                            image="https://i.pravatar.cc/150?u=chidi"
                        />
                         <TestimonialCard 
                            quote="The WhatsApp qualification bot is a game changer. I only speak to clients who are ready to buy. No more time wasters."
                            author="Zainab Ahmed"
                            role="Realtor, Nairobi"
                            image="https://i.pravatar.cc/150?u=zainab"
                        />
                         <TestimonialCard 
                            quote="The video tour generator helped me sell a property in East Legon without a physical viewing. Incredible technology."
                            author="Kwame Mensah"
                            role="Developer, Accra"
                            image="https://i.pravatar.cc/150?u=kwame"
                        />
                    </div>
                </div>
            </section>

            {/* Stats / Social Proof */}
            <section className="py-20 border-y border-white/5 bg-slate-900/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div>
                            <div className="text-4xl font-bold text-white mb-1">₦500M+</div>
                            <div className="text-sm text-slate-500 uppercase tracking-wider font-medium">Property Sales Tracked</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-white mb-1">10k+</div>
                            <div className="text-sm text-slate-500 uppercase tracking-wider font-medium">Leads Generated</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-white mb-1">24/7</div>
                            <div className="text-sm text-slate-500 uppercase tracking-wider font-medium">AI Availability</div>
                        </div>
                         <div>
                            <div className="text-4xl font-bold text-white mb-1">15+</div>
                            <div className="text-sm text-slate-500 uppercase tracking-wider font-medium">African Cities</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Live Demo Section */}
            <section id="demo" className="py-24 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
                        <div className="mb-12 lg:mb-0">
                            <h2 className="text-3xl font-extrabold text-white sm:text-4xl mb-6">
                                The AI that speaks <span className="text-emerald-400">Real Estate</span>
                            </h2>
                            <p className="text-lg text-slate-400 mb-8">
                                Watch how Afrimmo AI handles a WhatsApp inquiry from start to finish. It qualifies the buyer, checks your calendar, and books the viewing instantly.
                            </p>
                            
                            <ul className="space-y-4 mb-8">
                                {[
                                    'Understands local context (e.g. "Boys Quarter", "C of O")',
                                    'Handles multiple languages and pidgin',
                                    'Syncs directly with your Google Calendar'
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center text-slate-300">
                                        <CheckIcon className="w-5 h-5 text-emerald-500 mr-3" />
                                        {item}
                                    </li>
                                ))}
                            </ul>

                            <Button onClick={onLogin}>Try the Demo Yourself</Button>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full"></div>
                            <div className="relative bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl max-w-sm mx-auto lg:mx-0 lg:ml-auto">
                                <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-4">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center">
                                        <SparklesIcon className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-white">Afrimmo Assistant</p>
                                        <p className="text-xs text-emerald-400">Online</p>
                                    </div>
                                </div>
                                <div className="space-y-4 text-sm">
                                    <div className="bg-slate-800 p-3 rounded-lg rounded-tl-none text-slate-300">
                                        Hello! I noticed you were looking at the 4-bed in Ikoyi. Would you like to see a video tour?
                                    </div>
                                    <div className="bg-emerald-600 text-white p-3 rounded-lg rounded-tr-none ml-auto max-w-[85%]">
                                        Yes please. And what is the last price?
                                    </div>
                                    <div className="bg-slate-800 p-3 rounded-lg rounded-tl-none text-slate-300">
                                        The asking price is ₦450M. I've sent the video above. The owner is open to negotiation for a quick close. Are you available for a viewing this Saturday?
                                    </div>
                                    <div className="flex gap-2 mt-2">
                                        <span className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-full text-xs text-slate-400">Book Viewing</span>
                                        <span className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-full text-xs text-slate-400">Call Agent</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-24 bg-slate-900/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                            Simple, Transparent Pricing
                        </h2>
                        <p className="mt-4 text-lg text-slate-400">
                            Start for free, upgrade as you grow.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Free Plan */}
                        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-8 flex flex-col">
                            <h3 className="text-xl font-bold text-slate-400 mb-2">Starter</h3>
                            <div className="text-4xl font-bold text-white mb-6">$0<span className="text-lg font-normal text-slate-500">/mo</span></div>
                            <ul className="space-y-4 mb-8 flex-1">
                                <li className="flex items-center text-slate-300 text-sm"><CheckIcon className="w-4 h-4 text-emerald-500 mr-2"/> 5 AI Listings/mo</li>
                                <li className="flex items-center text-slate-300 text-sm"><CheckIcon className="w-4 h-4 text-emerald-500 mr-2"/> Basic CRM</li>
                                <li className="flex items-center text-slate-300 text-sm"><CheckIcon className="w-4 h-4 text-emerald-500 mr-2"/> Email Support</li>
                            </ul>
                            <Button variant="secondary" onClick={onLogin} className="w-full">Start Free</Button>
                        </div>

                        {/* Pro Plan */}
                        <div className="bg-slate-900 border border-emerald-500 rounded-2xl p-8 flex flex-col relative shadow-2xl shadow-emerald-900/20 transform md:-translate-y-4">
                            <div className="absolute top-0 right-0 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">POPULAR</div>
                            <h3 className="text-xl font-bold text-emerald-400 mb-2">Pro Agent</h3>
                            <div className="text-4xl font-bold text-white mb-6">$49<span className="text-lg font-normal text-slate-500">/mo</span></div>
                            <ul className="space-y-4 mb-8 flex-1">
                                <li className="flex items-center text-white text-sm"><CheckIcon className="w-4 h-4 text-emerald-500 mr-2"/> Unlimited AI Listings</li>
                                <li className="flex items-center text-white text-sm"><CheckIcon className="w-4 h-4 text-emerald-500 mr-2"/> Advanced CRM & Analytics</li>
                                <li className="flex items-center text-white text-sm"><CheckIcon className="w-4 h-4 text-emerald-500 mr-2"/> Social Media Auto-Poster</li>
                                <li className="flex items-center text-white text-sm"><CheckIcon className="w-4 h-4 text-emerald-500 mr-2"/> Live Negotiation Coach</li>
                            </ul>
                            <Button onClick={onLogin} className="w-full">Get Started</Button>
                        </div>

                        {/* Agency Plan */}
                        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-8 flex flex-col">
                            <h3 className="text-xl font-bold text-purple-400 mb-2">Agency</h3>
                            <div className="text-4xl font-bold text-white mb-6">$199<span className="text-lg font-normal text-slate-500">/mo</span></div>
                            <ul className="space-y-4 mb-8 flex-1">
                                <li className="flex items-center text-slate-300 text-sm"><CheckIcon className="w-4 h-4 text-emerald-500 mr-2"/> Everything in Pro</li>
                                <li className="flex items-center text-slate-300 text-sm"><CheckIcon className="w-4 h-4 text-emerald-500 mr-2"/> 5 Team Seats</li>
                                <li className="flex items-center text-slate-300 text-sm"><CheckIcon className="w-4 h-4 text-emerald-500 mr-2"/> Agency Branding</li>
                                <li className="flex items-center text-slate-300 text-sm"><CheckIcon className="w-4 h-4 text-emerald-500 mr-2"/> Priority Support</li>
                            </ul>
                            <Button variant="secondary" onClick={onLogin} className="w-full">Contact Sales</Button>
                        </div>
                    </div>
                </div>
            </section>

             {/* FAQ Section */}
             <section id="faq" className="py-24">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                     <div className="text-center mb-12">
                        <h2 className="text-3xl font-extrabold text-white">Frequently Asked Questions</h2>
                    </div>
                    <div className="space-y-2">
                        <FAQItem 
                            question="Does Afrimmo work with my personal WhatsApp?"
                            answer="Yes! Afrimmo connects via WhatsApp Web protocol, allowing you to use your existing number. We recommend using WhatsApp Business for better features."
                        />
                         <FAQItem 
                            question="Can I cancel my subscription anytime?"
                            answer="Absolutely. There are no long-term contracts. You can cancel your subscription from your dashboard at any time."
                        />
                         <FAQItem 
                            question="Do you support currencies other than Naira?"
                            answer="Yes, Afrimmo supports multi-currency listings including USD, GHS, KES, and ZAR, automatically updating exchange rates for reports."
                        />
                         <FAQItem 
                            question="Is my client data secure?"
                            answer="We take security seriously. All data is encrypted at rest and in transit. We do not sell your client data to third parties."
                        />
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/40 to-slate-950"></div>
                <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Ready to transform your agency?</h2>
                    <p className="text-lg text-slate-300 mb-10">Join 500+ agents using Afrimmo AI to sell smarter, faster, and better.</p>
                    <Button onClick={onLogin} className="px-10 py-5 text-xl rounded-full shadow-2xl hover:scale-105 transform transition-transform">
                        Create Free Account
                    </Button>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 bg-slate-950 border-t border-slate-800 text-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8">
                    <div className="col-span-2 md:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-6 h-6 rounded bg-emerald-500 flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 21l18 0"></path><path d="M5 21v-14l8 -4l8 4v14"></path></svg>
                            </div>
                            <span className="font-bold text-white">Afrimmo.ai</span>
                        </div>
                        <p className="text-slate-500">
                            Empowering African real estate agents with next-gen AI tools.
                        </p>
                    </div>
                    
                    <div>
                        <h4 className="font-bold text-white mb-4">Product</h4>
                        <ul className="space-y-2 text-slate-400">
                            <li><a href="#" className="hover:text-emerald-400">Features</a></li>
                            <li><a href="#" className="hover:text-emerald-400">Pricing</a></li>
                            <li><a href="#" className="hover:text-emerald-400">Case Studies</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-white mb-4">Company</h4>
                        <ul className="space-y-2 text-slate-400">
                            <li><a href="#" className="hover:text-emerald-400">About</a></li>
                            <li><a href="#" className="hover:text-emerald-400">Blog</a></li>
                            <li><a href="#" className="hover:text-emerald-400">Careers</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-white mb-4">Legal</h4>
                        <ul className="space-y-2 text-slate-400">
                            <li><a href="#" className="hover:text-emerald-400">Privacy</a></li>
                            <li><a href="#" className="hover:text-emerald-400">Terms</a></li>
                        </ul>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-slate-800 text-center text-slate-500">
                    &copy; 2024 Afrimmo AI Technologies. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;