import React from 'react';
import { Card } from '@/components/ui/card';
import TravelSlider from '@/components/ui/travel-slider';
import { Link } from 'wouter';

interface UniversalCarouselProps {
  title?: string;
  subtitle?: string;
  items: Array<{
    id: number | string;
    name?: string;
    title?: string;
    description?: string;
    image?: string;
    aiImage?: string;
    alt?: string;
    link?: string;
    slug?: string;
    [key: string]: any;
  }>;
  visibleItems?: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
  showNavigation?: boolean;
  cardClassName?: string;
  imageClassName?: string;
  contentClassName?: string;
  renderCard?: (item: any, defaultCard: React.ReactNode) => React.ReactNode;
  onItemClick?: (item: any) => void;
  className?: string;
}

export default function UniversalCarousel({
  title,
  subtitle,
  items,
  visibleItems = { mobile: 1, tablet: 2, desktop: 4 },
  showNavigation = true,
  cardClassName = "",
  imageClassName = "",
  contentClassName = "",
  renderCard,
  onItemClick,
  className = ""
}: UniversalCarouselProps) {

  const getItemImage = (item: any) => {
    return item.aiImage || item.image || '/images/placeholder.jpg';
  };

  const getItemName = (item: any) => {
    return item.name || item.title || 'Item';
  };

  const getItemDescription = (item: any) => {
    return item.description || item.subtitle || 'Ontdek dit item';
  };

  const defaultCard = (item: any) => (
    <Card 
      className={`group overflow-hidden bg-white shadow-luxury hover:shadow-luxury-xl transition-all duration-500 border-0 rounded-2xl mx-4 h-full flex flex-col relative hover:z-10 ${cardClassName}`}
    >
      <div className="aspect-[4/3] overflow-hidden relative">
        <img
          src={getItemImage(item)}
          alt={item.alt || getItemName(item)}
          className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out ${imageClassName}`}
          onError={(e) => {
            e.currentTarget.src = '/images/placeholder.jpg';
          }}
        />
        
        {/* AI Enhancement Indicators */}
        {item.aiImage && (
          <div className="absolute top-2 right-2">
            <div className="bg-blue-500 bg-opacity-95 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 shadow-md">
              <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
              AI Pro
            </div>
          </div>
        )}
      </div>
      
      <div className={`p-8 flex-1 flex flex-col justify-between ${contentClassName}`}>
        <div>
          <h3 className="font-playfair font-bold text-2xl text-navy-dark mb-3 leading-tight">
            {getItemName(item)}
          </h3>
          <p className="font-croatia-body text-navy-medium mb-6 leading-relaxed text-base">
            {getItemDescription(item)}
          </p>
        </div>
        <div className="mt-auto">
          <div className="inline-flex items-center justify-center bg-gold-accent hover:bg-gold-light text-navy-dark font-playfair font-bold px-8 py-4 rounded-full transition-all duration-300 hover:scale-105 shadow-luxury hover:shadow-gold text-lg cursor-pointer">
            Ontdek Meer
          </div>
        </div>
      </div>
    </Card>
  );

  const handleItemInteraction = (item: any, cardContent: React.ReactNode) => {
    if (onItemClick) {
      return (
        <div 
          key={item.id}
          onClick={() => onItemClick(item)}
          className="cursor-pointer"
        >
          {cardContent}
        </div>
      );
    }

    // External link - open in new tab
    if (item.link && item.link.startsWith('http')) {
      return (
        <a
          key={item.id}
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
        >
          {cardContent}
        </a>
      );
    }

    // Internal link to slug
    if (item.slug) {
      return (
        <Link key={item.id} href={`/${item.slug}`}>
          {cardContent}
        </Link>
      );
    }

    // No link - just display card
    return (
      <div key={item.id}>
        {cardContent}
      </div>
    );
  };

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <section className={`py-4 px-5 max-w-7xl mx-auto ${className}`}>
      {/* Title and Subtitle */}
      {(title || subtitle) && (
        <div className="text-center mb-6">
          {title && (
            <h2 className="text-4xl md:text-6xl font-playfair font-bold mb-4 text-navy-dark tracking-wide">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-xl md:text-2xl text-navy-medium font-croatia-body max-w-3xl mx-auto leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
      )}
      
      {/* Carousel */}
      <TravelSlider
        visibleItems={visibleItems}
        showNavigation={showNavigation}
        className="mx-auto"
      >
        {items.map((item) => {
          const cardContent = renderCard ? renderCard(item, defaultCard(item)) : defaultCard(item);
          return handleItemInteraction(item, cardContent);
        })}
      </TravelSlider>
    </section>
  );
}