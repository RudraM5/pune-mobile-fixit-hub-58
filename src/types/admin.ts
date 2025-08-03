export interface RepairRequest {
  id: string;
  customerName: string;
  phone: string;
  device: string;
  services: string[];
  status: "pending" | "in-progress" | "completed" | "delivered";
  priority: "low" | "medium" | "high";
  createdAt: string;
  estimatedCompletion: string;
  totalAmount: number;
  technician?: string;
}

export interface Analytics {
  totalRequests: number;
  pendingRequests: number;
  inProgressRequests: number;
  completedToday: number;
  revenue: number;
  avgRepairTime: string;
  customerSatisfaction: number;
  topTechnician: string;
  successRate: number;
  firstCallResolution: number;
  averageResponseTime: string;
  peakHours: string;
  topPerformingArea: string;
  qualityScore: number;
  repeatCustomerRate: number;
  monthlyGrowth: number;
}

export interface ServicePerformance {
  service: string;
  count: number;
  percentage: number;
}

export interface MonthlyRevenue {
  month: string;
  revenue: number;
  growth: string;
}