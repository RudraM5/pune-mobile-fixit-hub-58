import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/layout/Header";
import { ShoppingCart, Trash2, Plus, Minus, Clock, Shield, Truck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CartItem {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  quantity: number;
  category: string;
}

const CartPage = () => {
  const { toast } = useToast();
  
  // Mock cart data - in real app this would come from state management
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: "1",
      name: "Screen Replacement",
      description: "High-quality OLED display replacement",
      price: 1500,
      duration: "30 mins",
      quantity: 1,
      category: "Basic Repair"
    },
    {
      id: "2",
      name: "Battery Replacement",
      description: "Original capacity battery replacement",
      price: 1200,
      duration: "20 mins",
      quantity: 1,
      category: "Basic Repair"
    },
    {
      id: "3",
      name: "Tempered Glass",
      description: "9H hardness screen protector",
      price: 200,
      duration: "5 mins",
      quantity: 2,
      category: "Accessory"
    }
  ]);

  const updateQuantity = (id: string, change: number) => {
    setCartItems(items => 
      items.map(item => {
        if (item.id === id) {
          const newQuantity = Math.max(0, item.quantity + change);
          if (newQuantity === 0) {
            toast({
              title: "Item removed",
              description: `${item.name} removed from cart`,
            });
            return null;
          }
          return { ...item, quantity: newQuantity };
        }
        return item;
      }).filter(Boolean) as CartItem[]
    );
  };

  const removeItem = (id: string) => {
    const item = cartItems.find(item => item.id === id);
    setCartItems(items => items.filter(item => item.id !== id));
    toast({
      title: "Item removed",
      description: `${item?.name} removed from cart`,
    });
  };

  const getSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const estimatedDuration = () => {
    // Simple duration calculation - in real app this would be more sophisticated
    const totalMinutes = cartItems.reduce((total, item) => {
      const minutes = parseInt(item.duration) || 30;
      return total + (minutes * item.quantity);
    }, 0);
    
    if (totalMinutes < 60) return `${totalMinutes} mins`;
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    return `${hours}h ${mins > 0 ? `${mins}m` : ''}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header cartItems={getTotalItems()} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Shopping Cart</h1>
          <p className="text-muted-foreground">
            Review your selected services and proceed to book your repair
          </p>
        </div>

        {cartItems.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Your cart is empty</h3>
              <p className="text-muted-foreground mb-6">
                Add some services to get started with your repair booking
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/services">
                  <Button size="lg">
                    Browse Services
                  </Button>
                </Link>
                <Link to="/book-repair">
                  <Button variant="outline" size="lg">
                    Book Repair
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Selected Services ({getTotalItems()} items)</CardTitle>
                  <CardDescription>
                    Review and modify your service selection
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{item.name}</h4>
                          <Badge variant="outline" className="text-xs">
                            {item.category}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {item.duration}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, -1)}
                            className="h-8 w-8 p-0"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-sm">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, 1)}
                            className="h-8 w-8 p-0"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        <div className="text-right min-w-[80px]">
                          <p className="font-medium">₹{item.price * item.quantity}</p>
                          {item.quantity > 1 && (
                            <p className="text-xs text-muted-foreground">₹{item.price} each</p>
                          )}
                        </div>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Service Benefits */}
              <Card>
                <CardHeader>
                  <CardTitle>Why Choose FixMyPhone?</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-3">
                      <Shield className="h-8 w-8 text-primary" />
                      <div>
                        <p className="font-medium">6-Month Warranty</p>
                        <p className="text-xs text-muted-foreground">On all repairs</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Truck className="h-8 w-8 text-primary" />
                      <div>
                        <p className="font-medium">Free Pickup & Drop</p>
                        <p className="text-xs text-muted-foreground">Across Pune</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Clock className="h-8 w-8 text-primary" />
                      <div>
                        <p className="font-medium">Same Day Service</p>
                        <p className="text-xs text-muted-foreground">Most repairs</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal ({getTotalItems()} items):</span>
                      <span>₹{getSubtotal()}</span>
                    </div>
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Pickup & Drop:</span>
                      <span>FREE</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Estimated Duration:</span>
                      <span>{estimatedDuration()}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total:</span>
                      <span>₹{getSubtotal()}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      *Final quote will be provided after device inspection
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Link to="/book-repair" className="block">
                      <Button className="w-full" size="lg">
                        Proceed to Book
                      </Button>
                    </Link>
                    
                    <Link to="/services" className="block">
                      <Button variant="outline" className="w-full">
                        Add More Services
                      </Button>
                    </Link>
                  </div>

                  <div className="space-y-2 pt-4 border-t">
                    <h4 className="font-medium text-sm">Need Help?</h4>
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <p>📞 Call: +91 98765 43210</p>
                      <p>💬 WhatsApp for instant support</p>
                      <p>🕒 Available 24/7</p>
                    </div>
                    <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm" className="w-full mt-2">
                        WhatsApp Support
                      </Button>
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;