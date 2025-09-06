import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/layout/Header";
import OverviewTab from "@/components/admin/OverviewTab";
import RequestsTab from "@/components/admin/RequestsTab";
import AnalyticsTab from "@/components/admin/AnalyticsTab";
import SettingsTab from "@/components/admin/SettingsTab";
import ShopsManagementTab from "@/components/admin/ShopsManagementTab";
import TechniciansManagementTab from "@/components/admin/TechniciansManagementTab";

// Types for API response (adjust if needed)
type AnalyticsData = {
  totalBookings: number;
  revenue: number;
  popularService: string;
};

type ServicePerformance = {
  service: string;
  count: number;
};

type MonthlyRevenue = {
  month: string;
  revenue: number;
};

const API_BASE = import.meta.env.VITE_API_URL || "https://mobilerepairwala-backend.onrender.com";

const AdminPanel = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [servicePerformance, setServicePerformance] = useState<ServicePerformance[]>([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState<MonthlyRevenue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/analytics`);
        if (!res.ok) throw new Error("Failed to fetch analytics");
        const data = await res.json();

        setAnalytics(data.analytics);
        setServicePerformance(data.servicePerformance);
        setMonthlyRevenue(data.monthlyRevenue);
      } catch (err) {
        console.error("Error fetching analytics:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage repair requests, shops, technicians, and monitor business performance
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="requests">Repair Requests</TabsTrigger>
            <TabsTrigger value="shops">Shops</TabsTrigger>
            <TabsTrigger value="technicians">Technicians</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <OverviewTab />
          </TabsContent>

          <TabsContent value="requests">
            <RequestsTab />
          </TabsContent>

          <TabsContent value="shops">
            <ShopsManagementTab />
          </TabsContent>

          <TabsContent value="technicians">
            <TechniciansManagementTab />
          </TabsContent>

          <TabsContent value="analytics">
            {loading ? (
              <p>Loading analytics...</p>
            ) : (
              <AnalyticsTab
                analytics={analytics}
                servicePerformance={servicePerformance}
                monthlyRevenue={monthlyRevenue}
              />
            )}
          </TabsContent>

          <TabsContent value="settings">
            <SettingsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;
