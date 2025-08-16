import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Home, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import Footer from "@/components/ui/footer";

export default function NotFound() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f8f6f1" }}>
      {/* Hero Section - Consistent with Homepage */}
      <section 
        className="relative text-white py-12 md:py-16 px-4 md:px-5 text-center h-[50vh] md:h-[70vh] flex items-center justify-center"
        style={{
          backgroundImage: "url('/images/backgrounds/header.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }}
      >
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-navy-dark/40 via-navy-dark/20 to-navy-dark/60 z-10"></div>
        
        <div className="relative z-20 max-w-3xl mx-auto text-center">
          <div className="flex justify-center mb-4">
            <AlertCircle className="h-16 w-16 text-white" />
          </div>
          <h1 className="text-3xl md:text-6xl font-playfair font-bold mb-3 md:mb-4 text-white leading-tight">
            404 - Pagina Niet Gevonden
          </h1>
          <p className="text-base md:text-xl mb-6 md:mb-8 text-white font-croatia-body leading-relaxed px-2">
            Deze pagina bestaat niet of is verplaatst
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center mt-6 md:mt-12 px-4">
            <Link href="/">
              <Button
                className="py-4 md:py-5 px-8 md:px-10 text-base md:text-lg font-playfair font-medium bg-navy-dark hover:bg-navy-medium text-white rounded-full transition-all duration-500 border-2 border-navy-dark hover:border-navy-medium hover:scale-105"
              >
                <Home className="w-4 md:w-5 h-4 md:h-5 mr-2 md:mr-3" />
                Terug naar Home
              </Button>
            </Link>
            <Button
              onClick={() => window.history.back()}
              className="py-4 md:py-5 px-8 md:px-10 text-base md:text-lg font-playfair font-medium bg-white/10 hover:bg-white/20 border-2 border-white/40 text-white rounded-full transition-all duration-500 hover:scale-105"
              variant="outline"
            >
              <ArrowLeft className="w-4 md:w-5 h-4 md:h-5 mr-2 md:mr-3" />
              Vorige Pagina
            </Button>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}
