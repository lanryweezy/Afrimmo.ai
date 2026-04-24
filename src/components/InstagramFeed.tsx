
import React from 'react';
import { HeartIcon, ChatAltIcon } from './IconComponents';

interface InstagramFeedProps {
    handle: string;
    connected: boolean;
    onConnect: () => void;
}

const mockPosts = [
    { id: 1, img: 'https://picsum.photos/seed/insta1/400/400', likes: 124, comments: 12 },
    { id: 2, img: 'https://picsum.photos/seed/insta2/400/400', likes: 89, comments: 5 },
    { id: 3, img: 'https://picsum.photos/seed/insta3/400/400', likes: 256, comments: 34 },
    { id: 4, img: 'https://picsum.photos/seed/insta4/400/400', likes: 45, comments: 2 },
    { id: 5, img: 'https://picsum.photos/seed/insta5/400/400', likes: 112, comments: 8 },
    { id: 6, img: 'https://picsum.photos/seed/insta6/400/400', likes: 334, comments: 45 },
];

const InstagramFeed: React.FC<InstagramFeedProps> = ({ handle, connected, onConnect }) => {
    if (!connected) {
        return (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                </div>
                <h3 className="text-white font-bold text-lg mb-2">Connect Instagram</h3>
                <p className="text-slate-400 text-sm mb-6">Connect your professional account to see your live feed and analytics.</p>
                <button onClick={onConnect} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                    Connect Account
                </button>
            </div>
        );
    }

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            {/* Header */}
            <div className="p-6 flex items-center gap-6 border-b border-slate-800">
                <div className="w-20 h-20 rounded-full p-[2px] bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600">
                    <img src={`https://i.pravatar.cc/150?u=${handle}`} alt="Profile" className="w-full h-full rounded-full border-2 border-slate-900 object-cover" />
                </div>
                <div>
                    <h3 className="font-bold text-xl text-white">{handle}</h3>
                    <div className="flex gap-6 mt-2 text-sm text-slate-300">
                        <span><strong className="text-white">1,254</strong> posts</span>
                        <span><strong className="text-white">45.2k</strong> followers</span>
                        <span><strong className="text-white">210</strong> following</span>
                    </div>
                    <p className="text-sm text-slate-400 mt-2">Luxury Real Estate • Lagos • Accra</p>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-3 gap-0.5 bg-slate-800">
                {mockPosts.map(post => (
                    <div key={post.id} className="relative aspect-square group cursor-pointer overflow-hidden bg-slate-900">
                        <img src={post.img} alt="Post" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-90 group-hover:opacity-100" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 text-white font-bold backdrop-blur-sm">
                            <span className="flex items-center gap-1"><HeartIcon className="w-5 h-5 fill-white" /> {post.likes}</span>
                            <span className="flex items-center gap-1"><ChatAltIcon className="w-5 h-5 fill-white" /> {post.comments}</span>
                        </div>
                    </div>
                ))}
            </div>
             <div className="p-4 text-center border-t border-slate-800">
                <button className="text-blue-400 hover:text-blue-300 font-semibold text-sm transition-colors">View on Instagram</button>
            </div>
        </div>
    );
};

export default InstagramFeed;
