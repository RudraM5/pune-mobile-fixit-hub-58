import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/layout/Header";
import ServiceCard from "@/components/ServiceCard";
import { ReviewCard } from "@/components/reviews/ReviewCard";
import { TechnicianCard } from "@/components/reviews/TechnicianCard";
import { BeforeAfterCard } from "@/components/reviews/BeforeAfterCard";
import { VideoTestimonialCard } from "@/components/reviews/VideoTestimonialCard";
import { TrustBadges } from "@/components/reviews/TrustBadges";
import { SocialProofSection } from "@/components/reviews/SocialProofSection";
import { reviews, technicians, beforeAfterGallery, videoTestimonials } from "@/data/reviewsData";
import { Phone, Clock, Shield, Star, CheckCircle, Users, Truck, Wrench } from "lucide-react";

const HomePage = () => {
  const features = [
    {
      icon: Clock,
      title: "Quick Service",
      description: "Same-day repairs for most devices"
    },
    {
      icon: Shield,
      title: "Warranty",
      description: "6-month warranty on all repairs"
    },
    {
      icon: Star,
      title: "Expert Technicians",
      description: "Certified repair specialists"
    },
    {
      icon: Truck,
      title: "Pickup & Drop",
      description: "Free doorstep service in Pune"
    }
  ];

  const services = [
    {
      title: "Screen Replacement",
      description: "High-quality display replacement",
      price: "1,500",
      duration: "30 mins",
      rating: 4.8,
      popular: true
    },
    {
      title: "Battery Replacement",
      description: "Original battery replacement",
      price: "1,200",
      duration: "20 mins",
      rating: 4.9
    },
    {
      title: "Charging Port Repair",
      description: "Fix charging issues",
      price: "800",
      duration: "45 mins",
      rating: 4.7
    },
    {
      title: "Water Damage Repair",
      description: "Advanced liquid damage treatment",
      price: "2,500",
      duration: "2-4 hours",
      rating: 4.6
    }
  ];

  const stats = [
    { number: "10,000+", label: "Devices Repaired" },
    { number: "4.9/5", label: "Customer Rating" },
    { number: "30+", label: "Locations in Pune" },
    { number: "24/7", label: "Support Available" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header cartItems={0} />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/10 via-primary/5 to-background py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-4">
              Pune's #1 Mobile Repair Service
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent font-heading animate-fade-in">
              Fix Your Phone Today
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '200ms' }}>
              Professional mobile repair services with same-day fixes, genuine parts, and 6-month warranty. 
              Serving all of Pune with pickup & drop facility.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: '400ms' }}>
              <Link to="/book-repair">
                <Button size="lg" className="text-lg px-8 transition-all duration-300 hover:scale-105 hover:shadow-xl bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
                  Book Repair Now
                </Button>
              </Link>
              <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="lg" className="text-lg px-8 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                  WhatsApp Us
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-heading animate-fade-in">
              Why Choose FixMyPhone?
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We're committed to providing the best mobile repair experience in Pune
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center transition-all duration-300 hover:shadow-xl hover:scale-105 group animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <CardHeader>
                  <div className="mx-auto h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 transition-all duration-300 group-hover:bg-primary/20 group-hover:scale-110">
                    <feature.icon className="h-6 w-6 text-primary transition-transform duration-300 group-hover:rotate-12" />
                  </div>
                  <CardTitle className="text-xl font-heading">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our Popular Services
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Quick, reliable repairs with genuine parts and expert technicians
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <ServiceCard
                key={index}
                {...service}
                onSelect={() => {
                  // Navigate to booking page with pre-selected service
                  window.location.href = '/book-repair';
                }}
              />
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/services">
              <Button variant="outline" size="lg">
                View All Services
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground text-lg">
              Simple 4-step process to get your device fixed
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "1", title: "Book Online", desc: "Select your device and service" },
              { step: "2", title: "Pickup", desc: "We collect your device for free" },
              { step: "3", title: "Repair", desc: "Expert technicians fix your device" },
              { step: "4", title: "Delivery", desc: "Get your repaired device back" }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="mx-auto h-16 w-16 bg-primary rounded-full flex items-center justify-center text-2xl font-bold text-primary-foreground mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-heading">
              Why Trust FixMyPhone?
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

      {/* Social Proof & Live Activity */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-heading">
              Live from Our Service Centers
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Real-time updates from our active repair operations
            </p>
          </div>
          <SocialProofSection />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Ready to Fix Your Phone?
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-8 max-w-2xl mx-auto">
            Get a free quote and book your repair service today. Same-day service available!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/book-repair">
              <Button size="lg" variant="secondary" className="text-lg px-8">
                Book Now
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-8 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              Call +91 98765 43210
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Phone className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">FixMyPhone</span>
              </div>
              <p className="text-muted-foreground">
                Pune's most trusted mobile repair service with 10,000+ satisfied customers.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>Screen Replacement</li>
                <li>Battery Replacement</li>
                <li>Water Damage</li>
                <li>Motherboard Repair</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>+91 98765 43210</li>
                <li>info@fixmyphone.com</li>
                <li>Pune, Maharashtra</li>
                <li>24/7 Support</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link to="/dashboard">Track Repair</Link></li>
                <li><Link to="/services">All Services</Link></li>
                <li><Link to="/contact">Contact Us</Link></li>
                <li><a href="https://wa.me/919876543210">WhatsApp</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 FixMyPhone. All rights reserved. | Made with ❤️ in Pune</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;