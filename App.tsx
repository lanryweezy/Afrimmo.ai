

import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppContent from './src/AppContent';
import { AppProvider } from './src/contexts/AppContext';
import ErrorBoundary from './src/components/ui/ErrorBoundary';
import RealEstateSEO from './src/components/RealEstateSEO';

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <Router>
        <AppProvider>
          <>
            <RealEstateSEO
              title="Afrimmo AI - AI-Powered Real Estate Agent for Africa"
              description="Transform your real estate business with Afrimmo AI. Automated listings, viral marketing content, WhatsApp lead qualification, and more for African property markets."
              keywords={[
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
                'real estate automation',
                'Lagos real estate',
                'Nairobi property',
                'Cape Town homes',
                'Accra properties',
                'Kigali real estate'
              ]}
              canonicalUrl="https://afrimmo.ai/"
              ogTitle="Afrimmo AI - AI-Powered Real Estate Agent for Africa"
              ogDescription="Transform your real estate business with Afrimmo AI. Automated listings, viral marketing content, WhatsApp lead qualification, and more for African property markets."
              ogImage="https://afrimmo.ai/og-real-estate.jpg"
              ogUrl="https://afrimmo.ai/"
              twitterCard="summary_large_image"
              twitterTitle="Afrimmo AI - AI-Powered Real Estate Agent for Africa"
              twitterDescription="Transform your real estate business with Afrimmo AI. Automated listings, viral marketing content, WhatsApp lead qualification, and more for African property markets."
              twitterImage="https://afrimmo.ai/twitter-real-estate.jpg"
              schema={{
                "@context": "https://schema.org",
                "@type": "RealEstateAgent",
                "name": "Afrimmo AI",
                "description": "AI-powered real estate agent for Africa. Automate listings, generate viral marketing content, qualify leads on WhatsApp, and access hyper-local market data.",
                "url": "https://afrimmo.ai/",
                "image": "https://afrimmo.ai/logo.jpg",
                "areaServed": "Africa",
                "availableLanguage": ["English", "French", "Portuguese"],
                "serviceType": "Real Estate Services",
                "offers": {
                  "@type": "Service",
                  "name": "Real Estate AI Assistant",
                  "description": "AI-powered tools for real estate agents"
                },
                "aggregateRating": {
                  "@type": "AggregateRating",
                  "ratingValue": "4.8",
                  "reviewCount": "150"
                }
              }}
              agentData={{
                name: "Afrimmo AI",
                company: "Afrimmo AI Technologies",
                areasServed: ["Nigeria", "Kenya", "South Africa", "Ghana", "Rwanda", "Ethiopia", "Morocco"]
              }}
            />
            <AppContent />
          </>
        </AppProvider>
      </Router>
    </ErrorBoundary>
  );
};

export default App;