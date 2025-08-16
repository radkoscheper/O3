import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Search, Settings, ArrowLeft, MapPin } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import TravelSlider from "@/components/ui/travel-slider";
import Footer from "@/components/ui/footer";
import type { SiteSettings } from "@shared/schema";

export default function OntdekMeer() {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Fetch destinations and guides from API (homepage specific) with proper typing
  const { data: destinations = [], isLoading: destinationsLoading } = useQuery<any[]>({
    queryKey: ["/api/destinations/homepage"],
  });
  
  const { data: guides = [], isLoading: guidesLoading } = useQuery<any[]>({
    queryKey: ["/api/guides/homepage"],
  });

  const { data: pages = [], isLoading: pagesLoading } = useQuery<any[]>({
    queryKey: ["/api/pages"],
  });

  // Fetch highlights from database with proper typing
  const { data: highlights = [], isLoading: highlightsLoading } = useQuery<any[]>({
    queryKey: ["/api/highlights"],
  });

  // Fetch site settings with proper typing
  const { data: siteSettings, isLoading: settingsLoading } = useQuery<SiteSettings>({
    queryKey: ["/api/site-settings"],
  });

  // Update document title and meta tags when site settings change - CHANGED FOR ONTDEK MEER
  useEffect(() => {
    // Changed title for Ontdek Meer page
    document.title = "Ontdek Meer - Ontdek Polen";
    
    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', "Ontdek alle bestemmingen, reisgidsen en tips voor je reis naar Polen op één plek");
    
    if (siteSettings) {
      // Update meta keywords
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.setAttribute('name', 'keywords');
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute('content', (siteSettings as any)?.metaKeywords || "Polen, reizen, vakantie, bestemmingen");
      
      // Update favicon - handle enabled/disabled state
      const existingFavicon = document.querySelector('link[rel="icon"]');
      
      if ((siteSettings as any)?.faviconEnabled === true && (siteSettings as any)?.favicon) {
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
      if ((siteSettings as any)?.customCSS) {
        let customStyle = document.querySelector('#custom-site-css');
        if (!customStyle) {
          customStyle = document.createElement('style');
          customStyle.id = 'custom-site-css';
          document.head.appendChild(customStyle);
        }
        customStyle.textContent = (siteSettings as any).customCSS;
      }
      
      // Add custom JavaScript
      if ((siteSettings as any)?.customJS) {
        let customScript = document.querySelector('#custom-site-js');
        if (!customScript) {
          customScript = document.createElement('script');
          customScript.id = 'custom-site-js';
          document.head.appendChild(customScript);
        }
        customScript.textContent = (siteSettings as any).customJS;
      }
      
      // Add Google Analytics
      if ((siteSettings as any)?.googleAnalyticsId) {
        let gaScript = document.querySelector('#google-analytics');
        if (!gaScript) {
          gaScript = document.createElement('script');
          gaScript.id = 'google-analytics';
          (gaScript as any).async = true;
          (gaScript as any).src = `https://www.googletagmanager.com/gtag/js?id=${(siteSettings as any).googleAnalyticsId}`;
          document.head.appendChild(gaScript);
          
          const gaConfig = document.createElement('script');
          gaConfig.textContent = `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${(siteSettings as any).googleAnalyticsId}');
          `;
          document.head.appendChild(gaConfig);
        }
      }
    }
  }, [siteSettings]);

  // Filter only published destinations
  const publishedDestinations = destinations.filter((destination: any) => destination.published);
  
  // Filter only published guides
  const publishedGuides = guides.filter((guide: any) => guide.published);
  
  // Filter only published pages
  const publishedPages = pages.filter((page: any) => page.published);
  
  // Show loading state
  if (destinationsLoading || guidesLoading || pagesLoading || highlightsLoading || settingsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#f8f6f1" }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg">Laden...</p>
        </div>
      </div>
    );
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
    // TODO: Implement search functionality
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
      {/* Hero Section - Consistent with Homepage */}
      <section 
        className="relative text-white py-12 md:py-16 px-4 md:px-5 text-center h-[50vh] md:h-[70vh] flex items-center justify-center"
        style={{
          backgroundImage: (siteSettings as any)?.backgroundImage 
            ? `url('${(siteSettings as any).backgroundImage}')` 
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
            Ontdek Meer
          </h1>
          <p className="text-base md:text-xl mb-6 md:mb-8 text-white font-croatia-body leading-relaxed px-2">
            Alle bestemmingen, reisgidsen en tips voor je reis naar Polen
          </p>
          
          <form onSubmit={handleSearch} className="mt-4 md:mt-6 mb-4 md:mb-6 relative">
            <div className="relative inline-block w-full max-w-md mx-auto">
              <Input
                type="text"
                placeholder="Zoek je perfecte bestemming in Polen..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="py-3 md:py-4 px-4 md:px-6 w-full border border-white/20 rounded-full text-sm md:text-base text-navy-dark font-croatia-body bg-white/90 hover:bg-white transition-all duration-300 focus:border-gold-accent focus:ring-1 focus:ring-gold-accent/30"
              />
              <Search className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5 cursor-pointer" />
            </div>
          </form>
          
          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center mt-6 md:mt-12 px-4">
            <Link href="/">
              <Button
                className="py-4 md:py-5 px-8 md:px-10 text-base md:text-lg font-playfair font-medium bg-navy-dark hover:bg-navy-medium text-white rounded-full transition-all duration-500 border-2 border-navy-dark hover:border-navy-medium hover:scale-105"
              >
                <ArrowLeft className="w-4 md:w-5 h-4 md:h-5 mr-2 md:mr-3" />
                Terug naar Home
              </Button>
            </Link>
            <Button
              className="py-4 md:py-5 px-8 md:px-10 text-base md:text-lg font-playfair font-medium bg-white/10 hover:bg-white/20 border-2 border-white/40 text-white rounded-full transition-all duration-500 hover:scale-105"
              variant="outline"
            >
              <MapPin className="w-4 md:w-5 h-4 md:h-5 mr-2 md:mr-3" />
              Verken alles
            </Button>
          </div>
        </div>
      </section>

      {/* Destination Grid - Travel Slider Implementation */}
      <section className="py-16 px-5 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 font-playfair text-gray-900">
          Alle Bestemmingen
        </h2>
        <TravelSlider
          visibleItems={{ mobile: 1, tablet: 2, desktop: 4 }}
          showNavigation={true}
          className="mx-auto"
        >
          {publishedDestinations.map((destination: any) => {
            const CardContent = (
              <Card 
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 border-none cursor-pointer"
              >
                <img
                  src={destination.image}
                  alt={destination.alt}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4 font-bold font-playfair text-gray-900">
                  {destination.name}
                </div>
              </Card>
            );

            // If destination has a link, wrap in Link component or external link
            if (destination.link) {
              // Check if it's an external link (starts with http)
              if (destination.link.startsWith('http')) {
                return (
                  <a
                    key={destination.id}
                    href={destination.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {CardContent}
                  </a>
                );
              } else {
                // Internal link
                return (
                  <Link key={destination.id} href={destination.link}>
                    {CardContent}
                  </Link>
                );
              }
            }

            // No link, just return the card
            return <div key={destination.id}>{CardContent}</div>;
          })}
        </TravelSlider>
      </section>

      {/* Highlights Section - From Database - EXACT SAME AS HOMEPAGE */}
      {highlights.length > 0 && (
        <section className="py-16 px-5 max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 font-playfair text-gray-900">
            Hoogtepunten van Polen
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {highlights.map((highlight) => (
              <div key={highlight.id} className="bg-white rounded-xl p-4 shadow-lg hover:shadow-xl transition-shadow duration-300 border-none cursor-pointer text-center">
                <img
                  src={highlight.iconPath}
                  alt={highlight.name}
                  className="w-16 h-16 mx-auto mb-3"
                  onError={(e) => {
                    e.currentTarget.src = '/images/highlights/placeholder.svg';
                  }}
                />
                <h3 className="font-bold font-playfair text-gray-900 text-sm">
                  {highlight.name}
                </h3>
                {highlight.category !== 'general' && (
                  <p className="text-xs text-gray-500 mt-1 capitalize">
                    {highlight.category}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CTA Section - EXACT SAME AS HOMEPAGE */}
      <section className="py-16 px-5 max-w-6xl mx-auto">
        <div className="flex flex-wrap gap-8 items-center justify-between">
          <div className="flex-1 min-w-80">
            <h2 className="text-3xl font-bold mb-4 font-playfair text-gray-900">
              Laat je verrassen door het onbekende Polen
            </h2>
            <p className="text-lg mb-6 font-croatia-body text-gray-700">
              Bezoek historische steden, ontdek natuurparken en verborgen parels. 
              Onze reizen helpen je op weg!
            </p>
            <Button
              onClick={handleReadGuides}
              className="py-3 px-6 text-base font-croatia-body hover:opacity-90 transition-all duration-200"
              style={{ backgroundColor: "#2f3e46" }}
            >
              Lees onze reizen
            </Button>
          </div>
          <div className="flex-1 min-w-80">
            <img
              src="/images/tatra-vallei.jpg"
              alt="Tatra Valley"
              className="w-full rounded-xl shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Published Pages - EXACT SAME AS HOMEPAGE */}
      {publishedPages.length > 0 && (
        <section className="py-16 px-5 max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold font-playfair text-gray-900">
              Ontdek Meer
            </h2>
            <Link href="/ontdek-meer">
              <Button
                variant="outline"
                className="text-gray-900 border-gray-300 hover:bg-gray-100"
              >
                Bekijk Alles
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

      {/* Travel Guides - EXACT SAME AS HOMEPAGE */}
      <section className="py-16 px-5 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 font-playfair text-gray-900">
          Reizen en Tips
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {publishedGuides.map((guide) => {
            const CardContent = (
              <Card 
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 border-none cursor-pointer"
              >
                <img
                  src={guide.image}
                  alt={guide.alt}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4 font-bold font-playfair text-gray-900">
                  {guide.title}
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
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}