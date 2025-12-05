

export type Page = 'today' | 'leads' | 'listings' | 'marketing' | 'tools' | 'content-studio' | 'social-publisher' | 'whatsapp-automator' | 'market-insights' | 'property-valuator' | 'settings';

export enum ContentType {
  Instagram = 'Instagram Post',
  WhatsApp = 'WhatsApp Broadcast',
  Listing = 'Property Listing',
  YouTube = 'YouTube Short',
}

export interface GeneratedContent {
  id: string;
  text: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai' | 'system';
  text: string;
  timestamp: string;
  isTyping?: boolean;
}

// Valuation types
export interface PropertyDetailsForValuation {
  location: string;
  propertyType: string;
  bedrooms: string;
  bathrooms: string;
  size: string;
  condition: string;
  features: string;
}

export interface ValuationResponse {
    valueRange: string;
    confidence: 'High' | 'Medium' | 'Low';
    analysis: string;
    comps: {
        address: string;
        price: string;
        notes: string;
    }[];
    recommendations: string;
}

// Social Publisher types
export enum Platform {
  Instagram = 'Instagram',
  Facebook = 'Facebook',
  Threads = 'Threads',
  YouTube = 'YouTube',
  WhatsApp = 'WhatsApp',
}

export interface SocialAccount {
    platform: Platform;
    handle: string;
    connected: boolean;
}

export interface ScheduledPost {
    id: string;
    platform: Platform;
    content: string;
    scheduledAt: Date;
    status: 'Scheduled' | 'Published';
}

export interface SocialBundle {
  instagramCaption: string;
  whatsappMessage: string;
  youtubeTitle: string;
  youtubeDescription: string;
}

// New agent-centric types
export type LeadStatus = 'New' | 'Contacted' | 'Viewing' | 'Offer' | 'Closed' | 'Nurturing';

export interface LeadInteraction {
    id: string;
    date: string;
    description: string;
}

export interface Lead {
    id: string;
    name: string;
    status: LeadStatus;
    source: 'WhatsApp' | 'Instagram' | 'Manual';
    history: LeadInteraction[];
    notes: string;
    score?: number;
    temperature?: 'Hot' | 'Warm' | 'Cold';
    justification?: string;
    nextAction?: string;
    conversation?: ChatMessage[];
}

export type ListingStatus = 'Available' | 'Under Offer' | 'Sold';

export interface Listing {
    id: string;
    address: string;
    price: string;
    status: ListingStatus;
    imageUrl: string;
    images: string[];
    beds: number;
    baths: number;
    size: number; // in sqm
    amenities: string[];
}

// Marketing & Ads types
export type AudiencePersona = 'First-time Homebuyers' | 'Luxury Investors' | 'Young Families' | 'Expatriates' | 'Retirees';
export type MarketingObjective = 'Generate Leads' | 'Increase Awareness' | 'Announce Open House' | 'Promote Price Reduction';
export type TargetIncome = 'Any' | 'Mid-Income' | 'High-Income' | 'Luxury/HNWI';

export interface AdCopy {
    headline: string;
    primaryText: string;
}

export interface AdCampaign {
    id: string;
    status: 'Active' | 'Pending' | 'Completed';
    platform: 'Meta' | 'Google';
    budget: number;
    duration: number; // in days
    location: string;
    adCopy: AdCopy;
    propertyDetails: string;
    imageUrl?: string | null;
    keywords?: string[]; // Added for Google Ads
    impressions?: number;
    clicks?: number;
    ctr?: string;
    spend?: number;
    targetIncome?: TargetIncome;
    targetInterests?: string[];
}

// Goals
export interface AgentGoals {
    monthlyRevenueTarget: number;
    dealsTarget: number;
}