import React from "react";
import { Badge } from "@/components/ui/badge";
import { RepairRequest } from "@/types/admin";

export const getStatusBadge = (status: string) => {
  const variants = {
    pending: "destructive",
    "in-progress": "default",
    completed: "secondary",
    delivered: "default"
  } as const;
  
  return React.createElement(Badge, { 
    variant: variants[status as keyof typeof variants] || "default" 
  }, status);
};

export const getPriorityBadge = (priority: string) => {
  const variants = {
    low: "secondary",
    medium: "default", 
    high: "destructive"
  } as const;
  
  return React.createElement(Badge, { 
    variant: variants[priority as keyof typeof variants] || "default" 
  }, priority);
};

export const updateRequestStatus = (requestId: string, newStatus: string) => {
  // In real app, this would update the backend
  console.log(`Updating request ${requestId} to status: ${newStatus}`);
};

export const filterRequests = (
  requests: RepairRequest[], 
  searchTerm: string, 
  statusFilter: string
): RepairRequest[] => {
  return requests.filter(request => {
    const matchesSearch = request.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.device.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || request.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
};