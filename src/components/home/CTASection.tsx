import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
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
          <Button 
            size="lg" 
            variant="outline" 
            className="text-lg px-8 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
            onClick={() => window.open('https://wa.me/919325673075', '_blank')}
          >
            WhatsApp +91 93256 73075
          </Button>
        </div>
      </div>
    </section>
  );
}