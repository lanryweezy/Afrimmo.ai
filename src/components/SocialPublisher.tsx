

import React, { useState, useEffect } from 'react';
import Card from './Card';
import Button from './Button';
import { getPostSuggestions } from '../services/geminiService';
import { Platform, SocialAccount, ScheduledPost } from '../types';
import { SparklesIcon, SocialPublisherIcon, InstagramIcon, FacebookIcon, ThreadsIcon, CheckIcon, CalendarDaysIcon, ArrowLeftIcon, DotsHorizontalIcon } from './IconComponents';
import InstagramFeed from './InstagramFeed';

interface SocialPublisherProps {
    initialContent: string | null;
    clearInitialContent: () => void;
}

const SocialPublisher: React.FC<SocialPublisherProps> = ({ initialContent, clearInitialContent }) => {
    const [accounts, setAccounts] = useState<SocialAccount[]>([
        { platform: Platform.Instagram, handle: '@Afrimmo_Homes', connected: true },
        { platform: Platform.Facebook, handle: '', connected: false },
        { platform: Platform.Threads, handle: '', connected: false },
    ]);
    
    const [posts, setPosts] = useState<ScheduledPost[]>([]);
    const [content, setContent] = useState('');
    
    // Multi-select state
    const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([Platform.Instagram]);
    
    const [scheduledDate, setScheduledDate] = useState(new Date());

    const [isLoading, setIsLoading] = useState(false);
    const [isSuggesting, setIsSuggesting] = useState(false);
    const [connectingState, setConnectingState] = useState<Record<string, boolean>>({});
    const [error, setError] = useState('');

    // Calendar View State
    const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
    const [currentCalendarDate, setCurrentCalendarDate] = useState(new Date());

    // Tab State for Bottom Section
    const [activeFeedTab, setActiveFeedTab] = useState<'scheduled' | 'instagram'>('scheduled');
    
    useEffect(() => {
        if (initialContent) {
            setContent(initialContent);
            clearInitialContent();
        }
    }, [initialContent, clearInitialContent]);

    const handleToggleConnection = (acc: SocialAccount) => {
        if (acc.connected) {
            setAccounts(prev => prev.map(a => a.platform === acc.platform ? { ...a, connected: false } : a));
            // Remove from selection if disconnected
            setSelectedPlatforms(prev => prev.filter(p => p !== acc.platform));
        } else {
            if (!acc.handle.trim()) {
                setError(`Please enter a handle for ${acc.platform}`);
                setTimeout(() => setError(''), 3000);
                return;
            }
            
            setConnectingState(prev => ({ ...prev, [acc.platform]: true }));
            // Simulate API connection
            setTimeout(() => {
                setAccounts(prev => prev.map(a => a.platform === acc.platform ? { ...a, connected: true } : a));
                setConnectingState(prev => ({ ...prev, [acc.platform]: false }));
            }, 1000);
        }
    };

    const handleHandleChange = (platform: Platform, handle: string) => {
        setAccounts(prev => prev.map(a => a.platform === platform ? { ...a, handle } : a));
    };

    const togglePlatformSelection = (platform: Platform) => {
        const account = accounts.find(a => a.platform === platform);
        if (!account?.connected) {
            setError(`Please connect ${platform} first.`);
            setTimeout(() => setError(''), 3000);
            return;
        }

        setSelectedPlatforms(prev => 
            prev.includes(platform) 
                ? prev.filter(p => p !== platform)
                : [...prev, platform]
        );
    };

    const getPlatformIcon = (platform: Platform, className = "w-5 h-5 text-white") => {
        const props = { className };
        switch (platform) {
            case Platform.Instagram: return <InstagramIcon {...props} />;
            case Platform.Facebook: return <FacebookIcon {...props} />;
            case Platform.Threads: return <ThreadsIcon {...props} />;
            default: return null;
        }
    };

    const handleSchedule = () => {
        if (selectedPlatforms.length === 0) {
             setError(`Please select at least one platform.`);
             return;
        }

        if (!content.trim()) {
            setError('Post content cannot be empty.');
            return;
        }
        setError('');
        setIsLoading(true);

        // Create a post for each selected platform
        const newPosts: ScheduledPost[] = selectedPlatforms.map(platform => ({
            id: `${Date.now()}-${platform}`,
            platform: platform,
            content,
            scheduledAt: scheduledDate,
            status: 'Scheduled',
        }));
        
        setTimeout(() => {
            setPosts(prev => [...prev, ...newPosts].sort((a,b) => a.scheduledAt.getTime() - b.scheduledAt.getTime()));
            setContent('');
            setIsLoading(false);
            // Optional: Reset selections or keep them
        }, 500);
    };

    const handleGetSuggestions = async () => {
        if (!content.trim()) {
            setError('Write some content first to get suggestions.');
            return;
        }
        if (selectedPlatforms.length === 0) {
            setError('Select a platform to optimize for.');
            return;
        }

        setError('');
        setIsSuggesting(true);
        try {
            // Optimization usually targets the "primary" platform, usually the first selected
            const platformToOptimizeFor = selectedPlatforms[0];
            const suggestions = await getPostSuggestions(content, platformToOptimizeFor);
            setContent(`${suggestions.rewritten}\n\n${suggestions.hashtags.join(' ')}`);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSuggesting(false);
        }
    };
    
    // Calendar Logic
    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const days = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay(); // 0 = Sunday
        return { days, firstDay, year, month };
    };

    const changeMonth = (delta: number) => {
        const newDate = new Date(currentCalendarDate);
        newDate.setMonth(newDate.getMonth() + delta);
        setCurrentCalendarDate(newDate);
    };

    const renderCalendar = () => {
        const { days, firstDay, year, month } = getDaysInMonth(currentCalendarDate);
        const monthName = currentCalendarDate.toLocaleString('default', { month: 'long' });
        
        const calendarGrid = [];
        
        // Empty slots for previous month
        for (let i = 0; i < firstDay; i++) {
            calendarGrid.push(<div key={`empty-${i}`} className="bg-slate-900/30 border border-slate-800/50 min-h-[80px]"></div>);
        }

        // Days
        for (let d = 1; d <= days; d++) {
            const dateObj = new Date(year, month, d);
            // Check for posts on this day
            const daysPosts = posts.filter(p => 
                p.scheduledAt.getDate() === d && 
                p.scheduledAt.getMonth() === month && 
                p.scheduledAt.getFullYear() === year
            );

            calendarGrid.push(
                <div key={d} className="bg-slate-900/50 border border-slate-800 p-2 min-h-[80px] hover:bg-slate-800/50 transition-colors relative group">
                    <span className={`text-xs font-semibold ${daysPosts.length > 0 ? 'text-white' : 'text-slate-500'}`}>{d}</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                        {daysPosts.map(post => (
                            <div key={post.id} className="p-1 rounded-full bg-slate-700" title={`${post.platform}: ${post.content.substring(0, 20)}...`}>
                                {getPlatformIcon(post.platform, "w-3 h-3")}
                            </div>
                        ))}
                    </div>
                    {daysPosts.length > 0 && (
                        <div className="absolute bottom-1 right-1 w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                    )}
                </div>
            );
        }

        return (
            <div className="animate-fade-in">
                <div className="flex justify-between items-center mb-4 bg-slate-800/50 p-3 rounded-lg">
                    <button onClick={() => changeMonth(-1)} className="p-1 hover:bg-slate-700 rounded-full transition-colors">
                        <ArrowLeftIcon className="w-5 h-5 text-slate-400" />
                    </button>
                    <span className="font-bold text-white">{monthName} {year}</span>
                    <button onClick={() => changeMonth(1)} className="p-1 hover:bg-slate-700 rounded-full transition-colors transform rotate-180">
                         <ArrowLeftIcon className="w-5 h-5 text-slate-400" />
                    </button>
                </div>
                <div className="grid grid-cols-7 gap-px text-center mb-1">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">{day}</div>
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-px border border-slate-800 rounded-lg overflow-hidden">
                    {calendarGrid}
                </div>
            </div>
        );
    };
    
    // Get Instagram Account for feed
    const instagramAccount = accounts.find(a => a.platform === Platform.Instagram);

    return (
        <div className="space-y-6">
            <Card>
                <h2 className="text-xl font-semibold text-white mb-4">Connect Accounts</h2>
                <div className="space-y-3">
                    {accounts.map(account => (
                        <div key={account.platform} className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 rounded-lg gap-3 transition-colors ${account.connected ? 'bg-teal-900/20 border border-teal-900/50' : 'bg-gray-900/50 border border-transparent'}`}>
                            <div className="flex items-center gap-3 w-full sm:w-auto">
                                <div className={`p-2 rounded-full flex-shrink-0 ${
                                    account.platform === Platform.Instagram ? 'bg-gradient-to-br from-yellow-400 via-red-500 to-purple-600' :
                                    account.platform === Platform.Facebook ? 'bg-blue-600' : 'bg-gray-700'
                                }`}>
                                    {getPlatformIcon(account.platform)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-white text-sm">{account.platform}</p>
                                    {account.connected ? (
                                        <div className="flex items-center text-xs text-teal-400">
                                            <CheckIcon className="w-3 h-3 mr-1" />
                                            <span className="truncate">{account.handle}</span>
                                        </div>
                                    ) : (
                                        <input
                                            type="text"
                                            value={account.handle}
                                            onChange={(e) => handleHandleChange(account.platform, e.target.value)}
                                            className="text-sm text-gray-300 bg-gray-800 border border-gray-700 rounded px-2 py-1 focus:outline-none focus:border-teal-500 w-full sm:w-40"
                                            placeholder="@username"
                                        />
                                    )}
                                </div>
                            </div>
                            <Button
                                onClick={() => handleToggleConnection(account)}
                                variant={account.connected ? 'secondary' : 'primary'}
                                size="small"
                                isLoading={connectingState[account.platform]}
                                className="w-full sm:w-auto"
                            >
                                {account.connected ? 'Disconnect' : 'Connect'}
                            </Button>
                        </div>
                    ))}
                </div>
            </Card>

            <Card>
                <h2 className="text-xl font-semibold text-white mb-4">Compose & Schedule</h2>
                <div className="space-y-4">
                     <textarea
                        rows={6}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Write your post caption here..."
                        className="w-full bg-gray-700 border-gray-600 text-white rounded-lg p-3 focus:ring-teal-500 focus:border-teal-500"
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Publish To (Select Multiple)</label>
                            <div className="flex flex-wrap gap-2">
                                {accounts.map(a => (
                                    <button
                                        key={a.platform}
                                        onClick={() => togglePlatformSelection(a.platform)}
                                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border transition-all ${
                                            selectedPlatforms.includes(a.platform)
                                                ? 'bg-teal-600 text-white border-teal-500 shadow-lg shadow-teal-900/20'
                                                : 'bg-gray-800 text-gray-400 border-gray-700 hover:border-gray-600 hover:text-gray-200'
                                        } ${!a.connected ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        {getPlatformIcon(a.platform, "w-4 h-4")}
                                        {a.platform}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                             <label className="block text-sm font-medium text-gray-300 mb-1">Schedule Date & Time</label>
                             <input 
                                type="datetime-local"
                                value={scheduledDate.toISOString().substring(0, 16)}
                                onChange={e => setScheduledDate(new Date(e.target.value))}
                                className="w-full bg-gray-700 border-gray-600 text-white rounded-lg p-2 focus:ring-teal-500 focus:border-teal-500"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        <Button onClick={handleGetSuggestions} isLoading={isSuggesting} variant="secondary" icon={<SparklesIcon className="w-5 h-5"/>} className="flex-1">
                            AI Improve
                        </Button>
                        <Button onClick={handleSchedule} isLoading={isLoading} icon={<SocialPublisherIcon className="w-5 h-5"/>} className="flex-1" disabled={selectedPlatforms.length === 0}>
                            {selectedPlatforms.length > 1 ? `Schedule to ${selectedPlatforms.length} Platforms` : 'Schedule Post'}
                        </Button>
                    </div>
                    {error && <p className="text-red-400 text-sm text-center animate-pulse">{error}</p>}
                </div>
            </Card>

            <Card className="p-0 overflow-hidden bg-slate-900/50">
                <div className="flex border-b border-slate-700 bg-slate-900">
                    <button 
                        onClick={() => setActiveFeedTab('scheduled')}
                        className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${activeFeedTab === 'scheduled' ? 'text-teal-400 border-b-2 border-teal-500 bg-slate-800/50' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}
                    >
                        <CalendarDaysIcon className="w-4 h-4" /> Content Calendar
                    </button>
                    <button 
                        onClick={() => setActiveFeedTab('instagram')}
                        className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${activeFeedTab === 'instagram' ? 'text-teal-400 border-b-2 border-teal-500 bg-slate-800/50' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}
                    >
                        <InstagramIcon className="w-4 h-4" /> Live Instagram Feed
                    </button>
                </div>

                <div className="p-6">
                    {activeFeedTab === 'scheduled' && (
                        <>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold text-white">Scheduled Posts</h2>
                                <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800">
                                    <button 
                                        onClick={() => setViewMode('list')}
                                        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1 ${viewMode === 'list' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}
                                    >
                                        <DotsHorizontalIcon className="w-3 h-3"/> List
                                    </button>
                                    <button 
                                        onClick={() => setViewMode('calendar')}
                                        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1 ${viewMode === 'calendar' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}
                                    >
                                        <CalendarDaysIcon className="w-3 h-3"/> Calendar
                                    </button>
                                </div>
                            </div>

                            {viewMode === 'list' ? (
                                <div className="space-y-3">
                                    {posts.length > 0 ? posts.map(post => (
                                        <div key={post.id} className="bg-gray-900/50 p-4 rounded-lg border border-gray-700/50 animate-fade-in">
                                            <div className="flex justify-between items-start">
                                                <div className="flex items-center gap-2">
                                                    <div className={`p-1.5 rounded-full ${
                                                        post.platform === Platform.Instagram ? 'bg-gradient-to-br from-yellow-400 via-red-500 to-purple-600' :
                                                        post.platform === Platform.Facebook ? 'bg-blue-600' : 'bg-gray-700'
                                                    }`}>
                                                        {getPlatformIcon(post.platform)}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-white text-sm">{post.platform}</p>
                                                        <p className="text-xs text-gray-400">{post.scheduledAt.toLocaleString()}</p>
                                                    </div>
                                                </div>
                                                <span className="text-xs bg-yellow-500/10 text-yellow-300 border border-yellow-500/30 font-medium px-2 py-1 rounded-full">{post.status}</span>
                                            </div>
                                            <p className="text-sm text-gray-300 mt-3 line-clamp-2 pl-9">{post.content}</p>
                                        </div>
                                    )) : (
                                        <div className="text-center py-8 border-2 border-dashed border-gray-700 rounded-lg">
                                            <p className="text-gray-500">No posts scheduled yet.</p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                renderCalendar()
                            )}
                        </>
                    )}

                    {activeFeedTab === 'instagram' && (
                        <InstagramFeed 
                            handle={instagramAccount?.handle || ''} 
                            connected={instagramAccount?.connected || false}
                            onConnect={() => handleToggleConnection(instagramAccount!)} 
                        />
                    )}
                </div>
            </Card>
        </div>
    );
};

export default SocialPublisher;
