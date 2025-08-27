
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import { ReviewCard } from "@/components/reviews/ReviewCard";
import { TechnicianCard } from "@/components/reviews/TechnicianCard";
import { TrustBadges } from "@/components/reviews/TrustBadges";
import { SocialProofSection } from "@/components/reviews/SocialProofSection";
import HeroSection from "@/components/home/HeroSection";
import { StatsSection } from "@/components/home/StatsSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { ServicesSection } from "@/components/home/ServicesSection";
import { ProcessSection } from "@/components/home/ProcessSection";
import { CTASection } from "@/components/home/CTASection";
import { Footer } from "@/components/home/Footer";
import { LiveChatWidget } from "@/components/interactive/LiveChatWidget";
import { LiveRepairCounter } from "@/components/interactive/LiveRepairCounter";
import { PricingCalculator } from "@/components/interactive/PricingCalculator";
import { RealtimeNotifications } from "@/components/realtime/RealtimeNotifications";
import { InstallPrompt, OfflineIndicator } from "@/components/pwa/InstallPrompt";
import { reviews, technicians } from "@/data/reviewsData";

const HomePage = () => {

  return (
    <div className="min-h-screen bg-background">
      <Header cartItems={0} />
      
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <ServicesSection />
      <ProcessSection />

      {/* Trust Badges Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-heading">
              Why Trust Mobile Repairwala?
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Certified, trusted, and committed to excellence
            </p>
          </div>
          <TrustBadges />
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-heading">
              What Our Customers Say
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Real reviews from satisfied customers across Pune
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {reviews.slice(0, 6).map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
          <div className="text-center">
            <Link to="/reviews">
              <Button variant="outline" size="lg">
                View All Reviews
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Meet Our Experts Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-heading">
              Meet Our Expert Technicians
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Certified professionals with years of experience
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {technicians.map((technician) => (
              <TechnicianCard key={technician.id} technician={technician} />
            ))}
          </div>
        </div>
      </section>

      {/* Live Activity & Social Proof */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <LiveRepairCounter />
            <SocialProofSection />
          </div>
        </div>
      </section>

      <CTASection />
      <Footer />
      <LiveChatWidget />
      <RealtimeNotifications />
      <InstallPrompt />
      <OfflineIndicator />
    </div>
  );
};

export default HomePage;
