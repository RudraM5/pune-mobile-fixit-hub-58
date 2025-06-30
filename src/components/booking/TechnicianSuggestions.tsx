
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Clock, Phone, CheckCircle, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { EnhancedTechnician } from "@/types/shop";
import { Service } from "@/types/booking";

interface TechnicianSuggestion {
  technician: EnhancedTechnician;
  matchingServices: string[];
  distance?: number;
  estimatedPrice: number;
}

interface TechnicianSuggestionsProps {
  selectedServices: Service[];
  customerArea?: string;
  onSelectTechnician: (technician: EnhancedTechnician) => void;
}

const TechnicianSuggestions = ({ 
  selectedServices, 
  customerArea = "Pune Center",
  onSelectTechnician 
}: TechnicianSuggestionsProps) => {
  const [suggestions, setSuggestions] = useState<TechnicianSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTechnicianSuggestions = async () => {
      try {
        setIsLoading(true);

        // Get service categories from selected services
        const serviceCategories = selectedServices.map(s => s.category);
        
        // Fetch technicians with basic data (fallback to current schema)
        const { data: technicians, error } = await supabase
          .from('technicians')
          .select('*')
          .eq('is_active', true);

        if (error) {
          console.error('Error fetching technicians:', error);
          return;
        }

        if (technicians) {
          // Create enhanced technician objects with mock data until migration is applied
          const enhancedTechnicians = technicians.map(tech => ({
            id: tech.id,
            user_id: tech.user_id,
            name: tech.name,
            phone: tech.phone,
            email: tech.email,
            shop_id: tech.id, // Mock shop_id
            shop: {
              id: tech.id,
              name: `${tech.name}'s Mobile Repair Shop`,
              owner_name: tech.name,
              phone: tech.phone,
              email: tech.email,
              address: `Shop Address, ${customerArea}`,
              area: customerArea,
              is_active: true,
              rating: 4.5,
              total_repairs: 100,
              created_at: tech.created_at,
              updated_at: tech.updated_at
            },
            specialization: tech.specialization || [],
            expertise_level: 'expert' as const,
            years_experience: 5,
            rating: 4.5,
            completed_repairs: 80,
            availability_status: 'available' as const,
            hourly_rate: 300,
            area: customerArea,
            is_active: tech.is_active,
            created_at: tech.created_at,
            updated_at: tech.updated_at
          }));

          // Filter and score technicians based on specialization match
          const scoredTechnicians = enhancedTechnicians
            .filter(tech => {
              // Check if technician specialization matches any of the required service categories
              const techSpecializations = tech.specialization || [];
              return serviceCategories.some(cat => 
                techSpecializations.some(spec => 
                  spec.toLowerCase().includes(cat.toLowerCase()) ||
                  cat.toLowerCase().includes(spec.toLowerCase())
                )
              );
            })
            .map(tech => {
              const matchingServices = serviceCategories.filter(cat => 
                tech.specialization?.some(spec => 
                  spec.toLowerCase().includes(cat.toLowerCase()) ||
                  cat.toLowerCase().includes(spec.toLowerCase())
                ) || false
              );

              // Calculate estimated price
              const basePrice = selectedServices.reduce((sum, service) => sum + service.price, 0);
              const expertiseBonus = tech.expertise_level === 'master' ? 1.2 : 
                                   tech.expertise_level === 'expert' ? 1.1 : 1.0;
              const estimatedPrice = Math.round(basePrice * expertiseBonus);

              // Calculate mock distance
              const distance = Math.random() * 5 + 1;

              return {
                technician: tech,
                matchingServices,
                distance,
                estimatedPrice
              };
            })
            .sort((a, b) => {
              // Sort by rating, then by experience
              if (a.technician.rating !== b.technician.rating) return b.technician.rating - a.technician.rating;
              return b.technician.years_experience - a.technician.years_experience;
            })
            .slice(0, 6);

          setSuggestions(scoredTechnicians);
        }
      } catch (error) {
        console.error('Error fetching technician suggestions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (selectedServices.length > 0) {
      fetchTechnicianSuggestions();
    }
  }, [selectedServices, customerArea]);

  const getExpertiseColor = (level: string) => {
    switch (level) {
      case 'master': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'expert': return 'bg-green-100 text-green-800 border-green-200';
      case 'intermediate': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (selectedServices.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Select services to see suggested technicians</p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Finding Expert Technicians...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-muted animate-pulse rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5 text-primary" />
          Suggested Expert Technicians
          <Badge variant="secondary">{suggestions.length} available</Badge>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Based on your location ({customerArea}) and selected services
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {suggestions.map((suggestion) => (
          <div 
            key={suggestion.technician.id}
            className="p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold">{suggestion.technician.name}</h4>
                  <Badge className={getExpertiseColor(suggestion.technician.expertise_level)}>
                    {suggestion.technician.expertise_level}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>{suggestion.technician.rating}</span>
                    <span>({suggestion.technician.completed_repairs} repairs)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{suggestion.technician.years_experience}+ years</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{suggestion.distance?.toFixed(1)}km away</span>
                  </div>
                </div>

                <div className="mb-2">
                  <p className="text-sm font-medium mb-1">Shop: {suggestion.technician.shop?.name}</p>
                  <p className="text-xs text-muted-foreground">{suggestion.technician.shop?.address}</p>
                </div>

                <div className="flex flex-wrap gap-1 mb-2">
                  {suggestion.technician.specialization.map((service, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {service}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="text-right">
                <p className="text-lg font-bold text-primary">₹{suggestion.estimatedPrice}</p>
                <p className="text-xs text-muted-foreground">estimated total</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                size="sm" 
                className="flex-1"
                onClick={() => onSelectTechnician(suggestion.technician)}
              >
                Select Technician
              </Button>
              <Button size="sm" variant="outline">
                <Phone className="w-4 h-4 mr-1" />
                Call Shop
              </Button>
            </div>
          </div>
        ))}
        
        {suggestions.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No technicians available for selected services in {customerArea}</p>
            <p className="text-sm">Try selecting a different area or contact us directly</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TechnicianSuggestions;
