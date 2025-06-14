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
    <Card className={`relative transition-all duration-200 hover:shadow-lg hover:scale-105 ${popular ? 'ring-2 ring-primary' : ''}`}>
      {popular && (
        <Badge className="absolute -top-2 left-4 bg-primary">
          Most Popular
        </Badge>
      )}
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription className="text-sm">{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-primary">₹{price}</div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="h-4 w-4 mr-1" />
            {duration}
          </div>
        </div>
        <div className="flex items-center">
          <Star className="h-4 w-4 text-yellow-500 fill-current" />
          <span className="ml-1 text-sm text-muted-foreground">{rating}/5</span>
        </div>
        <Button className="w-full" onClick={onSelect}>
          Select Service
        </Button>
      </CardContent>
    </Card>
  );
};

export default ServiceCard;