import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Wrench, 
  Clock, 
  CheckCircle, 
  CreditCard,
  TrendingUp,
  Calendar
} from 'lucide-react';
import { CustomerStats } from '@/hooks/useCustomerData';

interface StatsCardsProps {
  stats: CustomerStats;
  loading?: boolean;
}

export function StatsCards({ stats, loading }: StatsCardsProps) {
  const statsData = [
    {
      title: 'Total Repairs',
      value: stats.totalRepairs,
      icon: Wrench,
      description: 'All time repairs',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Active Repairs',
      value: stats.activeRepairs,
      icon: Clock,
      description: 'Currently in progress',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      title: 'Completed',
      value: stats.completedRepairs,
      icon: CheckCircle,
      description: 'Successfully finished',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Total Spent',
      value: `₹${stats.totalSpent.toLocaleString()}`,
      icon: CreditCard,
      description: 'Lifetime spending',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-muted rounded w-20"></div>
              <div className="h-4 w-4 bg-muted rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-16 mb-1"></div>
              <div className="h-3 bg-muted rounded w-24"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsData.map((stat) => (
        <Card 
          key={stat.title} 
          className="transition-all duration-300 hover:shadow-lg hover:scale-105 group cursor-pointer"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${stat.bgColor} transition-all duration-300 group-hover:scale-110`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}