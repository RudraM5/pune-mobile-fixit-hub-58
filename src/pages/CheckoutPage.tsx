import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/layout/Header';
import { 
  CreditCard, 
  Smartphone, 
  User, 
  Phone, 
  MapPin, 
  Calendar,
  Check,
  Wallet,
  Building2
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

const CheckoutPage = () => {
  const { cart, getTotalPrice, clearCart } = useCart();
  const cartItems = cart;
  const total = getTotalPrice();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<'card' | 'upi' | 'cash'>('card');

  const paymentMethods = [
    {
      id: 'card' as const,
      title: 'Credit/Debit Card',
      description: 'Secure payment via card',
      icon: CreditCard,
      available: true
    },
    {
      id: 'upi' as const,
      title: 'UPI Payment',
      description: 'Pay using UPI apps',
      icon: Smartphone,
      available: true
    },
    {
      id: 'cash' as const,
      title: 'Cash on Service',
      description: 'Pay when technician arrives',
      icon: Wallet,
      available: true
    }
  ];

  const handlePayment = async () => {
    if (cartItems.length === 0) {
      toast({
        title: "No items in cart",
        description: "Please add items to your cart before proceeding.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Build booking payload
      const bookingData = {
        customer: {
          name: user?.display_name || "Guest User",
          email: user?.email || "guest@example.com",
          phone: "9325673075", // TODO: get real phone from user input
          address: "Shop No. 15, Lane 5, Koregaon Park, Pune" // TODO: real address
        },
        device: {
          brand: "Generic", // TODO: pass real device info from form
          model: "Device Model"
        },
        services: cartItems.map(item => ({
          name: item.service.name,
          price: item.service.price,
          quantity: item.quantity
        })),
        shopId: 1, // TODO: pick from selected shop
        totalAmount: total,
        pickupPreferred: false,
        description: `Paid via ${selectedPayment}`
      };

      // Call backend
      const response = await fetch(`${API_BASE_URL}/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Booking failed");
      }

      // Success
      toast({
        title: "Booking Confirmed 🎉",
        description: `Booking ID: ${data.id}. Payment: ${paymentMethods.find(p => p.id === selectedPayment)?.title}`,
      });

      clearCart();
      navigate("/dashboard");
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Something went wrong",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto">
            <CardContent className="pt-6 text-center">
              <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Items in Cart</h3>
              <p className="text-muted-foreground mb-4">
                Add items to your cart before proceeding to checkout.
              </p>
              <Button onClick={() => navigate('/book-repair')}>
                Go to Booking
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Checkout</h1>
            <p className="text-muted-foreground">
              Review your booking and complete payment
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Existing UI remains unchanged, just updated handlePayment */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
