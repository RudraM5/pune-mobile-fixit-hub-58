import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Menu, Phone, ShoppingCart, User, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { ThemeToggle } from "@/components/ui/theme-toggle";

interface HeaderProps {
  cartItems?: number;
}

const Header = ({ cartItems = 0 }: HeaderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/services", label: "Services" },
    { href: "/reviews", label: "Reviews" },
    { href: "/book-repair", label: "Book Repair" },
    { href: "/dashboard", label: "My Repairs" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 animate-slide-in-left">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group transition-all duration-300 hover:scale-105">
            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center transition-all duration-300 group-hover:shadow-lg group-hover:animate-glow">
              <Phone className="h-5 w-5 text-primary-foreground transition-transform duration-300 group-hover:rotate-12" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground font-heading">FixMyPhone</h1>
              <p className="text-xs text-muted-foreground">Pune's #1 Mobile Repair</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item, index) => (
              <Link
                key={item.href}
                to={item.href}
                className="text-foreground hover:text-primary transition-all duration-300 font-medium relative group py-2"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <span className="relative z-10">{item.label}</span>
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary scale-x-0 transition-transform duration-300 group-hover:scale-x-100 origin-left"></span>
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4 animate-slide-in-right">
            <ThemeToggle />
            <Link to="/cart" className="relative">
              <Button variant="outline" size="sm" className="transition-all duration-300 hover:scale-105 hover:shadow-md">
                <ShoppingCart className="h-4 w-4 mr-2 transition-transform duration-300 hover:rotate-12" />
                Cart
                {cartItems > 0 && (
                  <Badge variant="destructive" className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs animate-scale-in">
                    {cartItems}
                  </Badge>
                )}
              </Button>
            </Link>
            
            {isAuthenticated ? (
              <>
                {isAdmin && (
                <Link to="/admin">
                  <Button variant="outline" size="sm" className="transition-all duration-300 hover:scale-105 hover:shadow-md">
                    Admin Panel
                  </Button>
                </Link>
                )}
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">
                    Hi, {user?.name || 'User'}
                  </span>
                  <Button variant="outline" size="sm" onClick={logout} className="transition-all duration-300 hover:scale-105 hover:shadow-md">
                    <LogOut className="h-4 w-4 mr-2 transition-transform duration-300 hover:rotate-12" />
                    Logout
                  </Button>
                </div>
              </>
            ) : (
              <Link to="/login">
                <Button variant="outline" size="sm" className="transition-all duration-300 hover:scale-105 hover:shadow-md">
                  <User className="h-4 w-4 mr-2 transition-transform duration-300 hover:rotate-12" />
                  Login
                </Button>
              </Link>
            )}
            
            <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer">
              <Button size="sm" className="transition-all duration-300 hover:scale-105 hover:shadow-lg bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
                WhatsApp Us
              </Button>
            </a>
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="outline" size="sm">
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