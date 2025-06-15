import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BeforeAfter } from "@/data/reviewsData";

interface BeforeAfterCardProps {
  item: BeforeAfter;
  className?: string;
}

export function BeforeAfterCard({ item, className }: BeforeAfterCardProps) {
  const [showAfter, setShowAfter] = useState(false);

  return (
    <Card className={`transition-all duration-300 hover:shadow-xl hover:scale-105 group overflow-hidden ${className}`}>
      <div className="relative aspect-[4/3] overflow-hidden">
        <img 
          src={showAfter ? item.afterImage : item.beforeImage}
          alt={`${showAfter ? 'After' : 'Before'} - ${item.title}`}
          className="w-full h-full object-cover transition-all duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        
        <div className="absolute top-4 left-4">
          <Badge variant={showAfter ? "default" : "destructive"} className="text-xs font-medium">
            {showAfter ? "After" : "Before"}
          </Badge>
        </div>
        
        <div className="absolute bottom-4 left-4 right-4">
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={() => setShowAfter(!showAfter)}
            className="w-full bg-background/90 backdrop-blur-sm hover:bg-background transition-all duration-300"
          >
            Show {showAfter ? "Before" : "After"}
          </Button>
        </div>
      </div>
      
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-heading">{item.title}</CardTitle>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="text-xs">
            {item.serviceType}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {item.deviceModel}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-sm text-muted-foreground leading-relaxed mb-3">
          {item.description}
        </p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Repaired by:</span>
          <span className="font-medium text-primary">{item.technicianName}</span>
        </div>
      </CardContent>
    </Card>
  );
}