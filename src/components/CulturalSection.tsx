import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Johnson",
    location: "Tourist from Canada", 
    rating: 5,
    text: "An absolutely authentic experience! The kitfo was incredible and the cultural show made it unforgettable.",
    highlight: "authentic"
  },
  {
    name: "አለሙ ተስፋዬ",
    location: "Local Food Enthusiast",
    rating: 5,
    text: "የኛ ባህላዊ ምግብ በጣም ጣፋጭ ነው። ደሳለች ክትፎ እውነተኛ ጌርጋ ምግብ ነው።",
    highlight: "traditional"
  },
  {
    name: "Michael Rodriguez",
    location: "Business Traveler",
    rating: 5,
    text: "Best Ethiopian food I've had! The staff explained every dish and the atmosphere was perfect.",
    highlight: "service"
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
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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