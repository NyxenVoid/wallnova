import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Settings, Image, Heart, Star, Edit2, LogOut, Camera, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useWallpapers, useDeleteWallpaper } from "@/hooks/use-wallpapers";
import WallpaperCard from "@/components/WallpaperCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const Profile = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"wallpapers" | "settings">("wallpapers");
  const [profile, setProfile] = useState<{
    username: string;
    display_name: string | null;
    bio: string | null;
    avatar_url: string | null;
    banner_url: string | null;
    level: number;
    xp: number;
  } | null>(null);
  const [editName, setEditName] = useState("");
  const [editBio, setEditBio] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; image_url: string; title: string } | null>(null);
  const deleteWallpaper = useDeleteWallpaper();
  // Fetch user's wallpapers
  const { data: allWallpapers } = useWallpapers();
  const myWallpapers = (allWallpapers || []).filter((w) => w.user_id === user?.id);
  const totalLikes = myWallpapers.reduce((sum, w) => sum + (w.likes_count || 0), 0);
  const totalDownloads = myWallpapers.reduce((sum, w) => sum + w.downloads, 0);
  const avgRating =
    myWallpapers.length > 0
      ? Math.round(
          (myWallpapers.reduce((sum, w) => sum + (w.avg_rating || 0), 0) / myWallpapers.length) * 10
        ) / 10
      : 0;

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("username, display_name, bio, avatar_url, banner_url, level, xp")
      .eq("user_id", user.id)
      .single()
      .then(({ data }) => {
        if (data) {
          setProfile(data);
          setEditName(data.display_name || data.username);
          setEditBio(data.bio || "");
        }
      });
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 text-center">
          <h1 className="font-display text-2xl font-bold text-foreground mb-4">Sign in to view your profile</h1>
          <Button onClick={() => navigate("/sign-in")} className="btn-glow">Sign In</Button>
        </div>
        <Footer />
      </div>
    );
  }

  const handleSaveSettings = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ display_name: editName, bio: editBio })
      .eq("user_id", user.id);
    setSaving(false);
    if (error) {
      toast.error("Failed to save");
    } else {
      setProfile((p) => p ? { ...p, display_name: editName, bio: editBio } : p);
      toast.success("Profile updated!");
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const ext = file.name.split(".").pop();
    const path = `${user.id}/avatar.${ext}`;
    const { error: uploadErr } = await supabase.storage.from("wallpapers").upload(path, file, { upsert: true });
    if (uploadErr) { toast.error("Upload failed"); return; }
    const { data: urlData } = supabase.storage.from("wallpapers").getPublicUrl(path);
    await supabase.from("profiles").update({ avatar_url: urlData.publicUrl }).eq("user_id", user.id);
    setProfile((p) => p ? { ...p, avatar_url: urlData.publicUrl } : p);
    toast.success("Avatar updated!");
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const avatarUrl = profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`;

  // Convert DB wallpapers to WallpaperCard format
  const cardWallpapers = myWallpapers.map((w) => ({
    id: w.id,
    title: w.title,
    description: w.description || "",
    imageUrl: w.image_url,
    category: w.category,
    resolution: w.resolution,
    type: w.type,
    tags: w.tags,
    downloads: w.downloads,
    likes: w.likes_count || 0,
    rating: w.avg_rating || 0,
    creator: {
      name: profile?.display_name || profile?.username || "You",
      avatar: avatarUrl,
      id: user.id,
    },
    createdAt: w.created_at,
    featured: w.featured,
    trending: w.trending,
  }));

  const tabs = [
    { key: "wallpapers" as const, label: "My Wallpapers", icon: <Image size={16} /> },
    { key: "settings" as const, label: "Settings", icon: <Settings size={16} /> },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-20">
        {/* Banner */}
        <div className="h-48 md:h-56 bg-gradient-to-br from-primary/20 via-accent/10 to-secondary relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(var(--primary)/0.15),transparent_60%)]" />
        </div>

        <div className="container mx-auto px-4 -mt-16 relative z-10">
          {/* Avatar + Info */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row items-start gap-5 mb-8">
            <div className="relative group">
              <img src={avatarUrl} alt="Avatar" className="w-28 h-28 rounded-2xl border-4 border-background bg-muted object-cover" />
              <label className="absolute inset-0 rounded-2xl bg-background/60 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                <Camera size={20} className="text-foreground" />
                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
              </label>
            </div>
            <div className="flex-1 pt-2">
              <h1 className="font-display text-2xl font-bold text-foreground">
                {profile?.display_name || profile?.username || "Loading..."}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">@{profile?.username}</p>
              {profile?.bio && <p className="text-sm text-muted-foreground mt-2 max-w-md">{profile.bio}</p>}
              <div className="flex items-center gap-1 mt-2">
                <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  Level {profile?.level || 1}
                </span>
                <span className="text-xs text-muted-foreground ml-2">{profile?.xp || 0} XP</span>
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <StatCard icon={<Image size={18} />} label="Uploads" value={myWallpapers.length} />
            <StatCard icon={<Heart size={18} />} label="Total Likes" value={totalLikes} />
            <StatCard icon={<Star size={18} />} label="Avg Rating" value={avgRating} />
            <StatCard icon={<User size={18} />} label="Downloads" value={totalDownloads} />
          </motion.div>

          {/* Tabs */}
          <div className="flex gap-2 mb-8 border-b border-border">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
                  activeTab === tab.key
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          {activeTab === "wallpapers" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {cardWallpapers.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                  {cardWallpapers.map((w, i) => (
                    <WallpaperCard key={w.id} wallpaper={w} index={i} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <p className="text-4xl mb-4">🖼️</p>
                  <h3 className="font-display text-lg font-semibold text-foreground mb-2">No wallpapers yet</h3>
                  <p className="text-muted-foreground text-sm mb-4">Upload your first wallpaper to get started</p>
                  <Button onClick={() => navigate("/upload")} className="btn-glow">Upload Wallpaper</Button>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "settings" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-lg space-y-6 pb-16">
              <div className="glass-card p-6 rounded-2xl space-y-4">
                <h3 className="font-display text-lg font-semibold text-foreground">Edit Profile</h3>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Display Name</label>
                  <Input value={editName} onChange={(e) => setEditName(e.target.value)} className="bg-secondary/50 border-border" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Bio</label>
                  <textarea
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    rows={3}
                    className="w-full rounded-xl bg-secondary/50 border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                    placeholder="Tell the world about yourself..."
                  />
                </div>
                <Button onClick={handleSaveSettings} disabled={saving} className="btn-glow w-full flex items-center justify-center gap-2">
                  <Edit2 size={16} /> {saving ? "Saving..." : "Save Changes"}
                </Button>
              </div>

              <div className="glass-card p-6 rounded-2xl space-y-4">
                <h3 className="font-display text-lg font-semibold text-foreground">Account</h3>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <Button variant="outline" onClick={handleSignOut} className="w-full flex items-center justify-center gap-2 text-destructive border-destructive/30 hover:bg-destructive/10">
                  <LogOut size={16} /> Sign Out
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

const StatCard = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) => (
  <div className="glass-card rounded-2xl p-4 text-center">
    <div className="flex items-center justify-center text-primary mb-2">{icon}</div>
    <p className="font-display text-xl font-bold text-foreground">{value}</p>
    <p className="text-xs text-muted-foreground">{label}</p>
  </div>
);

export default Profile;
