import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { Service } from "@/types/booking";
import { services, serviceCategories } from "@/data/services";

interface ServicesSelectorProps {
  onAddToCart: (service: Service) => void;
}

const ServicesSelector = ({ onAddToCart }: ServicesSelectorProps) => {
  return (
    <div className="space-y-6">
      {serviceCategories.map(category => (
        <Card key={category.id}>
          <CardHeader>
            <CardTitle>{category.name}</CardTitle>
            <CardDescription>{category.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services
                .filter(service => service.category === category.id)
                .map(service => (
                  <Card key={service.id} className="transition-all hover:shadow-md">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold">{service.name}</h4>
                        <span className="text-lg font-bold text-primary">₹{service.price}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{service.description}</p>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="h-4 w-4 mr-1" />
                          {service.duration}
                        </div>
                        <Button size="sm" onClick={() => onAddToCart(service)}>
                          Add to Cart
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              }
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ServicesSelector;