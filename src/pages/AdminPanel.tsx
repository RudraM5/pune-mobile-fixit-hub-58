import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/layout/Header";
import OverviewTab from "@/components/admin/OverviewTab";
import RequestsTab from "@/components/admin/RequestsTab";
import AnalyticsTab from "@/components/admin/AnalyticsTab";
import SettingsTab from "@/components/admin/SettingsTab";
import { mockRepairRequests, mockAnalytics, mockServicePerformance, mockMonthlyRevenue } from "@/data/adminMockData";

const AdminPanel = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage repair requests, track analytics, and monitor service quality
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="requests">Repair Requests</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <OverviewTab />
          </TabsContent>

          <TabsContent value="requests">
            <RequestsTab />
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsTab 
              analytics={mockAnalytics}
              servicePerformance={mockServicePerformance}
              monthlyRevenue={mockMonthlyRevenue}
            />
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