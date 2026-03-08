import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Trophy, Heart, Download, Star, Crown, Medal } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface LeaderboardEntry {
  user_id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  total_likes: number;
  total_downloads: number;
  avg_rating: number;
  upload_count: number;
  score: number;
}

const Leaderboard = () => {
  const { data: leaders = [], isLoading } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      // Get all wallpapers
      const { data: wallpapers } = await supabase.from("wallpapers").select("id, user_id, downloads");
      if (!wallpapers?.length) return [];

      const ids = wallpapers.map((w) => w.id);
      const userIds = [...new Set(wallpapers.map((w) => w.user_id))];

      // Fetch likes, ratings, profiles in parallel
      const [likesRes, ratingsRes, profilesRes] = await Promise.all([
        supabase.from("wallpaper_likes").select("wallpaper_id").in("wallpaper_id", ids),
        supabase.from("wallpaper_ratings").select("wallpaper_id, rating").in("wallpaper_id", ids),
        supabase.from("profiles").select("user_id, username, display_name, avatar_url").in("user_id", userIds),
      ]);

      // Build wallpaper → likes count
      const likeMap: Record<string, number> = {};
      (likesRes.data || []).forEach((l) => {
        likeMap[l.wallpaper_id] = (likeMap[l.wallpaper_id] || 0) + 1;
      });

      // Build wallpaper → avg rating
      const ratingMap: Record<string, { sum: number; count: number }> = {};
      (ratingsRes.data || []).forEach((r) => {
        if (!ratingMap[r.wallpaper_id]) ratingMap[r.wallpaper_id] = { sum: 0, count: 0 };
        ratingMap[r.wallpaper_id].sum += r.rating;
        ratingMap[r.wallpaper_id].count += 1;
      });

      const profileMap: Record<string, { username: string; display_name: string | null; avatar_url: string | null }> = {};
      (profilesRes.data || []).forEach((p) => { profileMap[p.user_id] = p; });

      // Aggregate per user
      const userStats: Record<string, { likes: number; downloads: number; ratingSum: number; ratingCount: number; uploads: number }> = {};
      wallpapers.forEach((w) => {
        if (!userStats[w.user_id]) userStats[w.user_id] = { likes: 0, downloads: 0, ratingSum: 0, ratingCount: 0, uploads: 0 };
        const s = userStats[w.user_id];
        s.uploads += 1;
        s.downloads += w.downloads;
        s.likes += likeMap[w.id] || 0;
        if (ratingMap[w.id]) {
          s.ratingSum += ratingMap[w.id].sum;
          s.ratingCount += ratingMap[w.id].count;
        }
      });

      return Object.entries(userStats)
        .map(([uid, s]) => {
          const avgRating = s.ratingCount > 0 ? Math.round((s.ratingSum / s.ratingCount) * 10) / 10 : 0;
          const profile = profileMap[uid];
          return {
            user_id: uid,
            username: profile?.username || "Unknown",
            display_name: profile?.display_name,
            avatar_url: profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${uid}`,
            total_likes: s.likes,
            total_downloads: s.downloads,
            avg_rating: avgRating,
            upload_count: s.uploads,
            score: s.likes * 3 + s.downloads + avgRating * 50,
          } as LeaderboardEntry;
        })
        .sort((a, b) => b.score - a.score);
    },
  });

  const rankIcon = (i: number) => {
    if (i === 0) return <Crown size={20} className="text-yellow-400" />;
    if (i === 1) return <Medal size={20} className="text-gray-300" />;
    if (i === 2) return <Medal size={20} className="text-amber-600" />;
    return <span className="text-sm font-bold text-muted-foreground w-5 text-center">{i + 1}</span>;
  };

  const formatCount = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(1)}k` : n.toString());

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24 pb-16 container mx-auto px-4 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 mb-3">
            <Trophy className="text-primary" size={28} />
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">Leaderboard</h1>
          </div>
          <p className="text-muted-foreground">Top creators ranked by likes, downloads & ratings</p>
        </motion.div>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="glass-card rounded-2xl p-5 animate-pulse h-20" />
            ))}
          </div>
        ) : leaders.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <p className="text-4xl mb-4">🏆</p>
            <h3 className="font-display text-lg font-semibold text-foreground mb-2">No creators yet</h3>
            <p className="text-muted-foreground text-sm">Upload wallpapers to appear on the leaderboard</p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {leaders.map((entry, i) => (
              <motion.div
                key={entry.user_id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className={`glass-card rounded-2xl p-4 md:p-5 flex items-center gap-4 border transition-all ${
                  i === 0
                    ? "border-yellow-400/30 bg-yellow-400/5"
                    : i === 1
                    ? "border-gray-300/20 bg-gray-300/5"
                    : i === 2
                    ? "border-amber-600/20 bg-amber-600/5"
                    : "border-[hsl(var(--glass-border))]"
                }`}
              >
                <div className="w-8 flex items-center justify-center">{rankIcon(i)}</div>

                <img
                  src={entry.avatar_url!}
                  alt={entry.username}
                  className="w-11 h-11 rounded-xl bg-muted object-cover"
                />

                <div className="flex-1 min-w-0">
                  <p className="font-display text-sm font-semibold text-foreground truncate">
                    {entry.display_name || entry.username}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {entry.upload_count} wallpaper{entry.upload_count !== 1 ? "s" : ""}
                  </p>
                </div>

                <div className="hidden sm:flex items-center gap-5">
                  <StatPill icon={<Heart size={13} />} value={formatCount(entry.total_likes)} />
                  <StatPill icon={<Download size={13} />} value={formatCount(entry.total_downloads)} />
                  <StatPill icon={<Star size={13} />} value={entry.avg_rating.toString()} />
                </div>

                <div className="text-right">
                  <p className="font-display text-lg font-bold text-primary">{Math.round(entry.score)}</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Score</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-10 glass-card rounded-2xl p-5 text-center text-sm text-muted-foreground"
        >
          <p>Score = Likes × 3 + Downloads + Avg Rating × 50</p>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

const StatPill = ({ icon, value }: { icon: React.ReactNode; value: string }) => (
  <span className="flex items-center gap-1 text-xs text-muted-foreground">
    {icon} {value}
  </span>
);

export default Leaderboard;
