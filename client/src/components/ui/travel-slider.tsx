import React, { useCallback, useEffect, useRef, useState } from 'react'
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
    dragFree: false,
    containScroll: 'trimSnaps',
    loop: false
  })

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  // Track screen size for responsive navigation
  const [screenWidth, setScreenWidth] = useState(() => 
    typeof window !== 'undefined' ? window.innerWidth : 1024
  )

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Force re-initialization when visibleItems change
  useEffect(() => {
    if (emblaApi) {
      emblaApi.reInit()
    }
  }, [emblaApi, visibleItems.desktop, visibleItems.tablet, visibleItems.mobile])

  // Dynamic visibility management - ref to track slide elements
  const slideRefs = useRef<(HTMLDivElement | null)[]>([])

  // Smart visibility control using Intersection Observer
  useEffect(() => {
    if (!emblaApi) return

    const carouselContainer = emblaApi.rootNode()
    if (!carouselContainer) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const slide = entry.target as HTMLDivElement
          const isVisible = entry.intersectionRatio > 0.1 // 10% threshold for better detection
          
          // Smooth fade in/out instead of hard hide
          slide.style.opacity = isVisible ? '1' : '0'
          slide.style.pointerEvents = isVisible ? 'auto' : 'none'
        })
      },
      {
        root: carouselContainer, // Use carousel container as root instead of viewport
        rootMargin: '0px', // No margin needed since we're within carousel
        threshold: [0, 0.1, 0.5, 1] // Multiple thresholds for smooth transitions
      }
    )

    // Observe all current slide elements
    slideRefs.current.forEach((slide) => {
      if (slide) observer.observe(slide)
    })

    return () => observer.disconnect()
  }, [emblaApi, children.length])

  // Show navigation based on CMS settings and item count per device
  const shouldShowNavigation = () => {
    if (!showNavigation || !children) return false
    
    // Determine visible items based on current screen width
    let currentVisibleItems
    if (screenWidth < 768) {
      currentVisibleItems = visibleItems.mobile
    } else if (screenWidth < 1024) {
      currentVisibleItems = visibleItems.tablet
    } else {
      currentVisibleItems = visibleItems.desktop
    }
    
    // Show navigation if more items than visible on current device
    return children.length > currentVisibleItems
  }
  
  const showNavigationButtons = shouldShowNavigation()
  
  // Re-calculate on screenWidth changes
  useEffect(() => {
    // Force re-render when screen size changes
  }, [screenWidth, children.length, visibleItems.mobile, visibleItems.tablet, visibleItems.desktop])

  // Calculate flex-basis for carousel items based on visible items
  const getFlexBasis = () => {
    // Ensure we have valid numbers and handle edge cases
    const safeVisibleItems = {
      mobile: Math.max(1, visibleItems.mobile || 1),
      tablet: Math.max(1, visibleItems.tablet || 2), 
      desktop: Math.max(1, visibleItems.desktop || 3)
    };
    

    
    return {
      mobile: `${100 / safeVisibleItems.mobile}%`,
      tablet: `${100 / safeVisibleItems.tablet}%`,
      desktop: `${100 / safeVisibleItems.desktop}%`
    };
  };
  
  const flexBasis = getFlexBasis();
  
  // Generate unique class name for this carousel instance
  const uniqueId = React.useMemo(() => Math.random().toString(36).substr(2, 9), []);

  // Early return after all hooks
  if (!children || children.length === 0) {
    return null;
  }

  return (
    <div className={cn("relative z-10", className)} data-testid="travel-slider" style={{isolation: 'isolate'}}>
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
          
          /* Dynamic visibility - no mask needed as JS handles visibility */
          .carousel-mask-${uniqueId} {
            /* Mask disabled - using Intersection Observer for smart visibility */
          }
          
          /* Equal height carousel with flexible content */
          .embla__container {
            display: flex;
            align-items: stretch;
          }
          .embla__slide {
            min-width: 0;
            display: flex;
            align-items: stretch;
          }
          .embla__slide > div {
            display: flex;
            align-items: stretch;
            width: 100%;
          }
          .embla__slide [class*="Card"] {
            display: flex !important;
            flex-direction: column !important;
            width: 100% !important;
            height: 100% !important;
          }

        `
      }} />
      <div className={`embla overflow-visible carousel-mask-${uniqueId}`} ref={emblaRef}>
        <div className="embla__container flex">
            {children.map((child, index) => (
            <div
              key={`carousel-item-${index}`}
              ref={(el) => slideRefs.current[index] = el}
              className={`embla__slide flex-none responsive-carousel-item-${uniqueId}`}
              style={{ 
                opacity: 1, 
                transition: 'opacity 0.3s ease',
                pointerEvents: 'auto'
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