import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StarRating } from "./StarRating";
import { Technician } from "@/data/reviewsData";

interface TechnicianCardProps {
  technician: Technician;
  className?: string;
}

export function TechnicianCard({ technician, className }: TechnicianCardProps) {
  return (
    <Card className={`transition-all duration-300 hover:shadow-xl hover:scale-105 group ${className}`}>
      <CardHeader className="text-center pb-3">
        <Avatar className="h-24 w-24 mx-auto mb-4 ring-4 ring-primary/10 transition-all duration-300 group-hover:ring-primary/20">
          <AvatarImage 
            src={technician.photo} 
            alt={technician.name}
            className="object-cover"
          />
          <AvatarFallback className="bg-primary/10 text-primary text-lg font-bold">
            {technician.name.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        <h3 className="text-xl font-semibold text-foreground font-heading">
          {technician.name}
        </h3>
        <div className="flex justify-center">
          <StarRating rating={technician.rating} showValue size="sm" />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-primary">
              {technician.experienceYears}
            </div>
            <div className="text-xs text-muted-foreground">Years Experience</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary">
              {technician.totalRepairs.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">Repairs Done</div>
          </div>
        </div>
        
        <div className="space-y-3">
          <div>
            <h4 className="text-sm font-medium text-foreground mb-2">Specializations</h4>
            <div className="flex flex-wrap gap-1">
              {technician.specialization.map((spec, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {spec}
                </Badge>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-foreground mb-2">Certifications</h4>
            <div className="flex flex-wrap gap-1">
              {technician.certifications.map((cert, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {cert}
                </Badge>
              ))}
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground leading-relaxed">
            {technician.bio}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}