import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wrench, CheckCircle, Clock } from "lucide-react";

interface RepairActivity {
  id: number;
  device: string;
  action: string;
  time: string;
  status: 'completed' | 'in-progress' | 'starting';
}

export function LiveRepairCounter() {
  const [repairsToday, setRepairsToday] = useState(47);
  const [currentlyRepairing, setCurrentlyRepairing] = useState(8);
  const [recentActivity, setRecentActivity] = useState<RepairActivity[]>([
    { id: 1, device: "iPhone 15 Pro", action: "Screen replacement completed", time: "2 min ago", status: 'completed' },
    { id: 2, device: "Samsung Galaxy S24", action: "Battery replacement in progress", time: "5 min ago", status: 'in-progress' },
    { id: 3, device: "OnePlus 12", action: "Water damage treatment started", time: "8 min ago", status: 'starting' },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time updates
      const random = Math.random();
      
      if (random > 0.7) {
        setRepairsToday(prev => prev + 1);
        
        const devices = ["iPhone 15 Pro", "Samsung Galaxy S24", "OnePlus 12", "Xiaomi 14", "Google Pixel 8"];
        const actions = ["Screen replacement completed", "Battery replacement completed", "Camera repair finished", "Charging port repair done"];
        
        const newActivity: RepairActivity = {
          id: Date.now(),
          device: devices[Math.floor(Math.random() * devices.length)],
          action: actions[Math.floor(Math.random() * actions.length)],
          time: "Just now",
          status: 'completed'
        };
        
        setRecentActivity(prev => [newActivity, ...prev.slice(0, 2)]);
      }
      
      if (random > 0.8) {
        setCurrentlyRepairing(prev => Math.max(1, prev + (Math.random() > 0.5 ? 1 : -1)));
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="animate-fade-in border-primary/20 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold font-heading mb-2 flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            Live from Our Service Centers
          </h3>
          <p className="text-sm text-muted-foreground">Real-time repair activity across Pune</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center p-4 bg-primary/5 rounded-lg">
            <div className="text-2xl font-bold text-primary font-display animate-pulse-slow">{repairsToday}</div>
            <div className="text-sm text-muted-foreground">Repairs Today</div>
          </div>
          <div className="text-center p-4 bg-primary/5 rounded-lg">
            <div className="text-2xl font-bold text-primary font-display animate-pulse-slow">{currentlyRepairing}</div>
            <div className="text-sm text-muted-foreground">In Progress</div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="text-sm font-medium text-muted-foreground mb-2">Recent Activity:</div>
          {recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg animate-fade-in">
              <div className={`p-1 rounded-full ${
                activity.status === 'completed' 
                  ? 'bg-green-100 text-green-600' 
                  : activity.status === 'in-progress'
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-orange-100 text-orange-600'
              }`}>
                {activity.status === 'completed' ? (
                  <CheckCircle className="w-3 h-3" />
                ) : activity.status === 'in-progress' ? (
                  <Wrench className="w-3 h-3 animate-pulse" />
                ) : (
                  <Clock className="w-3 h-3" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{activity.device}</div>
                <div className="text-xs text-muted-foreground">{activity.action}</div>
              </div>
              <Badge variant="outline" className="text-xs">
                {activity.time}
              </Badge>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-border/50 text-center">
          <div className="text-xs text-muted-foreground">
            Average repair time: <span className="text-primary font-medium">2.5 hours</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}