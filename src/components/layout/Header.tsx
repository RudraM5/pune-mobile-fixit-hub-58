import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Menu, Phone, ShoppingCart, User, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface HeaderProps {
  cartItems?: number;
}

const Header = ({ cartItems = 0 }: HeaderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/services", label: "Services" },
    { href: "/book-repair", label: "Book Repair" },
    { href: "/dashboard", label: "My Repairs" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="border-b bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="h-8 w-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center group-hover:bg-white/30 transition-all">
              <Phone className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">FixMyPhone</h1>
              <p className="text-xs text-white/80">Pune's #1 Mobile Repair</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="text-white hover:text-yellow-300 transition-colors font-medium relative group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-300 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/cart" className="relative">
              <Button variant="outline" size="sm" className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Cart
                {cartItems > 0 && (
                  <Badge variant="destructive" className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-500">
                    {cartItems}
                  </Badge>
                )}
              </Button>
            </Link>
            
            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Link to="/admin">
                    <Button variant="outline" size="sm" className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30">
                      Admin Panel
                    </Button>
                  </Link>
                )}
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-white/90">
                    Hi, {user?.name || 'User'}
                  </span>
                  <Button variant="outline" size="sm" onClick={logout} className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <Link to="/login">
                <Button variant="outline" size="sm" className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30">
                  <User className="h-4 w-4 mr-2" />
                  Login
                </Button>
              </Link>
            )}
            
            <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer">
              <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white shadow-lg">
                WhatsApp Us
              </Button>
            </a>
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="outline" size="sm" className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex flex-col space-y-4 mt-8">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className="text-foreground hover:text-primary transition-colors font-medium text-lg py-2"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="pt-4 space-y-3">
                  <Link to="/cart" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full justify-start">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Cart ({cartItems})
                    </Button>
                  </Link>
                  
                  {isAuthenticated ? (
                    <>
                      {isAdmin && (
                        <Link to="/admin" onClick={() => setIsOpen(false)}>
                          <Button variant="outline" className="w-full">
                            Admin Panel
                          </Button>
                        </Link>
                      )}
                      <div className="space-y-2">
                        <div className="text-sm text-muted-foreground px-2">
                          Logged in as {user?.name || 'User'}
                        </div>
                        <Button 
                          variant="outline" 
                          className="w-full justify-start"
                          onClick={() => {
                            logout();
                            setIsOpen(false);
                          }}
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Logout
                        </Button>
                      </div>
                    </>
                  ) : (
                    <Link to="/login" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" className="w-full justify-start">
                        <User className="h-4 w-4 mr-2" />
                        Login
                      </Button>
                    </Link>
                  )}
                  
                  <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer">
                    <Button className="w-full">
                      WhatsApp Us
                    </Button>
                  </a>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;