import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const menuItems = [
  {
    category: "Signature Kitfo",
    items: [
      {
        name: "Traditional Kitfo",
        description: "Premium raw beef, seasoned with mitmita and served with homemade spiced butter",
        price: "Starting from 1350 ETB",
        isSignature: true
      },
      {
        name: "Leb Leb Kitfo", 
        description: "Lightly cooked kitfo for those who prefer it warmed",
        price: "Starting from 1350 ETB",
        isSignature: false
      },
      {
        name: "Fully Cooked Kitfo",
        description: "Well-cooked version maintaining all traditional flavors",
        price: "Starting from 1300 ETB", 
        isSignature: false
      }
    ]
  },
  {
    category: "Gurage Specialties",
    items: [
      {
        name: "Desalech Fento Platter",
        description: "Complete experience: kitfo, gored gored, gomen, ayib, and fresh kocho",
        price: "Starting from 1800 ETB",
        isSignature: true
      },
      {
        name: "Gored Gored",
        description: "Cubed raw beef with traditional spices and awaze sauce",
        price: "Starting from 1250 ETB",
        isSignature: false
      },
      {
        name: "Fresh Kocho with Ayib",
        description: "Traditional fermented bread served with fresh cottage cheese",
        price: "Starting from 450 ETB",
        isSignature: false
      }
    ]
  }
];

const MenuSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-coffee-brown mb-4">
            From Our Kitchen to Your Table
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Authentic Gurage cuisine prepared with traditional recipes passed down through generations
          </p>
        </div>
        
        <div className="space-y-12">
          {menuItems.map((section, sectionIndex) => (
            <div key={sectionIndex} className="space-y-6">
              <h3 className="text-2xl md:text-3xl font-bold text-center text-spiced-red mb-8">
                {section.category}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {section.items.map((item, itemIndex) => (
                  <Card 
                    key={itemIndex}
                    className="group hover:shadow-elegant transition-all duration-300 hover:animate-dish-hover bg-white border border-border"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="text-xl font-bold text-coffee-brown">
                          {item.name}
                        </h4>
                        {item.isSignature && (
                          <Badge className="bg-golden-accent text-coffee-brown hover:bg-golden-accent/90">
                            Signature
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-muted-foreground mb-4 leading-relaxed">
                        {item.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-semibold text-spiced-red">
                          {item.price}
                        </span>
                        <button className="text-coffee-brown hover:text-spiced-red transition-colors text-sm font-medium">
                          Learn More →
                        </button>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-border">
                        <p className="text-xs text-muted-foreground italic">
                          Served with homemade spiced butter and fresh injera
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-16">
          <div className="inline-block bg-injera-cream px-8 py-4 rounded-lg">
            <p className="text-coffee-brown font-medium">
              <span className="text-spiced-red font-bold">Traditional Note:</span> All dishes are prepared using authentic spices imported directly from Gurage region
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MenuSection;