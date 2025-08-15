import React from 'react';
import AIEnhancedImage from './ai-enhanced-image';
import EnhancedImage from './enhanced-image';

interface AdminControlledImageProps {
  src: string;
  alt: string;
  className?: string;
  location?: string;
  imageType?: 'hero' | 'destination' | 'activity' | 'guide' | 'motivation';
  aiEnabled?: boolean; // Admin controlled setting
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

export const AdminControlledImage: React.FC<AdminControlledImageProps> = ({
  src,
  alt,
  className = '',
  location,
  imageType = 'activity',
  aiEnabled = true, // Default to AI enabled
  fallback,
  lazy = true,
  priority = false,
  aspectRatio,
  onLoad,
  onAIProcessed
}) => {
  
  // If AI is enabled, use AI Enhanced Image
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
        {/* Admin controlled AI badge */}
        <div className="absolute top-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded-md flex items-center gap-1">
          <span className={`w-2 h-2 ${badgeColors[imageType]} rounded-full animate-pulse`}></span>
          AI
        </div>
      </div>
    );
  }

  // If AI is disabled, use Enhanced Image (performance optimized)
  return (
    <div className="relative">
      <EnhancedImage
        src={src}
        alt={alt}
        className={className}
        location={location}
        mood="vibrant"
        aspectRatio={aspectRatio}
        lazy={lazy}
        fallback={fallback}
        onLoad={onLoad}
      />
      {/* Performance optimized badge */}
      <div className="absolute top-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded-md flex items-center gap-1">
        <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
        OPT
      </div>
    </div>
  );
};

export default AdminControlledImage;