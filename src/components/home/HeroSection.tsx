
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, Users, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
      
      {/* Background Image */}
      <div className="absolute inset-0 opacity-10">
        <img 
          src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=2000&auto=format&fit=crop"
          alt="Mobile repair background"
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Floating Phone Icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 opacity-20 animate-pulse">
          <div className="w-8 h-12 bg-primary/30 rounded-lg"></div>
        </div>
        <div className="absolute top-40 right-32 opacity-15 animate-pulse delay-1000">
          <div className="w-6 h-10 bg-secondary/30 rounded-lg"></div>
        </div>
        <div className="absolute bottom-32 left-32 opacity-25 animate-pulse delay-2000">
          <div className="w-7 h-11 bg-primary/20 rounded-lg"></div>
        </div>
        <div className="absolute bottom-20 right-20 opacity-20 animate-pulse delay-500">
          <div className="w-5 h-9 bg-secondary/25 rounded-lg"></div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium animate-fade-in">
            <MapPin className="w-4 h-4" />
            Connecting Pune's Best Mobile Repair Experts
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight animate-fade-in">
            Find Expert
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              {" "}Mobile Repair{" "}
            </span>
            Technicians Near You
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-fade-in">
            Connect with certified mobile repair technicians from trusted local shops across Pune. 
            Get expert repairs with guaranteed quality and competitive pricing.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-6 md:gap-12 text-center animate-fade-in">
            <div>
              <div className="text-2xl md:text-3xl font-bold text-primary">50+</div>
              <div className="text-sm text-muted-foreground">Expert Technicians</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold text-primary">25+</div>
              <div className="text-sm text-muted-foreground">Partner Shops</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold text-primary">15+</div>
              <div className="text-sm text-muted-foreground">Pune Areas Covered</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-bold text-primary">1000+</div>
              <div className="text-sm text-muted-foreground">Happy Customers</div>
            </div>
          </div>

          {/* Key Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto animate-fade-in">
            <div className="flex items-center gap-3 p-4 bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg hover-scale">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
              <span className="text-sm">Certified Technicians</span>
            </div>
            <div className="flex items-center gap-3 p-4 bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg hover-scale">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
              <span className="text-sm">Local Shop Network</span>
            </div>
            <div className="flex items-center gap-3 p-4 bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg hover-scale">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
              <span className="text-sm">Guaranteed Quality</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in">
            <Button asChild size="lg" className="text-lg px-8 py-6 h-auto hover-scale">
              <Link to="/book-repair">
                Find Expert Technicians
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6 h-auto hover-scale">
              <Link to="/services">
                Browse Repair Services
              </Link>
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-4 text-sm text-muted-foreground animate-fade-in">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>Local Pune Experts</span>
            </div>
            <span>•</span>
            <span>Same Day Service Available</span>
            <span>•</span>
            <span>Warranty on All Repairs</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
