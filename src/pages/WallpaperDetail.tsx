import { useParams, Link } from "react-router-dom";
import { Download, Heart, Star, ArrowLeft, Share2, Monitor, Smartphone, Tag } from "lucide-react";
import { motion } from "framer-motion";
import { wallpapers } from "@/data/wallpapers";
import { useWallpaper, useToggleLike, useRateWallpaper } from "@/hooks/use-wallpapers";
import { useAuth } from "@/contexts/AuthContext";
import WallpaperCard from "@/components/WallpaperCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";

const WallpaperDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { data: dbWallpaper } = useWallpaper(id);
  const toggleLike = useToggleLike();
  const rateWallpaper = useRateWallpaper();

  // Fallback to static data
  const staticWallpaper = wallpapers.find((w) => w.id === id);
  const isDbWallpaper = !!dbWallpaper;

  const wallpaper = dbWallpaper
    ? {
        id: dbWallpaper.id,
        title: dbWallpaper.title,
        description: dbWallpaper.description || "",
        imageUrl: dbWallpaper.image_url,
        category: dbWallpaper.category,
        resolution: dbWallpaper.resolution,
        type: dbWallpaper.type,
        tags: dbWallpaper.tags,
        downloads: dbWallpaper.downloads,
        likes: dbWallpaper.likes_count || 0,
        rating: dbWallpaper.avg_rating || 0,
        creator: {
          name: dbWallpaper.creator_name || "Unknown",
          avatar: dbWallpaper.creator_avatar || "",
          id: dbWallpaper.user_id,
        },
        createdAt: dbWallpaper.created_at,
        userLiked: dbWallpaper.user_liked,
        userRating: dbWallpaper.user_rating,
      }
    : staticWallpaper
    ? { ...staticWallpaper, imageUrl: staticWallpaper.imageUrl, userLiked: false, userRating: 0 }
    : null;

  if (!wallpaper) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-3xl font-bold text-foreground">Wallpaper not found</h1>
          <Link to="/" className="btn-glow inline-block mt-4 text-sm">Go Home</Link>
        </div>
      </div>
    );
  }

  const handleLike = () => {
    if (!user) { toast.error("Sign in to like wallpapers"); return; }
    if (isDbWallpaper) {
      toggleLike.mutate({ wallpaperId: wallpaper.id, liked: !!wallpaper.userLiked });
    }
  };

  const handleRate = (star: number) => {
    if (!user) { toast.error("Sign in to rate wallpapers"); return; }
    if (isDbWallpaper) {
      rateWallpaper.mutate({ wallpaperId: wallpaper.id, rating: star });
    }
  };

  const related = wallpapers.filter((w) => w.id !== id && w.category === wallpaper.category).slice(0, 4);
  const moreRelated = related.length < 4
    ? [...related, ...wallpapers.filter((w) => w.id !== id && !related.find((r) => r.id === w.id)).slice(0, 4 - related.length)]
    : related;

  const formatCount = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(1)}k` : n.toString());
  const liked = wallpaper.userLiked || false;
  const userRating = wallpaper.userRating || 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-20 container mx-auto px-4">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-6">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={16} /> Back to Home
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2">
            <div className="glass-card overflow-hidden rounded-2xl">
              <img src={wallpaper.imageUrl} alt={wallpaper.title} className="w-full h-auto object-cover" />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-6">
            <div className="glass-card p-6 rounded-2xl">
              <h1 className="font-display text-2xl font-bold text-foreground">{wallpaper.title}</h1>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{wallpaper.description}</p>

              <div className="mt-4 flex items-center gap-4">
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Download size={14} /> {formatCount(wallpaper.downloads)}
                </span>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Heart size={14} /> {formatCount(wallpaper.likes)}
                </span>
                <span className="flex items-center gap-1 text-sm text-primary">
                  <Star size={14} fill="currentColor" /> {wallpaper.rating}
                </span>
              </div>

              <button className="btn-glow w-full mt-6 flex items-center justify-center gap-2 py-3">
                <Download size={18} /> Download Wallpaper
              </button>

              <div className="mt-3 flex gap-2">
                <button
                  onClick={handleLike}
                  className={`flex-1 glass-card flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 cursor-pointer ${
                    liked ? "text-red-400 border-red-400/30" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Heart size={16} fill={liked ? "currentColor" : "none"} /> {liked ? "Liked" : "Like"}
                </button>
                <button className="flex-1 glass-card flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                  <Share2 size={16} /> Share
                </button>
              </div>
            </div>

            <div className="glass-card p-6 rounded-2xl">
              <h3 className="font-display text-sm font-semibold text-foreground mb-3">Rate this wallpaper</h3>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} onClick={() => handleRate(star)} className="p-1 transition-transform hover:scale-125">
                    <Star
                      size={24}
                      className={star <= userRating ? "text-primary" : "text-muted-foreground/30"}
                      fill={star <= userRating ? "currentColor" : "none"}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="glass-card p-6 rounded-2xl space-y-3">
              <h3 className="font-display text-sm font-semibold text-foreground mb-3">Details</h3>
              <DetailRow icon={<Monitor size={14} />} label="Resolution" value={wallpaper.resolution} />
              <DetailRow icon={<Smartphone size={14} />} label="Type" value={wallpaper.type.charAt(0).toUpperCase() + wallpaper.type.slice(1)} />
              <DetailRow icon={<Tag size={14} />} label="Category" value={wallpaper.category} />
            </div>

            <div className="glass-card p-6 rounded-2xl">
              <h3 className="font-display text-sm font-semibold text-foreground mb-3">Creator</h3>
              <div className="flex items-center gap-3">
                <img src={wallpaper.creator.avatar} alt={wallpaper.creator.name} className="w-10 h-10 rounded-full bg-muted" />
                <div>
                  <p className="font-display text-sm font-semibold text-foreground">{wallpaper.creator.name}</p>
                  <p className="text-xs text-muted-foreground">View Profile</p>
                </div>
              </div>
            </div>

            <div className="glass-card p-6 rounded-2xl">
              <h3 className="font-display text-sm font-semibold text-foreground mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {wallpaper.tags.map((tag) => (
                  <span key={tag} className="badge-glass text-muted-foreground hover:text-primary cursor-pointer transition-colors">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        <section className="mt-16">
          <h2 className="font-display text-2xl font-bold text-foreground mb-6">Related Wallpapers</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {moreRelated.map((w, i) => (
              <WallpaperCard key={w.id} wallpaper={w} index={i} />
            ))}
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

const DetailRow = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="flex items-center justify-between">
    <span className="flex items-center gap-2 text-sm text-muted-foreground">{icon} {label}</span>
    <span className="text-sm font-medium text-foreground">{value}</span>
  </div>
);

export default WallpaperDetail;
