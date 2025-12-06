import React, { useState, useEffect, Suspense } from 'react';
import Header from './components/Header';
import BottomNavBar from './components/BottomNavBar';
import LandingPage from './components/LandingPage';
import { Page, Lead, Listing, AgentGoals } from './types';
import { scoreLead } from './services/geminiService';
import Sidebar from './components/Sidebar';
import Spinner from './components/Spinner';

// Lazy load heavy components to improve startup performance
const Today = React.lazy(() => import('./components/Today'));
const Leads = React.lazy(() => import('./components/Leads'));
const Listings = React.lazy(() => import('./components/Listings'));
const Marketing = React.lazy(() => import('./components/Marketing'));
const Tools = React.lazy(() => import('./components/Tools'));
const Settings = React.lazy(() => import('./components/Settings'));

const mockLeadsData: Omit<Lead, 'score' | 'temperature' | 'justification' | 'nextAction'>[] = [
    { 
      id: '1', name: 'Amara Nwosu', status: 'New', source: 'WhatsApp', 
      history: [{id: 'h1', date: '1 hour ago', description: 'Initial inquiry about 3-bed in Lekki.'}], 
      notes: 'Seems very interested and asked for pictures.',
      conversation: [
        { id: 'c1-1', sender: 'user', text: 'Hi, I saw your post on Instagram about the 3-bedroom duplex in Lekki. Is it still available?', timestamp: '10:30 AM'},
        { id: 'c1-2', sender: 'ai', text: 'Hello Amara! Yes, it is. It\'s a beautiful property with modern finishes. Are you looking for a home for yourself or as an investment?', timestamp: '10:31 AM'},
        { id: 'c1-3', sender: 'user', text: 'For my family. Could you send some more pictures of the kitchen and backyard?', timestamp: '10:32 AM'},
      ]
    },
    { id: '2', name: 'Boluwatife Adekunle', status: 'Contacted', source: 'Instagram', history: [{id: 'h2', date: '1 day ago', description: 'Sent property brochure via DM.'}], notes: 'Mentioned they are pre-approved for a mortgage.' },
    { id: '3', name: 'Chinedu Eze', status: 'Viewing', source: 'Manual', history: [{id: 'h3', date: '3 days ago', description: 'Scheduled viewing for Saturday at 11 AM.'}], notes: 'Looking for a quick close.'},
    { id: '4', name: 'Fatima Bello', status: 'Offer', source: 'WhatsApp', 
        history: [{id: 'h4', date: '2 days ago', description: 'Submitted a verbal offer.'}], notes: '',
        conversation: [
           { id: 'c4-1', sender: 'ai', text: 'Hi Fatima, following up on our chat. Have you had a chance to think about the property?', timestamp: 'Yesterday'},
           { id: 'c4-2', sender: 'user', text: 'Yes, we love it. We\'d like to make an offer.', timestamp: 'Yesterday'},
        ]
    },
    { id: '5', name: 'Emeka Okafor', status: 'Nurturing', source: 'Instagram', history: [{id: 'h5', date: '1 week ago', description: 'Followed up, client is still considering options.'}], notes: 'Budget is flexible.' },
    { id: '6', name: 'Sade Aliu', status: 'Closed', source: 'Manual', history: [{id: 'h6', date: '2 weeks ago', description: 'Deal closed.'}], notes: ''},
];

const mockListingsData: Listing[] = [
    { id: '1', address: '12 Banana Island Rd, Ikoyi, Lagos', price: '₦850,000,000', status: 'Available', imageUrl: 'https://picsum.photos/seed/house1/400/300', images: ['https://picsum.photos/seed/house1/800/600', 'https://picsum.photos/seed/house1-2/800/600'], beds: 5, baths: 6, size: 700, amenities: ['Pool', 'Gym'] },
    { id: '2', address: '8A Admiralty Way, Lekki Phase 1, Lagos', price: '₦450,000,000', status: 'Under Offer', imageUrl: 'https://picsum.photos/seed/house2/400/300', images: ['https://picsum.photos/seed/house2/800/600'], beds: 4, baths: 5, size: 550, amenities: ['Security', 'Boys Quarter'] },
    { id: '3', address: '25 Opebi Rd, Ikeja, Lagos', price: '₦180,000,000', status: 'Available', imageUrl: 'https://picsum.photos/seed/house3/400/300', images: ['https://picsum.photos/seed/house3/800/600'], beds: 4, baths: 4, size: 480, amenities: ['Parking'] },
    { id: '4', address: 'Estate 5, VGC, Lagos', price: '₦320,000,000', status: 'Sold', imageUrl: 'https://picsum.photos/seed/house4/400/300', images: ['https://picsum.photos/seed/house4/800/600'], beds: 5, baths: 5, size: 600, amenities: ['Garden'] },
];

const initialLeads: Lead[] = mockLeadsData.map(l => ({
    ...l,
    score: 50,
    temperature: 'Warm',
    justification: 'Analysis pending...',
    nextAction: 'Review details',
    conversation: l.conversation || []
}));

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>('today');
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [listings, setListings] = useState<Listing[]>(mockListingsData);
  const [isLoadingLeads, setIsLoadingLeads] = useState(false);
  const [selectedListingForMarketing, setSelectedListingForMarketing] = useState<Listing | null>(null);
  
  const [agentGoals, setAgentGoals] = useState<AgentGoals>({
      monthlyRevenueTarget: 100000000, 
      dealsTarget: 3
  });

  useEffect(() => {
    if (isLoggedIn) {
        const fetchScores = async () => {
            setIsLoadingLeads(true);
            try {
                const scoredLeadsPromises = mockLeadsData.map(async (leadData) => {
                    const leadForScoring = { ...leadData, history: leadData.history || [], notes: leadData.notes || '', conversation: leadData.conversation || [] };
                    try {
                        const scoreData = await scoreLead(leadForScoring);
                        return { ...leadForScoring, ...scoreData };
                    } catch (e) {
                        return { ...leadForScoring, score: 50, temperature: 'Warm', justification: 'AI scoring unavailable', nextAction: 'Check connection' } as Lead;
                    }
                });
                
                const scoredLeads = await Promise.all(scoredLeadsPromises);
                setLeads(scoredLeads.sort((a, b) => (b.score || 0) - (a.score || 0)));
            } catch (error) {
                console.error("Failed to score leads:", error);
            } finally {
                setIsLoadingLeads(false);
            }
        };
        fetchScores();
    }
  }, [isLoggedIn]);

  const handleSelectListingForMarketing = (listing: Listing) => {
    setSelectedListingForMarketing(listing);
    setCurrentPage('marketing');
  };

  const clearSelectedListingForMarketing = () => {
    setSelectedListingForMarketing(null);
  };

  const renderContent = () => {
    return (
        <Suspense fallback={
            <div className="flex flex-col items-center justify-center h-full text-slate-500 animate-fade-in">
                <Spinner />
                <p className="mt-4 text-sm animate-pulse">Loading workspace...</p>
            </div>
        }>
            {(() => {
                switch (currentPage) {
                    case 'today':
                        return <Today setActivePage={setCurrentPage} leads={leads} listings={listings} goals={agentGoals} />;
                    case 'leads':
                        return <Leads leads={leads} setLeads={setLeads} isLoading={isLoadingLeads} />;
                    case 'listings':
                        return <Listings listings={listings} onSelectForMarketing={handleSelectListingForMarketing} />;
                    case 'marketing':
                        return <Marketing selectedListing={selectedListingForMarketing} clearSelectedListing={clearSelectedListingForMarketing} />;
                    case 'tools':
                        return <Tools />;
                    case 'settings':
                        return <Settings goals={agentGoals} onUpdateGoals={setAgentGoals} />;
                    default:
                        return <Today setActivePage={setCurrentPage} leads={leads} listings={listings} goals={agentGoals} />;
                }
            })()}
        </Suspense>
    );
  };

  if (!isLoggedIn) {
      return <LandingPage onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="md:flex h-screen bg-gray-900 text-gray-100 font-sans">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header currentPage={currentPage} />
        <main className="flex-1 p-4 sm:p-6 pb-24 md:pb-6 overflow-y-auto">
          {renderContent()}
        </main>
        <BottomNavBar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      </div>
    </div>
  );
};

export default App;