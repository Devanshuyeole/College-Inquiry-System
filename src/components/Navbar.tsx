import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GraduationCap, Menu, X, LogOut, User } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

const Navbar = () => {
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/courses", label: "Courses" },
    { path: "/departments", label: "Departments" },
    { path: "/contact", label: "Contact" },
  ];

  const AuthButtons = () =>
    isAuthenticated ? (
      <>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-primary/10">
          <User className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-primary">
            {user?.name || "User"}
          </span>
        </div>
        <Button variant="outline" onClick={logout}>
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </>
    ) : (
      <>
        <Link to="/login">
          <Button variant="outline">Login</Button>
        </Link>
        <Link to="/admin">
          <Button variant="outline">Admin</Button>
        </Link>
      </>
    );

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <GraduationCap className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold text-foreground">EduConnect</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === link.path
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}

          <Link to="/inquiry">
            <Button variant="hero">Submit Inquiry</Button>
          </Link>

          {/* Auth buttons */}
          <AuthButtons />
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <div className="container py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === link.path
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}

            <Link to="/inquiry" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="hero" className="w-full">
                Submit Inquiry
              </Button>
            </Link>

            {/* Auth buttons */}
            <div className="flex flex-col gap-2">
              <AuthButtons />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
