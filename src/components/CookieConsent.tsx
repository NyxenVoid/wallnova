import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const COOKIE_CONSENT_KEY = "wallnova_cookie_consent";

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "accepted");
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "declined");
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-lg"
        >
          <div className="relative rounded-2xl border border-border bg-card/95 backdrop-blur-xl p-5 shadow-2xl">
            <button
              onClick={decline}
              className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X size={16} />
            </button>

            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-primary/10 p-2.5 shrink-0">
                <Cookie size={20} className="text-primary" />
              </div>
              <div className="space-y-3">
                <p className="text-sm text-foreground font-medium">We use cookies 🍪</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  We use cookies for authentication, analytics, and to improve your experience.{" "}
                  <Link
                    to="/privacy-policy"
                    className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </p>
                <div className="flex gap-2">
                  <Button size="sm" onClick={accept} className="h-8 text-xs px-4">
                    Accept All
                  </Button>
                  <Button size="sm" variant="outline" onClick={decline} className="h-8 text-xs px-4">
                    Decline
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
