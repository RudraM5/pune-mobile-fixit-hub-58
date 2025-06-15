import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Clock, MapPin, TrendingUp } from "lucide-react";

export function SocialProofSection() {
  const liveStats = [
    {
      icon: Users,
      value: "24",
      label: "customers served today",
      color: "text-green-600"
    },
    {
      icon: Clock,
      value: "2 mins",
      label: "avg response time",
      color: "text-blue-600"
    },
    {
      icon: MapPin,
      value: "Pune",
      label: "serving all areas",
      color: "text-purple-600"
    },
    {
      icon: TrendingUp,
      value: "98%",
      label: "success rate",
      color: "text-orange-600"
    }
  ];

  const recentActivity = [
    "Priya S. just booked a screen replacement in Koregaon Park",
    "Rahul M. completed battery repair in Baner - 5⭐ rating",
    "Sneha K. picked up device in Wakad for water damage repair",
    "Amit P. just left a review: 'Excellent service and quick turnaround!'"
  ];

  return (
    <div className="space-y-6">
      {/* Live Stats */}
      <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {liveStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div className={`text-2xl font-bold ${stat.color}`}>
                  {stat.value}
                </div>
                <div className="text-xs text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity Feed */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            Recent Activity
          </h3>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 transition-all duration-300 hover:bg-muted/50">
                <div className="h-2 w-2 bg-green-500 rounded-full mt-2 animate-pulse"></div>
                <p className="text-sm text-muted-foreground flex-1">
                  {activity}
                </p>
                <Badge variant="outline" className="text-xs">
                  {Math.floor(Math.random() * 30) + 1}m ago
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}