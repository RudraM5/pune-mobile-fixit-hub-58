import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import Header from "@/components/layout/Header";
import { ReviewCard } from "@/components/reviews/ReviewCard";
import { StarRating } from "@/components/reviews/StarRating";
import { reviews } from "@/data/reviewsData";
import { Search, Filter } from "lucide-react";

const ReviewsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRating, setFilterRating] = useState<string>("all");
  const [filterService, setFilterService] = useState<string>("all");

  const serviceTypes = [...new Set(reviews.map(review => review.serviceType))];
  const avgRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.reviewText.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.serviceType.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRating = filterRating === "all" || 
                         (filterRating === "5" && review.rating === 5) ||
                         (filterRating === "4" && review.rating === 4) ||
                         (filterRating === "3" && review.rating <= 3);
    
    const matchesService = filterService === "all" || review.serviceType === filterService;
    
    return matchesSearch && matchesRating && matchesService;
  });

  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(r => r.rating === rating).length,
    percentage: (reviews.filter(r => r.rating === rating).length / reviews.length) * 100
  }));

  return (
    <div className="min-h-screen bg-background">
      <Header cartItems={0} />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/10 via-primary/5 to-background py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent font-heading">
              Customer Reviews
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Read what our customers have to say about their repair experience
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="flex items-center gap-2">
                <StarRating rating={avgRating} size="lg" showValue />
                <span className="text-lg font-medium">Average Rating</span>
              </div>
              <Badge variant="secondary" className="text-lg px-4 py-2">
                {reviews.length} Total Reviews
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Stats & Filters Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Rating Distribution */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="text-lg">Rating Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {ratingDistribution.map(({ rating, count, percentage }) => (
                  <div key={rating} className="flex items-center gap-3">
                    <div className="flex items-center gap-1 min-w-[60px]">
                      <span className="text-sm font-medium">{rating}</span>
                      <StarRating rating={1} maxRating={1} size="sm" />
                    </div>
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground min-w-[30px]">
                      {count}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Reviews List */}
            <div className="lg:col-span-3 space-y-6">
              {/* Search and Filters */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search reviews..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Select value={filterRating} onValueChange={setFilterRating}>
                      <SelectTrigger className="w-full md:w-[180px]">
                        <SelectValue placeholder="Filter by rating" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Ratings</SelectItem>
                        <SelectItem value="5">5 Stars</SelectItem>
                        <SelectItem value="4">4 Stars</SelectItem>
                        <SelectItem value="3">3 Stars & Below</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={filterService} onValueChange={setFilterService}>
                      <SelectTrigger className="w-full md:w-[200px]">
                        <SelectValue placeholder="Filter by service" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Services</SelectItem>
                        {serviceTypes.map(service => (
                          <SelectItem key={service} value={service}>
                            {service}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Reviews Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredReviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>

              {filteredReviews.length === 0 && (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No reviews found</h3>
                    <p className="text-muted-foreground">
                      Try adjusting your search criteria or filters
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ReviewsPage;