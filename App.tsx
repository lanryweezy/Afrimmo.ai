

import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppContent from './src/AppContent';
import { AppProvider } from './src/contexts/AppContext';
import ErrorBoundary from './src/components/ui/ErrorBoundary';
import SEO from './src/components/SEO';

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <Router>
        <AppProvider>
          <>
            <SEO
              title="Afrimmo AI - AI-Powered Real Estate Agent for Africa"
              description="Transform your real estate business with Afrimmo AI. Automated listings, viral marketing content, WhatsApp lead qualification, and more for African property markets."
              keywords={[
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
              ]}
              canonicalUrl="https://afrimmo.ai/"
              ogTitle="Afrimmo AI - AI-Powered Real Estate Agent for Africa"
              ogDescription="Transform your real estate business with Afrimmo AI. Automated listings, viral marketing content, WhatsApp lead qualification, and more for African property markets."
              ogImage="https://afrimmo.ai/og-image.jpg"
              ogUrl="https://afrimmo.ai/"
              twitterCard="summary_large_image"
              twitterTitle="Afrimmo AI - AI-Powered Real Estate Agent for Africa"
              twitterDescription="Transform your real estate business with Afrimmo AI. Automated listings, viral marketing content, WhatsApp lead qualification, and more for African property markets."
              twitterImage="https://afrimmo.ai/twitter-image.jpg"
              schema={{
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