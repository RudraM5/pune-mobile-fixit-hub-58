import { RepairRequest, Analytics, ServicePerformance, MonthlyRevenue } from "@/types/admin";

export const mockRepairRequests: RepairRequest[] = [
  {
    id: "REP001",
    customerName: "Rahul Sharma",
    phone: "+91 98765 43210",
    device: "iPhone 15 Pro",
    services: ["Screen Replacement", "Battery Replacement"],
    status: "in-progress",
    priority: "high",
    createdAt: "2024-01-15T10:30:00Z",
    estimatedCompletion: "2024-01-15T16:00:00Z",
    totalAmount: 2700,
    technician: "Amit Kumar"
  },
  {
    id: "REP002",
    customerName: "Priya Patel",
    phone: "+91 87654 32109",
    device: "Samsung Galaxy S24",
    services: ["Water Damage Treatment"],
    status: "pending",
    priority: "medium",
    createdAt: "2024-01-15T11:15:00Z",
    estimatedCompletion: "2024-01-16T14:00:00Z",
    totalAmount: 2500,
  },
  {
    id: "REP003",
    customerName: "Arjun Mehta",
    phone: "+91 76543 21098",
    device: "OnePlus 12",
    services: ["Charging Port Repair", "Tempered Glass"],
    status: "completed",
    priority: "low",
    createdAt: "2024-01-14T09:00:00Z",
    estimatedCompletion: "2024-01-14T15:00:00Z",
    totalAmount: 1000,
    technician: "Suresh Reddy"
  },
  {
    id: "REP004",
    customerName: "Sneha Gupta",
    phone: "+91 65432 10987",
    device: "iPhone 14",
    services: ["Camera Repair"],
    status: "delivered",
    priority: "medium",
    createdAt: "2024-01-13T14:20:00Z",
    estimatedCompletion: "2024-01-14T10:00:00Z",
    totalAmount: 1800,
    technician: "Rajesh Singh"
  }
];

export const mockAnalytics: Analytics = {
  totalRequests: 156,
  pendingRequests: 12,
  inProgressRequests: 8,
  completedToday: 15,
  revenue: 45000,
  avgRepairTime: "2.5 hours",
  customerSatisfaction: 4.8,
  topTechnician: "Amit Kumar"
};

export const mockServicePerformance: ServicePerformance[] = [
  { service: "Screen Replacement", count: 45, percentage: 35 },
  { service: "Battery Replacement", count: 32, percentage: 25 },
  { service: "Water Damage", count: 18, percentage: 14 },
  { service: "Charging Port", count: 15, percentage: 12 },
  { service: "Camera Repair", count: 12, percentage: 9 }
];

export const mockMonthlyRevenue: MonthlyRevenue[] = [
  { month: "January", revenue: 45000, growth: "+12%" },
  { month: "December", revenue: 40000, growth: "+8%" },
  { month: "November", revenue: 37000, growth: "+15%" },
  { month: "October", revenue: 32000, growth: "+5%" }
];