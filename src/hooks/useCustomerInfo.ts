import { useState } from "react";
import { CustomerInfo } from "@/types/booking";

const initialCustomerInfo: CustomerInfo = {
  name: "",
  phone: "",
  email: "",
  address: "",
  description: "",
  pickupPreferred: true
};

export const useCustomerInfo = () => {
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>(initialCustomerInfo);

  const updateCustomerInfo = (updates: Partial<CustomerInfo>) => {
    setCustomerInfo(prev => ({ ...prev, ...updates }));
  };

  const resetCustomerInfo = () => {
    setCustomerInfo(initialCustomerInfo);
  };

  const isValid = () => {
    return customerInfo.name.trim() !== "" && customerInfo.phone.trim() !== "";
  };

  return {
    customerInfo,
    updateCustomerInfo,
    resetCustomerInfo,
    isValid
  };
};