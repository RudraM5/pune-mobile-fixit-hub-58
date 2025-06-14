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
    <Card className={`relative transition-all duration-300 hover:shadow-2xl hover:scale-105 service-card-hover ${popular ? 'ring-2 ring-purple-500 shadow-lg shadow-purple-500/25' : 'hover:shadow-blue-500/25'}`}>
      {popular && (
        <Badge className="absolute -top-2 left-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg">
          Most Popular
        </Badge>
      )}
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription className="text-sm">{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-gradient">₹{price}</div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="h-4 w-4 mr-1" />
            {duration}
          </div>
        </div>
        <div className="flex items-center">
          <Star className="h-4 w-4 text-yellow-500 fill-current" />
          <span className="ml-1 text-sm text-muted-foreground">{rating}/5</span>
        </div>
        <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg" onClick={onSelect}>
          Select Service
        </Button>
      </CardContent>
    </Card>
  );
};

export default ServiceCard;