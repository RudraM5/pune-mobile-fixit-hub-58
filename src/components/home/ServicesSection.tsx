import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ServiceCard from "@/components/ServiceCard";

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

export function ServicesSection() {
  return (
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
  );
}