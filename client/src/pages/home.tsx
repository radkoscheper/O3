import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Calendar, ArrowRight, Star, Clock, Users } from "lucide-react";
import TravelSlider from "@/components/TravelSlider";
import { useQuery } from "@tanstack/react-query";
import StructuredData from "@/components/StructuredData";
import OpenGraphMeta from "@/components/OpenGraphMeta";

interface Destination {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: string;
  alt: string;
  region?: string;
  highlights?: string[];
}

interface Guide {
  id: number;
  title: string;
  description: string;
  image: string;
  alt: string;
  link?: string;
}

interface Page {
  id: number;
  title: string;
  slug: string;
  metaDescription: string;
  featured: boolean;
  template: string;
  createdAt: string;
}

interface Activity {
  id: number;
  name: string;
  location: string;
  description: string;
  image: string;
  alt: string;
  category: string;
}

interface SiteSettings {
  id: number;
  siteName: string;
  siteDescription: string;
  backgroundImage?: string;
  backgroundImageAlt?: string;
  showDestinations?: boolean;
  showGuides?: boolean;
  showActivities?: boolean;
  showPages?: boolean;
  socialMediaImage?: string;
  metaKeywords?: string;
}

interface SearchConfig {
  id: number;
  placeholderText: string;
  scope: string;
  showCategories: boolean;
}

interface MotivationSection {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  isActive: boolean;
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const { data: siteSettings } = useQuery<SiteSettings>({
    queryKey: ['/api/site-settings']
  });

  const { data: searchConfig } = useQuery<SearchConfig>({
    queryKey: ['/api/search-configs']
  });

  const { data: publishedDestinations = [] } = useQuery<Destination[]>({
    queryKey: ['/api/destinations/homepage']
  });

  const { data: publishedGuides = [] } = useQuery<Guide[]>({
    queryKey: ['/api/guides/homepage']
  });

  const { data: publishedPages = [] } = useQuery<Page[]>({
    queryKey: ['/api/pages']
  });

  const { data: publishedActivities = [] } = useQuery<Activity[]>({
    queryKey: ['/api/activities']
  });

  const { data: motivation } = useQuery<MotivationSection>({
    queryKey: ['/api/motivation']
  });

  const { data: motivationImageLocation } = useQuery<{locationName: string}>({
    queryKey: ['/api/motivation/image-location']
  });

  // Homepage analytics tracking functions
  const trackHomepageView = () => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'page_view', {
        page_title: 'Homepage',
        page_location: window.location.href,
        custom_parameter: 'homepage_load'
      });
    }
  };

  const trackHomepageInteraction = (action: string, element: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'homepage_interaction', {
        action: action,
        element: element,
        page_location: window.location.href
      });
    }
  };

  const trackDestinationView = (destinationName: string, source: string = 'homepage') => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'destination_view', {
        destination_name: destinationName,
        source: source,
        page_location: window.location.href
      });
    }
  };

  const trackGuideView = (guideTitle: string, source: string = 'homepage') => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'guide_view', {
        guide_title: guideTitle,
        source: source,
        page_location: window.location.href
      });
    }
  };

  const trackSearchPerformed = (query: string, resultsCount: number) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'search', {
        search_term: query,
        results_count: resultsCount,
        page_location: window.location.href
      });
    }
  };

  useEffect(() => {
    trackHomepageView();
  }, []);

  // Dynamic SEO title based on current page
  useEffect(() => {
    const title = `${siteSettings?.siteName || 'Ontdek Polen'}`;
    document.title = title;
    console.log('🔍 Updating dynamic SEO tags for:', '/', title);
  }, [siteSettings]);

  const performSearch = async (query: string) => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    try {
      const scope = searchConfig?.scope || 'homepage';
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&scope=${scope}`);
      const results = await response.json();
      
      setSearchResults(results);
      trackSearchPerformed(query, results.length);
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults([]);
      trackSearchPerformed(query, 0);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Search submitted:', searchQuery);
      performSearch(searchQuery);
      setShowSearchResults(true);
      trackHomepageInteraction('search_submitted', 'search_form');
    }
  };

  const closeSearch = () => {
    setShowSearchResults(false);
    setSearchResults([]);
    trackHomepageInteraction('search_closed', 'search_overlay');
  };

  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'destination':
        return 'bg-blue-100 text-blue-800';
      case 'guide':
        return 'bg-green-100 text-green-800';
      case 'page':
        return 'bg-purple-100 text-purple-800';
      case 'activity':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'destination':
        return 'Bestemming';
      case 'guide':
        return 'Gids';
      case 'page':
        return 'Pagina';
      case 'activity':
        return 'Activiteit';
      default:
        return 'Onbekend';
    }
  };

  const handlePlanTrip = () => {
    console.log('Plan trip clicked');
    trackHomepageInteraction('plan_trip_clicked', 'hero_button');
    // TODO: Implement trip planning functionality
  };

  const handleReadGuides = () => {
    console.log('Read guides clicked');
    trackHomepageInteraction('read_guides_clicked', 'hero_button');
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
        {/* Gradient Overlay */}
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
                className="py-3 md:py-4 px-4 md:px-6 w-full border border-white/20 rounded-full text-sm md:text-base text-navy-dark font-croatia-body bg-white/90 hover:bg-white transition-all duration-300 focus:border-gold-accent focus:ring-1 focus:ring-gold-accent/30"
              />
              <Search 
                className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5 cursor-pointer" 
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
          <div 
            className="absolute top-80 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-2xl p-6 max-w-2xl w-full mx-4 max-h-96 overflow-y-auto border-2 border-gold-accent/30"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 font-playfair">
                Zoekresultaten{searchQuery && ` voor "${searchQuery}"`}
              </h3>
              <button 
                onClick={closeSearch}
                className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
              >
                ×
              </button>
            </div>
            
            {isSearching ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy-dark mx-auto"></div>
                <p className="mt-4 text-gray-600 font-croatia-body">Zoeken...</p>
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
                        <h4 className="font-medium text-gray-900 font-playfair">{result.title || result.name}</h4>
                        {result.excerpt && (
                          <p className="text-sm text-gray-600 mt-1 font-croatia-body">{result.excerpt}</p>
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
                <p className="text-gray-600 font-croatia-body">Geen resultaten gevonden voor "{searchQuery}"</p>
                <p className="text-sm text-gray-500 mt-2 font-croatia-body">Probeer een andere zoekterm</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Destinations Section - Luxury WebsiteBuilder Design */}
      {siteSettings?.showDestinations && (
        <section className="py-4 px-5 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-6">
              <h2 className="text-4xl md:text-6xl font-playfair font-bold mb-4 text-navy-dark tracking-wide">
                Populaire Bestemmingen
              </h2>
              <p className="text-xl md:text-2xl text-navy-medium font-croatia-body max-w-3xl mx-auto leading-relaxed">
                Ontdek de verborgen schatten van Polen
              </p>
            </div>
            
            <TravelSlider
              visibleItems={{ mobile: 1, tablet: 2, desktop: 3 }}
              showNavigation={true}
              className="mx-auto"
            >
              {publishedDestinations.map((destination) => {
                const CardContent = (
                  <Card className="group overflow-hidden bg-white shadow-luxury hover:shadow-luxury-xl transition-all duration-500 border-0 rounded-2xl mx-2">
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={destination.image}
                        alt={destination.alt}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                      />
                    </div>
                    <div className="p-8">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-playfair font-bold text-2xl text-navy-dark leading-tight">
                          {destination.name}
                        </h3>
                        {destination.region && (
                          <span className="bg-gold-accent/20 text-gold-dark px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ml-2">
                            {destination.region}
                          </span>
                        )}
                      </div>
                      <p className="font-croatia-body text-navy-medium mb-6 leading-relaxed text-base">
                        {destination.description}
                      </p>
                      {destination.highlights && (
                        <div className="flex flex-wrap gap-2 mb-6">
                          {destination.highlights.slice(0, 3).map((highlight, index) => (
                            <span key={index} className="bg-navy-light/10 text-navy-dark px-2 py-1 rounded text-xs font-medium">
                              {highlight}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="inline-flex items-center justify-center bg-gold-accent hover:bg-gold-light text-navy-dark font-playfair font-bold px-6 py-3 rounded-full transition-all duration-300 hover:scale-105 shadow-luxury hover:shadow-gold text-base cursor-pointer">
                        Ontdek Meer <ArrowRight className="w-4 h-4 ml-2" />
                      </div>
                    </div>
                  </Card>
                );

                return (
                  <Link 
                    key={destination.id} 
                    href={`/${destination.slug}`}
                    onClick={() => {
                      trackDestinationView(destination.name, 'homepage');
                      trackHomepageInteraction('destination_clicked', 'destination_card');
                    }}
                  >
                    {CardContent}
                  </Link>
                );
              })}
            </TravelSlider>

            <div className="text-center mt-12">
              <Link href="/ontdek-meer">
                <Button 
                  className="bg-navy-dark hover:bg-navy-medium text-white font-playfair font-bold px-8 py-4 rounded-full text-lg transition-all duration-300 hover:scale-105 shadow-luxury hover:shadow-navy-dark/25"
                  onClick={() => trackHomepageInteraction('view_all_destinations', 'destinations_section')}
                >
                  Bekijk Alle Bestemmingen
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Activities Section - Luxury WebsiteBuilder Design */}
      {siteSettings?.showActivities && (
        <section className="py-4 px-5" style={{ backgroundColor: "#f8f6f1" }}>
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-6">
              <h2 className="text-4xl md:text-6xl font-playfair font-bold mb-4 text-navy-dark tracking-wide">
                Unieke Ervaringen
              </h2>
              <p className="text-xl md:text-2xl text-navy-medium font-croatia-body max-w-3xl mx-auto leading-relaxed">
                Belevenissen die je nooit zult vergeten
              </p>
            </div>
            
            <TravelSlider
              visibleItems={{ mobile: 1, tablet: 2, desktop: 3 }}
              showNavigation={true}
              className="mx-auto"
            >
              {publishedActivities.map((activity) => (
                <Card key={activity.id} className="group overflow-hidden bg-white shadow-luxury hover:shadow-luxury-xl transition-all duration-500 border-0 rounded-2xl mx-2">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={activity.image}
                      alt={activity.alt}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                  </div>
                  <div className="p-8">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-playfair font-bold text-2xl text-navy-dark leading-tight">
                        {activity.name}
                      </h3>
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ml-2">
                        {activity.category}
                      </span>
                    </div>
                    <p className="font-croatia-body text-navy-medium mb-4 leading-relaxed text-base">
                      {activity.description}
                    </p>
                    <div className="flex items-center text-sm text-navy-medium mb-6">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>{activity.location}</span>
                    </div>
                    <div className="inline-flex items-center justify-center bg-gold-accent hover:bg-gold-light text-navy-dark font-playfair font-bold px-6 py-3 rounded-full transition-all duration-300 hover:scale-105 shadow-luxury hover:shadow-gold text-base cursor-pointer">
                      Meer Info <ArrowRight className="w-4 h-4 ml-2" />
                    </div>
                  </div>
                </Card>
              ))}
            </TravelSlider>
          </div>
        </section>
      )}

      {/* Motivation Section */}
      {motivation?.isActive && (
        <section className="py-16 px-5 bg-navy-dark text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-6xl font-playfair font-bold mb-6 text-white">
              {motivation.title}
            </h2>
            <h3 className="text-xl md:text-2xl font-croatia-body mb-8 text-gold-light">
              {motivation.subtitle}
            </h3>
            <p className="text-lg md:text-xl font-croatia-body leading-relaxed mb-12 text-white/90 max-w-3xl mx-auto">
              {motivation.description}
            </p>
            
            {motivationImageLocation && (
              <div className="mb-8 text-sm text-white/70 font-croatia-body">
                📍 Gefotografeerd in {motivationImageLocation.locationName}
              </div>
            )}

            <Link href={motivation.buttonLink}>
              <Button 
                className="bg-gold-accent hover:bg-gold-light text-navy-dark font-playfair font-bold px-8 py-4 rounded-full text-lg transition-all duration-300 hover:scale-105 shadow-luxury hover:shadow-gold"
                onClick={() => trackHomepageInteraction('motivation_button', 'motivation_section')}
              >
                {motivation.buttonText}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </section>
      )}

      {/* Pages Section - Only show if there are published pages */}
      {siteSettings?.showPages && publishedPages.length > 0 && (
        <section className="py-4 px-5" style={{ backgroundColor: "#f8f6f1" }}>
          <div className="text-center mb-6">
            <h2 className="text-4xl md:text-6xl font-playfair font-bold mb-4 text-navy-dark tracking-wide">
              Ontdek Meer
            </h2>
            <p className="text-xl md:text-2xl text-navy-medium font-croatia-body max-w-3xl mx-auto leading-relaxed">
              Verdiep je in de rijke geschiedenis en cultuur
            </p>
          </div>
          <div className="text-center mb-8">
            <Link href="/ontdek-meer">
              <Button className="bg-navy-dark hover:bg-navy-medium text-white font-playfair font-bold px-6 py-3 rounded-full transition-all duration-300 hover:scale-105 shadow-luxury hover:shadow-navy-dark/25">
                <ArrowRight className="w-4 h-4 mr-2" />
                Alle Pagina's
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {publishedPages.map((page) => (
              <Link href={`/${page.slug}`} key={page.id}>
                <Card className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 border-none cursor-pointer">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-bold font-playfair text-gray-900">
                        {page.title}
                      </h3>
                      {page.featured && (
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                          Uitgelicht
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm mb-4 font-croatia-body">
                      {page.metaDescription}
                    </p>
                    <div className="flex items-center text-xs text-gray-500">
                      <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded">
                        {page.template}
                      </span>
                      <span className="ml-2">
                        {new Date(page.createdAt).toLocaleDateString('nl-NL')}
                      </span>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Travel Guides - Luxury WebsiteBuilder Design */}
      {siteSettings?.showGuides && (
        <section className="py-4 px-5 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-6">
              <h2 className="text-4xl md:text-6xl font-playfair font-bold mb-4 text-navy-dark tracking-wide">
                Reizen en Tips
              </h2>
              <p className="text-xl md:text-2xl text-navy-medium font-croatia-body max-w-3xl mx-auto leading-relaxed">
                Expertadvies voor jouw Polen avontuur
              </p>
            </div>
            
            <TravelSlider
              visibleItems={{ mobile: 1, tablet: 2, desktop: 2 }}
              showNavigation={true}
              className="mx-auto"
            >
              {publishedGuides.map((guide: any) => {
                const CardContent = (
                  <Card className="group overflow-hidden bg-white shadow-luxury hover:shadow-luxury-xl transition-all duration-500 border-0 rounded-2xl mx-2">
                    <div className="aspect-[5/3] overflow-hidden">
                      <img
                        src={guide.image}
                        alt={guide.alt}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                      />
                    </div>
                    <div className="p-8">
                      <h3 className="font-playfair font-bold text-2xl text-navy-dark mb-3 leading-tight">
                        {guide.title}
                      </h3>
                      <p className="font-croatia-body text-navy-medium mb-6 leading-relaxed text-base">
                        {guide.description}
                      </p>
                      <div className="inline-flex items-center justify-center bg-gold-accent hover:bg-gold-light text-navy-dark font-playfair font-bold px-6 py-3 rounded-full transition-all duration-300 hover:scale-105 shadow-luxury hover:shadow-gold text-base cursor-pointer">
                        Lees Meer
                      </div>
                    </div>
                  </Card>
                );

              // If guide has a link, wrap in Link component or external link
              if (guide.link) {
                // Check if it's an external link (starts with http)
                if (guide.link.startsWith('http')) {
                  return (
                    <a
                      key={guide.id}
                      href={guide.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {CardContent}
                    </a>
                  );
                } else {
                  // Internal link
                  return (
                    <Link key={guide.id} href={guide.link}>
                      {CardContent}
                    </Link>
                  );
                }
              }

                // No link, just return the card
                return <div key={guide.id}>{CardContent}</div>;
              })}
            </TravelSlider>
          </div>
        </section>
      )}

      {/* Footer */}
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
                {siteSettings?.siteDescription || 'Jouw gids voor het ontdekken van de mooiste plekken in Polen.'}
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