

import React, { useState } from 'react';
import Card from './Card';
import Button from './Button';
import { UserIcon, CreditCardIcon, SettingsIcon, BadgeCheckIcon, CheckIcon, SparklesIcon } from './IconComponents';

const Settings: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'profile' | 'billing' | 'integrations'>('profile');
    const [formData, setFormData] = useState({
        fullName: 'Tunde Bakare',
        email: 'tunde@afrimmo.ai',
        agencyName: 'Prestige Homes Lagos',
        phone: '+234 800 123 4567'
    });
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => setIsSaving(false), 1500);
    };

    const PlanCard: React.FC<{name: string, price: string, features: string[], current?: boolean, color: string}> = ({ name, price, features, current, color }) => (
        <div className={`border rounded-2xl p-6 relative flex flex-col h-full ${current ? 'bg-slate-800 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.1)]' : 'bg-slate-900/50 border-slate-700'}`}>
            {current && <div className="absolute top-0 right-0 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">CURRENT PLAN</div>}
            <h3 className={`text-lg font-bold ${color} mb-2`}>{name}</h3>
            <div className="flex items-baseline mb-6">
                <span className="text-3xl font-bold text-white">{price}</span>
                <span className="text-slate-500 ml-1 text-sm">/month</span>
            </div>
            <ul className="space-y-3 mb-8 flex-1">
                {features.map((feature, i) => (
                    <li key={i} className="flex items-start text-sm text-slate-300">
                        <CheckIcon className="w-4 h-4 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                        {feature}
                    </li>
                ))}
            </ul>
            <Button variant={current ? 'secondary' : 'primary'} className="w-full" disabled={current}>
                {current ? 'Manage Subscription' : `Upgrade to ${name}`}
            </Button>
        </div>
    );

    return (
        <div className="space-y-6 max-w-5xl mx-auto animate-fade-in">
             <div className="flex items-center gap-3 mb-4">
                <div className="bg-slate-800 p-2.5 rounded-xl border border-slate-700">
                    <SettingsIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-white">Settings & Billing</h1>
                    <p className="text-gray-400 text-sm">Manage your account preferences and subscription.</p>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
                {/* Sidebar Navigation */}
                <div className="w-full md:w-64 flex-shrink-0 space-y-2">
                    <button 
                        onClick={() => setActiveTab('profile')}
                        className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 transition-colors ${activeTab === 'profile' ? 'bg-slate-800 text-white border border-slate-700' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}
                    >
                        <UserIcon className="w-5 h-5" /> Profile Details
                    </button>
                    <button 
                        onClick={() => setActiveTab('billing')}
                        className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 transition-colors ${activeTab === 'billing' ? 'bg-slate-800 text-white border border-slate-700' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}
                    >
                        <CreditCardIcon className="w-5 h-5" /> Subscription
                    </button>
                    <button 
                        onClick={() => setActiveTab('integrations')}
                        className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 transition-colors ${activeTab === 'integrations' ? 'bg-slate-800 text-white border border-slate-700' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}
                    >
                        <BadgeCheckIcon className="w-5 h-5" /> Integrations
                    </button>
                </div>

                {/* Content Area */}
                <div className="flex-1">
                    {activeTab === 'profile' && (
                        <Card>
                            <h2 className="text-xl font-bold text-white mb-6">My Profile</h2>
                            <div className="flex items-center gap-6 mb-8 pb-8 border-b border-slate-800">
                                <div className="relative">
                                    <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Profile" className="w-20 h-20 rounded-full border-4 border-slate-800" />
                                    <button className="absolute bottom-0 right-0 bg-emerald-500 p-1.5 rounded-full border-2 border-slate-900 text-white hover:bg-emerald-400 transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" /></svg>
                                    </button>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white">{formData.fullName}</h3>
                                    <p className="text-slate-400 text-sm">Premium Agent</p>
                                </div>
                            </div>

                            <div className="space-y-4 max-w-lg">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Full Name</label>
                                    <input type="text" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="w-full bg-slate-900 border-slate-700 rounded-lg p-2.5 text-white focus:ring-emerald-500 focus:border-emerald-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Email Address</label>
                                    <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-slate-900 border-slate-700 rounded-lg p-2.5 text-white focus:ring-emerald-500 focus:border-emerald-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Agency Name</label>
                                    <input type="text" value={formData.agencyName} onChange={e => setFormData({...formData, agencyName: e.target.value})} className="w-full bg-slate-900 border-slate-700 rounded-lg p-2.5 text-white focus:ring-emerald-500 focus:border-emerald-500" />
                                </div>
                                <div className="pt-4">
                                    <Button onClick={handleSave} isLoading={isSaving}>Save Changes</Button>
                                </div>
                            </div>
                        </Card>
                    )}

                    {activeTab === 'billing' && (
                        <div className="space-y-6">
                            <Card className="bg-gradient-to-r from-emerald-900/40 to-slate-900 border-emerald-500/30">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-emerald-400 font-bold text-xs uppercase tracking-wider mb-1">Current Status</p>
                                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                            Free Trial Active <BadgeCheckIcon className="w-5 h-5 text-emerald-400" />
                                        </h2>
                                        <p className="text-slate-400 text-sm mt-1">Your trial ends in 12 days. Upgrade to keep premium features.</p>
                                    </div>
                                    <Button size="small" variant="secondary" className="hidden sm:flex">Update Payment Method</Button>
                                </div>
                            </Card>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                <PlanCard 
                                    name="Starter" 
                                    price="$0" 
                                    color="text-slate-400"
                                    features={['5 AI Listings/mo', 'Basic CRM', 'Email Support']} 
                                />
                                <PlanCard 
                                    name="Pro Agent" 
                                    price="$49" 
                                    color="text-emerald-400"
                                    current={true}
                                    features={['Unlimited AI Listings', 'Advanced CRM & Analytics', 'Social Media Auto-Poster', 'Live Negotiation Coach', 'Priority Support']} 
                                />
                                <PlanCard 
                                    name="Agency" 
                                    price="$199" 
                                    color="text-purple-400"
                                    features={['Everything in Pro', '5 Team Seats', 'Agency Branding', 'API Access', 'Dedicated Account Manager']} 
                                />
                            </div>
                        </div>
                    )}

                    {activeTab === 'integrations' && (
                        <Card>
                            <h2 className="text-xl font-bold text-white mb-6">Connected Apps</h2>
                            <div className="space-y-4">
                                {[
                                    { name: 'WhatsApp Business', icon: 'bg-green-500', status: 'Connected', desc: 'Sync chats and automate replies.' },
                                    { name: 'Instagram', icon: 'bg-pink-500', status: 'Connected', desc: 'Auto-publish posts and stories.' },
                                    { name: 'Google Calendar', icon: 'bg-blue-500', status: 'Not Connected', desc: 'Sync viewings and appointments.' },
                                    { name: 'HubSpot CRM', icon: 'bg-orange-500', status: 'Not Connected', desc: 'Export leads automatically.' },
                                ].map((app, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 bg-slate-900/50 rounded-xl border border-slate-800">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-lg ${app.icon} flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                                                {app.name[0]}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-white text-sm">{app.name}</h3>
                                                <p className="text-slate-500 text-xs">{app.desc}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            {app.status === 'Connected' && <span className="text-emerald-400 text-xs font-bold flex items-center gap-1"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> Active</span>}
                                            <Button size="small" variant={app.status === 'Connected' ? 'secondary' : 'primary'}>
                                                {app.status === 'Connected' ? 'Configure' : 'Connect'}
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Settings;
