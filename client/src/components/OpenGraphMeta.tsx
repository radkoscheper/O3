import { useEffect } from 'react';

interface OpenGraphMetaProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: string;
  siteName?: string;
}

export default function OpenGraphMeta({
  title,
  description,
  image,
  url,
  type = 'website',
  siteName
}: OpenGraphMetaProps) {
  useEffect(() => {
    console.log('🔗 OpenGraphMeta component mounting...', { title, type });

    // Update or create Open Graph meta tags
    const updateMetaTag = (property: string, content: string) => {
      let metaTag = document.querySelector(`meta[property="${property}"]`);
      if (!metaTag) {
        metaTag = document.createElement('meta');
        metaTag.setAttribute('property', property);
        document.head.appendChild(metaTag);
      }
      metaTag.setAttribute('content', content);
    };

    // Set Open Graph meta tags
    updateMetaTag('og:title', title);
    updateMetaTag('og:description', description);
    updateMetaTag('og:type', type);
    
    if (url) {
      updateMetaTag('og:url', url);
    }
    
    if (image) {
      updateMetaTag('og:image', image);
    }
    
    if (siteName) {
      updateMetaTag('og:site_name', siteName);
    }

    // Also update Twitter Card meta tags for better social sharing
    const updateTwitterMetaTag = (name: string, content: string) => {
      let metaTag = document.querySelector(`meta[name="${name}"]`);
      if (!metaTag) {
        metaTag = document.createElement('meta');
        metaTag.setAttribute('name', name);
        document.head.appendChild(metaTag);
      }
      metaTag.setAttribute('content', content);
    };

    updateTwitterMetaTag('twitter:card', 'summary_large_image');
    updateTwitterMetaTag('twitter:title', title);
    updateTwitterMetaTag('twitter:description', description);
    
    if (image) {
      updateTwitterMetaTag('twitter:image', image);
    }

    console.log('✅ Open Graph meta tags updated for:', title);
  }, [title, description, image, url, type, siteName]);

  return null; // This component doesn't render anything visible
}