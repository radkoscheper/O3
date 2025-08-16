import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface UniversalHeroProps {
  backgroundImage?: string | null;
  title: string;
  subtitle: string;
  showSearchBar?: boolean;
  searchPlaceholder?: string;
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
  onSearchSubmit?: (e: React.FormEvent) => void;
  buttons?: Array<{
    text: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary';
    icon?: React.ReactNode;
  }>;
  className?: string;
  minHeight?: 'screen' | 'auto';
}

export default function UniversalHero({
  backgroundImage,
  title,
  subtitle,
  showSearchBar = false,
  searchPlaceholder = "Zoek...",
  searchQuery = "",
  onSearchChange,
  onSearchSubmit,
  buttons = [],
  className = "",
  minHeight = 'screen'
}: UniversalHeroProps) {
  
  const handleSearchIconClick = () => {
    if (searchQuery.trim() && onSearchSubmit) {
      const form = document.querySelector('form');
      if (form) {
        form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
      }
    }
  };

  const heroStyle = {
    backgroundImage: backgroundImage 
      ? `url('${backgroundImage}')` 
      : "url('/images/backgrounds/header.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat"
  };

  return (
    <section 
      className={`relative text-white py-24 px-5 text-center ${minHeight === 'screen' ? 'min-h-screen' : ''} flex items-center justify-center overflow-hidden ${className}`}
      style={heroStyle}
    >
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-navy-dark/40 via-navy-dark/20 to-navy-dark/60 z-10"></div>
      
      <div className="relative z-20 max-w-4xl mx-auto text-center">
        <h1 className="text-5xl md:text-7xl font-playfair font-bold mb-6 text-white drop-shadow-2xl tracking-wide leading-tight">
          {title}
        </h1>
        <p className="text-xl md:text-3xl mb-12 text-white/95 font-croatia-body drop-shadow-lg leading-relaxed font-light">
          {subtitle}
        </p>
        
        {/* Search Bar */}
        {showSearchBar && onSearchSubmit && (
          <form 
            onSubmit={onSearchSubmit}
            className="mt-5 mb-5 relative"
          >
            <div className="relative inline-block">
              <Input
                type="text"
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(e) => onSearchChange?.(e.target.value)}
                className="py-5 px-8 w-[28rem] max-w-full border-2 border-white/30 rounded-full text-lg text-navy-dark font-croatia-body shadow-2xl backdrop-blur-md bg-white/95 hover:bg-white hover:border-gold-accent transition-all duration-500 focus:border-gold-accent focus:ring-2 focus:ring-gold-accent/50"
              />
              <Search 
                className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5 cursor-pointer" 
                onClick={handleSearchIconClick}
              />
            </div>
          </form>
        )}
        
        {/* Action Buttons */}
        {buttons.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-6 justify-center mt-12">
            {buttons.map((button, index) => (
              <Button
                key={index}
                onClick={button.onClick}
                className={
                  button.variant === 'secondary'
                    ? "py-5 px-10 text-lg font-playfair font-medium bg-white/10 backdrop-blur-md hover:bg-white/20 border-2 border-white/40 text-white rounded-full shadow-2xl hover:shadow-white/25 transition-all duration-500 hover:scale-105"
                    : "py-5 px-10 text-lg font-playfair font-medium bg-navy-dark hover:bg-navy-medium text-white rounded-full shadow-2xl hover:shadow-navy-dark/25 transition-all duration-500 border-2 border-navy-dark hover:border-navy-medium hover:scale-105"
                }
                variant={button.variant === 'secondary' ? 'outline' : 'default'}
              >
                {button.icon && <span className="w-5 h-5 mr-3">{button.icon}</span>}
                {button.text}
              </Button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}