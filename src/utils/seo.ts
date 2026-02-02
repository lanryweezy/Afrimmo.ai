// SEO utilities for the application

// Generate meta tags for dynamic pages
export const generateMetaTags = (pageData: {
  title: string;
  description: string;
  keywords: string[];
  url: string;
  image?: string;
}): string => {
  const image = pageData.image || 'https://afrimmo.ai/default-og-image.jpg';
  
  return `
    <title>${pageData.title}</title>
    <meta name="description" content="${pageData.description}">
    <meta name="keywords" content="${pageData.keywords.join(', ')}">
    <meta property="og:title" content="${pageData.title}">
    <meta property="og:description" content="${pageData.description}">
    <meta property="og:url" content="${pageData.url}">
    <meta property="og:image" content="${image}">
    <meta property="og:type" content="website">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${pageData.title}">
    <meta name="twitter:description" content="${pageData.description}">
    <meta name="twitter:image" content="${image}">
  `;
};

// Update document head with new meta tags
export const updateMetaTags = (metaTags: {
  title?: string;
  description?: string;
  keywords?: string[];
  url?: string;
  image?: string;
}) => {
  if (metaTags.title) {
    document.title = metaTags.title;
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', metaTags.title);
    } else {
      const newTag = document.createElement('meta');
      newTag.setAttribute('property', 'og:title');
      newTag.setAttribute('content', metaTags.title);
      document.head.appendChild(newTag);
    }
  }

  if (metaTags.description) {
    const descTag = document.querySelector('meta[name="description"]');
    if (descTag) {
      descTag.setAttribute('content', metaTags.description);
    } else {
      const newTag = document.createElement('meta');
      newTag.setAttribute('name', 'description');
      newTag.setAttribute('content', metaTags.description);
      document.head.appendChild(newTag);
    }

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) {
      ogDesc.setAttribute('content', metaTags.description);
    } else {
      const newTag = document.createElement('meta');
      newTag.setAttribute('property', 'og:description');
      newTag.setAttribute('content', metaTags.description);
      document.head.appendChild(newTag);
    }
  }

  if (metaTags.keywords) {
    const keywordsTag = document.querySelector('meta[name="keywords"]');
    if (keywordsTag) {
      keywordsTag.setAttribute('content', metaTags.keywords.join(', '));
    } else {
      const newTag = document.createElement('meta');
      newTag.setAttribute('name', 'keywords');
      newTag.setAttribute('content', metaTags.keywords.join(', '));
      document.head.appendChild(newTag);
    }
  }

  if (metaTags.url) {
    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) {
      ogUrl.setAttribute('content', metaTags.url);
    } else {
      const newTag = document.createElement('meta');
      newTag.setAttribute('property', 'og:url');
      newTag.setAttribute('content', metaTags.url);
      document.head.appendChild(newTag);
    }
  }

  if (metaTags.image) {
    const ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage) {
      ogImage.setAttribute('content', metaTags.image);
    } else {
      const newTag = document.createElement('meta');
      newTag.setAttribute('property', 'og:image');
      newTag.setAttribute('content', metaTags.image);
      document.head.appendChild(newTag);
    }

    const twitterImage = document.querySelector('meta[name="twitter:image"]');
    if (twitterImage) {
      twitterImage.setAttribute('content', metaTags.image);
    } else {
      const newTag = document.createElement('meta');
      newTag.setAttribute('name', 'twitter:image');
      newTag.setAttribute('content', metaTags.image);
      document.head.appendChild(newTag);
    }
  }
};

// Generate structured data for real estate business
export const generateRealEstateSchema = (businessData: {
  name: string;
  description: string;
  url: string;
  logo: string;
  address: {
    street: string;
    city: string;
    region: string;
    postalCode: string;
    country: string;
  };
  telephone: string;
  openingHours?: string[];
  rating?: {
    value: number;
    count: number;
  };
}): string => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "serviceType": "Real Estate Agent",
    "name": businessData.name,
    "description": businessData.description,
    "url": businessData.url,
    "logo": businessData.logo,
    "image": businessData.logo,
    "telephone": businessData.telephone,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": businessData.address.street,
      "addressLocality": businessData.address.city,
      "addressRegion": businessData.address.region,
      "postalCode": businessData.address.postalCode,
      "addressCountry": businessData.address.country
    },
    "openingHours": businessData.openingHours || ["Mo-Fr 09:00-17:00"],
    ...(businessData.rating && {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": businessData.rating.value,
        "reviewCount": businessData.rating.count
      }
    }),
    "areaServed": "Africa",
    "availableLanguage": ["English", "French", "Portuguese"],
    "award": "Best AI Real Estate Solution 2025"
  };

  return `<script type="application/ld+json">${JSON.stringify(schema)}</script>`;
};

// Generate FAQ schema for real estate services
export const generateFAQSchema = (faqs: Array<{question: string; answer: string}>): string => {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return `<script type="application/ld+json">${JSON.stringify(faqSchema)}</script>`;
};

// Generate breadcrumbs schema
export const generateBreadcrumbSchema = (breadcrumbs: Array<{name: string; url: string}>): string => {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": crumb.url
    }))
  };

  return `<script type="application/ld+json">${JSON.stringify(breadcrumbSchema)}</script>`;
};

// Canonical URL helper
export const setCanonicalURL = (url: string) => {
  let canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) {
    canonical.setAttribute('href', url);
  } else {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    canonical.setAttribute('href', url);
    document.head.appendChild(canonical);
  }
};

// Check if page is indexed
export const checkIfIndexed = async (url: string): Promise<boolean> => {
  try {
    // This is a simplified check - in reality, you'd need to use a search engine API
    const response = await fetch(`https://api.searchconsole.googleapis.com/check-index?url=${encodeURIComponent(url)}`);
    return response.ok;
  } catch (error) {
    console.warn('Could not check indexing status:', error);
    return false;
  }
};

// Generate SEO report
export const generateSEOReport = (): string => {
  const report = {
    url: window.location.href,
    title: document.title,
    description: document.querySelector('meta[name="description"]')?.getAttribute('content') || '',
    keywords: document.querySelector('meta[name="keywords"]')?.getAttribute('content') || '',
    headingStructure: Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6')).map(el => ({
      tag: el.tagName.toLowerCase(),
      text: el.textContent?.trim() || ''
    })),
    imageCount: document.images.length,
    internalLinks: document.querySelectorAll('a[href^="/"]').length,
    externalLinks: document.querySelectorAll('a[href^="http"]').length,
    hasSchema: !!document.querySelector('script[type="application/ld+json"]'),
    hasCanonical: !!document.querySelector('link[rel="canonical"]'),
    hasViewport: !!document.querySelector('meta[name="viewport"]'),
    hasOGTags: document.querySelectorAll('[property^="og:"]').length > 0,
    hasTwitterTags: document.querySelectorAll('[name^="twitter:"]').length > 0
  };

  return JSON.stringify(report, null, 2);
};