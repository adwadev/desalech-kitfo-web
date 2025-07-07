import FeedbackForm from "@/components/FeedbackForm";
import PublicFeedback from "@/components/PublicFeedback";

const Feedback = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-coffee-brown via-spiced-red to-coffee-brown py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Share Your Experience
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Your feedback helps us continue serving authentic Ethiopian cuisine with the passion and quality you deserve
          </p>
        </div>
      </section>

      {/* Feedback Form Section */}
      <section className="py-20 bg-warm-background">
        <div className="container mx-auto px-4">
          <FeedbackForm />
        </div>
      </section>

      {/* Public Reviews Section */}
      <PublicFeedback />
    </div>
  );
};

export default Feedback;