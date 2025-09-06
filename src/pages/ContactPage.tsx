import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Header from "@/components/layout/Header";
import { useToast } from "@/hooks/use-toast";
import { Phone, MapPin, Clock, MessageCircle, Mail, Star } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

const ContactPage = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const payload = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      device: formData.get("device") as string,
      subject: formData.get("subject") as string,
      message: formData.get("message") as string,
    };

    try {
      const res = await fetch(`${API_BASE_URL}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      toast({
        title: "Message Sent ✅",
        description: "Thank you for contacting us. We'll get back to you within 2 hours.",
      });

      form.reset();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Something went wrong. Try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input name="firstName" id="firstName" placeholder="Enter your first name" required />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input name="lastName" id="lastName" placeholder="Enter your last name" required />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input name="email" id="email" type="email" placeholder="your.email@example.com" required />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input name="phone" id="phone" placeholder="+91 98765 43210" required />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="device">Device Model (Optional)</Label>
                    <Input name="device" id="device" placeholder="e.g., iPhone 15 Pro, Samsung Galaxy S24" />
                  </div>

                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Input name="subject" id="subject" placeholder="What can we help you with?" required />
                  </div>

                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea 
                      name="message"
                      id="message" 
                      placeholder="Describe your issue or question in detail..."
                      rows={4}
                      required
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button type="submit" className="flex-1" disabled={isSubmitting}>
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                    <a href="https://wa.me/919325673075" target="_blank" rel="noopener noreferrer" className="flex-1">
                      <Button type="button" variant="outline" className="w-full">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        WhatsApp Instead
                      </Button>
                    </a>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Right side (unchanged) ... */}
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
