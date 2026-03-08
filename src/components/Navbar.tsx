import { Link, useLocation } from "react-router-dom";
import { Search, Menu, X, Heart, LogOut, User } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/sonner";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();

  const links = [
    { to: "/", label: "Home" },
    { to: "/explore", label: "Explore" },
    { to: "/categories", label: "Categories" },
    { to: "/leaderboard", label: "Leaderboard" },
  ];

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out successfully");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-glass-border">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <div className="relative h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="font-display text-sm font-bold text-primary-foreground">W</span>
            <div className="absolute inset-0 rounded-lg animate-glow-pulse" />
          </div>
          <span className="font-display text-xl font-bold text-foreground">
            Wall<span className="text-primary">Nova</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm font-medium transition-colors duration-300 ${
                location.pathname === link.to
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <button className="p-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors">
            <Search size={18} />
          </button>
          <button className="p-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors">
            <Heart size={18} />
          </button>
          {user ? (
            <div className="flex items-center gap-2">
              <Link to="/profile" className="p-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors">
                <User size={18} />
              </Link>
              <button onClick={handleSignOut} className="p-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors">
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link to="/sign-in" className="btn-glow text-sm px-4 py-2">
              Sign In
            </Link>
          )}
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 text-muted-foreground"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden border-t border-glass-border"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-3">
              {links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground py-2"
                >
                  {link.label}
                </Link>
              ))}
              {user ? (
                <button onClick={() => { handleSignOut(); setMobileOpen(false); }} className="btn-glow text-sm mt-2 w-full">
                  Sign Out
                </button>
              ) : (
                <Link to="/sign-in" onClick={() => setMobileOpen(false)} className="btn-glow text-sm mt-2 w-full text-center block">
                  Sign In
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
