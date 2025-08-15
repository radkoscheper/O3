import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface EnhancedHeroProps {
  backgroundImage: string;
  children?: React.ReactNode;
  className?: string;
  location?: string;
  season?: 'spring' | 'summer' | 'autumn' | 'winter';
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night';
  overlayOpacity?: number;
  parallax?: boolean;
}

const seasonalFilters = {
  spring: 'brightness-110 contrast-100 saturate-110 hue-rotate-6',
  summer: 'brightness-115 contrast-105 saturate-115 hue-rotate-12',
  autumn: 'brightness-95 contrast-110 saturate-105 hue-rotate-[-6deg]',
  winter: 'brightness-90 contrast-115 saturate-85 hue-rotate-[-12deg]'
};

const timeOfDayOverlays = {
  morning: 'bg-gradient-to-b from-orange-100/20 via-transparent to-transparent',
  afternoon: 'bg-gradient-to-b from-blue-50/10 via-transparent to-transparent', 
  evening: 'bg-gradient-to-b from-orange-200/30 via-orange-100/10 to-transparent',
  night: 'bg-gradient-to-b from-blue-900/40 via-blue-800/20 to-transparent'
};

export const EnhancedHero: React.FC<EnhancedHeroProps> = ({
  backgroundImage,
  children,
  className = '',
  location,
  season = 'summer',
  timeOfDay = 'afternoon',
  overlayOpacity = 0.4,
  parallax = true
}) => {
  const [scrollY, setScrollY] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!parallax) return;
    
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [parallax]);

  // Optimaliseer hero image voor performance
  const getOptimizedHeroSrc = (src: string) => {
    if (src.includes('cloudinary.com')) {
      const optimizations = [
        'f_auto,q_auto:good', // Formaat en kwaliteit
        'c_fill,g_auto', // Smart cropping
        'ar_16:9', // Hero aspect ratio
        'w_1920', // Max breedte voor desktop
        'dpr_auto' // Retina support
      ].join(',');
      
      return src.replace('/upload/', `/upload/${optimizations}/`);
    }
    return src;
  };

  const parallaxOffset = parallax ? scrollY * 0.5 : 0;

  return (
    <div className={cn("relative min-h-screen overflow-hidden", className)}>
      {/* Loading state */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-200 via-gray-100 to-gray-300 animate-pulse">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
        </div>
      )}

      {/* Hero background image */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          transform: `translateY(${parallaxOffset}px)`,
        }}
      >
        <img
          src={getOptimizedHeroSrc(backgroundImage)}
          alt={`${location || 'Polen'} hero background`}
          className={cn(
            "w-full h-full object-cover scale-110", // Scale voor parallax
            seasonalFilters[season],
            "transition-all duration-1000 ease-out",
            !isLoaded && "opacity-0 scale-105",
            isLoaded && "opacity-100 scale-110"
          )}
          onLoad={() => setIsLoaded(true)}
          loading="eager"
          fetchPriority="high"
        />
      </div>

      {/* Seizoen-specifieke overlay */}
      <div className={cn("absolute inset-0", timeOfDayOverlays[timeOfDay])} />

      {/* Base overlay voor content leesbaarheid */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/60"
        style={{ opacity: overlayOpacity }}
      />

      {/* Polen flag pattern overlay (subtle) */}
      <div className="absolute inset-0 opacity-5">
        <div className="w-full h-1/2 bg-white"></div>
        <div className="w-full h-1/2 bg-red-600"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        {children}
      </div>

      {/* Performance metrics (development only) */}
      {process.env.NODE_ENV === 'development' && isLoaded && (
        <div className="absolute bottom-4 left-4 bg-black/70 text-white text-xs px-3 py-2 rounded space-y-1">
          <div>Season: {season}</div>
          <div>Time: {timeOfDay}</div>
          {location && <div>Location: {location}</div>}
          <div className="text-green-400">Optimized ✓</div>
        </div>
      )}

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/80 animate-bounce">
        <div className="flex flex-col items-center space-y-2">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full relative">
            <div className="w-1 h-3 bg-white/70 rounded-full absolute top-2 left-1/2 transform -translate-x-1/2 animate-pulse"></div>
          </div>
          <span className="text-sm font-medium">Scroll</span>
        </div>
      </div>
    </div>
  );
};

export default EnhancedHero;