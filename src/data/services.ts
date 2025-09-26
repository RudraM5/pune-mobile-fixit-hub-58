import { Service } from "@/types/booking";
import { getServices, getServiceCategories } from "@/lib/supabase";

// Static fallback data
export const staticServices: Service[] = [
  // Basic Repairs
  { id: "1", name: "Screen Replacement", description: "High-quality OLED/LCD display replacement", price: 1500, duration: "30 mins", category: "basic" },
  { id: "2", name: "Battery Replacement", description: "Original capacity battery replacement", price: 1200, duration: "20 mins", category: "basic" },
  { id: "3", name: "Charging Port Repair", description: "Fix charging port issues", price: 800, duration: "45 mins", category: "basic" },
  { id: "4", name: "Speaker Repair", description: "Fix audio issues and speaker replacement", price: 600, duration: "30 mins", category: "basic" },
  
  // Advanced Repairs
  { id: "5", name: "Motherboard Repair", description: "Circuit board and chip-level repairs", price: 3500, duration: "2-4 hours", category: "advanced" },
  { id: "6", name: "Water Damage Treatment", description: "Complete liquid damage recovery service", price: 2500, duration: "4-6 hours", category: "advanced" },
  { id: "7", name: "Camera Repair", description: "Front/rear camera module replacement", price: 1800, duration: "45 mins", category: "advanced" },
  { id: "8", name: "Face ID/Touch ID Repair", description: "Biometric sensor repair", price: 2200, duration: "1 hour", category: "advanced" },
  
  // Accessories
  { id: "9", name: "Tempered Glass", description: "9H hardness screen protector", price: 200, duration: "5 mins", category: "accessories" },
  { id: "10", name: "Phone Cover", description: "Protective case installation", price: 300, duration: "2 mins", category: "accessories" },
  { id: "11", name: "Screen Guard", description: "Anti-glare screen protection", price: 150, duration: "5 mins", category: "accessories" },
  
  // Premium Services
  { id: "12", name: "On-Call Technician", description: "Technician visits your location", price: 500, duration: "Travel time", category: "premium" },
  { id: "13", name: "Express Service", description: "Priority repair service", price: 300, duration: "Half the time", category: "premium" },
  { id: "14", name: "Data Recovery", description: "Recover data from damaged devices", price: 1500, duration: "2-8 hours", category: "premium" }
];

export const serviceCategories = [
  { id: "basic", name: "Basic Repairs", description: "Common repair services" },
  { id: "advanced", name: "Advanced Repairs", description: "Complex technical repairs" },
  { id: "accessories", name: "Accessories", description: "Protective accessories" },
  { id: "premium", name: "Premium Services", description: "Special services" }
]