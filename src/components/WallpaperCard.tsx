import { Link } from "react-router-dom";
import { Download, Play } from "lucide-react";
import { motion } from "framer-motion";
import { generateImageAlt } from "@/lib/seo";
import type { Wallpaper } from "@/data/wallpapers";

interface WallpaperCardProps {
  wallpaper: Wallpaper;
  index?: number;
}

const isVideo = (url: string) => /\.(mp4|webm)(\?|$)/i.test(url);
const isAnimated = (url: string) => /\.(mp4|webm|gif)(\?|$)/i.test(url);

const WallpaperCard = ({ wallpaper, index = 0 }: WallpaperCardProps) => {
  const formatCount = (n: number) => {
    if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
    return n.toString();
  };

  const altText = generateImageAlt(wallpaper.title, wallpaper.category, wallpaper.type);
  const animated = isAnimated(wallpaper.imageUrl);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      viewport={{ once: true }}
    >
      <Link to={`/wallpaper/${wallpaper.id}`} className="group block">
        <div className="glass-card-hover overflow-hidden">
          <div className="relative aspect-[3/4] overflow-hidden">
            {isVideo(wallpaper.imageUrl) ? (
              <video
                src={wallpaper.imageUrl}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                autoPlay loop muted playsInline
              />
            ) : (
              <img
                src={wallpaper.imageUrl}
                alt={altText}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy" decoding="async"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="absolute top-3 left-3 flex gap-2">
              {wallpaper.trending && <span className="badge-glass text-primary">🔥 Trending</span>}
              {wallpaper.featured && <span className="badge-glass text-accent">⭐ Featured</span>}
              {animated && (
                <span className="badge-glass text-primary flex items-center gap-1">
                  <Play size={10} /> Animated
                </span>
              )}
            </div>

            <span className="absolute top-3 right-3 badge-glass uppercase tracking-wider text-foreground/70">{wallpaper.type}</span>

            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
              <span className="flex items-center gap-1 text-xs text-foreground/80">
                <Download size={12} /> {formatCount(wallpaper.downloads)}
              </span>
            </div>
          </div>

          <div className="p-3">
            <h3 className="font-display text-sm font-semibold text-foreground truncate">{wallpaper.title}</h3>
            <div className="mt-1 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{wallpaper.category}</span>
              <span className="text-xs text-muted-foreground">{wallpaper.resolution}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default WallpaperCard;
