import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';

interface SEOProps {
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
}

const SEO: React.FC<SEOProps> = ({
  title = 'Afrimmo AI - AI-Powered Real Estate Agent for Africa',
  description = 'Transform your real estate business with Afrimmo AI. Automated listings, viral marketing content, WhatsApp lead qualification, and more for African property markets.',
  keywords = [
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
  canonicalUrl,
  ogTitle,
  ogDescription,
  ogImage = 'https://afrimmo.ai/og-image.jpg',
  ogUrl,
  twitterCard = 'summary_large_image',
  twitterTitle,
  twitterDescription,
  twitterImage,
  schema
}) => {
  useEffect(() => {
    document.title = title;
  }, [title]);

  return (
    <Helmet>
      {/* Standard Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      <meta name="author" content="Afrimmo AI" />
      <meta name="robots" content="index, follow" />
      <meta name="theme-color" content="#10b981" />
      
      {/* Viewport for Responsive Design */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
      
      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      
      {/* Open Graph / Facebook Meta Tags */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={ogTitle || title} />
      <meta property="og:description" content={ogDescription || description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={ogUrl || canonicalUrl || window.location.href} />
      <meta property="og:site_name" content="Afrimmo AI" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter Meta Tags */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={twitterTitle || title} />
      <meta name="twitter:description" content={twitterDescription || description} />
      <meta name="twitter:image" content={twitterImage || ogImage} />
      <meta name="twitter:site" content="@afrimmo_ai" />
      <meta name="twitter:creator" content="@afrimmo_ai" />
      
      {/* Structured Data / Schema Markup */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
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

export default SEO;