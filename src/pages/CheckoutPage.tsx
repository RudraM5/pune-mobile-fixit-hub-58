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

    // Simulate payment processing
    setTimeout(() => {
      toast({
        title: "Booking Confirmed!",
        description: `Your repair booking has been confirmed. Payment method: ${paymentMethods.find(p => p.id === selectedPayment)?.title}`,
      });
      
      clearCart();
      navigate('/dashboard');
      setIsProcessing(false);
    }, 2000);
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
            {/* Order Summary */}
            <div className="lg:col-span-2 space-y-6">
              {/* Customer Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Customer Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{user?.display_name || 'Guest User'}</p>
                        <p className="text-sm text-muted-foreground">{user?.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">+91 93256 73075</p>
                        <p className="text-sm text-muted-foreground">Contact Number</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Koregaon Park Center</p>
                      <p className="text-sm text-muted-foreground">Shop No. 15, Lane 5, Koregaon Park, Pune</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Service Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Service Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div key={item.service.id} className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium">{item.service.name}</h4>
                          <p className="text-sm text-muted-foreground">{item.service.description}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">~{item.service.duration}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">₹{item.service.price}</p>
                          <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Payment Methods */}
              <Card>
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                  <CardDescription>Choose your preferred payment method</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-3">
                    {paymentMethods.map((method) => (
                      <div
                        key={method.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedPayment === method.id 
                            ? 'border-primary bg-primary/5' 
                            : 'border-border hover:border-primary/50'
                        }`}
                        onClick={() => setSelectedPayment(method.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <method.icon className="h-5 w-5" />
                            <div>
                              <p className="font-medium">{method.title}</p>
                              <p className="text-sm text-muted-foreground">{method.description}</p>
                            </div>
                          </div>
                          {selectedPayment === method.id && (
                            <Check className="h-5 w-5 text-primary" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Payment Summary */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {cartItems.map((item) => (
                      <div key={item.service.id} className="flex justify-between text-sm">
                        <span>{item.service.name} x{item.quantity}</span>
                        <span>₹{item.service.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>₹{total}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Service Charge</span>
                      <span>₹0</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>GST (18%)</span>
                      <span>₹{Math.round(total * 0.18)}</span>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between font-semibold">
                    <span>Total Amount</span>
                    <span>₹{Math.round(total * 1.18)}</span>
                  </div>

                  <Button 
                    className="w-full mt-4" 
                    size="lg"
                    onClick={handlePayment}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      "Processing..."
                    ) : (
                      `Pay ₹${Math.round(total * 1.18)}`
                    )}
                  </Button>

                  <div className="text-center mt-4">
                    <Badge variant="outline" className="text-xs">
                      Secure Payment Gateway
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Service Guarantee</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-xs text-muted-foreground">
                  <p>• 6-month warranty on all repairs</p>
                  <p>• 100% genuine parts guarantee</p>
                  <p>• Free pickup & drop service</p>
                  <p>• Expert certified technicians</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;