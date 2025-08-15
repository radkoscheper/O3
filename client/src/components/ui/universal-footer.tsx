import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { Link } from "wouter";

interface UniversalFooterProps {
  siteName?: string;
  siteDescription?: string;
  showAdminLink?: boolean;
}

export default function UniversalFooter({ 
  siteName = "Ontdek Polen", 
  siteDescription = "Jouw gids voor het ontdekken van de mooiste plekken in Polen.",
  showAdminLink = true 
}: UniversalFooterProps) {
  return (
    <footer className="bg-navy-dark text-white py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-12">
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="h-10 w-10 bg-gold-accent rounded-full flex items-center justify-center">
                <span className="text-navy-dark font-playfair font-bold text-lg">P</span>
              </div>
              <span className="font-playfair font-semibold text-xl">
                {siteName}
              </span>
            </div>
            <p className="font-croatia-body text-white/80 leading-relaxed">
              {siteDescription}
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
              {showAdminLink && (
                <li><Link href="/admin" className="text-white/80 hover:text-gold-accent transition-colors">Admin</Link></li>
              )}
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/20 mt-12 pt-8 text-center">
          <p className="font-croatia-body text-white/60">
            © 2025 {siteName}. Alle rechten voorbehouden.
          </p>
        </div>
      </div>
    </footer>
  );
}