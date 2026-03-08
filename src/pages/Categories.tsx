import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { categories, wallpapers } from "@/data/wallpapers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { collectionJsonLd } from "@/lib/seo";

const Categories = () => {
  const jsonLd = collectionJsonLd(
    "Wallpaper Categories",
    "Browse wallpapers by category – Nature, Gaming, Anime, Cars, Space, Cyberpunk, and more.",
    wallpapers.slice(0, 12)
  );

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Wallpaper Categories – Browse by Style"
        description="Browse free HD and 4K wallpapers by category. Nature, Gaming, Anime, Cars, Space, Cyberpunk, Minimal, Abstract, Dark, and more on WallNova."
        canonical="/categories"
        jsonLd={jsonLd}
      />
      <Navbar />

      <div className="pt-24 pb-16 container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">Categories</h1>
          <p className="text-muted-foreground">Browse wallpapers by category</p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((cat, i) => {
            const samples = wallpapers.filter((w) => w.category === cat.name).slice(0, 3);
            const previewImg = samples[0]?.imageUrl;

            return (
              <motion.div key={cat.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} viewport={{ once: true }}>
                <Link
                  to={`/explore?category=${encodeURIComponent(cat.name)}`}
                  className="group block glass-card rounded-2xl overflow-hidden border border-[hsl(var(--glass-border))] hover:border-primary/30 transition-all duration-300"
                >
                  <div className="relative h-36 sm:h-44 overflow-hidden bg-secondary">
                    {previewImg ? (
                      <img src={previewImg} alt={`${cat.name} wallpapers – browse free ${cat.name} wallpapers`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl">{cat.icon}</div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />
                    {samples.length > 1 && (
                      <div className="absolute bottom-2 right-2 flex gap-1">
                        {samples.slice(1, 3).map((s) => (
                          <img key={s.id} src={s.imageUrl} alt="" className="w-8 h-8 rounded-md object-cover border border-background/50 opacity-80" loading="lazy" />
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{cat.icon}</span>
                      <h3 className="font-display text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{cat.name}</h3>
                    </div>
                    <p className="text-xs text-muted-foreground">{cat.count.toLocaleString()} wallpapers</p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Categories;
