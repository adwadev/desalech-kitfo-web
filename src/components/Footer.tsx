import { MapPin, Phone, Instagram } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const locations = [
    { name: "Bole - Millennium Hall", phone: "+251 91 123 1859" },
    { name: "Nifas Silk - Lebu", phone: "+251 91 123 1860" },
    { name: "Kirkos - Riche Area", phone: "+251 91 123 1861" },
    { name: "Cultural Hall", phone: "+251 91 123 1862" }
  ];

  return (
    <footer className="bg-coffee-brown text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-golden-accent">
              Desalech Kitfo
            </h3>
            <p className="text-injera-cream leading-relaxed">
              "Tradition Served Raw, Spiced with Soul."
            </p>
            <p className="text-sm text-injera-cream/80">
              Authentic Ethiopian and Gurage cuisine served across multiple locations in Addis Ababa since generations.
            </p>
            
            <div className="flex items-center gap-4 pt-4">
              <a 
                href="#" 
                className="text-injera-cream hover:text-golden-accent transition-colors"
                aria-label="Follow us on Instagram"
              >
                <Instagram className="h-6 w-6" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-golden-accent">
              Quick Links
            </h4>
            <ul className="space-y-2 text-injera-cream">
              <li><a href="#menu" className="hover:text-golden-accent transition-colors">Our Menu</a></li>
              <li><a href="#locations" className="hover:text-golden-accent transition-colors">Locations</a></li>
              <li><a href="#cultural" className="hover:text-golden-accent transition-colors">Cultural Experience</a></li>
              <li><a href="#contact" className="hover:text-golden-accent transition-colors">Reservations</a></li>
            </ul>
            
            <div className="pt-4">
              <p className="text-sm text-golden-accent font-medium">Opening Hours</p>
              <p className="text-sm text-injera-cream">Daily: 8:00 AM - 10:00 PM</p>
            </div>
          </div>
          
          {/* Locations Quick Contact */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-golden-accent">
              All Locations
            </h4>
            <div className="space-y-3">
              {locations.map((location, index) => (
                <div key={index} className="text-sm">
                  <p className="text-injera-cream font-medium">{location.name}</p>
                  <a 
                    href={`tel:${location.phone}`}
                    className="text-injera-cream/80 hover:text-golden-accent transition-colors flex items-center gap-1"
                  >
                    <Phone className="h-3 w-3" />
                    {location.phone}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-white/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-injera-cream/80">
            © {currentYear} Desalech Kitfo. All rights reserved.
          </p>
          
          <div className="flex gap-6 text-sm text-injera-cream/80 mt-4 md:mt-0">
            <a href="#" className="hover:text-golden-accent transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-golden-accent transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;