import { Search, TrendingUp, Sparkles, Clock, Award } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";
import heroBg from "@/assets/hero-bg.jpg";
import WallpaperCard from "@/components/WallpaperCard";
import { wallpapers, categories } from "@/data/wallpapers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const trending = wallpapers.filter((w) => w.trending);
  const featured = wallpapers.filter((w) => w.featured);
  const dailyPick = wallpapers[6]; // Aurora Borealis

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[90vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <img src={heroBg} alt="WallNova hero background" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background" />
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground mb-4">
              Discover <span className="gradient-text">Stunning</span>
              <br />Wallpapers
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8">
              Explore thousands of high-quality wallpapers from talented creators worldwide
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="max-w-2xl mx-auto"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
              <input
                type="text"
                placeholder="Search wallpapers, categories, creators..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="glass-input w-full pl-12 pr-32 py-4 text-base rounded-2xl"
              />
              <button className="btn-glow absolute right-2 top-1/2 -translate-y-1/2 text-sm px-5 py-2 rounded-xl">
                Search
              </button>
            </div>
            <div className="mt-3 flex flex-wrap justify-center gap-2">
              {["Cyberpunk", "4K", "Anime", "Nature", "Dark"].map((tag) => (
                <span key={tag} className="badge-glass text-muted-foreground hover:text-primary cursor-pointer transition-colors">
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-10 flex justify-center gap-8 sm:gap-12"
          >
            {[
              { label: "Wallpapers", value: "50K+" },
              { label: "Downloads", value: "2M+" },
              { label: "Creators", value: "8K+" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-display text-2xl font-bold text-primary">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Trending Wallpapers */}
      <section className="container mx-auto px-4 py-16">
        <SectionHeader icon={<TrendingUp size={20} />} title="Trending Now" subtitle="Most popular wallpapers this week" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
          {trending.map((w, i) => (
            <WallpaperCard key={w.id} wallpaper={w} index={i} />
          ))}
        </div>
      </section>

      {/* Daily Pick */}
      <section className="container mx-auto px-4 py-8">
        <SectionHeader icon={<Award size={20} />} title="Wallpaper of the Day" subtitle="Hand-picked by our team" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8"
        >
          <Link to={`/wallpaper/${dailyPick.id}`} className="block group">
            <div className="glass-card-hover overflow-hidden rounded-2xl">
              <div className="relative aspect-[21/9] overflow-hidden">
                <img
                  src={dailyPick.imageUrl}
                  alt={dailyPick.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/30 to-transparent" />
                <div className="absolute bottom-6 left-6 sm:bottom-10 sm:left-10">
                  <span className="badge-glass text-primary mb-3 inline-block">🏆 Daily Pick</span>
                  <h3 className="font-display text-2xl sm:text-4xl font-bold text-foreground">{dailyPick.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground max-w-md">{dailyPick.description}</p>
                  <span className="btn-glow inline-block mt-4 text-sm">Download Now</span>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 py-16">
        <SectionHeader icon={<Sparkles size={20} />} title="Categories" subtitle="Browse by your favorite style" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mt-8">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              viewport={{ once: true }}
            >
              <div className="glass-card-hover p-4 text-center cursor-pointer group">
                <span className="text-3xl block mb-2">{cat.icon}</span>
                <h4 className="font-display text-sm font-semibold text-foreground">{cat.name}</h4>
                <p className="text-xs text-muted-foreground mt-1">{cat.count.toLocaleString()} walls</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="container mx-auto px-4 py-16">
        <SectionHeader icon={<Sparkles size={20} />} title="Featured Wallpapers" subtitle="Editor's choice picks" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
          {featured.map((w, i) => (
            <WallpaperCard key={w.id} wallpaper={w} index={i} />
          ))}
        </div>
      </section>

      {/* Latest Uploads */}
      <section className="container mx-auto px-4 py-16">
        <SectionHeader icon={<Clock size={20} />} title="Latest Uploads" subtitle="Fresh wallpapers just added" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
          {wallpapers.slice(0, 8).map((w, i) => (
            <WallpaperCard key={w.id} wallpaper={w} index={i} />
          ))}
        </div>
      </section>

      {/* Ad Space */}
      <section className="container mx-auto px-4 py-8">
        <div className="glass-card rounded-2xl p-8 text-center">
          <p className="text-xs text-muted-foreground tracking-widest uppercase">Advertisement</p>
          <div className="h-24 flex items-center justify-center text-muted-foreground/40 text-sm">
            Ad Space — 728x90
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

const SectionHeader = ({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle: string }) => (
  <div className="flex items-center gap-3">
    <div className="p-2 rounded-lg bg-primary/10 text-primary">{icon}</div>
    <div>
      <h2 className="font-display text-2xl font-bold text-foreground">{title}</h2>
      <p className="text-sm text-muted-foreground">{subtitle}</p>
    </div>
  </div>
);

export default Index;
