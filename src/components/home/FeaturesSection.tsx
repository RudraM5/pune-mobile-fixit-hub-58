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
  );
}