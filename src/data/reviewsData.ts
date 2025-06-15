export interface Review {
  id: string;
  customerName: string;
  customerPhoto?: string;
  rating: number;
  reviewText: string;
  serviceType: string;
  date: string;
  verified: boolean;
  deviceModel?: string;
}

export interface Technician {
  id: string;
  name: string;
  photo: string;
  specialization: string[];
  experienceYears: number;
  certifications: string[];
  rating: number;
  totalRepairs: number;
  bio: string;
}

export interface BeforeAfter {
  id: string;
  title: string;
  beforeImage: string;
  afterImage: string;
  deviceModel: string;
  serviceType: string;
  description: string;
  technicianName: string;
}

export interface VideoTestimonial {
  id: string;
  customerName: string;
  thumbnailUrl: string;
  videoUrl: string;
  title: string;
  serviceType: string;
  rating: number;
}

export const reviews: Review[] = [
  {
    id: "1",
    customerName: "Priya Sharma",
    customerPhoto: "https://images.unsplash.com/photo-1494790108755-2616b612b6b5?w=150&h=150&fit=crop&crop=face",
    rating: 5,
    reviewText: "Excellent service! My iPhone screen was replaced within 30 minutes and it looks brand new. The technician was very professional and explained everything clearly.",
    serviceType: "Screen Replacement",
    date: "2024-01-15",
    verified: true,
    deviceModel: "iPhone 14 Pro"
  },
  {
    id: "2",
    customerName: "Rohit Patel",
    customerPhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    rating: 5,
    reviewText: "Amazing experience! They picked up my phone from home, fixed the battery issue, and delivered it back the same day. Highly recommended!",
    serviceType: "Battery Replacement",
    date: "2024-01-12",
    verified: true,
    deviceModel: "Samsung Galaxy S23"
  },
  {
    id: "3",
    customerName: "Anita Desai",
    customerPhoto: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    rating: 4,
    reviewText: "Good service and fair pricing. The water damage repair took a bit longer than expected, but they kept me updated throughout the process.",
    serviceType: "Water Damage Repair",
    date: "2024-01-10",
    verified: true,
    deviceModel: "OnePlus 11"
  },
  {
    id: "4",
    customerName: "Vikram Singh",
    customerPhoto: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    rating: 5,
    reviewText: "Fantastic work! They managed to recover all my data from my damaged phone. The team is skilled and trustworthy.",
    serviceType: "Data Recovery",
    date: "2024-01-08",
    verified: true,
    deviceModel: "iPhone 13"
  },
  {
    id: "5",
    customerName: "Meera Joshi",
    rating: 5,
    reviewText: "Quick and professional service. Fixed my charging port issue in just 20 minutes. Will definitely come back for any future repairs.",
    serviceType: "Charging Port Repair",
    date: "2024-01-05",
    verified: true,
    deviceModel: "Xiaomi 13"
  },
  {
    id: "6",
    customerName: "Arjun Kumar",
    customerPhoto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    rating: 4,
    reviewText: "Great service center with genuine parts. The repair was done perfectly and they provide good warranty coverage.",
    serviceType: "Screen Replacement",
    date: "2024-01-03",
    verified: true,
    deviceModel: "Google Pixel 7"
  }
];

export const technicians: Technician[] = [
  {
    id: "1",
    name: "Rajesh Kumar",
    photo: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop&crop=face",
    specialization: ["iPhone Repairs", "Screen Replacement", "Water Damage"],
    experienceYears: 8,
    certifications: ["Apple Certified Technician", "IPC Electronics Repair"],
    rating: 4.9,
    totalRepairs: 2500,
    bio: "Specialized in Apple device repairs with over 8 years of experience. Expert in complex motherboard repairs and data recovery."
  },
  {
    id: "2",
    name: "Priya Mehta",
    photo: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop&crop=face",
    specialization: ["Samsung Repairs", "Battery Replacement", "Software Issues"],
    experienceYears: 6,
    certifications: ["Samsung Certified Repair", "Android Specialist"],
    rating: 4.8,
    totalRepairs: 1800,
    bio: "Android and Samsung specialist with expertise in software troubleshooting and hardware repairs. Known for quick diagnosis."
  },
  {
    id: "3",
    name: "Amit Sharma",
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
    specialization: ["OnePlus Repairs", "Charging Port", "Camera Repairs"],
    experienceYears: 5,
    certifications: ["OnePlus Certified", "Camera Module Specialist"],
    rating: 4.7,
    totalRepairs: 1200,
    bio: "OnePlus and camera repair specialist. Expert in precision work and component-level repairs for modern smartphones."
  },
  {
    id: "4",
    name: "Sneha Patel",
    photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop&crop=face",
    specialization: ["Data Recovery", "Software Repair", "Xiaomi Repairs"],
    experienceYears: 7,
    certifications: ["Data Recovery Specialist", "Xiaomi Certified"],
    rating: 4.9,
    totalRepairs: 2100,
    bio: "Data recovery and software repair expert. Specialized in retrieving data from severely damaged devices and complex software issues."
  }
];

export const beforeAfterGallery: BeforeAfter[] = [
  {
    id: "1",
    title: "iPhone 14 Screen Replacement",
    beforeImage: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop",
    afterImage: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop",
    deviceModel: "iPhone 14 Pro",
    serviceType: "Screen Replacement",
    description: "Completely shattered screen restored to factory condition with genuine Apple parts.",
    technicianName: "Rajesh Kumar"
  },
  {
    id: "2",
    title: "Samsung Galaxy Water Damage Recovery",
    beforeImage: "https://images.unsplash.com/photo-1601972602288-818d5e2309d9?w=400&h=300&fit=crop",
    afterImage: "https://images.unsplash.com/photo-1592286041411-8ca90638ca3a?w=400&h=300&fit=crop",
    deviceModel: "Samsung Galaxy S23",
    serviceType: "Water Damage Repair",
    description: "Phone fell in water, full restoration including motherboard cleaning and component replacement.",
    technicianName: "Priya Mehta"
  },
  {
    id: "3",
    title: "OnePlus Charging Port Repair",
    beforeImage: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=300&fit=crop",
    afterImage: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop",
    deviceModel: "OnePlus 11",
    serviceType: "Charging Port Repair",
    description: "Loose charging port causing intermittent charging issues, replaced with OEM part.",
    technicianName: "Amit Sharma"
  },
  {
    id: "4",
    title: "Xiaomi Back Glass Replacement",
    beforeImage: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=300&fit=crop",
    afterImage: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop",
    deviceModel: "Xiaomi 13 Pro",
    serviceType: "Back Glass Replacement",
    description: "Cracked back glass panel replaced while maintaining wireless charging functionality.",
    technicianName: "Sneha Patel"
  }
];

export const videoTestimonials: VideoTestimonial[] = [
  {
    id: "1",
    customerName: "Rahul Gupta",
    thumbnailUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    title: "Amazing Screen Replacement Service",
    serviceType: "Screen Replacement",
    rating: 5
  },
  {
    id: "2",
    customerName: "Kavya Nair",
    thumbnailUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b6b5?w=400&h=300&fit=crop",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    title: "Water Damage Recovery Success",
    serviceType: "Water Damage Repair",
    rating: 5
  }
];

export const trustBadges = [
  {
    id: "1",
    title: "ISO 9001 Certified",
    icon: "shield-check",
    description: "Quality management system certified"
  },
  {
    id: "2",
    title: "Authorized Service Partner",
    icon: "award",
    description: "Official partner for major brands"
  },
  {
    id: "3",
    title: "6 Month Warranty",
    icon: "shield",
    description: "All repairs covered by warranty"
  },
  {
    id: "4",
    title: "10,000+ Repairs",
    icon: "users",
    description: "Trusted by thousands of customers"
  }
];