import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

function Navigation() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm border-b z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="text-xl font-bold">
            <Link to="/" className="hover:text-gray-600 transition-colors">
              MyApp
            </Link>
          </div>
          <div className="flex gap-2">
            <Button
              variant={isActive("/") ? "default" : "ghost"}
              asChild
              size="sm"
            >
              <Link to="/">Home</Link>
            </Button>
            <Button
              variant={isActive("/about") ? "default" : "ghost"}
              asChild
              size="sm"
            >
              <Link to="/about">About</Link>
            </Button>
            <Button
              variant={isActive("/contact") ? "default" : "ghost"}
              asChild
              size="sm"
            >
              <Link to="/contact">Contact</Link>
            </Button>
            <Button
              variant={isActive("/api-demo") ? "default" : "ghost"}
              asChild
              size="sm"
            >
              <Link to="/api-demo">API Demo</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
