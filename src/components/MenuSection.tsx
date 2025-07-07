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
        isSignature: true,
        currency: "ETB",
        priceValue: "1350"
      },
      {
        name: "Leb Leb Kitfo", 
        description: "Lightly cooked kitfo for those who prefer it warmed",
        price: "Starting from 1350 ETB",
        isSignature: false,
        currency: "ETB",
        priceValue: "1350"
      },
      {
        name: "Fully Cooked Kitfo",
        description: "Well-cooked version maintaining all traditional flavors",
        price: "Starting from 1300 ETB", 
        isSignature: false,
        currency: "ETB",
        priceValue: "1300"
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
        isSignature: true,
        currency: "ETB",
        priceValue: "1800"
      },
      {
        name: "Gored Gored",
        description: "Cubed raw beef with traditional spices and awaze sauce",
        price: "Starting from 1250 ETB",
        isSignature: false,
        currency: "ETB",
        priceValue: "1250"
      },
      {
        name: "Fresh Kocho with Ayib",
        description: "Traditional fermented bread served with fresh cottage cheese",
        price: "Starting from 450 ETB",
        isSignature: false,
        currency: "ETB",
        priceValue: "450"
      }
    ]
  }
];

const MenuSection = () => {
  return (
    <section 
      id="menu" 
      className="py-20 bg-background"
      itemScope 
      itemType="https://schema.org/Menu"
      role="main"
      aria-labelledby="menu-heading"
    >
      <div className="container mx-auto px-4">
        <header className="text-center mb-16">
          <h2 
            id="menu-heading"
            className="text-4xl md:text-5xl font-bold text-coffee-brown mb-4"
            itemProp="name"
          >
            From Our Kitchen to Your Table
          </h2>
          <p 
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
            itemProp="description"
          >
            Authentic Gurage cuisine prepared with traditional recipes passed down through generations
          </p>
        </header>
        
        <div className="space-y-12" role="list" aria-label="Menu categories">
          {menuItems.map((section, sectionIndex) => (
            <article 
              key={sectionIndex} 
              className="space-y-6"
              itemScope 
              itemType="https://schema.org/MenuSection"
              role="listitem"
            >
              <h3 
                className="text-2xl md:text-3xl font-bold text-center text-spiced-red mb-8"
                itemProp="name"
              >
                {section.category}
              </h3>
              
              <div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                role="list"
                aria-label={`${section.category} menu items`}
              >
                {section.items.map((item, itemIndex) => (
                  <Card 
                    key={itemIndex}
                    className="group hover:shadow-elegant transition-all duration-300 hover:animate-dish-hover bg-white border border-border"
                    itemScope 
                    itemType="https://schema.org/MenuItem"
                    role="listitem"
                  >
                    <CardContent className="p-6">
                      <header className="flex items-start justify-between mb-3">
                        <h4 
                          className="text-xl font-bold text-coffee-brown"
                          itemProp="name"
                        >
                          {item.name}
                        </h4>
                        {item.isSignature && (
                          <Badge 
                            className="bg-golden-accent text-coffee-brown hover:bg-golden-accent/90"
                            aria-label="Signature dish"
                          >
                            Signature
                          </Badge>
                        )}
                      </header>
                      
                      <p 
                        className="text-muted-foreground mb-4 leading-relaxed"
                        itemProp="description"
                      >
                        {item.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span 
                          className="text-lg font-semibold text-spiced-red"
                          itemScope 
                          itemType="https://schema.org/Offer"
                        >
                          <span itemProp="price" content={item.priceValue}>{item.price}</span>
                          <meta itemProp="priceCurrency" content={item.currency} />
                          <meta itemProp="availability" content="https://schema.org/InStock" />
                        </span>
                        <button 
                          className="text-coffee-brown hover:text-spiced-red transition-colors text-sm font-medium"
                          aria-label={`Learn more about ${item.name}`}
                          type="button"
                        >
                          Learn More →
                        </button>
                      </div>
                      
                      <footer className="mt-4 pt-4 border-t border-border">
                        <p 
                          className="text-xs text-muted-foreground italic"
                          itemProp="menuAddOn"
                        >
                          Served with homemade spiced butter and fresh injera
                        </p>
                      </footer>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </article>
          ))}
        </div>
        
        <footer className="text-center mt-16">
          <div className="inline-block bg-injera-cream px-8 py-4 rounded-lg">
            <p className="text-coffee-brown font-medium">
              <span className="text-spiced-red font-bold">Traditional Note:</span> All dishes are prepared using authentic spices imported directly from Gurage region
            </p>
          </div>
        </footer>
      </div>
    </section>
  );
};

export default MenuSection;