import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// SEO data for different pages
const pageSEOData: Record<string, {
  title: string;
  description: string;
  keywords: string[];
  ogTitle?: string;
  ogDescription?: string;
  twitterTitle?: string;
  twitterDescription?: string;
}> = {
  '/': {
    title: 'Afrimmo AI - AI-Powered Real Estate Agent for Africa',
    description: 'Transform your real estate business with Afrimmo AI. Automated listings, viral marketing content, WhatsApp lead qualification, and more for African property markets.',
    keywords: ['real estate AI', 'property management', 'real estate marketing', 'WhatsApp automation', 'property listings', 'African real estate']
  },
  '/today': {
    title: 'Dashboard - Afrimmo AI',
    description: 'Your real estate command center. View leads, listings, and analytics at a glance.',
    keywords: ['real estate dashboard', 'property analytics', 'lead management', 'real estate CRM']
  },
  '/leads': {
    title: 'Lead Management - Afrimmo AI',
    description: 'Manage and qualify your real estate leads with AI-powered scoring and insights.',
    keywords: ['lead management', 'real estate leads', 'lead scoring', 'CRM', 'real estate marketing']
  },
  '/listings': {
    title: 'Property Listings - Afrimmo AI',
    description: 'Manage your property inventory with AI-powered descriptions and marketing content.',
    keywords: ['property listings', 'real estate listings', 'property management', 'real estate marketing']
  },
  '/marketing': {
    title: 'Marketing Tools - Afrimmo AI',
    description: 'Generate viral marketing content for social media and advertising campaigns.',
    keywords: ['real estate marketing', 'social media marketing', 'content generation', 'advertising']
  },
  '/tools': {
    title: 'Real Estate Tools - Afrimmo AI',
    description: 'Access powerful tools for property valuation, market insights, and deal management.',
    keywords: ['real estate tools', 'property valuation', 'market insights', 'deal management']
  },
  '/settings': {
    title: 'Settings - Afrimmo AI',
    description: 'Customize your Afrimmo AI experience and configure your preferences.',
    keywords: ['settings', 'preferences', 'account settings', 'real estate tools']
  }
};

export const useDynamicSEO = () => {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    const seoData = pageSEOData[path] || pageSEOData['/'];

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
      keywordsTag.setAttribute('content', seoData.keywords.join(', '));
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
  }, [location]);
};