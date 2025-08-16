import React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Home, 
  MapPin, 
  Users, 
  Calendar, 
  Settings, 
  BookOpen,
  Camera,
  Mountain,
  Coffee,
  Plane,
  ArrowLeft
} from 'lucide-react';
import { Link } from 'wouter';
import Footer from '@/components/ui/footer';

export function SidebarDemo() {
  const navItems = [
    { title: 'Dashboard', icon: Home, url: '#' },
    { title: 'Bestemmingen', icon: MapPin, url: '#' },
    { title: 'Reisgidsen', icon: BookOpen, url: '#' },
    { title: 'Activiteiten', icon: Mountain, url: '#' },
    { title: 'Fotogalerij', icon: Camera, url: '#' },
  ];

  const planningItems = [
    { title: 'Mijn Reizen', icon: Calendar, url: '#' },
    { title: 'Favorieten', icon: Coffee, url: '#' },
    { title: 'Boekingen', icon: Plane, url: '#' },
  ];

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
          <h1 className="text-3xl md:text-6xl font-playfair font-bold mb-3 md:mb-4 text-white leading-tight">
            Sidebar Demo
          </h1>
          <p className="text-base md:text-xl mb-6 md:mb-8 text-white font-croatia-body leading-relaxed px-2">
            Ontdek de sidebar component functionaliteit
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

      <div className="py-12 px-4">
        <SidebarProvider defaultOpen={true}>
          <div className="flex min-h-screen max-w-6xl mx-auto">
            <Sidebar variant="inset" className="border-r">
              <SidebarHeader className="p-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">OP</span>
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">Ontdek Polen</h2>
                    <p className="text-sm text-muted-foreground">Travel Admin</p>
                  </div>
                </div>
              </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <a href={item.url} className="flex items-center space-x-2">
                          <item.icon className="w-4 h-4" />
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Reisplanning</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {planningItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <a href={item.url} className="flex items-center space-x-2">
                          <item.icon className="w-4 h-4" />
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Account</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a href="#" className="flex items-center space-x-2">
                        <Users className="w-4 h-4" />
                        <span>Profiel</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a href="#" className="flex items-center space-x-2">
                        <Settings className="w-4 h-4" />
                        <span>Instellingen</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="p-4">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <div className="w-6 h-6 bg-green-500 rounded-full"></div>
              <span>Online</span>
            </div>
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>

        <SidebarInset>
          <header className="flex h-16 items-center gap-2 px-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <SidebarTrigger className="-ml-1" />
            <div className="flex-1">
              <h1 className="text-xl font-semibold">Sidebar Component Demo</h1>
            </div>
          </header>

          <main className="flex-1 space-y-6 p-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight">Welkom bij de Sidebar Demo</h2>
              <p className="text-muted-foreground">
                Dit is een volledig functionele sidebar component met collapsible functies.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Bestemmingen</CardTitle>
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">40</div>
                  <p className="text-xs text-muted-foreground">+2 deze maand</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Reisgidsen</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground">+1 deze week</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Activiteiten</CardTitle>
                  <Mountain className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">93</div>
                  <p className="text-xs text-muted-foreground">+5 deze week</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Bezoekers</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2.4K</div>
                  <p className="text-xs text-muted-foreground">+10% vs vorige maand</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Sidebar Features</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Collapsible design</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Mobile responsive</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Keyboard shortcuts (Ctrl/Cmd + B)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">State persistence</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Dark mode support</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Usage Instructions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    • Klik op de hamburger menu om de sidebar te openen/sluiten
                  </p>
                  <p className="text-sm text-muted-foreground">
                    • Gebruik Ctrl/Cmd + B als keyboard shortcut
                  </p>
                  <p className="text-sm text-muted-foreground">
                    • Op mobile wordt de sidebar als overlay getoond
                  </p>
                  <p className="text-sm text-muted-foreground">
                    • De staat wordt bewaard in cookies voor volgende bezoeken
                  </p>
                </CardContent>
              </Card>
            </div>
          </main>
        </SidebarInset>
          </div>
        </SidebarProvider>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}