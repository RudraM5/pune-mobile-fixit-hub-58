import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Phone, Shield, Clock, Star } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary/10 py-24 min-h-screen flex items-center">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-primary/5 rounded-full blur-2xl animate-pulse-slow"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Main Content */}
          <div className="text-center lg:text-left space-y-8">
            <div className="space-y-6">
              <Badge 
                variant="secondary" 
                className="animate-bounce-in bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-all duration-300"
              >
                🏆 Pune's #1 Mobile Repair Service
              </Badge>
              
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold font-display leading-tight">
                <span className="block animate-fade-in-up bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient-shift">
                  Fix Your
                </span>
                <span className="block animate-fade-in-up text-foreground font-heading" style={{ animationDelay: '200ms' }}>
                  Phone Today
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed animate-fade-in-up" style={{ animationDelay: '400ms' }}>
                Professional mobile repair services with <span className="text-primary font-semibold">same-day fixes</span>, 
                genuine parts, and <span className="text-primary font-semibold">6-month warranty</span>. 
                Serving all of Pune with free pickup & drop.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in-up" style={{ animationDelay: '600ms' }}>
              <Link to="/book-repair">
                <Button 
                  size="lg" 
                  className="text-lg px-8 py-4 transition-all duration-500 hover:scale-105 hover:shadow-2xl bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 group relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <Phone className="w-5 h-5" />
                    Book Repair Now
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Button>
              </Link>
              <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="text-lg px-8 py-4 transition-all duration-500 hover:scale-105 hover:shadow-xl border-2 hover:bg-primary/5 group"
                >
                  <span className="flex items-center gap-2">
                    💬 WhatsApp Us
                  </span>
                </Button>
              </a>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center justify-center lg:justify-start gap-8 pt-8 animate-fade-in-up" style={{ animationDelay: '800ms' }}>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="w-4 h-4 text-primary" />
                <span>6 Month Warranty</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4 text-primary" />
                <span>Same Day Service</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Star className="w-4 h-4 text-primary" />
                <span>4.9/5 Rating</span>
              </div>
            </div>
          </div>

          {/* Right Column - Visual Elements */}
          <div className="relative lg:block hidden">
            <div className="relative animate-float">
              {/* Phone mockup placeholder - replace with actual image */}
              <div className="w-80 h-96 bg-gradient-to-br from-primary/20 to-primary/5 rounded-3xl shadow-2xl mx-auto relative overflow-hidden border border-primary/10">
                <div className="absolute inset-4 bg-gradient-to-br from-card to-card/80 rounded-2xl shadow-inner">
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <div className="w-20 h-20 bg-primary/20 rounded-full mx-auto flex items-center justify-center animate-pulse-slow">
                        <Phone className="w-10 h-10 text-primary" />
                      </div>
                      <p className="text-muted-foreground font-medium">Professional Repair</p>
                    </div>
                  </div>
                </div>
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-foreground/10 rounded-full"></div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-full animate-bounce-in flex items-center justify-center" style={{ animationDelay: '1s' }}>
                <Shield className="w-8 h-8 text-primary animate-pulse-slow" />
              </div>
              <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-primary/10 rounded-full animate-bounce-in flex items-center justify-center" style={{ animationDelay: '1.5s' }}>
                <Clock className="w-6 h-6 text-primary animate-pulse-slow" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}