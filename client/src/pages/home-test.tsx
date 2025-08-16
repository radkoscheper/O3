import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Search, Settings, MapPin, Calendar } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import TravelSlider from "@/components/ui/travel-slider";
import { DestinationImage, ThumbnailImage, HeroImage } from "@/components/ui/optimized-image";
import { HeroImageOptimized, DestinationImageOptimized } from "@/components/ui/optimized-image-enhanced";
import AIEnhancedImage from "@/components/ui/ai-enhanced-image";
import StructuredData from "@/components/ui/structured-data";
import OpenGraphMeta from "@/components/ui/open-graph-meta";
import { useSEO } from "@/hooks/use-seo";
import { usePerformanceMonitoring, useConnectionMonitoring } from "@/hooks/use-performance";
import { usePerformanceOptimizations } from "@/hooks/use-performance-optimization";
import { trackSearch, trackHomepageInteraction, trackDestinationView, trackGuideView } from "../../lib/analytics";
import type { SiteSettings, SearchConfig, SelectMotivation, Activity } from "@shared/schema";

export default function HomeTest() {
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  
  // Hooks must be called in consistent order
  useSEO();
  usePerformanceMonitoring();
  useConnectionMonitoring();
  usePerformanceOptimizations();
  
  // Close search handler that preserves ability to re-search
  const closeSearch = () => {
    console.log('Closing search overlay');
    setShowSearchResults(false);
    setIsSearching(false);
    // Keep searchQuery and searchResults so user can re-open same search
  };

  // Helper function to get type-specific styling for search results
  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'destination':
        return 'bg-green-100 text-green-700';
      case 'activity':
        return 'bg-green-100 text-green-700';
      case 'highlight':
        return 'bg-yellow-100 text-yellow-700';
      case 'guide':
        return 'bg-blue-100 text-blue-700';
      case 'page':
        return 'bg-purple-100 text-purple-700';
      case 'template':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-blue-100 text-blue-600';
    }
  };

  // Helper function to get user-friendly type labels
  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'destination':
        return '🏔️ Bestemmingen';
      case 'activity':
        return '🎯 Activiteiten';
      case 'highlight':
        return '✨ Hoogtepunten';
      case 'guide':
        return '📖 Reizen';
      case 'page':
        return '📄 Pagina';
      case 'template':
        return '🎨 Template';
      default:
        return type;
    }
  };
  
  // Fetch destinations and guides from API (homepage specific)
  const { data: destinations = [], isLoading: destinationsLoading } = useQuery({
    queryKey: ["/api/destinations/homepage"],
  });
  
  const { data: guides = [], isLoading: guidesLoading } = useQuery({
    queryKey: ["/api/guides/homepage"],
  });

  const { data: pages = [], isLoading: pagesLoading } = useQuery({
    queryKey: ["/api/pages"],
  });

  // Fetch featured activities from database (replaces old highlights)
  const { data: featuredActivities = [], isLoading: featuredLoading } = useQuery({
    queryKey: ["/api/activities"],
    queryFn: async () => {
      const response = await fetch('/api/activities');
      if (!response.ok) {
        throw new Error('Failed to fetch activities');
      }
      const activities = await response.json();
      // Filter for featured and published activities only
      return activities.filter((activity: any) => activity.featured === true && activity.published === true);
    },
  });

  // Fetch site settings
  const { data: siteSettings, isLoading: settingsLoading } = useQuery<SiteSettings>({
    queryKey: ["/api/site-settings"],
  });

  // Fetch search configuration for homepage context
  const { data: searchConfig } = useQuery({
    queryKey: ["/api/search-configs"],
    queryFn: async () => {
      const response = await fetch('/api/search-configs');
      if (!response.ok) throw new Error('Failed to fetch search configs');
      const configs = await response.json();
      return configs.find((config: any) => config.context === 'homepage' && config.enabled);
    },
  });

  // Fetch motivation data for CTA section
  const { data: motivationData } = useQuery<SelectMotivation>({
    queryKey: ["/api/motivation"],
  });

  // Fetch motivation image location name
  const { data: motivationImageLocation } = useQuery({
    queryKey: ["/api/motivation/image-location", motivationData?.image],
    queryFn: async () => {
      if (!motivationData?.image) return null;
      const response = await fetch(`/api/motivation/image-location?imagePath=${encodeURIComponent(motivationData.image)}`);
      if (!response.ok) throw new Error('Failed to fetch location');
      return response.json();
    },
    enabled: !!motivationData?.image,
  });

  // Update document title and meta tags when site settings change
  useEffect(() => {
    if (siteSettings) {
      document.title = siteSettings.siteName || "Ontdek Polen";
      
      // Update meta description
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute('content', siteSettings.siteDescription || "Ontdek de mooiste plekken van Polen");
      
      // Update meta keywords
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.setAttribute('name', 'keywords');
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute('content', siteSettings.metaKeywords || "Polen, reizen, vakantie, bestemmingen");
      
      // Update favicon - handle enabled/disabled state
      const existingFavicon = document.querySelector('link[rel="icon"]');
      
      if (siteSettings.faviconEnabled === true && siteSettings.favicon) {
        // Favicon enabled and has path - use server route which checks database
        if (existingFavicon) {
          existingFavicon.setAttribute('href', '/favicon.ico?' + Date.now()); // Cache bust
        } else {
          const newFavicon = document.createElement('link');
          newFavicon.setAttribute('rel', 'icon');
          newFavicon.setAttribute('href', '/favicon.ico?' + Date.now()); // Cache bust
          document.head.appendChild(newFavicon);
        }
      } else {
        // Favicon disabled - remove any existing favicon
        if (existingFavicon) {
          existingFavicon.remove();
        }
        // Force browser to not show any favicon by using empty data URL
        const emptyFavicon = document.createElement('link');
        emptyFavicon.setAttribute('rel', 'icon');
        emptyFavicon.setAttribute('href', 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=');
        document.head.appendChild(emptyFavicon);
      }
      
      // Add custom CSS
      if (siteSettings.customCSS) {
        let customStyle = document.querySelector('#custom-site-css');
        if (!customStyle) {
          customStyle = document.createElement('style');
          customStyle.id = 'custom-site-css';
          document.head.appendChild(customStyle);
        }
        customStyle.textContent = siteSettings.customCSS;
      }
      
      // Add custom JavaScript
      if (siteSettings.customJS) {
        let customScript = document.querySelector('#custom-site-js');
        if (!customScript) {
          customScript = document.createElement('script');
          customScript.id = 'custom-site-js';
          document.head.appendChild(customScript);
        }
        customScript.textContent = siteSettings.customJS;
      }
      
      // Add Google Analytics
      if (siteSettings.googleAnalyticsId) {
        let gaScript = document.querySelector('#google-analytics') as HTMLScriptElement;
        if (!gaScript) {
          gaScript = document.createElement('script') as HTMLScriptElement;
          gaScript.id = 'google-analytics';
          gaScript.async = true;
          gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${siteSettings.googleAnalyticsId}`;
          document.head.appendChild(gaScript);
          
          const gaConfig = document.createElement('script');
          gaConfig.textContent = `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${siteSettings.googleAnalyticsId}');
          `;
          document.head.appendChild(gaConfig);
        }
      }
    }
  }, [siteSettings]);

  // Filter only published destinations
  const publishedDestinations = (destinations as any[]).filter((destination: any) => destination.published);
  
  // Filter only published guides
  const publishedGuides = (guides as any[]).filter((guide: any) => guide.published);
  
  // Filter only published pages
  const publishedPages = (pages as any[]).filter((page: any) => page.published);
  
  // Loading states are handled by global LoadingScreen in App.tsx

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    // Track search analytics
    trackSearch(searchQuery, 'homepage');
    
    console.log('=== SEARCH DEBUG ===');
    console.log('Starting search for:', searchQuery);
    console.log('Current showSearchResults:', showSearchResults);
    console.log('Current searchResults length:', searchResults.length);
    console.log('Current isSearching:', isSearching);
    
    // Always perform fresh search - don't cache results
    setIsSearching(true);
    setShowSearchResults(true);
    
    try {
      const searchScope = searchConfig?.searchScope || 'destinations';
      const url = `/api/search?q=${encodeURIComponent(searchQuery)}&scope=${searchScope}`;
      console.log('Fetching URL:', url);
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('API Response:', data);
      console.log('Results count:', data.results?.length || 0);
      
      setSearchResults(data.results || []);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
      console.log('=== SEARCH COMPLETE ===');
    }
  };

  const handlePlanTrip = () => {
    console.log("Planning trip...");
    // TODO: Implement trip planning logic
  };

  const handleReadGuides = () => {
    console.log("Reading guides...");
    // TODO: Implement guide reading functionality
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f8f6f1" }}>


      {/* Structured Data for Homepage */}
      <StructuredData
        type="Website"
        title={siteSettings?.siteName || "Ontdek Polen"}
        description={siteSettings?.siteDescription || "Jouw gids voor het ontdekken van de mooiste plekken in Polen. Bezoek historische steden, nationale parken en verborgen parels van Midden-Europa."}
        url={typeof window !== 'undefined' ? window.location.href : ''}
        image={siteSettings?.socialMediaImage || (typeof window !== 'undefined' ? `${window.location.origin}/images/og-poland-travel.jpg` : '')}
        keywords={siteSettings?.metaKeywords || "Polen, reizen, bestemmingen, Krakow, Warschau, Gdansk, reistips"}
        siteName={siteSettings?.siteName || "Ontdek Polen"}
      />
      
      {/* Open Graph Meta Tags for Social Media */}
      <OpenGraphMeta
        title={siteSettings?.siteName || "Ontdek Polen"}
        description={siteSettings?.siteDescription || "Jouw gids voor het ontdekken van de mooiste plekken in Polen. Bezoek historische steden, nationale parken en verborgen parels van Midden-Europa."}
        image={siteSettings?.socialMediaImage || (typeof window !== 'undefined' ? `${window.location.origin}/images/og-poland-travel.jpg` : '')}
        url={typeof window !== 'undefined' ? window.location.href : ''}
        type="website"
        siteName={siteSettings?.siteName || "Ontdek Polen"}
      />

      {/* Hero Section - Croatia.com Inspired Optimization */}
      <section 
        className="relative text-white py-12 md:py-16 px-4 md:px-5 text-center h-[50vh] md:h-[70vh] flex items-center justify-center"
        style={{
          backgroundImage: siteSettings?.backgroundImage 
            ? `url('${siteSettings.backgroundImage}')` 
            : "url('/images/backgrounds/header.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }}
      >
        {/* Gradient Overlay - Use same as homepage */}
        <div className="absolute inset-0 bg-gradient-to-b from-navy-dark/40 via-navy-dark/20 to-navy-dark/60 z-10"></div>
        
        <div className="relative z-20 max-w-3xl mx-auto text-center">
          <h1 className="text-3xl md:text-6xl font-playfair font-bold mb-3 md:mb-4 text-white leading-tight">
            {siteSettings?.siteName || "Ontdek Polen"}
          </h1>
          <p className="text-base md:text-xl mb-6 md:mb-8 text-white font-croatia-body leading-relaxed px-2">
            {siteSettings?.siteDescription || "Van historische steden tot adembenemende natuurparken"}
          </p>
          
          <form 
            onSubmit={(e) => {
              console.log('Form submit event triggered');
              handleSearch(e);
            }} 
            className="mt-4 md:mt-6 mb-4 md:mb-6 relative"
          >
            <div className="relative inline-block w-full max-w-md mx-auto">
              <Input
                type="text"
                placeholder={searchConfig?.placeholderText || "Zoek je perfecte bestemming in Polen..."}
                value={searchQuery}
                onChange={(e) => {
                  console.log('Search input changed:', e.target.value);
                  setSearchQuery(e.target.value);
                }}
                onKeyDown={(e) => {
                  console.log('Key pressed:', e.key);
                  if (e.key === 'Enter') {
                    console.log('Enter key detected, form should submit');
                  }
                }}
                className="py-4 md:py-5 px-6 md:px-8 w-full border-2 border-white/30 rounded-full text-base md:text-lg text-navy-dark font-croatia-body bg-white/95 hover:bg-white hover:border-gold-accent transition-all duration-500 focus:border-gold-accent focus:ring-2 focus:ring-gold-accent/50"
              />
              <Search 
                className="absolute right-4 md:right-5 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 md:h-5 w-4 md:w-5 cursor-pointer" 
                onClick={() => {
                  console.log('Search icon clicked');
                  if (searchQuery.trim()) {
                    const form = document.querySelector('form');
                    if (form) {
                      form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
                    }
                  }
                }}
              />
            </div>
          </form>
          
          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center mt-6 md:mt-12 px-4">
            <Button
              onClick={handlePlanTrip}
              className="py-4 md:py-5 px-8 md:px-10 text-base md:text-lg font-playfair font-medium bg-navy-dark hover:bg-navy-medium text-white rounded-full transition-all duration-500 border-2 border-navy-dark hover:border-navy-medium hover:scale-105"
            >
              <MapPin className="w-4 md:w-5 h-4 md:h-5 mr-2 md:mr-3" />
              Plan je reis
            </Button>
            <Button
              onClick={handleReadGuides}
              className="py-4 md:py-5 px-8 md:px-10 text-base md:text-lg font-playfair font-medium bg-white/10 hover:bg-white/20 border-2 border-white/40 text-white rounded-full transition-all duration-500 hover:scale-105"
              variant="outline"
            >
              <Calendar className="w-4 md:w-5 h-4 md:h-5 mr-2 md:mr-3" />
              Lees onze gidsen
            </Button>
          </div>
        </div>
      </section>

      {/* Search Results Overlay */}
      {showSearchResults && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-40 z-50"
          onClick={closeSearch}
        >
          <div className="fixed top-20 left-1/2 transform -translate-x-1/2 w-11/12 max-w-2xl bg-white rounded-lg shadow-2xl max-h-96 overflow-y-auto">
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-navy-dark">
                  Zoekresultaten voor "{searchQuery}"
                </h3>
                <button 
                  onClick={closeSearch}
                  className="text-gray-500 hover:text-gray-700 text-xl font-bold"
                >
                  ×
                </button>
              </div>
              
              {isSearching ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Zoeken...</p>
                </div>
              ) : searchResults.length > 0 ? (
                <div className="space-y-3">
                  {searchResults.map((result: any, index: number) => (
                    <Link 
                      key={`${result.type}-${result.id || index}`} 
                      href={result.url || `/${result.slug || result.id}`}
                      className="block p-3 rounded-lg hover:bg-gray-50 border border-gray-100"
                      onClick={() => {
                        console.log('Search result clicked:', result);
                        if (result.type === 'destination') {
                          trackDestinationView(result.name || result.title, 'search');
                        } else if (result.type === 'guide') {
                          trackGuideView(result.title, 'search');
                        }
                        trackHomepageInteraction('search_result_click', result.type);
                        closeSearch();
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-navy-dark">{result.title || result.name}</h4>
                          {result.excerpt && (
                            <p className="text-sm text-gray-600 mt-1">{result.excerpt}</p>
                          )}
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ml-3 ${getTypeStyles(result.type)}`}>
                          {getTypeLabel(result.type)}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600">Geen resultaten gevonden voor "{searchQuery}"</p>
                  <p className="text-sm text-gray-500 mt-2">Probeer een andere zoekterm</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer - Exact copy from homepage */}
      <footer className="bg-navy-dark text-white py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="h-10 w-10 bg-gold-accent rounded-full flex items-center justify-center">
                  <span className="text-navy-dark font-playfair font-bold text-lg">P</span>
                </div>
                <span className="font-playfair font-semibold text-xl">
                  {siteSettings?.siteName || 'Ontdek Polen'}
                </span>
              </div>
              <p className="font-croatia-body text-white/80 leading-relaxed">
                {siteSettings?.siteDescription || 'Van historische steden tot adembenemende natuurparken'}
              </p>
            </div>
            
            <div>
              <h3 className="font-playfair font-semibold text-lg mb-6">Ontdekken</h3>
              <ul className="space-y-3 font-croatia-body">
                <li><Link href="/ontdek-meer" className="text-white/80 hover:text-gold-accent transition-colors">Alle Bestemmingen</Link></li>
                <li><Link href="#" className="text-white/80 hover:text-gold-accent transition-colors">Reisgidsen</Link></li>
                <li><Link href="#" className="text-white/80 hover:text-gold-accent transition-colors">Activiteiten</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-playfair font-semibold text-lg mb-6">Informatie</h3>
              <ul className="space-y-3 font-croatia-body">
                <li><Link href="#" className="text-white/80 hover:text-gold-accent transition-colors">Over Ons</Link></li>
                <li><Link href="#" className="text-white/80 hover:text-gold-accent transition-colors">Contact</Link></li>
                <li><Link href="/admin" className="text-white/80 hover:text-gold-accent transition-colors">Admin</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/20 mt-12 pt-8 text-center">
            <p className="font-croatia-body text-white/60">
              © 2025 {siteSettings?.siteName || 'Ontdek Polen'}. Alle rechten voorbehouden.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}