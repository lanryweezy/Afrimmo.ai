import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Lead, Listing, AgentGoals, Page } from '../types';

// Define the shape of our global state
interface AppState {
  leads: Lead[];
  listings: Listing[];
  goals: AgentGoals;
  isLoading: boolean;
  isLoggedIn: boolean;
  currentPage: Page;
  isFirstTime: boolean;
  isWhatsAppConnected: boolean;
  onboardingProgress: {
    videoCreated: boolean;
    aiChatTested: boolean;
  };
}

// Define action types
type AppAction =
  | { type: 'SET_LEADS'; payload: Lead[] }
  | { type: 'UPDATE_LEAD'; payload: Lead }
  | { type: 'SET_LEADS_ACTION'; payload: React.Dispatch<React.SetStateAction<Lead[]>> }
  | { type: 'SET_LISTINGS'; payload: Listing[] }
  | { type: 'UPDATE_LISTING'; payload: Listing }
  | { type: 'SET_GOALS'; payload: AgentGoals }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_LOGIN_STATUS'; payload: boolean }
  | { type: 'SET_CURRENT_PAGE'; payload: string }
  | { type: 'ADD_LEAD'; payload: Lead }
  | { type: 'ADD_LISTING'; payload: Listing }
  | { type: 'COMPLETE_ONBOARDING' }
  | { type: 'RESTART_ONBOARDING' }
  | { type: 'UPDATE_ONBOARDING_PROGRESS'; payload: Partial<AppState['onboardingProgress']> }
  | { type: 'CONNECT_WHATSAPP'; payload: boolean };

// Initial state helper
const getInitialState = (): AppState => {
  const savedState = localStorage.getItem('afrimmo_state');
  if (savedState) {
    try {
      return JSON.parse(savedState);
    } catch (e) {
      console.error("Failed to parse saved state", e);
    }
  }
  return {
    leads: [],
    listings: [],
    goals: {
      monthlyRevenueTarget: 100000000,
      dealsTarget: 3
    },
    isLoading: false,
    isLoggedIn: false,
    currentPage: 'today',
    isFirstTime: true,
    isWhatsAppConnected: false,
    onboardingProgress: {
      videoCreated: false,
      aiChatTested: false,
    },
  };
};

const initialState: AppState = getInitialState();

// Reducer function
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_LEADS':
      return { ...state, leads: action.payload };
    case 'UPDATE_LEAD':
      return {
        ...state,
        leads: state.leads.map(lead =>
          lead.id === action.payload.id ? action.payload : lead
        ),
      };
    case 'SET_LEADS_ACTION':
      // This action doesn't change state, but allows passing the setter function
      return state;
    case 'SET_LISTINGS':
      return { ...state, listings: action.payload };
    case 'UPDATE_LISTING':
      return {
        ...state,
        listings: state.listings.map(listing =>
          listing.id === action.payload.id ? action.payload : listing
        ),
      };
    case 'SET_GOALS':
      return { ...state, goals: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_LOGIN_STATUS':
      return { ...state, isLoggedIn: action.payload };
    case 'SET_CURRENT_PAGE':
      return { ...state, currentPage: action.payload as Page };
    case 'ADD_LEAD':
      return { ...state, leads: [...state.leads, action.payload] };
    case 'ADD_LISTING':
      return { ...state, listings: [...state.listings, action.payload] };
    case 'COMPLETE_ONBOARDING':
      return { ...state, isFirstTime: false };
    case 'RESTART_ONBOARDING':
      return { ...state, isFirstTime: true, onboardingProgress: { videoCreated: false, aiChatTested: false }, isWhatsAppConnected: false };
    case 'UPDATE_ONBOARDING_PROGRESS':
      return { ...state, onboardingProgress: { ...state.onboardingProgress, ...action.payload } };
    case 'CONNECT_WHATSAPP':
      return { ...state, isWhatsAppConnected: action.payload };
    default:
      return state;
  }
};

// Create context
interface AppContextType extends AppState {
  dispatch: React.Dispatch<AppAction>;
  setLeads: React.Dispatch<React.SetStateAction<Lead[]>>;
  addLead: (lead: Lead) => void;
  updateLead: (lead: Lead) => void;
  addListing: (listing: Listing) => void;
  updateListing: (listing: Listing) => void;
  setGoals: (goals: AgentGoals) => void;
  setLoading: (loading: boolean) => void;
  login: () => void;
  logout: () => void;
  navigateTo: (page: Page) => void;
  completeOnboarding: () => void;
  restartOnboarding: () => void;
  updateOnboardingProgress: (progress: Partial<AppState['onboardingProgress']>) => void;
  connectWhatsApp: (status: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Persistence effect
  React.useEffect(() => {
    localStorage.setItem('afrimmo_state', JSON.stringify(state));
  }, [state]);

  // Helper functions
  const addLead = (lead: Lead) => {
    dispatch({ type: 'ADD_LEAD', payload: lead });
  };

  const updateLead = (lead: Lead) => {
    dispatch({ type: 'UPDATE_LEAD', payload: lead });
  };

  const addListing = (listing: Listing) => {
    dispatch({ type: 'ADD_LISTING', payload: listing });
  };

  const updateListing = (listing: Listing) => {
    dispatch({ type: 'UPDATE_LISTING', payload: listing });
  };

  const setGoals = (goals: AgentGoals) => {
    dispatch({ type: 'SET_GOALS', payload: goals });
  };

  const setLoading = (loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };

  const login = () => {
    dispatch({ type: 'SET_LOGIN_STATUS', payload: true });
  };

  const logout = () => {
    dispatch({ type: 'SET_LOGIN_STATUS', payload: false });
  };

  const navigateTo = (page: Page) => {
    dispatch({ type: 'SET_CURRENT_PAGE', payload: page });
  };

  const setLeads = (leads: React.SetStateAction<Lead[]>) => {
    if (typeof leads === 'function') {
      dispatch({ type: 'SET_LEADS', payload: leads(state.leads) });
    } else {
      dispatch({ type: 'SET_LEADS', payload: leads });
    }
  };

  const completeOnboarding = () => {
    dispatch({ type: 'COMPLETE_ONBOARDING' });
  };

  const restartOnboarding = () => {
    dispatch({ type: 'RESTART_ONBOARDING' });
  };

  const updateOnboardingProgress = (progress: Partial<AppState['onboardingProgress']>) => {
    dispatch({ type: 'UPDATE_ONBOARDING_PROGRESS', payload: progress });
  };

  const connectWhatsApp = (status: boolean) => {
    dispatch({ type: 'CONNECT_WHATSAPP', payload: status });
  };

  const contextValue: AppContextType = {
    ...state,
    dispatch,
    setLeads,
    addLead,
    updateLead,
    addListing,
    updateListing,
    setGoals,
    setLoading,
    login,
    logout,
    navigateTo,
    completeOnboarding,
    restartOnboarding,
    updateOnboardingProgress,
    connectWhatsApp,
  };

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};

// Custom hook to use the app context
export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};