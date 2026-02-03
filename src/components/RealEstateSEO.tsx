import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';

interface RealEstateSEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  schema?: object;
  propertyData?: {
    address?: string;
    price?: string;
    bedrooms?: number;
    bathrooms?: number;
    size?: string;
    propertyType?: string;
    location?: string;
  };
  agentData?: {
    name?: string;
    company?: string;
    licenseNumber?: string;
    areasServed?: string[];
  };
}

const RealEstateSEO: React.FC<RealEstateSEOProps> = ({
  title = 'Afrimmo AI - AI-Powered Real Estate Agent for Africa',
  description = 'Transform your real estate business with Afrimmo AI. Automated listings, viral marketing content, WhatsApp lead qualification, and more for African property markets.',
  keywords = [
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
  ],
  canonicalUrl,
  ogTitle,
  ogDescription,
  ogImage = 'https://afrimmo.ai/og-real-estate.jpg',
  ogUrl,
  twitterCard = 'summary_large_image',
  twitterTitle,
  twitterDescription,
  twitterImage,
  schema,
  propertyData,
  agentData
}) => {
  useEffect(() => {
    document.title = title;
  }, [title]);

  // Generate property schema if property data is provided
  const propertySchema = propertyData ? {
    "@context": "https://schema.org",
    "@type": "Residence", // Could be Apartment, House, Condo, etc.
    "name": `${propertyData.propertyType || 'Property'} in ${propertyData.location || 'Africa'}`,
    "description": `Discover this ${propertyData.bedrooms}-bedroom ${propertyData.propertyType || 'property'} in ${propertyData.location || 'prime location'}. ${propertyData.price || 'Competitively priced'}.`,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": propertyData.address || "Property Address",
      "addressLocality": propertyData.location || "City",
      "addressRegion": "Africa",
      "addressCountry": "Country"
    },
    "offers": {
      "@type": "Offer",
      "price": propertyData.price || "Price on Application",
      "priceCurrency": "NGN" // Could be adjusted based on location
    },
    "numberOfRooms": propertyData.bedrooms,
    "floorSize": {
      "@type": "QuantitativeValue",
      "value": propertyData.size || "N/A",
      "unitCode": "MTK" // Square meters
    },
    "mainEntityOfPage": canonicalUrl || window.location.href
  } : null;

  // Generate real estate agent schema if agent data is provided
  const agentSchema = agentData ? {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "name": agentData.name || "Real Estate Agent",
    "description": "Professional real estate agent specializing in African property markets",
    "url": canonicalUrl || window.location.href,
    "image": "/agent-profile.jpg", // Placeholder
    "telephone": "+234-XXX-XXXX", // Placeholder
    "email": "agent@afrimmo.ai", // Placeholder
    "jobTitle": "Real Estate Agent",
    "worksFor": {
      "@type": "RealEstateAgent",
      "name": agentData.company || "Afrimmo AI"
    },
    "areaServed": agentData.areasServed || ["Africa"],
    "license": agentData.licenseNumber || "License #12345",
    "memberOf": [
      {
        "@type": "Organization",
        "name": "Nigerian Institution of Estate Surveyors and Valuers (NIESV)"
      },
      {
        "@type": "Organization",
        "name": "Estate Surveyors and Valuers Board of Nigeria (ESVBN)"
      }
    ]
  } : null;

  // Combine schemas if needed
  const combinedSchema = schema || propertySchema || agentSchema;

  return (
    <Helmet>
      {/* Standard Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      <meta name="author" content={agentData?.company || "Afrimmo AI"} />
      <meta name="robots" content="index, follow" />
      <meta name="theme-color" content="#10b981" />
      
      {/* Viewport for Responsive Design */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
      
      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      
      {/* Open Graph / Facebook Meta Tags */}
      <meta property="og:type" content={propertyData ? "article" : "website"} />
      <meta property="og:title" content={ogTitle || title} />
      <meta property="og:description" content={ogDescription || description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={ogUrl || canonicalUrl || window.location.href} />
      <meta property="og:site_name" content="Afrimmo AI" />
      <meta property="og:locale" content="en_US" />
      {propertyData && (
        <>
          <meta property="og:latitude" content="6.5244" /> {/* Lagos, Nigeria */}
          <meta property="og:longitude" content="3.3792" />
          <meta property="og:price:amount" content={propertyData.price?.replace(/[^\d.-]/g, '') || "0"} />
          <meta property="og:price:currency" content="NGN" />
        </>
      )}
      
      {/* Twitter Meta Tags */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={twitterTitle || title} />
      <meta name="twitter:description" content={twitterDescription || description} />
      <meta name="twitter:image" content={twitterImage || ogImage} />
      <meta name="twitter:site" content="@afrimmo_ai" />
      <meta name="twitter:creator" content="@afrimmo_ai" />
      
      {/* Structured Data / Schema Markup */}
      {combinedSchema && (
        <script type="application/ld+json">
          {JSON.stringify(combinedSchema)}
        </script>
      )}
      
      {/* Favicon and Icons */}
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      
      {/* Manifest */}
      <link rel="manifest" href="/site.webmanifest" />
      
      {/* Preload critical resources */}
      <link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
    </Helmet>
  );
};

export default RealEstateSEO;