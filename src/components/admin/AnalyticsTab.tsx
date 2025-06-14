import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Analytics, ServicePerformance, MonthlyRevenue } from "@/types/admin";

interface AnalyticsTabProps {
  analytics: Analytics;
  servicePerformance: ServicePerformance[];
  monthlyRevenue: MonthlyRevenue[];
}

const AnalyticsTab = ({ analytics, servicePerformance, monthlyRevenue }: AnalyticsTabProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Service Performance</CardTitle>
            <CardDescription>Most requested services this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {servicePerformance.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm">{item.service}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground">{item.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue</CardTitle>
            <CardDescription>Revenue breakdown by month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {monthlyRevenue.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm">{item.month}</span>
                  <div className="text-right">
                    <p className="font-medium">₹{item.revenue.toLocaleString()}</p>
                    <p className="text-xs text-green-600">{item.growth}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Key Metrics</CardTitle>
          <CardDescription>Important business metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{analytics.customerSatisfaction}</p>
              <p className="text-sm text-muted-foreground">Customer Rating</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">98%</p>
              <p className="text-sm text-muted-foreground">Success Rate</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">1.2hr</p>
              <p className="text-sm text-muted-foreground">Avg Response</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">85%</p>
              <p className="text-sm text-muted-foreground">Repeat Customers</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsTab;