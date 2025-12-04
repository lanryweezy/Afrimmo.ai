import React from 'react';
import { Page } from '../types';

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
  
  return (
    <header className="bg-slate-950/80 backdrop-blur-xl sticky top-0 z-20 px-4 sm:px-8 py-4 border-b border-slate-800/60">
      <div className="flex items-center justify-between">
        <div className="flex-1">
            <h1 className="text-lg sm:text-2xl font-bold text-white tracking-tight">{title}</h1>
            <p className="hidden sm:block text-xs text-slate-400 mt-0.5">Manage your real estate business with AI.</p>
        </div>

        <div className="flex items-center gap-3 sm:gap-5">
            {/* Search Bar - Hidden on mobile, visible on desktop */}
            <div className="hidden md:flex items-center bg-slate-900 border border-slate-800 rounded-full px-4 py-2 w-64 focus-within:border-emerald-500/50 focus-within:ring-1 focus-within:ring-emerald-500/20 transition-all">
                <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                <input type="text" placeholder="Search properties, clients..." className="bg-transparent border-none text-sm text-white ml-2 w-full focus:outline-none placeholder-slate-500" />
            </div>

            <button className="relative p-2 text-slate-400 hover:text-white transition-colors rounded-full hover:bg-slate-800">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-slate-950"></span>
            </button>
            
            <div className="md:hidden">
                 <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="User" className="w-8 h-8 rounded-full border border-slate-700" />
            </div>
        </div>
      </div>
    </header>
  );
};

export default Header;