
import React, { useState, useEffect } from 'react';
import Card from './Card';
import Button from './Button';
import { Lead, LeadStatus, ChatMessage, LeadInteraction } from '../types';
import { FireIcon, SparklesIcon, HistoryIcon, NoteIcon, LeadsIcon, ChatBubbleLeftRightIcon, WhatsAppIcon, CheckIcon, DocumentTextIcon } from './IconComponents';
import WhatsAppChat from './WhatsAppChat';
import DealDocs from './DealDocs';
import { scoreLead } from '../services/geminiService';

type DetailTab = 'details' | 'chat' | 'docs';

const statusConfig: Record<LeadStatus, { color: string, label: string }> = {
    New: { color: 'bg-blue-500/10 text-blue-400 border-blue-500/20', label: 'New' },
    Contacted: { color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20', label: 'Contacted' },
    Viewing: { color: 'bg-purple-500/10 text-purple-400 border-purple-500/20', label: 'Viewing Scheduled' },
    Offer: { color: 'bg-amber-500/10 text-amber-400 border-amber-500/20', label: 'Offer Made' },
    Closed: { color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', label: 'Deal Closed' },
    Nurturing: { color: 'bg-slate-500/10 text-slate-400 border-slate-500/20', label: 'Nurturing' },
};

interface LeadsProps {
    leads: Lead[];
    setLeads: React.Dispatch<React.SetStateAction<Lead[]>>;
    isLoading: boolean;
}

const AddLeadForm: React.FC<{ onAdd: (data: any) => void, onCancel: () => void }> = ({ onAdd, onCancel }) => {
    const [name, setName] = useState('');
    const [source, setSource] = useState<'WhatsApp' | 'Instagram' | 'Manual'>('Manual');
    const [notes, setNotes] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;
        onAdd({ name, source, notes });
    };

    return (
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 animate-fade-in mb-4">
            <h3 className="font-semibold text-white text-sm mb-3">New Client Profile</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
                <input
                    type="text"
                    placeholder="Client Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg p-2.5 text-sm focus:ring-emerald-500 focus:border-emerald-500 placeholder-slate-500"
                    required
                />
                <select value={source} onChange={(e) => setSource(e.target.value as any)} className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg p-2.5 text-sm focus:ring-emerald-500 focus:border-emerald-500">
                    <option value="Manual">Manual Entry</option>
                    <option value="WhatsApp">WhatsApp Inquiry</option>
                    <option value="Instagram">Instagram DM</option>
                </select>
                <textarea
                    placeholder="Initial requirements (e.g. 3 Bed in Ikoyi, Budget ₦100M)"
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg p-2.5 text-sm focus:ring-emerald-500 focus:border-emerald-500 placeholder-slate-500"
                />
                <div className="flex justify-end gap-2 pt-1">
                    <Button type="button" onClick={onCancel} variant="secondary" size="small" className="bg-transparent border border-slate-700">Cancel</Button>
                    <Button type="submit" size="small">Create & Score</Button>
                </div>
            </form>
        </div>
    );
};


const Leads: React.FC<LeadsProps> = ({ leads, setLeads, isLoading }) => {
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
    const [activeDetailTab, setActiveDetailTab] = useState<DetailTab>('details');
    const [showAddLeadForm, setShowAddLeadForm] = useState(false);
    const [filter, setFilter] = useState<'All' | 'Hot'>('All');

    useEffect(() => {
        if (!isLoading && leads.length > 0 && !selectedLead && window.innerWidth >= 768) {
            handleSelectLead(leads[0]);
        }
        if (selectedLead && !leads.find(l => l.id === selectedLead.id)) {
            leads.length > 0 ? handleSelectLead(leads[0]) : setSelectedLead(null);
        }
    }, [leads, isLoading]);


    const handleSelectLead = (lead: Lead) => {
        setSelectedLead(lead);
        if (lead.source === 'WhatsApp' && lead.conversation && lead.conversation.length > 0) {
            setActiveDetailTab('chat');
        } else if (lead.status === 'Offer' || lead.status === 'Closed') {
            setActiveDetailTab('docs');
        } else {
            setActiveDetailTab('details');
        }
    };

    const handleStatusChange = (leadId: string, newStatus: LeadStatus) => {
        setLeads(prevLeads => prevLeads.map(l => l.id === leadId ? {...l, status: newStatus} : l));
        if (selectedLead?.id === leadId) {
            setSelectedLead(prev => prev ? {...prev, status: newStatus} : null);
        }
    };
    
    const handleNoteSave = (leadId: string, newNote: string) => {
       setLeads(prevLeads => prevLeads.map(l => l.id === leadId ? {...l, notes: newNote} : l));
        if (selectedLead?.id === leadId) {
            setSelectedLead(prev => prev ? {...prev, notes: newNote} : null);
        }
    };

    const handleSendMessage = (leadId: string, message: ChatMessage, isUserMessage: boolean) => {
        setLeads(prevLeads => {
            const updatedLeads = prevLeads.map(l => {
                if (l.id === leadId) {
                    let conversation = l.conversation || [];
                    if (!message.isTyping) {
                        conversation = conversation.filter(m => !m.isTyping);
                    }
                    const newConversation = [...conversation, message];
                    return { ...l, conversation: newConversation };
                }
                return l;
            });
            
            if (selectedLead?.id === leadId) {
                 const updatedLead = updatedLeads.find(l => l.id === leadId);
                 if (updatedLead) setSelectedLead(updatedLead);
            }
            return updatedLeads;
        });

        if (isUserMessage && message.sender === 'ai') {
            const typingIndicator: ChatMessage = {
                id: `typing-${Date.now()}`,
                sender: 'user',
                text: '',
                timestamp: '',
                isTyping: true,
            };
            handleSendMessage(leadId, typingIndicator, false);

            setTimeout(() => {
                const clientReply: ChatMessage = {
                    id: `msg-${Date.now()}`,
                    sender: 'user',
                    text: "Okay, thank you for the information! When can we view?",
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                };
                handleSendMessage(leadId, clientReply, false);
            }, 2500);
        }
    };
    
    const handleUpdateLeadHistory = (leadId: string, newInteraction: LeadInteraction) => {
        setLeads(prevLeads => {
            const updatedLeads = prevLeads.map(l => {
                if (l.id === leadId) {
                    const newHistory = [newInteraction, ...(l.history || [])];
                    return { ...l, history: newHistory };
                }
                return l;
            });
            if (selectedLead?.id === leadId) {
                const updatedLead = updatedLeads.find(l => l.id === leadId);
                if (updatedLead) setSelectedLead(updatedLead);
            }
            return updatedLeads;
        });
    };

    const handleAddNewLead = async (newLeadData: { name: string, source: 'WhatsApp' | 'Instagram' | 'Manual', notes: string }) => {
        const tempId = `lead-${Date.now()}`;
        const newLead: Lead = {
            id: tempId,
            ...newLeadData,
            status: 'New',
            history: [{ id: 'h-new', date: 'Just now', description: 'Lead created manually.' }],
            score: 0,
            temperature: 'Cold',
            justification: 'AI Scoring in progress...',
            nextAction: 'Pending analysis...',
        };
        
        // Optimistic update
        setLeads(prevLeads => [newLead, ...prevLeads]);
        setShowAddLeadForm(false);
        handleSelectLead(newLead);

        try {
            // Real-time AI scoring
            const scoreData = await scoreLead(newLead);
            
            setLeads(prevLeads => prevLeads.map(l => 
                l.id === tempId ? { ...l, ...scoreData } : l
            ));
            
            // Update selected view if still on this lead
            setSelectedLead(prev => 
                prev && prev.id === tempId ? { ...prev, ...scoreData } : prev
            );
        } catch (error) {
            console.error("Scoring failed", error);
        }
    };

    // Filter and Sort leads
    const filteredLeads = (filter === 'All' ? leads : leads.filter(l => l.temperature === 'Hot'))
        .sort((a, b) => (b.score || 0) - (a.score || 0));

    return (
        <div className="space-y-6 max-w-[1600px] mx-auto animate-fade-in h-[calc(100vh-140px)] md:h-[calc(100vh-100px)] flex flex-col">
             <div className="flex justify-between items-center px-2">
                <div>
                    <h1 className="text-2xl font-bold text-white">Relationships</h1>
                    <p className="text-slate-400 text-xs">Manage your pipeline.</p>
                </div>
                <div className="flex gap-2">
                    <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800">
                        <button onClick={() => setFilter('All')} className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${filter === 'All' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}>All</button>
                        <button onClick={() => setFilter('Hot')} className={`px-3 py-1 text-xs font-medium rounded-md transition-all flex items-center gap-1 ${filter === 'Hot' ? 'bg-rose-500/20 text-rose-400' : 'text-slate-400 hover:text-white'}`}>
                            <FireIcon className="w-3 h-3"/> Hot
                        </button>
                    </div>
                </div>
            </div>
            
            <div className="flex-1 md:flex md:gap-6 overflow-hidden">
                {/* Lead List Column */}
                <div className={`${selectedLead ? 'hidden md:flex' : 'flex'} w-full md:w-1/3 lg:w-1/4 flex-col bg-slate-950 md:bg-transparent border-r md:border-r-0 border-slate-800 md:border-none`}>
                    <Card className="flex-1 flex flex-col p-0 overflow-hidden border-0 md:border border-slate-800/60">
                        <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
                            <h2 className="font-bold text-white text-sm">Clients ({filteredLeads.length})</h2>
                            <button onClick={() => setShowAddLeadForm(prev => !prev)} className="text-emerald-400 hover:text-emerald-300 text-xs font-bold uppercase tracking-wider">+ Add</button>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-3 space-y-2">
                             {showAddLeadForm && <AddLeadForm onAdd={handleAddNewLead} onCancel={() => setShowAddLeadForm(false)} />}
                            
                            {isLoading && <div className="p-4 text-center"><div className="animate-spin w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full mx-auto mb-2"></div><p className="text-xs text-slate-500">Analyzing pipeline...</p></div>}
                            
                            {!isLoading && filteredLeads.map(lead => (
                                <button key={lead.id} onClick={() => handleSelectLead(lead)} className={`w-full text-left p-3 rounded-xl transition-all border ${selectedLead?.id === lead.id ? 'bg-emerald-500/10 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'bg-slate-900/40 border-transparent hover:bg-slate-800/60 hover:border-slate-700'}`}>
                                    <div className="flex justify-between items-start mb-1.5">
                                        <div className="flex items-center gap-2 min-w-0">
                                             <div className="relative">
                                                <img src={`https://i.pravatar.cc/150?u=${lead.id}`} className="w-10 h-10 rounded-full border border-slate-700" alt="" />
                                                {lead.source === 'WhatsApp' && <div className="absolute -bottom-1 -right-1 bg-slate-950 rounded-full p-0.5"><WhatsAppIcon className="w-3.5 h-3.5 text-green-500"/></div>}
                                            </div>
                                            <div className="min-w-0">
                                                <p className={`font-semibold text-sm truncate ${selectedLead?.id === lead.id ? 'text-white' : 'text-slate-200'}`}>{lead.name}</p>
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
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Lead Detail / Chat Column */}
                <div className={`${selectedLead ? 'flex' : 'hidden md:flex'} w-full md:w-2/3 lg:w-3/4 flex-col bg-slate-950 md:bg-transparent z-10`}>
                    {selectedLead ? (
                       <Card className="h-full flex flex-col p-0 overflow-hidden border-0 md:border border-slate-800/60">
                            {/* Detail Header */}
                            <div className="p-4 border-b border-slate-800 bg-slate-900/80 backdrop-blur flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                     <button onClick={() => setSelectedLead(null)} className="md:hidden p-2 -ml-2 text-slate-400 hover:text-white">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                    </button>
                                    <img src={`https://i.pravatar.cc/150?u=${selectedLead.id}`} className="w-10 h-10 rounded-full border border-slate-700" alt="" />
                                    <div>
                                        <h2 className="text-base font-bold text-white flex items-center gap-2">
                                            {selectedLead.name}
                                            {selectedLead.temperature === 'Hot' && <span className="bg-rose-500/20 text-rose-400 text-[10px] px-1.5 py-0.5 rounded-full border border-rose-500/30 flex items-center"><FireIcon className="w-3 h-3 mr-0.5"/> HOT</span>}
                                        </h2>
                                        <div className="flex items-center gap-2">
                                            <span className={`text-[10px] px-1.5 py-0.5 rounded border ${statusConfig[selectedLead.status].color}`}>{statusConfig[selectedLead.status].label}</span>
                                            <span className="text-[10px] text-slate-500">via {selectedLead.source}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                     <select 
                                        value={selectedLead.status} 
                                        onChange={(e) => handleStatusChange(selectedLead.id, e.target.value as LeadStatus)} 
                                        className="bg-slate-800 border border-slate-700 text-white text-xs rounded-lg py-1.5 pl-2 pr-8 focus:ring-emerald-500 focus:border-emerald-500 hidden sm:block"
                                    >
                                        {Object.keys(statusConfig).map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                            </div>
                            
                            {/* Tab Switcher */}
                            <div className="flex border-b border-slate-800 bg-slate-900/30 overflow-x-auto">
                                {selectedLead.source === 'WhatsApp' && (
                                    <TabButton icon={<ChatBubbleLeftRightIcon className="w-4 h-4"/>} label="Live Chat" isActive={activeDetailTab === 'chat'} onClick={() => setActiveDetailTab('chat')} />
                                )}
                                <TabButton icon={<NoteIcon className="w-4 h-4"/>} label="CRM Profile" isActive={activeDetailTab === 'details'} onClick={() => setActiveDetailTab('details')} />
                                <TabButton icon={<DocumentTextIcon className="w-4 h-4"/>} label="Deal Docs" isActive={activeDetailTab === 'docs'} onClick={() => setActiveDetailTab('docs')} />
                            </div>

                           <div className="flex-1 overflow-y-auto relative bg-slate-950/50">
                               {/* BACKGROUND PATTERN FOR CHAT */}
                               {activeDetailTab === 'chat' && <div className="absolute inset-0 opacity-5 pointer-events-none" style={{backgroundImage: "radial-gradient(#cbd5e1 1px, transparent 1px)", backgroundSize: "20px 20px"}}></div>}

                                {activeDetailTab === 'chat' && selectedLead.source === 'WhatsApp' && (
                                    <WhatsAppChat lead={selectedLead} onSendMessage={handleSendMessage} onUpdateHistory={handleUpdateLeadHistory} />
                                )}

                                {activeDetailTab === 'docs' && (
                                    <DealDocs lead={selectedLead} />
                                )}

                                {activeDetailTab === 'details' && (
                                    <div className="p-6 max-w-4xl mx-auto space-y-6">
                                         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                            {/* AI Insight Card */}
                                            <div className="lg:col-span-2">
                                                <div className="bg-gradient-to-br from-emerald-900/20 to-slate-900 border border-emerald-500/20 rounded-xl p-5 mb-6 shadow-lg shadow-emerald-900/10">
                                                    <h3 className="text-sm font-bold text-emerald-400 mb-3 flex items-center uppercase tracking-wider"><SparklesIcon className="w-4 h-4 mr-2"/> AI Lead Analysis</h3>
                                                    <p className="text-slate-300 text-sm leading-relaxed mb-4">{selectedLead.justification || "Insufficient data for analysis."}</p>
                                                    <div className="bg-slate-950/50 p-3 rounded-lg border border-emerald-500/10 flex items-start gap-3">
                                                        <div className="mt-0.5 text-emerald-500"><CheckIcon className="w-4 h-4"/></div>
                                                        <div>
                                                            <p className="text-[10px] text-slate-500 font-bold uppercase">Recommended Action</p>
                                                            <p className="text-white text-sm font-medium">{selectedLead.nextAction || "Gather more requirements."}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
                                                    <h3 className="text-sm font-bold text-white mb-4 flex items-center"><NoteIcon className="w-4 h-4 mr-2 text-slate-400"/> Notes & Requirements</h3>
                                                    <textarea
                                                        rows={6}
                                                        defaultValue={selectedLead.notes}
                                                        onBlur={(e) => handleNoteSave(selectedLead.id, e.target.value)}
                                                        placeholder="Enter client requirements, budget, preferred locations..."
                                                        className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded-lg p-3 text-sm focus:ring-emerald-500 focus:border-emerald-500 leading-relaxed"
                                                    />
                                                </div>
                                            </div>
                                            
                                            {/* History Timeline */}
                                            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 h-fit">
                                                <h3 className="text-sm font-bold text-white mb-4 flex items-center"><HistoryIcon className="w-4 h-4 mr-2 text-slate-400"/> Activity Log</h3>
                                                <div className="space-y-0 relative">
                                                    <div className="absolute left-1.5 top-2 bottom-2 w-px bg-slate-800"></div>
                                                    {(selectedLead.history || []).map((item, idx) => (
                                                        <div key={item.id} className="relative pl-6 pb-6 last:pb-0">
                                                            <div className="absolute left-0 top-1.5 w-3 h-3 bg-slate-800 border-2 border-slate-600 rounded-full"></div>
                                                            <p className="text-slate-300 text-sm">{item.description}</p>
                                                            <p className="text-xs text-slate-500 mt-1 font-mono">{item.date}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                         </div>
                                    </div>
                                )}
                            </div>
                       </Card>
                    ) : (
                         <div className="h-full hidden md:flex flex-col items-center justify-center text-center p-6 glass-card">
                            <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mb-4 shadow-inner">
                                <LeadsIcon className="w-10 h-10 text-slate-600" />
                            </div>
                            <h3 className="text-xl font-bold text-white">Select a Client</h3>
                            <p className="mt-2 text-sm text-slate-400 max-w-xs">View chat history, AI insights, and manage your sales pipeline from this panel.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const TabButton: React.FC<{icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void}> = ({ icon, label, isActive, onClick}) => (
    <button onClick={onClick} className={`flex-1 min-w-fit px-4 py-3 text-sm font-medium transition-all border-b-2 flex items-center justify-center gap-2 whitespace-nowrap ${isActive ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5' : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-800'}`}>
        {icon}
        {label}
    </button>
);

export default Leads;
