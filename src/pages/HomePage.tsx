import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import { ReviewCard } from "@/components/reviews/ReviewCard";
import { TechnicianCard } from "@/components/reviews/TechnicianCard";
import { BeforeAfterCard } from "@/components/reviews/BeforeAfterCard";
import { VideoTestimonialCard } from "@/components/reviews/VideoTestimonialCard";
import { TrustBadges } from "@/components/reviews/TrustBadges";
import { SocialProofSection } from "@/components/reviews/SocialProofSection";
import { HeroSection } from "@/components/home/HeroSection";
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
import { reviews, technicians, beforeAfterGallery, videoTestimonials } from "@/data/reviewsData";

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

      {/* Before & After Gallery */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-heading">
              Repair Gallery
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              See the quality of our work - before and after transformations
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {beforeAfterGallery.map((item) => (
              <BeforeAfterCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>

      {/* Video Testimonials */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-heading">
              Customer Stories
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Watch real customers share their experiences
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {videoTestimonials.map((testimonial) => (
              <VideoTestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Tools & Live Activity */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-display bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Interactive Repair Experience
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Get instant quotes, track live repairs, and chat with experts
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <PricingCalculator />
            <LiveRepairCounter />
            <div className="lg:col-span-1">
              <SocialProofSection />
            </div>
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