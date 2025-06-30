
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Trash2, Star, MapPin } from "lucide-react";
import { CartItem, MobileDevice } from "@/types/booking";
import { EnhancedTechnician } from "@/types/shop";

interface BookingCartProps {
  cart: CartItem[];
  totalItems: number;
  totalPrice: number;
  selectedDevice: MobileDevice | null;
  selectedTechnician?: EnhancedTechnician | null;
  onRemoveFromCart: (serviceId: string) => void;
  onBooking: () => void;
  isSubmitting: boolean;
}

const BookingCart = ({ 
  cart, 
  totalItems, 
  totalPrice, 
  selectedDevice,
  selectedTechnician,
  onRemoveFromCart, 
  onBooking,
  isSubmitting 
}: BookingCartProps) => {
  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="w-5 h-5" />
          Booking Summary
          {totalItems > 0 && (
            <Badge variant="secondary">{totalItems} services</Badge>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Selected Device */}
        {selectedDevice && (
          <div className="p-3 bg-accent/50 rounded-lg">
            <h4 className="font-medium text-sm mb-1">Selected Device</h4>
            <p className="text-sm text-muted-foreground">
              {selectedDevice.brand} {selectedDevice.model}
            </p>
          </div>
        )}

        {/* Selected Technician */}
        {selectedTechnician && (
          <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
            <h4 className="font-medium text-sm mb-2 text-primary">Selected Technician</h4>
            <div className="space-y-1">
              <p className="font-medium text-sm">{selectedTechnician.name}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span>{selectedTechnician.rating}</span>
                <span>•</span>
                <span>{selectedTechnician.expertise_level}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="w-3 h-3" />
                <span>{selectedTechnician.shop?.name}</span>
              </div>
              <p className="text-xs text-muted-foreground">{selectedTechnician.area}</p>
            </div>
          </div>
        )}

        {/* Cart Items */}
        {cart.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <ShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-sm">No services selected</p>
          </div>
        ) : (
          <div className="space-y-3">
            {cart.map((item) => (
              <div key={item.service.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{item.service.name}</h4>
                  <p className="text-xs text-muted-foreground">{item.service.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {item.service.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {item.service.duration}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <p className="font-semibold text-sm">₹{item.service.price}</p>
                    {item.quantity > 1 && (
                      <p className="text-xs text-muted-foreground">
                        ₹{item.service.price} × {item.quantity}
                      </p>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onRemoveFromCart(item.service.id)}
                    className="h-8 w-8 p-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {cart.length > 0 && (
          <>
            <Separator />
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal ({totalItems} services)</span>
                <span>₹{totalPrice}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Service charge</span>
                <span>₹0</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>₹{totalPrice}</span>
              </div>
            </div>

            <Button 
              className="w-full" 
              onClick={onBooking}
              disabled={isSubmitting || !selectedDevice || cart.length === 0}
            >
              {isSubmitting ? "Processing..." : "Book Repair"}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              * Final price may vary based on device condition and technician assessment
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default BookingCart;
