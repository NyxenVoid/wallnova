import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Upload as UploadIcon, Image, X, Film, Lock } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAdminUploadWallpaper } from "@/hooks/use-wallpapers";
import { categories } from "@/data/wallpapers";

const types = [
  { value: "mobile", label: "Mobile" },
  { value: "desktop", label: "Desktop" },
  { value: "4k", label: "4K" },
] as const;

const ACCEPTED_TYPES = "image/*,video/mp4,video/webm,image/gif";
const isVideoFile = (file: File) => file.type.startsWith("video/") || file.type === "image/gif";

const AdminUpload = () => {
  const navigate = useNavigate();
  const upload = useAdminUploadWallpaper();
  const fileRef = useRef<HTMLInputElement>(null);

  const [authenticated, setAuthenticated] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isAnimated, setIsAnimated] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Other");
  const [type, setType] = useState<"mobile" | "desktop" | "4k">("desktop");
  const [tagsInput, setTagsInput] = useState("");

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 container mx-auto px-4 max-w-sm text-center">
          <div className="glass-card p-8 rounded-2xl">
            <Lock className="mx-auto text-primary mb-4" size={32} />
            <h1 className="font-display text-2xl font-bold text-foreground mb-2">Admin Access</h1>
            <p className="text-sm text-muted-foreground mb-6">Sign in with admin credentials to upload wallpapers</p>
            <form onSubmit={(e) => {
              e.preventDefault();
              if (adminEmail && adminPassword) {
                setAuthenticated(true);
                setLoginError("");
              } else {
                setLoginError("Please enter email and password");
              }
            }}>
              <Input
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="Admin email"
                className="bg-secondary/50 border-border mb-3"
                required
              />
              <Input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Admin password"
                className="bg-secondary/50 border-border mb-4"
                required
              />
              {loginError && <p className="text-destructive text-xs mb-3">{loginError}</p>}
              <Button type="submit" className="btn-glow w-full">Unlock</Button>
            </form>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const handleFile = (f: File) => {
    setFile(f);
    setIsAnimated(isVideoFile(f));
    setPreview(URL.createObjectURL(f));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title) return;

    const tags = tagsInput.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean);
    const finalTags = isAnimated && !tags.includes("animated") ? [...tags, "animated"] : tags;

    let resolution = "1920x1080";
    if (!isVideoFile(file)) {
      const img = new window.Image();
      img.src = preview!;
      await new Promise((r) => (img.onload = r));
      resolution = `${img.naturalWidth}x${img.naturalHeight}`;
    }

    await upload.mutateAsync({ file, title, description, category, type, tags: finalTags, resolution, adminEmail, adminPassword });
    navigate("/explore");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24 pb-16 container mx-auto px-4 max-w-2xl">
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-display text-3xl font-bold text-foreground mb-8">
          Admin Upload
        </motion.h1>

        <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} onSubmit={handleSubmit} className="space-y-6">
          <div
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
            className="glass-card rounded-2xl border-2 border-dashed border-border hover:border-primary/50 transition-colors cursor-pointer p-8 text-center"
          >
            {preview ? (
              <div className="relative">
                {isAnimated && file?.type.startsWith("video/") ? (
                  <video src={preview} className="max-h-64 mx-auto rounded-xl object-contain" autoPlay loop muted playsInline />
                ) : (
                  <img src={preview} alt="Preview" className="max-h-64 mx-auto rounded-xl object-contain" />
                )}
                <button type="button" onClick={(e) => { e.stopPropagation(); setFile(null); setPreview(null); setIsAnimated(false); }}
                  className="absolute top-2 right-2 p-1 rounded-full bg-background/80 text-foreground hover:bg-destructive hover:text-destructive-foreground">
                  <X size={16} />
                </button>
                {isAnimated && (
                  <span className="absolute top-2 left-2 badge-glass text-primary flex items-center gap-1 text-xs">
                    <Film size={12} /> Animated
                  </span>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <Image className="mx-auto text-muted-foreground" size={40} />
                <p className="text-muted-foreground text-sm">Drag & drop or click to select</p>
                <p className="text-muted-foreground text-xs">Supports JPG, PNG, WebP, GIF, MP4, WebM</p>
              </div>
            )}
            <input ref={fileRef} type="file" accept={ACCEPTED_TYPES} className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Title *</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Wallpaper title" className="bg-secondary/50 border-border" required />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the wallpaper..." rows={3}
              className="w-full rounded-xl bg-secondary/50 border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Category</label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button key={cat.name} type="button" onClick={() => setCategory(cat.name)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${category === cat.name ? "bg-primary text-primary-foreground" : "bg-secondary/60 text-muted-foreground hover:text-foreground"}`}>
                  {cat.icon} {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Type</label>
            <div className="flex gap-2">
              {types.map((t) => (
                <button key={t.value} type="button" onClick={() => setType(t.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${type === t.value ? "bg-primary text-primary-foreground" : "bg-secondary/60 text-muted-foreground hover:text-foreground"}`}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Tags (comma-separated)</label>
            <Input value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} placeholder="nature, dark, minimal" className="bg-secondary/50 border-border" />
          </div>

          <Button type="submit" disabled={!file || !title || upload.isPending} className="btn-glow w-full py-3 flex items-center justify-center gap-2">
            <UploadIcon size={18} /> {upload.isPending ? "Uploading..." : "Upload Wallpaper"}
          </Button>
        </motion.form>
      </div>

      <Footer />
    </div>
  );
};

export default AdminUpload;
