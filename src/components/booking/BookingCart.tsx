import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Phone, MapPin } from "lucide-react";
import { CartItem, MobileDevice } from "@/types/booking";

interface BookingCartProps {
  cart: CartItem[];
  totalItems: number;
  totalPrice: number;
  selectedDevice: MobileDevice | null;
  onRemoveFromCart: (serviceId: string) => void;
  onBooking: () => void;
}

const BookingCart = ({ 
  cart, 
  totalItems, 
  totalPrice, 
  selectedDevice, 
  onRemoveFromCart, 
  onBooking 
}: BookingCartProps) => {
  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          Your Cart ({totalItems})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {cart.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">
            Your cart is empty. Add some services to get started.
          </p>
        ) : (
          <>
            <div className="space-y-3">
              {cart.map(item => (
                <div key={item.service.id} className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{item.service.name}</h4>
                    <p className="text-xs text-muted-foreground">₹{item.service.price} × {item.quantity}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">₹{item.service.price * item.quantity}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onRemoveFromCart(item.service.id)}
                      className="h-6 w-6 p-0"
                    >
                      ×
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>₹{totalPrice}</span>
              </div>
              <div className="flex justify-between text-sm text-green-600">
                <span>Pickup & Drop:</span>
                <span>FREE</span>
              </div>
              <div className="flex justify-between font-semibold text-lg">
                <span>Total:</span>
                <span>₹{totalPrice}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                *Final quote will be provided by technician after device inspection
              </p>
            </div>

            <Button 
              className="w-full" 
              onClick={onBooking}
              disabled={!selectedDevice || cart.length === 0}
            >
              Book Repair Service
            </Button>

            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="h-3 w-3" />
                <span>Free pickup & drop in Pune</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-3 w-3" />
                <span>Call support: +91 98765 43210</span>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default BookingCart;