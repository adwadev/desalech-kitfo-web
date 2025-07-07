import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone } from "lucide-react";

const locations = [
  {
    name: "Bole - Millennium Hall Area",
    subtitle: "Main Branch",
    address: "Airport Road, front of Millennium Hall",
    phone: "+251 91 123 1859",
    mapLink: "https://maps.app.goo.gl/L7j9jKMWKmuz99eLA",
    city: "Addis Ababa",
    featured: true
  },
  {
    name: "Nifas Silk - Lebu Branch",
    subtitle: "Traditional Setting",
    address: "Lebu Area, Nifas Silk District",
    phone: "+251 91 123 1860",
    mapLink: "https://maps.app.goo.gl/4hZZsq2814LKF4J1A",
    city: "Addis Ababa",
    featured: false
  },
  {
    name: "Kirkos - Riche Area Branch",
    subtitle: "City Center",
    address: "Riche Area, Kirkos District",
    phone: "+251 91 123 1861",
    mapLink: "https://maps.app.goo.gl/BfKPibDWAruXvLNL81",
    city: "Addis Ababa",
    featured: false
  },
  {
    name: "Cultural Hall - Kitfo & Showroom",
    subtitle: "Cultural Experience",
    address: "Cultural Hall Complex, Addis Ababa",
    phone: "+251 91 123 1862",
    mapLink: "https://maps.app.goo.gl/f6pmgNsbnbwFnK2R6",
    city: "Addis Ababa",
    featured: false
  },
  {
    name: "Dire Dawa - Central Branch",
    subtitle: "Eastern Gateway",
    address: "Kazanchis Area, Dire Dawa",
    phone: "+251 91 123 1863",
    mapLink: "https://maps.app.goo.gl/V2Xq3EeNnxJHQrrAA",
    city: "Dire Dawa",
    featured: false
  },
  {
    name: "Dire Dawa - Sabian Branch",
    subtitle: "Historic District",
    address: "Sabian Area, Dire Dawa",
    phone: "+251 91 123 1864",
    mapLink: "https://maps.app.goo.gl/dS4fESycuhYC7Lci7",
    city: "Dire Dawa",
    featured: false
  },
  {
    name: "Harar - Jugol Branch",
    subtitle: "Ancient City",
    address: "Inside Jugol, Old City, Harar",
    phone: "+251 91 123 1865",
    mapLink: "https://maps.app.goo.gl/vozAvwkbHXf1m9eq8",
    city: "Harar",
    featured: false
  }
];

const LocationsSection = () => {
  return (
    <section className="py-20 bg-warm-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-coffee-brown mb-4">
            Find Us Across Ethiopia
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Visit any of our authentic locations in Addis Ababa, Dire Dawa, and Harar to experience the true taste of Ethiopian cuisine
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {locations.map((location, index) => (
            <Card 
              key={index} 
              className={`group hover:shadow-warm transition-all duration-300 hover:-translate-y-2 ${
                location.featured ? 'ring-2 ring-spiced-red bg-gradient-to-br from-white to-injera-cream/30' : 'bg-white'
              }`}
            >
              <CardContent className="p-6">
                {location.featured && (
                  <div className="inline-block bg-spiced-red text-white px-3 py-1 rounded-full text-sm font-semibold mb-4">
                    Main Branch
                  </div>
                )}
                
                <div className="mb-2">
                  <span className="text-xs font-medium text-spiced-red bg-spiced-red/10 px-2 py-1 rounded">
                    {location.city}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-coffee-brown mb-2">
                  {location.name}
                </h3>
                
                <p className="text-golden-accent font-medium mb-4">
                  {location.subtitle}
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-spiced-red mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-foreground">{location.address}</p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-spiced-red flex-shrink-0" />
                    <a 
                      href={`tel:${location.phone}`}
                      className="text-sm font-medium text-foreground hover:text-spiced-red transition-colors"
                      onClick={(e) => {
                        e.preventDefault();
                        window.open(`tel:${location.phone}`);
                      }}
                    >
                      {location.phone}
                    </a>
                  </div>
                </div>
                
                <div className="mt-6 pt-4 border-t border-border">
                  <a 
                    href={location.mapLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-spiced-red font-medium text-sm hover:underline"
                  >
                    Get Directions →
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LocationsSection;