import React, { useState, useEffect } from 'react';
import { generateAIEnhancedUrl, TRAVEL_AI_PRESETS } from '@/lib/cloudinary-ai-features';

interface AIEnhancedHeroProps {
  backgroundImage?: string;
  children: React.ReactNode;
  className?: string;
  aiPreset?: keyof typeof TRAVEL_AI_PRESETS | 'auto';
  upscale?: boolean;
  aspectRatio?: string;
  showAIBadge?: boolean;
}

export function AIEnhancedHero({
  backgroundImage,
  children,
  className = '',
  aiPreset = 'landscape',
  upscale = true,
  aspectRatio = '16:9',
  showAIBadge = true
}: AIEnhancedHeroProps) {
  const [processedBackgroundUrl, setProcessedBackgroundUrl] = useState<string>('');
  const [isAIProcessed, setIsAIProcessed] = useState(false);
  const [aiTags, setAiTags] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!backgroundImage) {
      setProcessedBackgroundUrl('/images/backgrounds/header.jpg');
      return;
    }

    // Check if this is already a Cloudinary URL or local image
    const isCloudinaryUrl = backgroundImage.includes('cloudinary.com');
    const isLocalImage = backgroundImage.startsWith('/') || backgroundImage.startsWith('./');

    if (isCloudinaryUrl) {
      // Apply AI enhancements to Cloudinary images
      console.log('🤖 AI Hero Enhancement activated for:', backgroundImage);
      
      try {
        const enhancedUrl = generateAIEnhancedUrl(backgroundImage, '', {
          transformation: `e_improve:outdoor,e_saturation:25,e_auto_contrast${upscale ? ',e_upscale' : ''}${aspectRatio ? `,ar_16:9,c_fill` : ''},w_1920,h_1080,q_auto:good,f_auto`
        });

        setProcessedBackgroundUrl(enhancedUrl);
        setIsAIProcessed(true);

        // Generate travel-specific AI tags for hero images
        const heroTags = [
          'polen', 'travel', 'tourism', 'landscape', 'hero-section',
          ...(aiPreset === 'landscape' ? ['mountains', 'nature', 'scenic'] : []),
          ...(aiPreset === 'nature' ? ['nature', 'outdoor', 'natural'] : []),
          ...(aiPreset === 'architecture' ? ['architecture', 'historic', 'buildings'] : [])
        ];

        setAiTags(heroTags);
        
        console.log('🎨 Hero AI Enhancement applied with preset:', aiPreset);
        console.log('🏷️ Hero AI tags generated:', heroTags);

      } catch (error) {
        console.error('❌ Hero AI enhancement failed:', error);
        setProcessedBackgroundUrl(backgroundImage);
        setIsAIProcessed(false);
      }
    } else {
      // For local images, use as-is
      setProcessedBackgroundUrl(backgroundImage);
      setIsAIProcessed(false);
    }
  }, [backgroundImage, aiPreset, upscale, aspectRatio]);

  // Preload the processed background image
  useEffect(() => {
    if (processedBackgroundUrl) {
      const img = new Image();
      img.onload = () => {
        setIsLoaded(true);
        if (isAIProcessed) {
          console.log('✅ AI-enhanced hero background loaded successfully');
        }
      };
      img.onerror = () => {
        console.error('❌ Hero background failed to load:', processedBackgroundUrl);
        // Fallback to default background
        setProcessedBackgroundUrl('/images/backgrounds/header.jpg');
        setIsAIProcessed(false);
      };
      img.src = processedBackgroundUrl;
    }
  }, [processedBackgroundUrl, isAIProcessed]);

  const heroStyle = {
    backgroundImage: processedBackgroundUrl ? `url('${processedBackgroundUrl}')` : "url('/images/backgrounds/header.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat"
  };

  return (
    <section 
      className={`relative text-white py-24 px-5 text-center min-h-screen flex items-center justify-center overflow-hidden ${className}`}
      style={heroStyle}
    >
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-navy-dark/40 via-navy-dark/20 to-navy-dark/60 z-10"></div>
      
      {/* AI Badge - Only show for Cloudinary AI-enhanced images */}
      {showAIBadge && isAIProcessed && isLoaded && (
        <div className="absolute top-6 left-6 z-30">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg border border-white/20">
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              AI
            </span>
          </div>
        </div>
      )}
      
      {/* Hero Content */}
      <div className="relative z-20 max-w-4xl mx-auto text-center">
        {children}
      </div>
      
      {/* Loading indicator for AI processing */}
      {isAIProcessed && !isLoaded && (
        <div className="absolute top-6 right-6 z-30">
          <div className="bg-black/50 text-white text-xs px-3 py-1.5 rounded-full">
            <span className="flex items-center gap-2">
              <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              AI verwerkt...
            </span>
          </div>
        </div>
      )}
    </section>
  );
}

export default AIEnhancedHero;