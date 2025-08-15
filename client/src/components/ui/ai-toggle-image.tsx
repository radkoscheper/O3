import React from 'react';
import { useQuery } from '@tanstack/react-query';
import AIEnhancedImage from './ai-enhanced-image';
import EnhancedImage from './enhanced-image';
import type { SiteSettings } from '@shared/schema';

interface AIToggleImageProps {
  src: string;
  alt: string;
  className?: string;
  location?: string;
  imageType?: 'hero' | 'destination' | 'activity' | 'guide' | 'motivation';
  fallback?: string;
  lazy?: boolean;
  priority?: boolean;
  aspectRatio?: string;
  onLoad?: () => void;
  onAIProcessed?: (tags: string[]) => void;
}

// Badge colors per image type
const badgeColors = {
  hero: 'bg-blue-400',
  destination: 'bg-green-400', 
  activity: 'bg-green-400',
  guide: 'bg-purple-400',
  motivation: 'bg-blue-400'
};

export const AIToggleImage: React.FC<AIToggleImageProps> = ({
  src,
  alt,
  className = '',
  location,
  imageType = 'activity',
  fallback,
  lazy = true,
  priority = false,
  aspectRatio,
  onLoad,
  onAIProcessed
}) => {
  
  // Get global AI setting from site settings
  const { data: siteSettings } = useQuery<SiteSettings>({
    queryKey: ['/api/site-settings'],
  });

  const aiEnabled = (siteSettings as any)?.aiEnhancementEnabled ?? true;
  
  // If AI is enabled globally, use AI Enhanced Image
  if (aiEnabled) {
    return (
      <div className="relative">
        <AIEnhancedImage
          src={src}
          alt={alt}
          className={className}
          aiPreset="auto"
          upscale={true}
          aspectRatio={aspectRatio}
          autoTag={true}
          lazy={lazy}
          priority={priority}
          fallback={fallback}
          onAIProcessed={onAIProcessed}
        />
        {/* AI Badge - only show in development */}
        {process.env.NODE_ENV === 'development' && (
          <div className="absolute top-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded-md flex items-center gap-1">
            <span className={`w-2 h-2 ${badgeColors[imageType]} rounded-full animate-pulse`}></span>
            AI
          </div>
        )}
      </div>
    );
  }

  // If AI is disabled globally, use simple img tag (most reliable)
  return (
    <div className="relative">
      <img
        src={src}
        alt={alt}
        className={className}
        loading={lazy ? "lazy" : "eager"}
        onLoad={onLoad}
        onError={(e) => {
          if (fallback && (e.target as HTMLImageElement).src !== fallback) {
            (e.target as HTMLImageElement).src = fallback;
          }
        }}
      />
      {/* Performance optimized badge - only show in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded-md flex items-center gap-1">
          <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
          STD
        </div>
      )}
    </div>
  );
};

export default AIToggleImage;