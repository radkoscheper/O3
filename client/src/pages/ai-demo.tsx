import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import AIEnhancedImage from '@/components/ui/ai-enhanced-image';
import { useAITagging } from '@/hooks/use-ai-tagging';
import { generateUpscaledUrl, generateAspectRatioUrl } from '@/lib/cloudinary-ai-features';
import { Sparkles, Zap, Tags, Expand, Home, ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';
import Footer from '@/components/ui/footer';

const DEMO_IMAGES = [
  {
    id: 1,
    name: 'Krakow Castle',
    url: 'https://res.cloudinary.com/df3i1avwb/image/upload/v1753801852/ontdek-polen/backgrounds/header.jpg',
    description: 'Historisch kasteel in Krakow met prachtige architectuur'
  },
  {
    id: 2,
    name: 'Tatra Mountains',
    url: '/images/destinations/zakopane/header.jpg',
    description: 'Adembenemende berglandschappen in de Tatra'
  },
  {
    id: 3,
    name: 'Polish Food',
    url: '/images/activities/local-food.jpg',
    description: 'Traditionele Poolse gerechten en lokale specialiteiten'
  }
];

export default function AIDemoPage() {
  const [selectedImage, setSelectedImage] = useState(DEMO_IMAGES[0]);
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<string>('4:3');
  const [enableUpscaling, setEnableUpscaling] = useState(true);
  const [enableAutoTag, setEnableAutoTag] = useState(true);
  const [generatedTags, setGeneratedTags] = useState<string[]>([]);
  
  const { processImage, isProcessing } = useAITagging();

  const handleAIProcessed = (tags: string[], categories: string[]) => {
    setGeneratedTags(tags);
    console.log('🤖 AI Demo - Tags gegenereerd:', { tags, categories });
  };

  const handleManualTagging = async () => {
    if (!selectedImage) return;
    
    try {
      const result = await processImage(selectedImage.url, selectedImage.name);
      setGeneratedTags(result.tags.map(t => t.tag));
    } catch (error) {
      console.error('Manual tagging failed:', error);
    }
  };

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
            🤖 AI Features Demo
          </h1>
          <p className="text-base md:text-xl mb-6 md:mb-8 text-white font-croatia-body leading-relaxed px-2">
            Ontdek de kracht van AI-enhanced images voor Ontdek Polen
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
        <div className="max-w-6xl mx-auto">

        {/* Controls */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-golden" />
              AI Enhancement Controls
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Image Selection */}
            <div>
              <label className="block text-sm font-medium mb-2">Selecteer Demo Image:</label>
              <Select 
                value={selectedImage.id.toString()} 
                onValueChange={(value) => {
                  const image = DEMO_IMAGES.find(img => img.id === parseInt(value));
                  if (image) setSelectedImage(image);
                }}
              >
                <SelectTrigger className="w-full max-w-md">
                  <SelectValue placeholder="Kies een afbeelding" />
                </SelectTrigger>
                <SelectContent>
                  {DEMO_IMAGES.map((img) => (
                    <SelectItem key={img.id} value={img.id.toString()}>
                      {img.name} - {img.description}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Settings */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Aspect Ratio (Generative Fill):</label>
                <Select value={selectedAspectRatio} onValueChange={setSelectedAspectRatio}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="16:9">16:9 (Widescreen)</SelectItem>
                    <SelectItem value="4:3">4:3 (Standard)</SelectItem>
                    <SelectItem value="1:1">1:1 (Square)</SelectItem>
                    <SelectItem value="3:4">3:4 (Portrait)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-4 pt-6">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={enableUpscaling}
                    onChange={(e) => setEnableUpscaling(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">AI Upscaling</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={enableAutoTag}
                    onChange={(e) => setEnableAutoTag(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">Auto Tagging</span>
                </label>
              </div>

              <div className="pt-6">
                <Button 
                  onClick={handleManualTagging}
                  disabled={isProcessing}
                  className="bg-golden hover:bg-golden/90"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Tags className="w-4 h-4 mr-2" />
                      Run AI Tagging
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Image Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Original Image */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">📸 Originele Afbeelding</CardTitle>
            </CardHeader>
            <CardContent>
              <img
                src={selectedImage.url}
                alt={selectedImage.name}
                className="w-full h-64 object-cover rounded-lg border"
              />
              <p className="text-sm text-gray-600 mt-2">
                Standaard afbeelding zonder AI enhancements
              </p>
            </CardContent>
          </Card>

          {/* AI Enhanced Image */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Zap className="w-5 h-5 text-golden" />
                AI Enhanced Afbeelding
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AIEnhancedImage
                src={selectedImage.url}
                alt={selectedImage.name}
                aiPreset="auto"
                upscale={enableUpscaling}
                aspectRatio={selectedAspectRatio}
                autoTag={enableAutoTag}
                onAIProcessed={handleAIProcessed}
                className="w-full h-64 object-cover rounded-lg border"
                priority={true}
                lazy={false}
              />
              <div className="mt-2 space-y-1">
                <div className="flex items-center gap-2 text-sm">
                  {enableUpscaling && (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                      <Expand className="w-3 h-3 mr-1" />
                      AI Upscaling
                    </Badge>
                  )}
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    Generative Fill {selectedAspectRatio}
                  </Badge>
                  {enableAutoTag && (
                    <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                      <Tags className="w-3 h-3 mr-1" />
                      Auto Tags
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Generated Tags */}
        {generatedTags.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tags className="w-5 h-5 text-purple-500" />
                AI Generated Tags
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {generatedTags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="border-purple-200 text-purple-700">
                    {tag}
                  </Badge>
                ))}
              </div>
              <p className="text-sm text-gray-600 mt-4">
                Deze tags zijn automatisch gegenereerd door AI en kunnen gebruikt worden voor SEO, 
                zoekfunctionaliteit, en content categorisering.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Feature Explanation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Expand className="w-5 h-5 text-blue-500" />
                AI Upscaling
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Schaalt kleine afbeeldingen op naar hogere resoluties zonder kwaliteitsverlies. 
                Perfect voor oude foto's of thumbnails die groter moeten worden.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-green-500" />
                Generative Fill
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Vult afbeeldingen aan met AI-gegenereerde content om andere aspect ratios te maken. 
                Ideaal voor social media posts of verschillende display formats.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Tags className="w-5 h-5 text-purple-500" />
                Auto Tagging
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Detecteert automatisch objecten, locaties, en activiteiten in afbeeldingen. 
                Verbetert SEO en maakt content beter doorzoekbaar.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}