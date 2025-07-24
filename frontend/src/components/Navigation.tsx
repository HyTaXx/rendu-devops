import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { AuthModal } from "@/components/auth/AuthModal";

function Navigation() {
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  const isActive = (path: string) => location.pathname === path;

  const handleAuthClick = (mode: "login" | "register") => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm border-b z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="text-xl font-bold">
              <Link to="/" className="hover:text-gray-600 transition-colors">
                MyApp
              </Link>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={isActive("/") ? "default" : "ghost"}
                asChild
                size="sm"
              >
                <Link to="/">Home</Link>
              </Button>
              <Button
                variant={isActive("/products") ? "default" : "ghost"}
                asChild
                size="sm"
              >
                <Link to="/products">Produits</Link>
              </Button>

              {isAuthenticated ? (
                <>
                  <Button
                    variant={isActive("/dashboard") ? "default" : "ghost"}
                    asChild
                    size="sm"
                  >
                    <Link to="/dashboard">Dashboard</Link>
                  </Button>

                  <Button
                    variant={isActive("/products/new") ? "default" : "outline"}
                    asChild
                    size="sm"
                  >
                    <Link to="/products/new">+ Ajouter produit</Link>
                  </Button>

                  <div className="flex items-center gap-2 ml-4">
                    <span className="text-sm text-gray-600">
                      Welcome, {user?.firstname}!
                    </span>
                    <Button variant="outline" size="sm" onClick={handleLogout}>
                      Logout
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2 ml-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleAuthClick("login")}
                  >
                    Login
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => handleAuthClick("register")}
                  >
                    Register
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultMode={authMode}
      />
    </>
  );
}

export default Navigation;
