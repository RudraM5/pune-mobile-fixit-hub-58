import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/layout/Header";
import ServiceCard from "@/components/ServiceCard";
import { Clock, CheckCircle, Star, Shield } from "lucide-react";

const ServicesPage = () => {
  const serviceCategories = [
    {
      id: "basic",
      title: "Basic Repairs",
      description: "Common repairs for everyday issues",
      services: [
        {
          title: "Screen Replacement",
          description: "High-quality OLED/LCD display replacement with original parts",
          price: "1,500",
          duration: "30 mins",
          rating: 4.8,
          popular: true
        },
        {
          title: "Battery Replacement",
          description: "Original capacity battery with 6-month warranty",
          price: "1,200",
          duration: "20 mins",
          rating: 4.9
        },
        {
          title: "Charging Port Repair",
          description: "Fix charging issues and loose connections",
          price: "800",
          duration: "45 mins",
          rating: 4.7
        },
        {
          title: "Speaker/Microphone Repair",
          description: "Fix audio issues and sound problems",
          price: "600",
          duration: "30 mins",
          rating: 4.6
        },
        {
          title: "Volume/Power Button Repair",
          description: "Fix stuck or unresponsive buttons",
          price: "500",
          duration: "25 mins",
          rating: 4.5
        },
        {
          title: "Proximity Sensor Repair",
          description: "Fix screen staying on during calls",
          price: "700",
          duration: "40 mins",
          rating: 4.4
        }
      ]
    },
    {
      id: "advanced",
      title: "Advanced Repairs",
      description: "Complex technical repairs requiring expertise",
      services: [
        {
          title: "Motherboard Repair",
          description: "Circuit board and chip-level repairs for hardware issues",
          price: "3,500",
          duration: "2-4 hours",
          rating: 4.6,
          popular: true
        },
        {
          title: "Water Damage Treatment",
          description: "Complete liquid damage recovery and restoration",
          price: "2,500",
          duration: "4-6 hours",
          rating: 4.5
        },
        {
          title: "Camera Module Replacement",
          description: "Front/rear camera repair and replacement",
          price: "1,800",
          duration: "45 mins",
          rating: 4.7
        },
        {
          title: "Face ID/Touch ID Repair",
          description: "Biometric sensor repair and calibration",
          price: "2,200",
          duration: "1 hour",
          rating: 4.3
        },
        {
          title: "WiFi/Bluetooth Antenna Repair",
          description: "Fix connectivity and signal issues",
          price: "1,200",
          duration: "1 hour",
          rating: 4.4
        },
        {
          title: "Logic Board Micro Soldering",
          description: "Component-level repairs and replacements",
          price: "4,000",
          duration: "4-8 hours",
          rating: 4.8
        }
      ]
    },
    {
      id: "accessories",
      title: "Mobile Accessories",
      description: "Protective accessories and add-ons",
      services: [
        {
          title: "Tempered Glass",
          description: "9H hardness screen protector with lifetime replacement",
          price: "200",
          duration: "5 mins",
          rating: 4.9,
          popular: true
        },
        {
          title: "Phone Cover/Case",
          description: "High-quality protective cases and covers",
          price: "300",
          duration: "2 mins",
          rating: 4.8
        },
        {
          title: "Screen Guard (Matte/Clear)",
          description: "Anti-glare and clear screen protection films",
          price: "150",
          duration: "5 mins",
          rating: 4.6
        },
        {
          title: "Camera Lens Protector",
          description: "Protect your camera from scratches and cracks",
          price: "100",
          duration: "3 mins",
          rating: 4.7
        },
        {
          title: "Wireless Charger",
          description: "Fast wireless charging pads and stands",
          price: "800",
          duration: "Demo available",
          rating: 4.5
        },
        {
          title: "Mobile Holder/Stand",
          description: "Car and desk mount holders",
          price: "250",
          duration: "Installation help",
          rating: 4.4
        }
      ]
    },
    {
      id: "premium",
      title: "Premium Services",
      description: "Special services for enhanced experience",
      services: [
        {
          title: "On-Call Technician",
          description: "Expert technician visits your location for repairs",
          price: "500",
          duration: "Travel time + repair",
          rating: 4.9,
          popular: true
        },
        {
          title: "Express Service",
          description: "Priority repair with faster turnaround time",
          price: "300",
          duration: "50% faster",
          rating: 4.8
        },
        {
          title: "Data Recovery Service",
          description: "Recover photos, contacts, and files from damaged devices",
          price: "1,500",
          duration: "2-8 hours",
          rating: 4.7
        },
        {
          title: "Device Cleaning & Maintenance",
          description: "Deep cleaning and performance optimization",
          price: "400",
          duration: "30 mins",
          rating: 4.6
        },
        {
          title: "Software Troubleshooting",
          description: "Fix software issues, updates, and configurations",
          price: "600",
          duration: "45 mins",
          rating: 4.5
        },
        {
          title: "Extended Warranty",
          description: "Additional 6-month warranty on top of standard warranty",
          price: "800",
          duration: "Instant",
          rating: 4.8
        }
      ]
    }
  ];

  const features = [
    {
      title: "6-Month Warranty",
      description: "All repairs covered",
      icon: Shield
    },
    {
      title: "Same Day Service",
      description: "Most repairs in hours",
      icon: Clock
    },
    {
      title: "Expert Technicians",
      description: "Certified professionals",
      icon: Star
    },
    {
      title: "Quality Guarantee",
      description: "100% satisfaction assured",
      icon: CheckCircle
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Our Services</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Complete mobile repair solutions with genuine parts, expert technicians, and reliable warranty.
            From basic repairs to complex motherboard fixes, we've got you covered.
          </p>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {features.map((feature, index) => (
            <Card key={index} className="text-center">
              <CardContent className="pt-6">
                <div className="mx-auto h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Service Categories */}
        <div className="space-y-12">
          {serviceCategories.map((category) => (
            <section key={category.id}>
              <div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                  <h2 className="text-3xl font-bold">{category.title}</h2>
                  <Badge variant="outline" className="text-sm">
                    {category.services.length} Services
                  </Badge>
                </div>
                <p className="text-lg text-muted-foreground">{category.description}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.services.map((service, index) => (
                  <ServiceCard
                    key={index}
                    {...service}
                    onSelect={() => {
                      // Navigate to booking page with pre-selected service
                      window.location.href = `/book-repair?service=${encodeURIComponent(service.title)}`;
                    }}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Pricing Note */}
        <Card className="mt-12 bg-muted/30">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">Transparent Pricing</h3>
              <p className="text-muted-foreground mb-4">
                Prices shown are tentative and may vary based on device model and damage severity. 
                Final quote will be provided by our technician after device inspection.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/book-repair">
                  <Button size="lg">
                    Get Free Quote
                  </Button>
                </Link>
                <a href="https://wa.me/919325673075" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="lg">
                    WhatsApp for Pricing
                  </Button>
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Service Areas */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Service Areas in Pune</CardTitle>
            <CardDescription>
              We provide pickup & drop service across Pune
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              {[
                "Koregaon Park", "Baner", "Wakad", "Hinjewadi",
                "Kothrud", "Deccan", "FC Road", "Camp Area",
                "Hadapsar", "Mundhwa", "Viman Nagar", "Kalyani Nagar",
                "Aundh", "Shivaji Nagar", "Pune Station", "Swargate",
                "Katraj", "Kondhwa", "NIBM", "Magarpatta",
                "Yerawada", "Kharadi", "Wagholi", "Lohegaon"
              ].map((area, index) => (
                <div key={index} className="flex items-center text-muted-foreground">
                  <CheckCircle className="h-3 w-3 mr-2 text-green-500" />
                  {area}
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Don't see your area? Contact us for availability in other parts of Pune.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ServicesPage;