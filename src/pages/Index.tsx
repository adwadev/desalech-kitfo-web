import HeroSection from "@/components/HeroSection";
import LocationsSection from "@/components/LocationsSection";
import MenuSection from "@/components/MenuSection";
import OfferingsSection from "@/components/OfferingsSection";
import CulturalSection from "@/components/CulturalSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <LocationsSection />
      <MenuSection />
      <OfferingsSection />
      <CulturalSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
