import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Phone, MapPin, Instagram } from "lucide-react";

const ContactSection = () => {
  const mainPhone = "+251 91 123 1859";
  
  const handleReserveCall = () => {
    window.location.href = `tel:${mainPhone}`;
  };

  return (
    <section className="py-20 bg-coffee-brown text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(214,199,161,0.3),transparent_50%)]"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Ready to Experience Authentic Kitfo?
          </h2>
          <p className="text-xl text-injera-cream max-w-2xl mx-auto">
            Reserve your table today and join us for an unforgettable culinary journey
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Contact Information */}
          <div className="space-y-8">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold mb-6 text-golden-accent">
                  Contact & Hours
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Phone className="h-6 w-6 text-golden-accent flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Main Reservation Line</p>
                      <a 
                        href={`tel:${mainPhone}`}
                        className="text-injera-cream hover:text-golden-accent transition-colors text-lg"
                      >
                        {mainPhone}
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <MapPin className="h-6 w-6 text-golden-accent flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Main Branch</p>
                      <p className="text-injera-cream">
                        Airport Road, front of Millennium Hall, Bole
                      </p>
                    </div>
                  </div>
                  
                  <div className="border-t border-white/20 pt-4 mt-6">
                    <p className="font-semibold text-golden-accent mb-2">Opening Hours</p>
                    <p className="text-injera-cream">Daily: 8:00 AM - 10:00 PM</p>
                    <p className="text-sm text-injera-cream/80 mt-1">
                      Cultural shows: Friday & Saturday evenings at 7:00 PM
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Social Links */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4 text-golden-accent">
                  Follow Our Journey
                </h3>
                <div className="flex gap-4">
                  <a 
                    href="#" 
                    className="flex items-center gap-2 text-injera-cream hover:text-golden-accent transition-colors"
                  >
                    <Instagram className="h-5 w-5" />
                    <span>@desalechkitfo</span>
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Reservation Form */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-6">
              <h3 className="text-2xl font-bold mb-6 text-golden-accent">
                Quick Reservation Request
              </h3>
              
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input 
                    placeholder="Your Name" 
                    className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
                  />
                  <Input 
                    placeholder="Phone Number" 
                    className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input 
                    type="date" 
                    className="bg-white/20 border-white/30 text-white"
                  />
                  <Input 
                    placeholder="Number of Guests" 
                    type="number"
                    className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
                  />
                </div>
                
                <div className="text-center pt-4">
                  <Button 
                    type="submit"
                    variant="golden"
                    className="px-8 py-3 w-full md:w-auto"
                  >
                    Request Reservation
                  </Button>
                  <p className="text-sm text-injera-cream/80 mt-2">
                    We'll call you to confirm your reservation
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
        
        {/* Sticky Reserve Button */}
        <div className="fixed bottom-6 right-6 z-50">
            <Button 
              onClick={handleReserveCall}
              variant="spiced"
              className="px-6 py-4 rounded-full shadow-2xl text-lg font-semibold"
          >
            <Phone className="mr-2 h-5 w-5" />
            Reserve Now
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;