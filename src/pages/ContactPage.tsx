import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Header from "@/components/layout/Header";
import { Phone, MapPin, Clock, MessageCircle, Mail, Star } from "lucide-react";

const ContactPage = () => {
  const locations = [
    {
      name: "Koregaon Park Center",
      address: "Shop No. 15, Lane 5, Koregaon Park, Pune - 411001",
      phone: "+91 98765 43210",
      hours: "9:00 AM - 9:00 PM",
      services: ["All Repairs", "Accessories", "Express Service"]
    },
    {
      name: "Baner Service Hub",
      address: "Office No. 201, Baner Road, Near D-Mart, Pune - 411045",
      phone: "+91 98765 43211",
      hours: "10:00 AM - 8:00 PM", 
      services: ["Basic Repairs", "Data Recovery", "On-site Service"]
    },
    {
      name: "Hinjewadi Tech Center",
      address: "Phase 1, Hinjewadi IT Park, Near Wipro Circle, Pune - 411057",
      phone: "+91 98765 43212",
      hours: "9:00 AM - 10:00 PM",
      services: ["All Repairs", "Corporate Service", "Bulk Orders"]
    },
    {
      name: "FC Road Outlet",
      address: "Shop 8, Ground Floor, FC Road, Near Sambhaji Bridge, Pune - 411004",
      phone: "+91 98765 43213", 
      hours: "9:30 AM - 8:30 PM",
      services: ["Walk-in Repairs", "Student Discounts", "Quick Service"]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Get in touch with us for any questions, support, or to schedule a repair. 
            We're here to help 24/7!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Send us a Message</CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you within 2 hours
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="Enter your first name" />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Enter your last name" />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="your.email@example.com" />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" placeholder="+91 98765 43210" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="device">Device Model (Optional)</Label>
                  <Input id="device" placeholder="e.g., iPhone 15 Pro, Samsung Galaxy S24" />
                </div>

                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="What can we help you with?" />
                </div>

                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea 
                    id="message" 
                    placeholder="Describe your issue or question in detail..."
                    rows={4}
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button className="flex-1">
                    Send Message
                  </Button>
                  <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="flex-1">
                    <Button variant="outline" className="w-full">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      WhatsApp Instead
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Contact Info */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Contact</CardTitle>
                <CardDescription>Reach us instantly through these channels</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Call Us</p>
                    <p className="text-sm text-muted-foreground">+91 98765 43210</p>
                    <p className="text-xs text-green-600">Available 24/7</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <MessageCircle className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">WhatsApp</p>
                    <p className="text-sm text-muted-foreground">Quick responses</p>
                    <p className="text-xs text-green-600">Usually reply within 5 mins</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">support@mobilerepairwala.com</p>
                    <p className="text-xs text-green-600">Response within 2 hours</p>
                  </div>
                </div>

                <div className="pt-4">
                  <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer">
                    <Button className="w-full">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      WhatsApp Now
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Customer Reviews</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="border-l-4 border-primary pl-4">
                    <div className="flex items-center mb-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-sm">"Excellent service! Fixed my iPhone screen in 30 minutes."</p>
                    <p className="text-xs text-muted-foreground">- Rahul S.</p>
                  </div>
                  
                  <div className="border-l-4 border-primary pl-4">
                    <div className="flex items-center mb-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-sm">"Great prices and genuine parts. Highly recommended!"</p>
                    <p className="text-xs text-muted-foreground">- Priya M.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Service Locations */}
        <div className="mt-12">
          <h2 className="text-3xl font-bold text-center mb-8">Our Service Centers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {locations.map((location, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    {location.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">{location.address}</p>
                  
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-primary" />
                    <span className="text-sm">{location.phone}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <span className="text-sm">{location.hours}</span>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium mb-1">Services Available:</p>
                    <div className="flex flex-wrap gap-1">
                      {location.services.map((service, serviceIndex) => (
                        <span 
                          key={serviceIndex}
                          className="text-xs bg-primary/10 text-primary px-2 py-1 rounded"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <Button variant="outline" className="w-full" size="sm">
                      Get Directions
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Emergency Contact */}
        <Card className="mt-8 bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2 text-primary">Emergency Repair Service</h3>
              <p className="text-muted-foreground mb-4">
                Need urgent repair? Our emergency service is available 24/7 for critical device issues.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg">
                  <Phone className="h-4 w-4 mr-2" />
                  Emergency Hotline
                </Button>
                <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="lg">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Emergency WhatsApp
                  </Button>
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ContactPage;