import { useEffect } from 'react';

interface StructuredDataProps {
  type: string;
  title: string;
  description: string;
  url: string;
  image?: string;
  keywords?: string;
  siteName?: string;
}

export default function StructuredData({
  type,
  title,
  description,
  url,
  image,
  keywords,
  siteName
}: StructuredDataProps) {
  useEffect(() => {
    console.log('🔧 StructuredData component mounting...', { type, title, description });
    
    // Create structured data JSON-LD
    const structuredData = {
      "@context": "https://schema.org",
      "@type": type,
      "name": title,
      "description": description,
      "url": url,
      ...(image && { "image": image }),
      ...(keywords && { "keywords": keywords }),
      ...(siteName && { "publisher": { "@type": "Organization", "name": siteName } })
    };

    // Remove existing structured data script
    const existingScript = document.querySelector('script[type="application/ld+json"]');
    if (existingScript) {
      existingScript.remove();
    }

    // Add new structured data script
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);

    // Cleanup on unmount
    return () => {
      const scriptToRemove = document.querySelector('script[type="application/ld+json"]');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [type, title, description, url, image, keywords, siteName]);

  return null; // This component doesn't render anything visible
}