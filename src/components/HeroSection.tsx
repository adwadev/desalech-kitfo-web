import { Button } from "@/components/ui/button";
import { Phone, MapPin } from "lucide-react";
import heroImage from "@/assets/hero-kitfo.jpg";

const HeroSection = () => {
  return (
    <header 
      className="relative h-screen flex items-center justify-center overflow-hidden"
      itemScope 
      itemType="https://schema.org/Restaurant"
      role="banner"
      aria-label="Desalegn Kitfo Ethiopian Restaurant Hero Section"
    >
      {/* Hero Background with Ken Burns Effect */}
      <div 
        className="absolute inset-0 bg-cover bg-center animate-ken-burns"
        style={{
          backgroundImage: `url(${heroImage})`,
        }}
        role="img"
        aria-label="Traditional Ethiopian Kitfo dish served with spiced butter and injera bread"
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-coffee-brown/80 via-spiced-red/60 to-transparent" aria-hidden="true" />
      
      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <h1 
          className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold mb-6 animate-fade-up tracking-wide leading-tight"
          itemProp="name"
        >
          Desalegn Kitfo
        </h1>
        
        <p 
          className="text-lg sm:text-xl md:text-2xl mb-8 animate-fade-up font-light tracking-wide delay-200 px-4"
          itemProp="slogan"
          role="text"
          aria-label="Restaurant tagline"
        >
          "Tradition Served Raw, Spiced with Soul."
        </p>
        
        <nav 
          className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-up delay-400 px-4"
          role="navigation"
          aria-label="Primary restaurant actions"
        >
          <Button 
            size="lg" 
            variant="hero"
            className="px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg font-semibold w-full sm:w-auto"
            onClick={() => window.open('tel:+251911231859')}
            itemProp="telephone"
            content="+251911231859"
            aria-label="Call Desalegn Kitfo restaurant to make a reservation at +251911231859"
            type="button"
          >
            <Phone className="mr-2 h-4 sm:h-5 w-4 sm:w-5" aria-hidden="true" />
            Call to Reserve
          </Button>
          
          <Button 
            size="lg" 
            variant="outline-hero"
            className="px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg font-semibold w-full sm:w-auto"
            onClick={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })}
            aria-label="Explore Desalegn Kitfo's traditional Ethiopian food menu"
            type="button"
          >
            <MapPin className="mr-2 h-4 sm:h-5 w-4 sm:w-5" aria-hidden="true" />
            Explore Our Food
          </Button>
        </nav>
      </div>
      
      {/* Decorative Elements */}
      <div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60"
        role="presentation"
        aria-hidden="true"
      >
        <div className="w-px h-16 bg-white/40 mx-auto mb-4"></div>
        <p className="text-sm tracking-widest">SCROLL TO DISCOVER</p>
      </div>
      
      {/* Hidden structured data */}
      <div style={{ display: 'none' }}>
        <span itemProp="description">
          #1 Authentic Ethiopian Restaurant specializing in traditional kitfo, gored gored, and Gurage cuisine in Ethiopia
        </span>
        <span itemProp="servesCuisine">Ethiopian</span>
        <span itemProp="servesCuisine">Gurage</span>
        <span itemProp="priceRange">$$</span>
        <span itemProp="acceptsReservations">true</span>
      </div>
    </header>
  );
};

export default HeroSection;