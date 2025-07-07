import { Card, CardContent } from "@/components/ui/card";
import { Wine, Coffee, Utensils, Clock } from "lucide-react";

const offerings = [
  {
    icon: Wine,
    title: "Premium Alcoholic Beverages",
    description: "Traditional Tej, imported wines, and Ethiopian beer to complement your meal",
    items: ["Traditional Tej (Honey Wine)", "Ethiopian St. George Beer", "Imported Red & White Wines", "Local Araki Spirits"]
  },
  {
    icon: Clock,
    title: "Quick Bite Options",
    description: "Perfect for busy schedules without compromising on authentic taste",
    items: ["Express Kitfo Plates", "Quick Gored Gored", "Traditional Coffee Service", "Light Injera Wraps"]
  },
  {
    icon: Utensils,
    title: "Small Plates & Appetizers",
    description: "Share the Ethiopian way with our selection of mezze-style dishes",
    items: ["Ayib (Fresh Cheese)", "Kocho with Spiced Butter", "Mixed Vegetable Sambusas", "Traditional Spiced Nuts"]
  },
  {
    icon: Coffee,
    title: "Ethiopian Coffee Experience",
    description: "From bean to cup - witness the traditional coffee ceremony",
    items: ["Traditional Coffee Ceremony", "Freshly Roasted Single Origin", "Spiced Coffee Variations", "Take-Home Coffee Beans"]
  }
];

const OfferingsSection = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-warm-background to-injera-cream/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-coffee-brown mb-4">
            More Than Just Food
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Experience the full spectrum of Ethiopian hospitality with our comprehensive offerings
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {offerings.map((offering, index) => {
            const Icon = offering.icon;
            return (
              <Card 
                key={index} 
                className="group hover:shadow-warm transition-all duration-300 hover:-translate-y-1 bg-white/80 backdrop-blur-sm"
              >
                <CardContent className="p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="p-3 bg-spiced-red/10 rounded-lg group-hover:bg-spiced-red/20 transition-colors">
                      <Icon className="h-8 w-8 text-spiced-red" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-coffee-brown mb-2">
                        {offering.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {offering.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {offering.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-golden-accent rounded-full"></div>
                        <span className="text-foreground font-medium">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        <div className="text-center mt-12">
          <div className="inline-block bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-warm">
            <h3 className="text-2xl font-bold text-coffee-brown mb-4">
              Cultural Dining Philosophy
            </h3>
            <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
              At Desalegn Kitfo, dining transcends mere sustenance. We honor the Ethiopian tradition of 
              <span className="font-semibold text-spiced-red"> communal eating</span>, where sharing food from a common plate 
              symbolizes the sacred bonds of family, friendship, and community. Every meal becomes a celebration 
              of our rich heritage, transforming visitors into cherished members of our extended family.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OfferingsSection;