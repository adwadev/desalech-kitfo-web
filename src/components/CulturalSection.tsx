import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Abebe Mersha",
    location: "Local Food Critic, Addis Ababa", 
    rating: 5,
    text: "The kitfo at Desalegn is exceptional - perfectly seasoned with mitmita and served with the finest ayib. Their traditional preparation method brings out the authentic Gurage flavors that remind me of my grandmother's cooking.",
    highlight: "authentic"
  },
  {
    name: "Fatima Hassan",
    location: "Food Blogger & Chef",
    rating: 5,
    text: "I've eaten kitfo across Ethiopia, but Desalegn's version is unmatched. The meat quality is pristine, the spice blend is perfect, and their gored gored literally melts in your mouth. A true culinary treasure.",
    highlight: "quality"
  },
  {
    name: "Daniel Thompson",
    location: "International Food Consultant",
    rating: 5,
    text: "As someone who travels globally for authentic cuisine, Desalegn Kitfo offers the most genuine Ethiopian dining experience. The cultural performances paired with their signature dishes create an unforgettable evening.",
    highlight: "experience"
  },
  {
    name: "Meseret Alemayehu",
    location: "Traditional Cook & Cultural Expert",
    rating: 5,
    text: "This is where tradition lives. Their kocho is made exactly as we do in Gurage region, and the kitfo preparation follows our ancestral methods. You taste the heritage in every bite.",
    highlight: "traditional"
  },
  {
    name: "James Chen",
    location: "Michelin Guide Inspector",
    rating: 5,
    text: "Rare to find such authentic preparation and cultural immersion. The quality of ingredients, especially their house-made berbere and fresh herbs, sets Desalegn apart as Ethiopia's premier kitfo destination.",
    highlight: "premier"
  },
  {
    name: "Tigist Bekele",
    location: "Culinary Tourism Director",
    rating: 5,
    text: "I bring international visitors here regularly. The combination of exceptional kitfo, warm hospitality, and educational cultural shows makes this the perfect introduction to authentic Ethiopian cuisine.",
    highlight: "hospitality"
  }
];

const experiences = [
  {
    title: "Live Cultural Shows",
    description: "Traditional music and dance performances every evening",
    icon: "🎭"
  },
  {
    title: "Coffee Ceremony",
    description: "Authentic Ethiopian coffee ceremony experience", 
    icon: "☕"
  },
  {
    title: "Traditional Seating",
    description: "Comfortable mesob tables for authentic dining",
    icon: "🪑"
  },
  {
    title: "Cultural Tours",
    description: "Learn about Gurage heritage and cooking traditions",
    icon: "🏛️"
  }
];

const CulturalSection = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-injera-cream/50 to-warm-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-coffee-brown mb-4">
            A Taste Beyond the Plate
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Immerse yourself in authentic Ethiopian culture through food, music, and warm hospitality
          </p>
        </div>
        
        {/* Cultural Experiences */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {experiences.map((experience, index) => (
            <Card key={index} className="text-center hover:shadow-warm transition-all duration-300 hover:-translate-y-1 bg-white">
              <CardContent className="p-6">
                <div className="text-4xl mb-4">{experience.icon}</div>
                <h3 className="text-lg font-bold text-coffee-brown mb-2">
                  {experience.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {experience.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Testimonials */}
        <div className="mb-16">
          <h3 className="text-2xl md:text-3xl font-bold text-center text-spiced-red mb-8">
            What Our Guests Say
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white hover:shadow-elegant transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-golden-accent text-golden-accent" />
                    ))}
                  </div>
                  
                  <p className="text-foreground mb-4 italic leading-relaxed">
                    "{testimonial.text}"
                  </p>
                  
                  <div className="border-t border-border pt-4">
                    <p className="font-semibold text-coffee-brown">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.location}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        
        {/* Cultural Experience CTA */}
        <div className="text-center bg-white rounded-lg p-8 shadow-warm">
          <h3 className="text-2xl font-bold text-coffee-brown mb-4">
            Experience Ethiopian Culture First-Hand
          </h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Join us for an evening of traditional music, dance, and authentic cuisine that tells the story of our heritage.
          </p>
          <Button variant="spiced" className="px-8 py-3">
            Book Cultural Experience
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CulturalSection;