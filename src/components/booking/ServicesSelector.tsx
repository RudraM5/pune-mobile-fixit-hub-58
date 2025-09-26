import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { Service } from "@/types/booking";
import { staticServices, serviceCategories } from "@/data/services";
import { getServices, getServiceCategories } from "@/lib/supabase";
import { useState, useEffect } from "react";

interface ServicesSelectorProps {
  onAddToCart: (service: Service) => void;
  onProceedToDetails: () => void;
  hasItemsInCart: boolean;
}

const ServicesSelector = ({ onAddToCart, onProceedToDetails, hasItemsInCart }: ServicesSelectorProps) => {
  const [services, setServices] = useState<Service[]>(staticServices);
  const [categories, setCategories] = useState(serviceCategories);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesData, categoriesData] = await Promise.all([
          getServices(),
          getServiceCategories()
        ]);
        
        // Transform Supabase data to match frontend interface
        const transformedServices = servicesData.map(service => ({
          id: service.id,
          name: service.name,
          description: service.description || '',
          price: service.price,
          duration: service.duration,
          category: service.category?.slug || 'basic'
        }));
        
        const transformedCategories = categoriesData.map(cat => ({
          id: cat.slug,
          name: cat.name,
          description: cat.description || ''
        }));
        
        setServices(transformedServices);
        setCategories(transformedCategories);
      } catch (error) {
        console.error('Error fetching services:', error);
        // Keep static data as fallback
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map(i => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-muted rounded w-1/3"></div>
              <div className="h-4 bg-muted rounded w-2/3"></div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2].map(j => (
                  <div key={j} className="h-32 bg-muted rounded"></div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {categories.map(category => (
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
      
      {hasItemsInCart && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground mb-4">
              Ready to proceed? Add your contact details to complete the booking.
            </p>
            <Button onClick={onProceedToDetails} size="lg" className="w-full md:w-auto">
              Proceed to Contact Details
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ServicesSelector;