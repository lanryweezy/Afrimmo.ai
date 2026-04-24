

import React, { useState } from 'react';
import { Page } from '../types';
import { BellIcon, CheckIcon } from './IconComponents';

interface HeaderProps {
  currentPage: Page;
}

const pageTitles: Record<Page, string> = {
  today: 'Command Center',
  leads: 'Client Relationship',
  listings: 'Property Portfolio',
  marketing: 'Marketing Studio',
  tools: 'Intelligence Tools',
  'content-studio': 'Content Studio',
  'whatsapp-automator': 'WhatsApp Bot',
  'market-insights': 'Market Insights',
  'property-valuator': 'AI Valuator',
  'social-publisher': 'Social Publisher',
  settings: 'Settings & Billing',
};

const Header: React.FC<HeaderProps> = ({ currentPage }) => {
  const title = pageTitles[currentPage] || 'Afrimmo AI';
  const [showNotifications, setShowNotifications] = useState(false);
  
  const mockNotifications = [
      { id: 1, text: "Lead 'Amara' sent a new message.", time: "2m ago", unread: true },
      { id: 2, text: "Listing 'Banana Island' generated 500 views.", time: "1h ago", unread: true },
      { id: 3, text: "Market Alert: Rental prices in Lekki up 3%.", time: "5h ago", unread: false },
  ];
  
  return (
    <header className="bg-slate-950/80 backdrop-blur-xl sticky top-0 z-20 px-4 sm:px-8 py-4 border-b border-slate-800/60">
      <div className="flex items-center justify-between">
        <div className="flex-1">
            <h1 className="text-lg sm:text-2xl font-bold text-white tracking-tight">{title}</h1>
            <p className="hidden sm:block text-xs text-slate-400 mt-0.5">Manage your real estate business with AI.</p>
        </div>

        <div className="flex items-center gap-3 sm:gap-5 relative">
            {/* Search Bar - Hidden on mobile, visible on desktop */}
            <div className="hidden md:flex items-center bg-slate-900 border border-slate-800 rounded-full px-4 py-2 w-64 focus-within:border-emerald-500/50 focus-within:ring-1 focus-within:ring-emerald-500/20 transition-all">
                <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                <input type="text" placeholder="Search properties, clients..." className="bg-transparent border-none text-sm text-white ml-2 w-full focus:outline-none placeholder-slate-500" />
            </div>

            <div className="relative">
                <button 
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-2 text-slate-400 hover:text-white transition-colors rounded-full hover:bg-slate-800"
                >
                    <BellIcon className="w-6 h-6" />
                    <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-slate-950"></span>
                </button>

                {showNotifications && (
                    <div className="absolute right-0 mt-3 w-80 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-50 animate-fade-in origin-top-right">
                        <div className="p-3 border-b border-slate-800 flex justify-between items-center">
                            <h3 className="font-bold text-white text-sm">Notifications</h3>
                            <button className="text-xs text-emerald-400 hover:text-emerald-300">Mark all read</button>
                        </div>
                        <div className="max-h-64 overflow-y-auto">
                            {mockNotifications.map(n => (
                                <div key={n.id} className={`p-4 border-b border-slate-800 last:border-0 hover:bg-slate-800/50 transition-colors cursor-pointer ${n.unread ? 'bg-slate-800/20' : ''}`}>
                                    <div className="flex items-start gap-3">
                                        <div className={`w-2 h-2 mt-1.5 rounded-full flex-shrink-0 ${n.unread ? 'bg-emerald-500' : 'bg-transparent'}`}></div>
                                        <div>
                                            <p className={`text-sm ${n.unread ? 'text-white font-medium' : 'text-slate-400'}`}>{n.text}</p>
                                            <p className="text-[10px] text-slate-500 mt-1">{n.time}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            
            <div className="md:hidden">
                 <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="User" className="w-8 h-8 rounded-full border border-slate-700" />
            </div>
        </div>
      </div>
    </header>
  );
};

export default Header;