import React, { useCallback, useEffect } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface TravelSliderProps {
  children: React.ReactNode[]
  visibleItems?: {
    mobile: number
    tablet: number
    desktop: number
  }
  showNavigation?: boolean
  className?: string
}

export default function TravelSlider({ 
  children, 
  visibleItems = { mobile: 1, tablet: 2, desktop: 3 },
  showNavigation = true,
  className 
}: TravelSliderProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    slidesToScroll: 1,
    breakpoints: {
      '(min-width: 768px)': { 
        slidesToScroll: 1
      },
      '(min-width: 1024px)': { 
        slidesToScroll: 1
      }
    }
  })

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  // Force re-initialization when visibleItems change
  useEffect(() => {
    if (emblaApi) {
      emblaApi.reInit()
    }
  }, [emblaApi, visibleItems.desktop, visibleItems.tablet, visibleItems.mobile])

  // Show navigation based on CMS settings and item count
  const shouldShowNavigation = () => {
    if (!showNavigation || !children) return false
    
    // Always show navigation if more items than visible
    return children.length > visibleItems.desktop
  }
  
  const showNavigationButtons = shouldShowNavigation()

  if (!children || children.length === 0) {
    return null;
  }

  // Calculate flex-basis for carousel items based on visible items
  const getFlexBasis = () => {
    // Ensure we have valid numbers and handle edge cases
    const safeVisibleItems = {
      mobile: Math.max(1, visibleItems.mobile || 1),
      tablet: Math.max(1, visibleItems.tablet || 2), 
      desktop: Math.max(1, visibleItems.desktop || 3)
    };
    
    // Debug logging to see actual values
    console.log('🎠 TravelSlider visibleItems:', visibleItems);
    console.log('🎠 SafeVisibleItems:', safeVisibleItems);
    
    return {
      mobile: `${100 / safeVisibleItems.mobile}%`,
      tablet: `${100 / safeVisibleItems.tablet}%`,
      desktop: `${100 / safeVisibleItems.desktop}%`
    };
  };
  
  // Generate unique class name for this carousel instance
  const uniqueId = React.useMemo(() => Math.random().toString(36).substr(2, 9), []);

  const flexBasis = getFlexBasis();

  return (
    <div className={cn("relative", className)} data-testid="travel-slider" style={{isolation: 'isolate'}}>
      <style dangerouslySetInnerHTML={{
        __html: `
          .responsive-carousel-item-${uniqueId} {
            flex: 0 0 ${flexBasis.mobile} !important;
            max-width: ${flexBasis.mobile} !important;
          }
          @media (min-width: 768px) {
            .responsive-carousel-item-${uniqueId} {
              flex: 0 0 ${flexBasis.tablet} !important;
              max-width: ${flexBasis.tablet} !important;
            }
          }
          @media (min-width: 1024px) {
            .responsive-carousel-item-${uniqueId} {
              flex: 0 0 ${flexBasis.desktop} !important;
              max-width: ${flexBasis.desktop} !important;
            }
          }
        `
      }} />
      <div 
        className="embla overflow-hidden relative" 
        ref={emblaRef}
        style={{
          maskImage: `linear-gradient(to right, transparent 0%, black 1%, black 99%, transparent 100%)`
        }}
      >
        <div className="embla__container flex">
          {children.map((child, index) => (
            <div
              key={`carousel-item-${index}`}
              className={`embla__slide flex-none responsive-carousel-item-${uniqueId}`}
              style={{
                transformStyle: 'preserve-3d'
              }}
            >
              <div className="px-2 h-full">
                {child}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      {showNavigationButtons && (
        <>
          <Button
            variant="outline"
            size="sm"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 z-10 bg-white/95 hover:bg-white shadow-xl border-gold-accent/30 rounded-full"
            onClick={scrollPrev}
            aria-label="Vorige items"
          >
            <ChevronLeft className="h-4 w-4 text-navy-dark" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 z-10 bg-white/95 hover:bg-white shadow-xl border-gold-accent/30 rounded-full"
            onClick={scrollNext}
            aria-label="Volgende items"
          >
            <ChevronRight className="h-4 w-4 text-navy-dark" />
          </Button>
        </>
      )}

      {/* Scroll Indicator Dots */}
      {showNavigationButtons && (
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: Math.ceil(children.length / visibleItems.desktop) }).map((_, index) => (
            <div
              key={index}
              className="w-3 h-3 rounded-full bg-gold-accent/60 hover:bg-gold-accent transition-all duration-300 cursor-pointer"
              aria-hidden="true"
            />
          ))}
        </div>
      )}
    </div>
  )
}