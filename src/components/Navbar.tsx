import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, User, LogOut, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import LoginModal from "@/components/LoginModal";

const navLinks = [
  { label: "Destinations", path: "/destinations" },
  { label: "Ways to travel", path: "/ways-to-travel" },
  { label: "Deals", path: "/deals" },
  { label: "About", path: "/about" },
  { label: "My Bookings", path: "/my-bookings" },
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { isLoggedIn, user, logout } = useAuth();
  const location = useLocation();
  const [logoError, setLogoError] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              {logoError ? (
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                  <Compass className="w-6 h-6 text-primary-foreground" />
                </div>
              ) : (
                <img 
                  src="/assets/images/logo.png" 
                  alt="Rathh Logo"
                  className="w-10 h-10 object-contain"
                  onError={() => setLogoError(true)}
                />
              )}
              <span className="font-serif text-2xl font-bold text-primary">
                Rathh
              </span>
            </Link>

            {/* Desktop Navigation - Center */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    location.pathname === link.path
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Desktop Actions - Right */}
            <div className="hidden lg:flex items-center gap-3">
              {isLoggedIn && user ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                      <User className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      {user.username}
                    </span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleLogout}
                    className="gap-2 text-muted-foreground hover:text-foreground"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </Button>
                </div>
              ) : (
                <>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setIsLoginModalOpen(true)}
                  >
                    Login
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => setIsLoginModalOpen(true)}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-foreground" />
              ) : (
                <Menu className="w-6 h-6 text-foreground" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div 
            className="lg:hidden fixed inset-0 top-16 bg-background/80 backdrop-blur-sm z-40"
            onClick={closeMenu}
          >
            <div 
              className="bg-background border-b border-border shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="container mx-auto px-4 py-6 space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={closeMenu}
                    className={`block py-3 px-4 text-base font-medium rounded-lg transition-colors ${
                      location.pathname === link.path
                        ? "text-primary bg-primary/10"
                        : "text-foreground hover:bg-muted"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                
                <hr className="border-border my-4" />
                
                {isLoggedIn && user ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 px-4 py-2">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                        <User className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{user.username}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full gap-2"
                      onClick={handleLogout}
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3 pt-2">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => {
                        closeMenu();
                        setIsLoginModalOpen(true);
                      }}
                    >
                      Login
                    </Button>
                    <Button 
                      className="w-full bg-primary hover:bg-primary/90"
                      onClick={() => {
                        closeMenu();
                        setIsLoginModalOpen(true);
                      }}
                    >
                      Sign Up
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Login Modal */}
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
    </>
  );
};

export default Navbar;
