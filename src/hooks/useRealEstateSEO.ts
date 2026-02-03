import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Real estate specific SEO data for different pages
const realEstatePageSEOData: Record<string, {
  title: string;
  description: string;
  keywords: string[];
  ogTitle?: string;
  ogDescription?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  propertyType?: string;
}> = {
  '/': {
    title: 'Afrimmo AI - AI-Powered Real Estate Agent for Africa',
    description: 'Transform your real estate business with Afrimmo AI. Automated listings, viral marketing content, WhatsApp lead qualification, and more for African property markets.',
    keywords: [
      'real estate agent',
      'property management',
      'real estate marketing',
      'WhatsApp automation',
      'property listings',
      'African real estate',
      'real estate agent tools',
      'property marketing automation',
      'real estate CRM',
      'property valuation',
      'real estate leads',
      'property search',
      'real estate technology',
      'AI real estate',
      'real estate automation'
    ]
  },
  '/today': {
    title: 'Real Estate Dashboard - Afrimmo AI',
    description: 'Your real estate command center. View leads, listings, and analytics at a glance.',
    keywords: [
      'real estate dashboard',
      'property analytics',
      'lead management',
      'real estate CRM',
      'property insights',
      'real estate metrics',
      'agent dashboard',
      'property management'
    ]
  },
  '/leads': {
    title: 'Real Estate Lead Management - Afrimmo AI',
    description: 'Manage and qualify your real estate leads with AI-powered scoring and insights.',
    keywords: [
      'real estate leads',
      'lead management',
      'lead scoring',
      'CRM',
      'real estate marketing',
      'lead qualification',
      'prospects',
      'real estate pipeline',
      'agent leads',
      'property leads'
    ]
  },
  '/listings': {
    title: 'Property Listings Management - Afrimmo AI',
    description: 'Manage your property inventory with AI-powered descriptions and marketing content.',
    keywords: [
      'property listings',
      'real estate listings',
      'property management',
      'real estate marketing',
      'listing management',
      'property inventory',
      'property marketing',
      'real estate platform'
    ]
  },
  '/marketing': {
    title: 'Real Estate Marketing Tools - Afrimmo AI',
    description: 'Generate viral marketing content for social media and advertising campaigns.',
    keywords: [
      'real estate marketing',
      'social media marketing',
      'content generation',
      'advertising',
      'marketing automation',
      'viral content',
      'property promotion',
      'real estate ads',
      'social media content',
      'marketing tools'
    ]
  },
  '/tools': {
    title: 'Real Estate Tools - Afrimmo AI',
    description: 'Access powerful tools for property valuation, market insights, and deal management.',
    keywords: [
      'real estate tools',
      'property valuation',
      'market insights',
      'deal management',
      'real estate calculator',
      'property analysis',
      'investment tools',
      'real estate software'
    ]
  },
  '/settings': {
    title: 'Agent Settings - Afrimmo AI',
    description: 'Customize your Afrimmo AI experience and configure your real estate business preferences.',
    keywords: [
      'settings',
      'preferences',
      'account settings',
      'real estate tools',
      'agent profile',
      'business settings',
      'real estate platform'
    ]
  },
  '/property-valuator': {
    title: 'Property Valuation Tool - Afrimmo AI',
    description: 'Get accurate property valuations using AI-powered analysis of market data and comparable properties.',
    keywords: [
      'property valuation',
      'real estate appraisal',
      'property estimate',
      'valuation tool',
      'property value',
      'real estate calculator',
      'property assessment',
      'market value'
    ]
  },
  '/market-insights': {
    title: 'Real Estate Market Insights - Afrimmo AI',
    description: 'Access hyper-local market data, trends, and insights for African property markets.',
    keywords: [
      'real estate market',
      'market insights',
      'property trends',
      'market data',
      'real estate analytics',
      'property market',
      'investment insights',
      'market analysis'
    ]
  }
};

// African city-specific keywords
const africanCities = [
  'Lagos', 'Nairobi', 'Cape Town', 'Accra', 'Kigali', 'Addis Ababa', 
  'Casablanca', 'Cairo', 'Johannesburg', 'Durban', 'Abuja', 'Kano',
  'Mombasa', 'Kampala', 'Dar es Salaam', 'Luanda', 'Maputo', 'Lusaka'
];

// Property type keywords
const propertyTypes = [
  'apartment', 'house', 'condo', 'villa', 'townhouse', 'penthouse',
  'duplex', 'bungalow', 'farmhouse', 'mansion', 'cottage', 'studio',
  'loft', 'residential', 'commercial', 'industrial', 'land', 'development'
];

// Real estate action keywords
const realEstateActions = [
  'buy', 'sell', 'rent', 'lease', 'invest', 'purchase', 'mortgage',
  'finance', 'property management', 'real estate agent', 'realtor',
  'property search', 'home search', 'property listing', 'real estate'
];

export const useRealEstateSEO = () => {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    const seoData = realEstatePageSEOData[path] || realEstatePageSEOData['/'];

    // Combine with African city and property keywords
    const enhancedKeywords = [
      ...seoData.keywords,
      ...africanCities.slice(0, 5).map(city => `${city} real estate`),
      ...africanCities.slice(0, 5).map(city => `${city} property`),
      ...propertyTypes.slice(0, 5).map(type => `${type} for sale`),
      ...propertyTypes.slice(0, 5).map(type => `${type} for rent`),
      ...realEstateActions.slice(0, 5).map(action => `${action} property`)
    ];

    // Update title
    document.title = seoData.title;

    // Update description
    const descriptionTag = document.querySelector('meta[name="description"]');
    if (descriptionTag) {
      descriptionTag.setAttribute('content', seoData.description);
    }

    // Update keywords
    const keywordsTag = document.querySelector('meta[name="keywords"]');
    if (keywordsTag) {
      keywordsTag.setAttribute('content', enhancedKeywords.join(', '));
    }

    // Update Open Graph tags
    const ogTitleTag = document.querySelector('meta[property="og:title"]');
    if (ogTitleTag) {
      ogTitleTag.setAttribute('content', seoData.ogTitle || seoData.title);
    }

    const ogDescTag = document.querySelector('meta[property="og:description"]');
    if (ogDescTag) {
      ogDescTag.setAttribute('content', seoData.ogDescription || seoData.description);
    }

    // Update Twitter tags
    const twitterTitleTag = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitleTag) {
      twitterTitleTag.setAttribute('content', seoData.twitterTitle || seoData.title);
    }

    const twitterDescTag = document.querySelector('meta[name="twitter:description"]');
    if (twitterDescTag) {
      twitterDescTag.setAttribute('content', seoData.twitterDescription || seoData.description);
    }

    // Update canonical URL
    const canonicalTag = document.querySelector('link[rel="canonical"]');
    if (canonicalTag) {
      canonicalTag.setAttribute('href', `https://afrimmo.ai${path}`);
    } else {
      const newCanonical = document.createElement('link');
      newCanonical.setAttribute('rel', 'canonical');
      newCanonical.setAttribute('href', `https://afrimmo.ai${path}`);
      document.head.appendChild(newCanonical);
    }

    // Add location-specific schema if on property-related pages
    if (path.includes('/listings') || path.includes('/property')) {
      // Remove existing property schema if present
      const existingSchema = document.querySelector('script[data-schema-type="property"]');
      if (existingSchema) {
        existingSchema.remove();
      }

      // Add new property schema
      const propertySchema = document.createElement('script');
      propertySchema.type = 'application/ld+json';
      propertySchema.setAttribute('data-schema-type', 'property');
      propertySchema.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Residence", // Could be Apartment, House, Condo, etc.
        "name": "Property in Africa",
        "description": seoData.description,
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Major City",
          "addressRegion": "Africa",
          "addressCountry": "Country"
        },
        "mainEntityOfPage": `https://afrimmo.ai${path}`
      });
      document.head.appendChild(propertySchema);
    }
  }, [location]);
};