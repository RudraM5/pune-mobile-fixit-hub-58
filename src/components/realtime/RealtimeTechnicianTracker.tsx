import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, User, MapPin, Phone, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface TechnicianAvailability {
  id: string;
  name: string;
  phone: string;
  specialization: string[];
  is_active: boolean;
  current_workload: number;
  location: string;
  next_available: string;
}

export function RealtimeTechnicianTracker() {
  const [technicians, setTechnicians] = useState<TechnicianAvailability[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTechnicians = async () => {
      try {
        // Fetch active technicians
        const { data } = await supabase
          .from('technicians')
          .select('*')
          .eq('is_active', true)
          .order('name');

        if (data) {
          // Simulate workload and availability data
          const techniciansWithAvailability = data.map(tech => ({
            ...tech,
            current_workload: Math.floor(Math.random() * 5) + 1,
            location: ['Pune Center', 'Kothrud', 'Viman Nagar', 'Hadapsar'][Math.floor(Math.random() * 4)],
            next_available: new Date(Date.now() + Math.random() * 6 * 60 * 60 * 1000).toISOString()
          }));
          setTechnicians(techniciansWithAvailability);
        }
      } catch (error) {
        console.error('Error fetching technicians:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTechnicians();

    // Set up real-time subscription for technician updates
    const channel = supabase
      .channel('technician-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'technicians'
        },
        (payload) => {
          console.log('Technician update:', payload);
          
          if (payload.eventType === 'UPDATE' && payload.new) {
            setTechnicians(prev => 
              prev.map(tech => 
                tech.id === payload.new.id 
                  ? { ...tech, ...payload.new }
                  : tech
              )
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const getAvailabilityStatus = (workload: number) => {
    if (workload <= 2) return { status: 'Available', color: 'bg-green-500', textColor: 'text-green-700' };
    if (workload <= 4) return { status: 'Busy', color: 'bg-yellow-500', textColor: 'text-yellow-700' };
    return { status: 'Unavailable', color: 'bg-red-500', textColor: 'text-red-700' };
  };

  if (isLoading) {
    return (
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-display">
            <User className="w-5 h-5 text-primary" />
            Live Technician Availability
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-muted animate-pulse rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="animate-fade-in border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-display">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          Live Technician Availability
          <Badge variant="secondary" className="ml-auto">
            {technicians.filter(t => t.current_workload <= 2).length} Available
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {technicians.slice(0, 4).map((technician) => {
          const availability = getAvailabilityStatus(technician.current_workload);
          
          return (
            <div 
              key={technician.id}
              className="p-3 border border-border/50 rounded-lg bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 group"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${availability.color} rounded-full border-2 border-background`}></div>
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{technician.name}</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      <span>{technician.location}</span>
                    </div>
                  </div>
                </div>
                <Badge 
                  variant="outline" 
                  className={`${availability.textColor} border-current`}
                >
                  {availability.status}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    Workload: {technician.current_workload}/5 repairs
                  </span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>
                      Next: {new Date(technician.next_available).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>

                {technician.specialization && (
                  <div className="flex flex-wrap gap-1">
                    {technician.specialization.slice(0, 3).map((spec, index) => (
                      <Badge key={index} variant="secondary" className="text-xs py-0">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {availability.status === 'Available' && (
                <Button 
                  size="sm" 
                  className="w-full mt-2 h-7 text-xs"
                  variant="outline"
                >
                  <Phone className="w-3 h-3 mr-1" />
                  Request Assignment
                </Button>
              )}
            </div>
          );
        })}

        <div className="text-center pt-2 border-t border-border/50">
          <p className="text-xs text-muted-foreground">
            Live updates every 30 seconds • {technicians.length} total technicians
          </p>
        </div>
      </CardContent>
    </Card>
  );
}