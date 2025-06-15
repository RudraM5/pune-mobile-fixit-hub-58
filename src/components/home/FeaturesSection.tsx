import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Shield, Star, Truck } from "lucide-react";

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

export function FeaturesSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 font-display animate-fade-in-up bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Why Choose Mobile Repairwala?
          </h2>
          <p className="text-muted-foreground text-xl max-w-3xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            We're committed to providing the best mobile repair experience in Pune with cutting-edge technology and expert craftsmanship
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="text-center transition-all duration-500 hover:shadow-2xl hover:scale-105 group animate-slide-up border-primary/10 bg-card/50 backdrop-blur-sm hover:bg-card/80 hover:border-primary/20" 
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <CardHeader className="pb-4">
                <div className="mx-auto h-16 w-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 group-hover:bg-gradient-to-br group-hover:from-primary/30 group-hover:to-primary/20 group-hover:scale-110 group-hover:rotate-3 shadow-lg group-hover:shadow-xl">
                  <feature.icon className="h-8 w-8 text-primary transition-all duration-500 group-hover:scale-110 group-hover:rotate-12" />
                </div>
                <CardTitle className="text-xl font-bold font-heading group-hover:text-primary transition-colors duration-300">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Additional stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-16 border-t border-border/50">
          <div className="text-center animate-fade-in-up" style={{ animationDelay: '600ms' }}>
            <div className="text-3xl md:text-4xl font-bold text-primary font-display mb-2">10,000+</div>
            <div className="text-muted-foreground">Phones Repaired</div>
          </div>
          <div className="text-center animate-fade-in-up" style={{ animationDelay: '700ms' }}>
            <div className="text-3xl md:text-4xl font-bold text-primary font-display mb-2">4.9★</div>
            <div className="text-muted-foreground">Customer Rating</div>
          </div>
          <div className="text-center animate-fade-in-up" style={{ animationDelay: '800ms' }}>
            <div className="text-3xl md:text-4xl font-bold text-primary font-display mb-2">24hr</div>
            <div className="text-muted-foreground">Average Turnaround</div>
          </div>
          <div className="text-center animate-fade-in-up" style={{ animationDelay: '900ms' }}>
            <div className="text-3xl md:text-4xl font-bold text-primary font-display mb-2">6mo</div>
            <div className="text-muted-foreground">Warranty Period</div>
          </div>
        </div>
      </div>
    </section>
  );
}