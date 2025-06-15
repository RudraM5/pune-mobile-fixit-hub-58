import { Link } from "react-router-dom";
import { Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-muted py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Phone className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">Mobile Repairwala</span>
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
              <li>info@mobilerepairwala.com</li>
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
          <p>&copy; 2024 Mobile Repairwala. All rights reserved. | Made with ❤️ in Pune</p>
        </div>
      </div>
    </footer>
  );
}