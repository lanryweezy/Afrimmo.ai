import React from 'react';
import Card from './Card';
import Button from './Button';
import { Page, Lead, Listing } from '../types';
import { ListingsIcon, LeadsIcon, PropertyValuatorIcon, WhatsAppIcon, CalendarDaysIcon, SendIcon } from './IconComponents';

interface TodayProps {
    setActivePage: (page: Page) => void;
    leads: Lead[];
    listings: Listing[];
}

const StatCard: React.FC<{ title: string; value: string; subtext?: string; icon: React.ReactNode; color: string }> = ({ title, value, subtext, icon, color }) => (
    <div className="glass-panel p-5 rounded-2xl relative overflow-hidden group hover:bg-slate-800/50 transition-colors">
        <div className={`absolute top-0 right-0 p-24 opacity-5 rounded-full -mr-10 -mt-10 transition-transform group-hover:scale-110 ${color.replace('text-', 'bg-')}`}></div>
        <div className="flex justify-between items-start mb-4">
            <div>
                <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">{title}</p>
                <h3 className="text-2xl font-bold text-white mt-1">{value}</h3>
            </div>
            <div className={`p-2.5 rounded-xl bg-slate-900/50 ${color} shadow-sm border border-white/5`}>
                {icon}
            </div>
        </div>
        {subtext && <p className="text-xs text-slate-500 flex items-center">{subtext}</p>}
    </div>
);

const Today: React.FC<TodayProps> = ({ setActivePage, leads, listings }) => {
  const activeListingsCount = listings.filter(l => l.status === 'Available').length;
  const newLeadsCount = leads.filter(l => l.status === 'New').length;
  const hotLeadsCount = leads.filter(l => l.temperature === 'Hot').length;
  const newLeadsToContact = leads.filter(l => l.status === 'New').slice(0, 3);

  const formatCurrency = (val: string) => val; // Assuming value is already formatted string or we could add formatting logic here

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
      
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Hello, <span className="text-emerald-400">Tunde</span> 👋</h1>
            <p className="text-slate-400 mt-2">Here is your daily briefing for the Lagos market.</p>
        </div>
        <div className="flex gap-2">
            <Button variant="secondary" size="small" onClick={() => setActivePage('listings')}>+ Listing</Button>
            <Button onClick={() => setActivePage('leads')} size="small">+ Lead</Button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
            title="Active Listings" 
            value={activeListingsCount.toString()} 
            subtext="2 Under Offer"
            icon={<ListingsIcon className="w-5 h-5" />} 
            color="text-blue-400"
        />
        <StatCard 
            title="New Leads" 
            value={newLeadsCount.toString()} 
            subtext="+5 from Instagram Ads"
            icon={<LeadsIcon className="w-5 h-5" />} 
            color="text-emerald-400"
        />
        <StatCard 
            title="Pipeline Value" 
            value="₦1.2B" 
            subtext="Potential Commission: ₦60M"
            icon={<PropertyValuatorIcon className="w-5 h-5" />} 
            color="text-amber-400"
        />
        <StatCard 
            title="Hot Prospects" 
            value={hotLeadsCount.toString()} 
            subtext="Close these this week!"
            icon={<SendIcon className="w-5 h-5" />} 
            color="text-rose-400"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
        
        {/* Quick Actions / Agenda */}
        <div className="lg:col-span-2 space-y-6">
             <Card>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-white">Today's Priority</h2>
                    <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded border border-emerald-500/20">3 Tasks</span>
                </div>
                <div className="space-y-3">
                    {/* Agenda Items */}
                    <div className="group flex items-center p-4 bg-slate-900/40 hover:bg-slate-800/60 border border-slate-800 hover:border-emerald-500/30 rounded-xl transition-all cursor-pointer">
                        <div className="flex flex-col items-center justify-center w-14 h-14 bg-slate-800 rounded-lg mr-4 border border-slate-700 group-hover:border-emerald-500/50">
                            <span className="text-xs text-slate-400 font-medium">SEP</span>
                            <span className="text-xl font-bold text-white">14</span>
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <h3 className="font-semibold text-white group-hover:text-emerald-400 transition-colors">Viewing: 4-Bed Duplex</h3>
                                <span className="text-xs font-mono bg-slate-950 px-2 py-1 rounded text-slate-400">11:00 AM</span>
                            </div>
                            <p className="text-sm text-slate-400 mt-0.5">Client: Mr. Adebayo • Lekki Phase 1</p>
                        </div>
                    </div>

                    <div className="group flex items-center p-4 bg-slate-900/40 hover:bg-slate-800/60 border border-slate-800 hover:border-emerald-500/30 rounded-xl transition-all cursor-pointer">
                        <div className="flex flex-col items-center justify-center w-14 h-14 bg-slate-800 rounded-lg mr-4 border border-slate-700 group-hover:border-emerald-500/50">
                            <span className="text-xs text-slate-400 font-medium">SEP</span>
                            <span className="text-xl font-bold text-white">14</span>
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <h3 className="font-semibold text-white group-hover:text-emerald-400 transition-colors">Contract Signing</h3>
                                <span className="text-xs font-mono bg-slate-950 px-2 py-1 rounded text-slate-400">02:00 PM</span>
                            </div>
                            <p className="text-sm text-slate-400 mt-0.5">Client: Mrs. Eze • Ikoyi Office</p>
                        </div>
                    </div>

                     <div className="group flex items-center p-4 bg-slate-900/40 hover:bg-slate-800/60 border border-slate-800 hover:border-emerald-500/30 rounded-xl transition-all cursor-pointer">
                        <div className="flex flex-col items-center justify-center w-14 h-14 bg-slate-800 rounded-lg mr-4 border border-slate-700 group-hover:border-emerald-500/50">
                             <span className="text-xs text-slate-400 font-medium">SEP</span>
                            <span className="text-xl font-bold text-white">14</span>
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <h3 className="font-semibold text-white group-hover:text-emerald-400 transition-colors">Follow-up Call</h3>
                                <span className="text-xs font-mono bg-slate-950 px-2 py-1 rounded text-slate-400">04:30 PM</span>
                            </div>
                            <p className="text-sm text-slate-400 mt-0.5">Lead: Chinedu • Discuss Budget</p>
                        </div>
                    </div>
                </div>
            </Card>
        </div>

        {/* Urgent Leads Column */}
        <div className="space-y-6">
             <Card className="h-full">
                <h2 className="text-lg font-bold text-white mb-4 flex items-center">
                    <span className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></span>
                    Action Required
                </h2>
                 <div className="space-y-3">
                    {newLeadsToContact.length > 0 ? (
                        newLeadsToContact.map(lead => (
                            <div key={lead.id} className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <p className="font-semibold text-white text-sm">{lead.name}</p>
                                        <p className="text-xs text-slate-400">{lead.source} • <span className="text-amber-400">Just now</span></p>
                                    </div>
                                    <button onClick={() => setActivePage('leads')} className={`p-2 rounded-lg transition-colors ${lead.source === 'WhatsApp' ? 'bg-green-500/10 hover:bg-green-500/20 text-green-400' : 'bg-slate-800 hover:bg-slate-700 text-white'}`}>
                                       {lead.source === 'WhatsApp' ? <WhatsAppIcon className="w-4 h-4" /> : <SendIcon className="w-4 h-4" />}
                                    </button>
                                </div>
                                {lead.notes && <p className="text-xs text-slate-500 line-clamp-1 bg-slate-950/50 p-1.5 rounded border border-slate-800/50">"{lead.notes}"</p>}
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-10">
                            <p className="text-slate-500 text-sm">All caught up! 🎉</p>
                        </div>
                    )}
                    <Button variant="secondary" className="w-full mt-4 text-xs" onClick={() => setActivePage('leads')}>View All Leads</Button>
                </div>
            </Card>
        </div>

      </div>
    </div>
  );
};

export default Today;