
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, Users, CheckCircle, Calculator, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { PricingCalculator } from "@/components/interactive/PricingCalculator";
import { RepairDiagnosis } from "@/components/interactive/RepairDiagnosis";

const HeroSection = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10 overflow-hidden">
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
        <div className="absolute top-20 left-20 opacity-30 animate-float">
          <div className="w-8 h-12 bg-gradient-to-br from-primary to-primary-glow rounded-lg shadow-lg"></div>
        </div>
        <div className="absolute top-40 right-32 opacity-25 animate-float delay-1000">
          <div className="w-6 h-10 bg-gradient-to-br from-secondary to-accent rounded-lg shadow-lg"></div>
        </div>
        <div className="absolute bottom-32 left-32 opacity-35 animate-float delay-2000">
          <div className="w-7 h-11 bg-gradient-to-br from-accent to-primary rounded-lg shadow-lg"></div>
        </div>
        <div className="absolute bottom-20 right-20 opacity-30 animate-float delay-500">
          <div className="w-5 h-9 bg-gradient-to-br from-success to-secondary rounded-lg shadow-lg"></div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Hero content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/20 to-accent/20 text-primary rounded-full text-sm font-medium animate-fade-in border border-primary/20">
              <MapPin className="w-4 h-4" />
              Connecting Pune's Best Mobile Repair Experts
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight animate-fade-in">
              Find Expert
              <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent animate-gradient-shift bg-size-200">
                {" "}Mobile Repair{" "}
              </span>
              Technicians Near You
            </h1>

            {/* Subheading */}
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed animate-fade-in">
              Connect with certified mobile repair technicians from trusted local shops across Pune. 
              Get expert repairs with guaranteed quality and competitive pricing.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center animate-fade-in">
              <div className="space-y-1">
                <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">50+</div>
                <div className="text-sm text-muted-foreground">Expert Technicians</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">25+</div>
                <div className="text-sm text-muted-foreground">Partner Shops</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">15+</div>
                <div className="text-sm text-muted-foreground">Pune Areas Covered</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-success to-secondary bg-clip-text text-transparent">1000+</div>
                <div className="text-sm text-muted-foreground">Happy Customers</div>
              </div>
            </div>

            {/* Key Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 animate-fade-in">
              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-primary/10 to-primary-glow/10 backdrop-blur-sm border border-primary/20 rounded-lg hover-scale">
                <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                <span className="text-sm font-medium">Certified Technicians</span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-secondary/10 to-accent/10 backdrop-blur-sm border border-secondary/20 rounded-lg hover-scale">
                <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                <span className="text-sm font-medium">Local Shop Network</span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-accent/10 to-success/10 backdrop-blur-sm border border-accent/20 rounded-lg hover-scale">
                <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                <span className="text-sm font-medium">Guaranteed Quality</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-start gap-4 animate-fade-in">
              <Button asChild size="lg" className="text-lg px-8 py-6 h-auto hover-scale bg-gradient-to-r from-primary to-primary-glow hover:from-primary/90 hover:to-primary-glow/90 shadow-lg">
                <Link to="/book-repair">
                  Find Expert Technicians
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              
              <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6 h-auto hover-scale border-primary/30 hover:bg-primary/5">
                <Link to="/services">
                  Browse Repair Services
                </Link>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground animate-fade-in">
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

          {/* Right side - Interactive Tools */}
          <div className="space-y-6">
            <div className="grid gap-6">
              {/* Pricing Calculator */}
              <div className="animate-slide-in-right">
                <PricingCalculator />
              </div>
              
              {/* Repair Diagnosis */}
              <div className="animate-slide-in-right delay-200">
                <RepairDiagnosis />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
