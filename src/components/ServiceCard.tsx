import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Star } from "lucide-react";

interface ServiceCardProps {
  title: string;
  description: string;
  price: string;
  duration: string;
  rating: number;
  popular?: boolean;
  onSelect: () => void;
}

const ServiceCard = ({ 
  title, 
  description, 
  price, 
  duration, 
  rating, 
  popular = false, 
  onSelect 
}: ServiceCardProps) => {
  return (
    <Card className={`relative vibrant-card service-card-hover ${popular ? 'ring-2 ring-neon-pink shadow-lg shadow-neon-pink/25' : ''}`}>
      {popular && (
        <Badge className="absolute -top-2 left-4 glow-button text-white shadow-lg" style={{ background: 'linear-gradient(45deg, #ff006e, #8338ec)' }}>
          Most Popular
        </Badge>
      )}
      <CardHeader>
        <CardTitle className="text-lg neon-text">{title}</CardTitle>
        <CardDescription className="text-sm text-foreground">{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold neon-text">₹{price}</div>
          <div className="flex items-center text-sm text-foreground">
            <Clock className="h-4 w-4 mr-1 text-electric-blue" />
            {duration}
          </div>
        </div>
        <div className="flex items-center">
          <Star className="h-4 w-4 text-golden fill-current" />
          <span className="ml-1 text-sm text-foreground">{rating}/5</span>
        </div>
        <Button className="w-full glow-button text-white shadow-lg" style={{ background: 'linear-gradient(45deg, #8338ec, #3a86ff)' }} onClick={onSelect}>
          Select Service
        </Button>
      </CardContent>
    </Card>
  );
};

export default ServiceCard;