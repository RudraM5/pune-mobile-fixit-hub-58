import { Card, CardContent } from "@/components/ui/card";
import { Shield, ShieldCheck, Award, Users } from "lucide-react";
import { trustBadges } from "@/data/reviewsData";

const iconMap = {
  "shield": Shield,
  "shield-check": ShieldCheck,
  "award": Award,
  "users": Users,
};

export function TrustBadges() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {trustBadges.map((badge) => {
        const IconComponent = iconMap[badge.icon as keyof typeof iconMap] || Shield;
        
        return (
          <Card key={badge.id} className="transition-all duration-300 hover:shadow-lg hover:scale-105 group">
            <CardContent className="p-6 text-center">
              <div className="mx-auto h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3 transition-all duration-300 group-hover:bg-primary/20">
                <IconComponent className="h-6 w-6 text-primary transition-transform duration-300 group-hover:scale-110" />
              </div>
              <h3 className="font-semibold text-sm mb-1">{badge.title}</h3>
              <p className="text-xs text-muted-foreground">{badge.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}