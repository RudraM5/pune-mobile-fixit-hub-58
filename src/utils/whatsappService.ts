
interface BookingDetails {
  customerName: string;
  customerPhone: string;
  deviceBrand: string;
  deviceModel: string;
  services: string[];
  technicianName: string;
  shopName: string;
  shopPhone: string;
  totalAmount: number;
  bookingId: string;
  estimatedCompletion: string;
}

export const sendWhatsAppConfirmation = async (bookingDetails: BookingDetails) => {
  const {
    customerName,
    customerPhone,
    deviceBrand,
    deviceModel,
    services,
    technicianName,
    shopName,
    shopPhone,
    totalAmount,
    bookingId,
    estimatedCompletion
  } = bookingDetails;

  // Format the message
  const message = `🔧 *Mobile Repairwala - Booking Confirmation*

Hi ${customerName}! 👋

Your repair booking has been confirmed:

📱 *Device:* ${deviceBrand} ${deviceModel}
🛠️ *Services:* ${services.join(', ')}
💰 *Total Amount:* ₹${totalAmount}

👨‍🔧 *Assigned Technician:* ${technicianName}
🏪 *Shop:* ${shopName}
📞 *Shop Contact:* ${shopPhone}

📋 *Booking ID:* #${bookingId.substring(0, 8)}
⏰ *Estimated Completion:* ${estimatedCompletion}

Your technician will contact you shortly to schedule pickup/drop-off.

Need help? Reply to this message or call us at +91 98765 43210

Thank you for choosing Mobile Repairwala! 🙏`;

  // Create WhatsApp URL with pre-filled message
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${customerPhone.replace(/[^0-9]/g, '')}?text=${encodedMessage}`;
  
  // Open WhatsApp in new tab (for demo purposes)
  // In a real implementation, this would use a WhatsApp Business API
  window.open(whatsappUrl, '_blank');
  
  console.log('WhatsApp confirmation sent for booking:', bookingId);
  
  return {
    success: true,
    message: 'WhatsApp confirmation sent successfully',
    whatsappUrl
  };
};

export const sendWhatsAppToShop = async (bookingDetails: BookingDetails) => {
  const {
    customerName,
    customerPhone,
    deviceBrand,
    deviceModel,
    services,
    technicianName,
    shopName,
    shopPhone,
    totalAmount,
    bookingId
  } = bookingDetails;

  const shopMessage = `🔔 *New Booking Alert - Mobile Repairwala*

New repair request assigned to ${technicianName}:

👤 *Customer:* ${customerName}
📞 *Phone:* ${customerPhone}
📱 *Device:* ${deviceBrand} ${deviceModel}
🛠️ *Services:* ${services.join(', ')}
💰 *Amount:* ₹${totalAmount}
📋 *Booking ID:* #${bookingId.substring(0, 8)}

Please contact the customer to arrange pickup/drop-off.

View full details in your dashboard.`;

  const encodedShopMessage = encodeURIComponent(shopMessage);
  const shopWhatsappUrl = `https://wa.me/${shopPhone.replace(/[^0-9]/g, '')}?text=${encodedShopMessage}`;
  
  // Open shop WhatsApp in new tab
  setTimeout(() => {
    window.open(shopWhatsappUrl, '_blank');
  }, 2000); // Delay to avoid popup blocking
  
  console.log('WhatsApp notification sent to shop:', shopName);
  
  return {
    success: true,
    message: 'Shop notification sent successfully',
    whatsappUrl: shopWhatsappUrl
  };
};
