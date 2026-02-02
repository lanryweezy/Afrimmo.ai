// SEO Configuration for Afrimmo AI Agent

export const SEO_CONFIG = {
  // Site-wide settings
  site: {
    name: 'Afrimmo AI',
    title: 'Afrimmo AI - AI-Powered Real Estate Agent for Africa',
    description: 'Transform your real estate business with Afrimmo AI. Automated listings, viral marketing content, WhatsApp lead qualification, and more for African property markets.',
    url: 'https://afrimmo.ai',
    type: 'website',
    locale: 'en_US',
    image: 'https://afrimmo.ai/og-image.jpg',
    imageWidth: 1200,
    imageHeight: 630,
    twitterHandle: '@afrimmo_ai',
    facebookPage: 'afrimmoai',
    linkedinPage: 'afrimmo-ai',
    instagramHandle: 'afrimmo_ai',
    youtubeChannel: 'UC-afrimmo-ai-channel'
  },

  // Keywords for different sections
  keywords: {
    general: [
      'real estate AI',
      'property management',
      'real estate marketing',
      'WhatsApp automation',
      'property listings',
      'African real estate',
      'real estate agent tools',
      'property marketing automation',
      'real estate CRM',
      'property valuation'
    ],
    landing: [
      'AI real estate agent',
      'real estate automation',
      'property marketing AI',
      'WhatsApp lead qualification',
      'African property market',
      'real estate tech',
      'property management software'
    ],
    dashboard: [
      'real estate dashboard',
      'property analytics',
      'lead management',
      'real estate CRM',
      'property insights',
      'real estate metrics'
    ],
    leads: [
      'lead management',
      'real estate leads',
      'lead scoring',
      'CRM',
      'real estate marketing',
      'lead qualification',
      'prospects'
    ],
    listings: [
      'property listings',
      'real estate listings',
      'property management',
      'real estate marketing',
      'property inventory',
      'listing management'
    ],
    marketing: [
      'real estate marketing',
      'social media marketing',
      'content generation',
      'advertising',
      'marketing automation',
      'viral content',
      'property promotion'
    ]
  },

  // Page-specific titles and descriptions
  pages: {
    '/': {
      title: 'Afrimmo AI - AI-Powered Real Estate Agent for Africa',
      description: 'Transform your real estate business with Afrimmo AI. Automated listings, viral marketing content, WhatsApp lead qualification, and more for African property markets.'
    },
    '/today': {
      title: 'Dashboard - Afrimmo AI',
      description: 'Your real estate command center. View leads, listings, and analytics at a glance.'
    },
    '/leads': {
      title: 'Lead Management - Afrimmo AI',
      description: 'Manage and qualify your real estate leads with AI-powered scoring and insights.'
    },
    '/listings': {
      title: 'Property Listings - Afrimmo AI',
      description: 'Manage your property inventory with AI-powered descriptions and marketing content.'
    },
    '/marketing': {
      title: 'Marketing Tools - Afrimmo AI',
      description: 'Generate viral marketing content for social media and advertising campaigns.'
    },
    '/tools': {
      title: 'Real Estate Tools - Afrimmo AI',
      description: 'Access powerful tools for property valuation, market insights, and deal management.'
    },
    '/settings': {
      title: 'Settings - Afrimmo AI',
      description: 'Customize your Afrimmo AI experience and configure your preferences.'
    }
  },

  // Structured data templates
  structuredData: {
    softwareApp: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Afrimmo AI",
      "operatingSystem": "Web Browser",
      "applicationCategory": "BusinessApplication",
      "description": "AI-powered real estate agent for Africa. Automate listings, generate viral marketing content, qualify leads on WhatsApp, and access hyper-local market data.",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Afrimmo AI Technologies"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "reviewCount": "150"
      }
    },
    realEstateService: {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      "serviceType": "Real Estate Agent",
      "name": "Afrimmo AI",
      "description": "AI-powered real estate agent for Africa. Automate listings, generate viral marketing content, qualify leads on WhatsApp, and access hyper-local market data.",
      "url": "https://afrimmo.ai",
      "logo": "https://afrimmo.ai/logo.png",
      "image": "https://afrimmo.ai/og-image.jpg",
      "telephone": "+234-XXX-XXXX",
      "areaServed": "Africa",
      "availableLanguage": ["English", "French", "Portuguese"],
      "award": "Best AI Real Estate Solution 2025"
    }
  },

  // Performance settings
  performance: {
    // Preload critical resources
    preloadFonts: [
      { href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap', as: 'style' }
    ],
    // Preconnect to external domains
    preconnectDomains: [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
      'https://api.afrimmo.ai',
      'https://storage.googleapis.com'
    ]
  },

  // Social media settings
  social: {
    facebook: {
      appId: 'YOUR_FACEBOOK_APP_ID',
      pageId: 'YOUR_FACEBOOK_PAGE_ID'
    },
    twitter: {
      card: 'summary_large_image',
      site: '@afrimmo_ai',
      creator: '@afrimmo_ai'
    }
  },

  // Analytics and tracking
  analytics: {
    gtmId: 'GTM-XXXXXXX', // Google Tag Manager ID
    gaId: 'GA-XXXXXXXXX-X', // Google Analytics ID
    fbPixelId: 'XXXXXXXXXXXXXXX', // Facebook Pixel ID
  }
};