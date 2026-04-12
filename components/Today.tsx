

import React, { useState } from 'react';
import Card from './Card';
import Button from './Button';
import { Page, Lead, Listing, AgentGoals } from '../types';
import { ListingsIcon, LeadsIcon, PropertyValuatorIcon, WhatsAppIcon, SendIcon, PlusIcon, TrashIcon, CheckIcon, BellIcon, TargetIcon, MoneyIcon, SparklesIcon, VideoIcon } from './IconComponents';
import { useAppContext } from '../src/contexts/AppContext';
import { useToast } from '../src/contexts/ToastContext';

interface TodayProps {
    setActivePage: (page: Page) => void;
    leads: Lead[];
    listings: Listing[];
    goals?: AgentGoals;
}

interface Task {
    id: string;
    text: string;
    completed: boolean;
    time?: string;
    reminder?: boolean;
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

const CircularProgress: React.FC<{ percentage: number, label: string, value: string, subLabel: string, color: string }> = ({ percentage, label, value, subLabel, color }) => {
    const radius = 35;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;
    
    return (
        <div className="flex flex-col items-center justify-center p-4 bg-slate-900/40 rounded-xl border border-slate-800">
             <div className="relative w-24 h-24 mb-3">
                 {/* Background Circle */}
                 <svg className="w-full h-full transform -rotate-90">
                     <circle cx="50%" cy="50%" r={radius} stroke="currentColor" strokeWidth="6" fill="transparent" className="text-slate-800" />
                     <circle 
                        cx="50%" cy="50%" r={radius} 
                        stroke="currentColor" strokeWidth="6" fill="transparent" 
                        strokeDasharray={circumference} 
                        strokeDashoffset={strokeDashoffset} 
                        strokeLinecap="round"
                        className={`${color} transition-all duration-1000 ease-out`}
                     />
                 </svg>
                 <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white">
                     {percentage}%
                 </div>
             </div>
             <p className="text-xs text-slate-400 uppercase font-bold tracking-wide mb-1">{label}</p>
             <p className="text-white font-bold">{value}</p>
             <p className="text-[10px] text-slate-500">{subLabel}</p>
        </div>
    );
}

const Today: React.FC<TodayProps> = ({ setActivePage, leads, listings, goals }) => {
  const { isWhatsAppConnected, onboardingProgress, updateOnboardingProgress } = useAppContext();
  const { showToast } = useToast();
  const activeListingsCount = listings.filter(l => l.status === 'Available').length;
  const newLeadsCount = leads.filter(l => l.status === 'New').length;
  const hotLeadsCount = leads.filter(l => l.temperature === 'Hot').length;
  const newLeadsToContact = leads.filter(l => l.status === 'New').slice(0, 3);
  
  // Calculate mock revenue based on leads with 'Closed' status or 'Offer'
  // In a real app, this would come from a transaction log.
  // Mocking 40% progress for demo
  const revenueTarget = goals?.monthlyRevenueTarget || 50000000;
  const currentRevenue = Math.floor(revenueTarget * 0.42); 
  const dealsTarget = goals?.dealsTarget || 5;
  const closedDeals = leads.filter(l => l.status === 'Closed').length + 1; // +1 for mock

  const revenuePercentage = Math.min(100, Math.round((currentRevenue / revenueTarget) * 100));
  const dealsPercentage = Math.min(100, Math.round((closedDeals / dealsTarget) * 100));

  // Task State
  const [tasks, setTasks] = useState<Task[]>([
      { id: '1', text: 'Viewing: 4-Bed Duplex', time: '11:00 AM', completed: false, reminder: true },
      { id: '2', text: 'Contract Signing', time: '02:00 PM', completed: false, reminder: false },
      { id: '3', text: 'Follow-up Call: Chinedu', time: '04:30 PM', completed: false, reminder: false },
  ]);
  const [newTask, setNewTask] = useState('');

  const addTask = (e: React.FormEvent) => {
      e.preventDefault();
      if (!newTask.trim()) return;
      
      const task: Task = {
          id: Date.now().toString(),
          text: newTask,
          completed: false,
          reminder: false,
      };
      
      setTasks([task, ...tasks]); // Add to top
      setNewTask('');
  };

  const toggleTask = (id: string) => {
      setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
      setTasks(tasks.filter(t => t.id !== id));
  };

  const toggleReminder = (id: string, e: React.MouseEvent) => {
      e.stopPropagation();
      setTasks(tasks.map(t => {
          if (t.id === id) {
              const newReminderState = !t.reminder;
              if (newReminderState) {
                  showToast(`Reminder set for "${t.text}"`, 'info');
              }
              return { ...t, reminder: newReminderState };
          }
          return t;
      }));
  };

  const pendingTasks = tasks.filter(t => !t.completed).length;

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto relative">
      
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Hello, <span className="text-emerald-400">Tunde</span> 👋</h1>
            <p className="text-slate-400 mt-2">Here is your daily briefing for the Lagos market.</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto mt-4 md:mt-0">
            <Button variant="secondary" size="small" onClick={() => setActivePage('listings')} className="flex-1 md:flex-none justify-center">+ Listing</Button>
            <Button onClick={() => setActivePage('leads')} size="small" className="flex-1 md:flex-none justify-center">+ Lead</Button>
        </div>
      </div>

      {/* Getting Started Checklist */}
      {(!isWhatsAppConnected || hotLeadsCount === 0) && (
          <Card className="bg-gradient-to-r from-emerald-950/40 to-slate-900 border-emerald-500/20">
              <div className="flex items-center gap-2 mb-4">
                  <SparklesIcon className="w-5 h-5 text-emerald-400" />
                  <h2 className="text-lg font-bold text-white">Getting Started Checklist</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <ChecklistItem
                    title="Connect WhatsApp"
                    description="Enable AI replies for your leads."
                    completed={isWhatsAppConnected}
                    onClick={() => setActivePage('settings')}
                    icon={<WhatsAppIcon className="w-5 h-5" />}
                  />
                  <ChecklistItem
                    title="Create AI Video"
                    description="Turn photos into viral tours."
                    completed={onboardingProgress.videoCreated}
                    onClick={() => {
                        updateOnboardingProgress({ videoCreated: true });
                        setActivePage('marketing');
                    }}
                    icon={<VideoIcon className="w-5 h-5" />}
                  />
                  <ChecklistItem
                    title="Chat with your AI"
                    description="Try the 'My AI Assistant' lead."
                    completed={onboardingProgress.aiChatTested || leads.some(l => l.id === 'user-self' && (l.conversation?.length || 0) > 1)}
                    onClick={() => {
                        updateOnboardingProgress({ aiChatTested: true });
                        setActivePage('leads');
                    }}
                    icon={<LeadsIcon className="w-5 h-5" />}
                  />
              </div>
          </Card>
      )}

      {/* AI Market Pulse */}
      <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                <SparklesIcon className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
                <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Market Pulse</p>
                <p className="text-sm text-slate-200 font-medium">Demand for 2-bed rentals in Lekki Phase 1 is up <span className="text-emerald-400">12%</span> this week. Consider adjusting your listing prices.</p>
            </div>
        </div>
        <Button variant="secondary" size="small" className="whitespace-nowrap bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20">View Insights</Button>
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
            icon={<MoneyIcon className="w-5 h-5" />} 
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
        
        {/* Left Column: Tasks & Goals */}
        <div className="lg:col-span-2 space-y-6">
             
             {/* Goal Tracker */}
             <Card className="bg-gradient-to-br from-slate-900 to-slate-900 border-slate-800">
                <div className="flex justify-between items-center mb-6">
                     <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <TargetIcon className="w-5 h-5 text-emerald-400"/> Monthly Targets
                     </h2>
                     <button onClick={() => setActivePage('settings')} className="text-xs text-slate-400 hover:text-white transition-colors">Edit Goals</button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <CircularProgress 
                        percentage={revenuePercentage} 
                        label="Revenue Goal" 
                        value={`₦${(currentRevenue / 1000000).toFixed(1)}M`} 
                        subLabel={`Target: ₦${(revenueTarget / 1000000).toFixed(0)}M`}
                        color="text-emerald-500" 
                    />
                    <CircularProgress 
                        percentage={dealsPercentage} 
                        label="Deals Closed" 
                        value={`${closedDeals} Closed`} 
                        subLabel={`Target: ${dealsTarget}`}
                        color="text-blue-500" 
                    />
                </div>
             </Card>

             <Card>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-white">Daily Tasks</h2>
                    <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded border border-emerald-500/20">{pendingTasks} Pending</span>
                </div>
                
                {/* Add Task Input */}
                <form onSubmit={addTask} className="flex gap-2 mb-6">
                    <input 
                        type="text" 
                        value={newTask} 
                        onChange={(e) => setNewTask(e.target.value)}
                        placeholder="What needs to be done today?" 
                        className="flex-1 bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 placeholder-slate-500 transition-all"
                    />
                    <Button type="submit" size="small" className="w-12 flex items-center justify-center rounded-xl" disabled={!newTask.trim()}>
                        <PlusIcon className="w-5 h-5" />
                    </Button>
                </form>

                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                    {tasks.length > 0 ? (
                        tasks.map(task => (
                            <div key={task.id} className={`group flex items-center p-4 bg-slate-900/40 hover:bg-slate-800/60 border border-slate-800 hover:border-emerald-500/30 rounded-xl transition-all cursor-pointer ${task.completed ? 'opacity-50' : ''}`}>
                                <button 
                                    onClick={() => toggleTask(task.id)}
                                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 transition-all duration-200 flex-shrink-0 ${task.completed ? 'bg-emerald-500 border-emerald-500' : 'border-slate-600 hover:border-emerald-500'}`}
                                >
                                    {task.completed && <CheckIcon className="w-3.5 h-3.5 text-white stroke-[3]" />}
                                </button>
                                
                                <div className="flex-1 min-w-0" onClick={() => toggleTask(task.id)}>
                                    <div className="flex justify-between items-start gap-2">
                                        <h3 className={`font-medium text-sm sm:text-base transition-colors truncate ${task.completed ? 'text-slate-500 line-through decoration-slate-600' : 'text-white'}`}>{task.text}</h3>
                                        {task.time && <span className="text-[10px] font-mono bg-slate-950 px-2 py-1 rounded text-slate-400 whitespace-nowrap">{task.time}</span>}
                                    </div>
                                </div>

                                {!task.completed && (
                                    <button 
                                        onClick={(e) => toggleReminder(task.id, e)}
                                        className={`p-2 rounded-lg transition-all ml-2 ${
                                            task.reminder 
                                            ? 'text-amber-400 bg-amber-500/10 opacity-100' 
                                            : 'text-slate-600 hover:text-amber-400 hover:bg-slate-800 opacity-0 group-hover:opacity-100'
                                        }`}
                                        title={task.reminder ? "Turn off reminder" : "Set reminder"}
                                    >
                                        <BellIcon className="w-4 h-4" />
                                    </button>
                                )}

                                <button 
                                    onClick={(e) => { e.stopPropagation(); deleteTask(task.id); }}
                                    className="ml-1 p-2 text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                                    title="Delete Task"
                                >
                                    <TrashIcon className="w-4 h-4" />
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8 text-slate-500 text-sm">
                            No tasks yet. Enjoy your day! ☀️
                        </div>
                    )}
                </div>
            </Card>
        </div>

        {/* Right Column: Urgent Leads */}
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

const ChecklistItem: React.FC<{ title: string, description: string, completed: boolean, onClick: () => void, icon: React.ReactNode }> = ({ title, description, completed, onClick, icon }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-4 p-4 rounded-xl border transition-all text-left ${
            completed
            ? 'bg-emerald-500/5 border-emerald-500/20 opacity-70'
            : 'bg-slate-900/50 border-slate-800 hover:border-emerald-500/50 hover:bg-slate-800/80'
        }`}
    >
        <div className={`p-2 rounded-lg ${completed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
            {completed ? <CheckIcon className="w-5 h-5" /> : icon}
        </div>
        <div className="flex-1 min-w-0">
            <h3 className={`text-sm font-bold ${completed ? 'text-emerald-400 line-through' : 'text-white'}`}>{title}</h3>
            <p className="text-xs text-slate-500 truncate">{description}</p>
        </div>
    </button>
);

export default Today;