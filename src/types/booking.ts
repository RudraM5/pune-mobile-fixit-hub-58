export interface MobileDevice {
  id: string;
  brand: string;
  model: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  category: string;
}

export interface CartItem {
  service: Service;
  quantity: number;
}

export interface CustomerInfo {
  name: string;
  phone: string;
  email: string;
  address: string;
  description: string;
  pickupPreferred: boolean;
}