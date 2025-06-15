import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { StarRating } from "./StarRating";
import { VideoTestimonial } from "@/data/reviewsData";
import { Video } from "lucide-react";

interface VideoTestimonialCardProps {
  testimonial: VideoTestimonial;
  className?: string;
}

export function VideoTestimonialCard({ testimonial, className }: VideoTestimonialCardProps) {
  return (
    <Card className={`transition-all duration-300 hover:shadow-xl hover:scale-105 group overflow-hidden ${className}`}>
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={testimonial.thumbnailUrl}
          alt={`Video testimonial - ${testimonial.title}`}
          className="w-full h-full object-cover transition-all duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center transition-all duration-300 group-hover:bg-black/60">
          <Dialog>
            <DialogTrigger asChild>
              <Button size="lg" className="bg-primary/90 hover:bg-primary text-primary-foreground rounded-full p-4">
                <Video className="h-6 w-6" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl p-0">
              <div className="aspect-video">
                <iframe
                  src={testimonial.videoUrl}
                  title={testimonial.title}
                  className="w-full h-full rounded-lg"
                  allowFullScreen
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="absolute top-4 right-4">
          <StarRating rating={testimonial.rating} size="sm" />
        </div>
      </div>
      
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-heading">{testimonial.title}</CardTitle>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">
            {testimonial.customerName}
          </span>
          <Badge variant="secondary" className="text-xs">
            {testimonial.serviceType}
          </Badge>
        </div>
      </CardHeader>
    </Card>
  );
}