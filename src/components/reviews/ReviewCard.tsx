import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StarRating } from "./StarRating";
import { CheckCircle } from "lucide-react";
import { Review } from "@/data/reviewsData";

interface ReviewCardProps {
  review: Review;
  className?: string;
}

export function ReviewCard({ review, className }: ReviewCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card className={`transition-all duration-300 hover:shadow-lg hover:scale-105 ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage 
              src={review.customerPhoto} 
              alt={review.customerName}
              className="object-cover"
            />
            <AvatarFallback className="bg-primary/10 text-primary font-medium">
              {review.customerName.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-foreground">
                  {review.customerName}
                </h4>
                {review.verified && (
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-xs text-green-600 font-medium">Verified</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <StarRating rating={review.rating} size="sm" />
                <span className="text-xs text-muted-foreground">
                  {formatDate(review.date)}
                </span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="text-xs">
                {review.serviceType}
              </Badge>
              {review.deviceModel && (
                <Badge variant="outline" className="text-xs">
                  {review.deviceModel}
                </Badge>
              )}
            </div>
            
            <p className="text-muted-foreground leading-relaxed">
              {review.reviewText}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}