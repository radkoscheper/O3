import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { Link } from "wouter";

interface UniversalFooterProps {
  siteName?: string;
  showAdminLink?: boolean;
}

export default function UniversalFooter({ 
  siteName = "Ontdek Polen", 
  showAdminLink = true 
}: UniversalFooterProps) {
  return (
    <footer 
      className="text-center py-10 px-5 text-white relative"
      style={{ backgroundColor: "#2f3e46" }}
    >
      {/* Admin Link */}
      {showAdminLink && (
        <Link href="/admin">
          <Button 
            variant="outline" 
            size="sm"
            className="absolute top-4 right-4 text-white border-white hover:bg-white hover:text-gray-900"
          >
            <Settings className="h-4 w-4 mr-2" />
            Admin
          </Button>
        </Link>
      )}
      
      <p className="font-croatia-body">
        &copy; 2025 {siteName}. Alle rechten voorbehouden.
      </p>
    </footer>
  );
}