import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface EnhancedImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  lazy?: boolean;
  fallback?: string;
  location?: string; // Voor Polen-specifieke styling
  mood?: 'dramatic' | 'vibrant' | 'serene' | 'historic' | 'natural';
  showOverlay?: boolean;
  overlayText?: string;
  aspectRatio?: string;
  cropFocus?: 'center' | 'top' | 'bottom' | 'left' | 'right' | 'faces';
  onLoad?: () => void;
}

const locationMoods: Record<string, string> = {
  'Krakow': 'historic',
  'Warsaw': 'dramatic', 
  'Gdansk': 'vibrant',
  'Tatra': 'natural',
  'Zakopane': 'serene',
  'Wrocław': 'vibrant'
};

const moodFilters = {
  dramatic: 'brightness-95 contrast-110 saturate-105',
  vibrant: 'brightness-105 contrast-105 saturate-110 hue-rotate-3',
  serene: 'brightness-110 contrast-95 saturate-95 blur-[0.3px]',
  historic: 'brightness-90 contrast-115 saturate-90 sepia-10',
  natural: 'brightness-105 contrast-100 saturate-105'
};

const cropPositions = {
  center: 'object-center',
  top: 'object-top',
  bottom: 'object-bottom',
  left: 'object-left',
  right: 'object-right',
  faces: 'object-center' // Zou met face detection kunnen worden verbeterd
};

export const EnhancedImage: React.FC<EnhancedImageProps> = ({
  src,
  alt,
  className = '',
  priority = false,
  lazy = true,
  fallback = '/images/placeholder.jpg',
  location,
  mood,
  showOverlay = false,
  overlayText,
  aspectRatio,
  cropFocus = 'center',
  onLoad
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [imageSrc, setImageSrc] = useState(src);

  // Bepaal mood op basis van locatie of expliciet opgegeven mood
  const effectiveMood = mood || (location && locationMoods[location]) || 'natural';
  
  // Genereer optimale image formats
  const getOptimizedSrc = (originalSrc: string) => {
    // Als het een Cloudinary URL is, optimaliseer voor performance in plaats van AI
    if (originalSrc.includes('cloudinary.com')) {
      // Performance optimalisaties zonder AI enhancement
      const optimizations = [
        'f_auto', // Automatisch formaat (WebP, AVIF)
        'q_auto:good', // Automatische kwaliteit optimalisatie
        'c_fill', // Smart cropping
        cropFocus !== 'center' ? `g_${cropFocus}` : 'g_auto', // Smart focus
        aspectRatio ? `ar_${aspectRatio.replace(':', '_')}` : '',
        'dpr_auto' // Automatische DPI voor verschillende schermen
      ].filter(Boolean).join(',');
      
      return originalSrc.replace('/upload/', `/upload/${optimizations}/`);
    }
    return originalSrc;
  };

  useEffect(() => {
    setImageSrc(getOptimizedSrc(src));
  }, [src, aspectRatio, cropFocus]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setIsError(true);
    if (fallback && imageSrc !== fallback) {
      setImageSrc(fallback);
    }
  };

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Loading state */}
      {!isLoaded && !isError && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
        </div>
      )}
      
      {/* Main image */}
      <img
        src={imageSrc}
        alt={alt}
        className={cn(
          "w-full h-full object-cover transition-all duration-700",
          cropPositions[cropFocus],
          moodFilters[effectiveMood as keyof typeof moodFilters],
          "hover:scale-105 hover:brightness-110",
          !isLoaded && "opacity-0",
          isLoaded && "opacity-100"
        )}
        loading={lazy && !priority ? "lazy" : "eager"}
        onLoad={handleLoad}
        onError={handleError}
        {...(priority && { fetchPriority: "high" as any })}
      />

      {/* Polen-specifieke overlay voor tekst leesbaarheid */}
      {showOverlay && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent">
          {overlayText && (
            <div className="absolute bottom-4 left-4 right-4">
              <p className="text-white font-semibold text-lg drop-shadow-lg">
                {overlayText}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Performance indicator (alleen in development) */}
      {process.env.NODE_ENV === 'development' && isLoaded && (
        <div className="absolute top-2 right-2 bg-green-500/80 text-white text-xs px-2 py-1 rounded">
          {effectiveMood}
        </div>
      )}

      {/* Polen travel badge */}
      {location && (
        <div className="absolute top-3 left-3 bg-white/90 text-gray-800 text-xs px-2 py-1 rounded-md flex items-center gap-1">
          <span className="w-2 h-2 bg-red-500 rounded-full"></span>
          <span className="w-2 h-2 bg-white rounded-full"></span>
          {location}
        </div>
      )}
    </div>
  );
};

export default EnhancedImage;