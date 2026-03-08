import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-glass-border mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="font-display text-xl font-bold text-foreground">
              Wall<span className="text-primary">Nova</span>
            </Link>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Discover and download stunning wallpapers for every device. Join our community of creators.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-3">Explore</h4>
            <div className="flex flex-col gap-2">
              <Link to="/explore" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Trending</Link>
              <Link to="/explore" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Featured</Link>
              <Link to="/categories" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Categories</Link>
              <Link to="/explore" className="text-sm text-muted-foreground hover:text-foreground transition-colors">New Uploads</Link>
            </div>
          </div>

          {/* Community */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-3">Community</h4>
            <div className="flex flex-col gap-2">
              <Link to="/leaderboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Leaderboard</Link>
              <Link to="/upload" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Upload</Link>
              <Link to="/content-policy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Content Policy</Link>
              <span className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">Discord</span>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-3">Legal</h4>
            <div className="flex flex-col gap-2">
              <Link to="/privacy-policy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link>
              <Link to="/terms-of-service" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms of Service</Link>
              <Link to="/content-policy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Content Policy</Link>
              <Link to="/dmca-copyright-policy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">DMCA Policy</Link>
            </div>
            <button className="mt-4 btn-glow text-xs px-4 py-2 flex items-center gap-2">
              <Heart size={14} />
              Support WallNova
            </button>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-glass-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">© 2026 WallNova. All rights reserved.</p>
          <div className="flex gap-4">
            {["Twitter", "Instagram", "Pinterest", "Discord"].map((social) => (
              <span key={social} className="text-xs text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                {social}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
