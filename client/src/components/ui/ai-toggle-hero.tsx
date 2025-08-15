import React, { useState, useEffect } from 'react';
import { generateAIEnhancedUrl, TRAVEL_AI_PRESETS } from '@/lib/cloudinary-ai-features';
import { useQuery } from '@tanstack/react-query';

interface AIToggleHeroProps {
  backgroundImage?: string;
  children: React.ReactNode;
  className?: string;
  aiPreset?: keyof typeof TRAVEL_AI_PRESETS | 'auto';
  upscale?: boolean;
  aspectRatio?: string;
  showAIBadge?: boolean;
  location?: string;
}

export function AIToggleHero({
  backgroundImage,
  children,
  className = '',
  aiPreset = 'landscape',
  upscale = true,
  aspectRatio = '16:9',
  showAIBadge = true,
  location
}: AIToggleHeroProps) {
  const [processedBackgroundUrl, setProcessedBackgroundUrl] = useState<string>('');
  const [isAIProcessed, setIsAIProcessed] = useState(false);
  const [aiTags, setAiTags] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Fetch AI enhancement setting from admin
  const { data: siteSettings } = useQuery({
    queryKey: ['/api/site-settings'],
    staleTime: 30000, // Cache for 30 seconds
  });

  const isAIEnabled = (siteSettings as any)?.aiEnhancementEnabled ?? true;

  useEffect(() => {
    // Always use the provided background image - simple fallback
    const imageUrl = backgroundImage || '/images/backgrounds/header.jpg';
    
    if (isAIEnabled && imageUrl.includes('cloudinary.com')) {
      // Apply AI enhancements only if enabled and it's a Cloudinary image
      console.log('🤖 AI Hero Enhancement activated for:', imageUrl);
      
      try {
        const enhancedUrl = generateAIEnhancedUrl(imageUrl, location || '', {
          transformation: `e_improve:outdoor,e_saturation:25,e_auto_contrast${upscale ? ',e_upscale' : ''},ar_16:9,c_fill,w_1920,h_1080,q_auto:good,f_auto`
        });

        setProcessedBackgroundUrl(enhancedUrl);
        setIsAIProcessed(true);
        
        console.log('🎨 Hero AI Enhancement applied with preset:', aiPreset);

      } catch (error) {
        console.error('❌ Hero AI enhancement failed:', error);
        setProcessedBackgroundUrl(imageUrl);
        setIsAIProcessed(false);
      }
    } else {
      // Use original image when AI is disabled or for non-Cloudinary images
      setProcessedBackgroundUrl(imageUrl);
      setIsAIProcessed(false);
      if (!isAIEnabled) {
        console.log('⚙️ AI disabled - using original hero image');
      }
    }
    
    // Always ensure we have a background image set
    setIsLoaded(true);
  }, [backgroundImage, isAIEnabled, location]);

  // Preload the processed background image
  useEffect(() => {
    if (processedBackgroundUrl) {
      const img = new Image();
      img.onload = () => setIsLoaded(true);
      img.src = processedBackgroundUrl;
      
      if (isAIProcessed) {
        console.log('✅ AI-enhanced hero background loaded successfully');
      }
    }
  }, [processedBackgroundUrl, isAIProcessed]);

  const heroStyle = {
    backgroundImage: `url(${processedBackgroundUrl})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  };

  return (
    <div 
      className={`relative ${className}`}
      style={heroStyle}
    >
      {/* Gradient Overlay - HERO_SECTION_CONFIGURATION.md */}
      <div className="absolute inset-0 bg-gradient-to-b from-navy-dark/40 via-navy-dark/20 to-navy-dark/60" />
      
      {/* Hero Content */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* AI Enhancement Badge */}
      {showAIBadge && isAIProcessed && isAIEnabled && (
        <div className="absolute top-4 right-4 z-30">
          <div className="bg-blue-500/90 text-white text-sm px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-lg backdrop-blur-sm">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
            <span className="font-medium">AI Enhanced</span>
          </div>
        </div>
      )}
      
      {/* Performance indicator when AI is disabled */}
      {showAIBadge && !isAIEnabled && backgroundImage?.includes('cloudinary.com') && (
        <div className="absolute top-4 right-4 z-30">
          <div className="bg-gray-600/90 text-white text-sm px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-lg backdrop-blur-sm">
            <span className="w-2 h-2 bg-white rounded-full"></span>
            <span className="font-medium">Performance Mode</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default AIToggleHero;