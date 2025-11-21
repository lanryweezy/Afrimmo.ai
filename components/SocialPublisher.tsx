
import React, { useState, useEffect } from 'react';
import Card from './Card';
import Button from './Button';
import { getPostSuggestions } from '../services/geminiService';
import { Platform, SocialAccount, ScheduledPost } from '../types';
import { SparklesIcon, SocialPublisherIcon, InstagramIcon, FacebookIcon, ThreadsIcon, CheckIcon } from './IconComponents';

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
    const [selectedPlatform, setSelectedPlatform] = useState<Platform>(Platform.Instagram);
    const [scheduledDate, setScheduledDate] = useState(new Date());

    const [isLoading, setIsLoading] = useState(false);
    const [isSuggesting, setIsSuggesting] = useState(false);
    const [connectingState, setConnectingState] = useState<Record<string, boolean>>({});
    const [error, setError] = useState('');
    
    useEffect(() => {
        if (initialContent) {
            setContent(initialContent);
            clearInitialContent();
        }
    }, [initialContent, clearInitialContent]);

    const handleToggleConnection = (acc: SocialAccount) => {
        if (acc.connected) {
            setAccounts(prev => prev.map(a => a.platform === acc.platform ? { ...a, connected: false } : a));
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

    const getPlatformIcon = (platform: Platform) => {
        const iconProps = { className: "w-5 h-5 text-white" };
        switch (platform) {
            case Platform.Instagram: return <InstagramIcon {...iconProps} />;
            case Platform.Facebook: return <FacebookIcon {...iconProps} />;
            case Platform.Threads: return <ThreadsIcon {...iconProps} />;
            default: return null;
        }
    };

    const handleSchedule = () => {
        const activeAccount = accounts.find(a => a.platform === selectedPlatform);
        if (!activeAccount?.connected) {
             setError(`Please connect your ${selectedPlatform} account first.`);
             return;
        }

        if (!content.trim()) {
            setError('Post content cannot be empty.');
            return;
        }
        setError('');
        setIsLoading(true);

        const newPost: ScheduledPost = {
            id: Date.now().toString(),
            platform: selectedPlatform,
            content,
            scheduledAt: scheduledDate,
            status: 'Scheduled',
        };
        
        setTimeout(() => {
            setPosts(prev => [...prev, newPost].sort((a,b) => a.scheduledAt.getTime() - b.scheduledAt.getTime()));
            setContent('');
            setIsLoading(false);
        }, 500);
    };

    const handleGetSuggestions = async () => {
        if (!content.trim()) {
            setError('Write some content first to get suggestions.');
            return;
        }
        setError('');
        setIsSuggesting(true);
        try {
            const suggestions = await getPostSuggestions(content, selectedPlatform);
            setContent(`${suggestions.rewritten}\n\n${suggestions.hashtags.join(' ')}`);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSuggesting(false);
        }
    };
    
    const connectedAccounts = accounts.filter(a => a.connected);

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
                            <label className="block text-sm font-medium text-gray-300 mb-1">Platform</label>
                            <select 
                                value={selectedPlatform} 
                                onChange={(e) => setSelectedPlatform(e.target.value as Platform)}
                                className="w-full bg-gray-700 border-gray-600 text-white rounded-lg p-2 focus:ring-teal-500 focus:border-teal-500"
                            >
                                {accounts.map(a => (
                                    <option key={a.platform} value={a.platform}>
                                        {a.platform} {a.connected ? '(Connected)' : '(Not Connected)'}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                             <label className="block text-sm font-medium text-gray-300 mb-1">Schedule For</label>
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
                        <Button onClick={handleSchedule} isLoading={isLoading} icon={<SocialPublisherIcon className="w-5 h-5"/>} className="flex-1" disabled={!connectedAccounts.find(a => a.platform === selectedPlatform)}>
                            Schedule Post
                        </Button>
                    </div>
                    {error && <p className="text-red-400 text-sm text-center animate-pulse">{error}</p>}
                </div>
            </Card>

            <Card>
                <h2 className="text-xl font-semibold text-white mb-4">Scheduled Posts</h2>
                <div className="space-y-3">
                    {posts.length > 0 ? posts.map(post => (
                        <div key={post.id} className="bg-gray-900/50 p-4 rounded-lg border border-gray-700/50">
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
            </Card>
        </div>
    );
};

export default SocialPublisher;
