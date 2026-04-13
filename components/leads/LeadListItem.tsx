
import React from 'react';
import { Lead, LeadStatus } from '../../types';
import { WhatsAppIcon, FireIcon } from '../IconComponents';

const statusConfig: Record<LeadStatus, { color: string, label: string }> = {
    New: { color: 'bg-blue-500/10 text-blue-400 border-blue-500/20', label: 'New' },
    Contacted: { color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20', label: 'Contacted' },
    Viewing: { color: 'bg-purple-500/10 text-purple-400 border-purple-500/20', label: 'Viewing Scheduled' },
    Offer: { color: 'bg-amber-500/10 text-amber-400 border-amber-500/20', label: 'Offer Made' },
    Closed: { color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', label: 'Deal Closed' },
    Nurturing: { color: 'bg-slate-500/10 text-slate-400 border-slate-500/20', label: 'Nurturing' },
};

interface LeadListItemProps {
    lead: Lead;
    isSelected: boolean;
    onClick: () => void;
}

const LeadListItem: React.FC<LeadListItemProps> = ({ lead, isSelected, onClick }) => {
    return (
        <button
            onClick={onClick}
            className={`w-full text-left p-3 rounded-xl transition-all border ${isSelected ? 'bg-emerald-500/10 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'bg-slate-900/40 border-transparent hover:bg-slate-800/60 hover:border-slate-700'}`}
        >
            <div className="flex justify-between items-start mb-1.5">
                <div className="flex items-center gap-2 min-w-0">
                     <div className="relative">
                        <img src={`https://i.pravatar.cc/150?u=${lead.id}`} className="w-10 h-10 rounded-full border border-slate-700" alt="" />
                        {lead.source === 'WhatsApp' && <div className="absolute -bottom-1 -right-1 bg-slate-950 rounded-full p-0.5"><WhatsAppIcon className="w-3.5 h-3.5 text-green-500"/></div>}
                    </div>
                    <div className="min-w-0">
                        <p className={`font-semibold text-sm truncate ${isSelected ? 'text-white' : 'text-slate-200'}`}>{lead.name}</p>
                        <p className="text-[10px] text-slate-500 truncate">{lead.history[0]?.date}</p>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                     {lead.temperature === 'Hot' && <FireIcon className="w-3 h-3 text-rose-500" />}
                     {lead.score !== undefined && (
                        <div className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${lead.score > 75 ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : lead.score > 40 ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
                            {lead.score}
                        </div>
                    )}
                </div>
            </div>

            <div className="pl-12">
                <p className="text-xs text-slate-400 truncate line-clamp-1">
                    {lead.source === 'WhatsApp' && lead.conversation && lead.conversation.length > 0
                        ? <span className="italic text-slate-500">{lead.conversation[lead.conversation.length - 1].text}</span>
                        : (lead.notes || 'No notes available')}
                </p>
                <div className="mt-2 flex items-center gap-2">
                     <span className={`w-2 h-2 rounded-full ${statusConfig[lead.status].color.split(' ')[0].replace('/10', '')}`}></span>
                     <span className="text-[10px] text-slate-500">{statusConfig[lead.status].label}</span>
                </div>
            </div>
        </button>
    );
};

export default LeadListItem;
