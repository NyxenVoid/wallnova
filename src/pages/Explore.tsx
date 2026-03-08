import { Search, SlidersHorizontal, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import WallpaperCard from "@/components/WallpaperCard";
import { wallpapers, categories } from "@/data/wallpapers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const resolutions = ["All", "768x1024", "1920x1080", "3840x2160"];
const types = ["All", "mobile", "desktop", "4k"];
const sortOptions = [
  { value: "popular", label: "Most Popular" },
  { value: "newest", label: "Newest" },
  { value: "most-liked", label: "Most Liked" },
  { value: "top-rated", label: "Top Rated" },
  { value: "most-downloaded", label: "Most Downloaded" },
];
const colorFilters = [
  { name: "All", color: "" },
  { name: "Red", color: "hsl(0, 80%, 50%)" },
  { name: "Orange", color: "hsl(30, 80%, 50%)" },
  { name: "Yellow", color: "hsl(50, 80%, 50%)" },
  { name: "Green", color: "hsl(120, 60%, 40%)" },
  { name: "Blue", color: "hsl(210, 80%, 50%)" },
  { name: "Purple", color: "hsl(270, 70%, 55%)" },
  { name: "Pink", color: "hsl(330, 70%, 55%)" },
];

const Explore = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedColor, setSelectedColor] = useState("All");
  const [sortBy, setSortBy] = useState("popular");
  const [showFilters, setShowFilters] = useState(true);

  const filtered = useMemo(() => {
    let results = [...wallpapers];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      results = results.filter(
        (w) =>
          w.title.toLowerCase().includes(q) ||
          w.description.toLowerCase().includes(q) ||
          w.tags.some((t) => t.includes(q))
      );
    }

    if (selectedCategory !== "All") {
      results = results.filter((w) => w.category === selectedCategory);
    }

    if (selectedType !== "All") {
      results = results.filter((w) => w.type === selectedType);
    }

    // Color filter maps to tags loosely
    if (selectedColor !== "All") {
      const colorTag = selectedColor.toLowerCase();
      results = results.filter(
        (w) =>
          w.tags.some((t) => t.includes(colorTag)) ||
          w.description.toLowerCase().includes(colorTag)
      );
    }

    switch (sortBy) {
      case "newest":
        results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case "most-liked":
        results.sort((a, b) => b.likes - a.likes);
        break;
      case "top-rated":
        results.sort((a, b) => b.rating - a.rating);
        break;
      case "most-downloaded":
        results.sort((a, b) => b.downloads - a.downloads);
        break;
      default:
        results.sort((a, b) => b.downloads + b.likes - (a.downloads + a.likes));
    }

    return results;
  }, [searchQuery, selectedCategory, selectedType, selectedColor, sortBy]);

  const activeFilterCount = [
    selectedCategory !== "All",
    selectedType !== "All",
    selectedColor !== "All",
  ].filter(Boolean).length;

  const clearFilters = () => {
    setSelectedCategory("All");
    setSelectedType("All");
    setSelectedColor("All");
    setSearchQuery("");
    setSortBy("popular");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
              Explore Wallpapers
            </h1>
            <p className="text-muted-foreground">
              Discover {wallpapers.length.toLocaleString()}+ stunning wallpapers
            </p>
          </motion.div>

          {/* Search + Filter toggle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex gap-3 mb-6"
          >
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                type="text"
                placeholder="Search wallpapers, tags, categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 bg-secondary/50 border-border text-foreground placeholder:text-muted-foreground"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className={`h-12 gap-2 border-border ${showFilters ? "bg-primary/10 text-primary border-primary/30" : ""}`}
            >
              <SlidersHorizontal size={16} />
              Filters
              {activeFilterCount > 0 && (
                <span className="ml-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </Button>
          </motion.div>

          {/* Filters panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden mb-8"
              >
                <div className="glass-card rounded-2xl p-6 border border-[hsl(var(--glass-border))] space-y-6">
                  {/* Sort */}
                  <div>
                    <h3 className="text-sm font-medium text-foreground mb-3">Sort By</h3>
                    <div className="flex flex-wrap gap-2">
                      {sortOptions.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => setSortBy(opt.value)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            sortBy === opt.value
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary/60 text-muted-foreground hover:text-foreground hover:bg-secondary"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Categories */}
                  <div>
                    <h3 className="text-sm font-medium text-foreground mb-3">Category</h3>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setSelectedCategory("All")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          selectedCategory === "All"
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary/60 text-muted-foreground hover:text-foreground hover:bg-secondary"
                        }`}
                      >
                        All
                      </button>
                      {categories.map((cat) => (
                        <button
                          key={cat.name}
                          onClick={() => setSelectedCategory(cat.name)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            selectedCategory === cat.name
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary/60 text-muted-foreground hover:text-foreground hover:bg-secondary"
                          }`}
                        >
                          {cat.icon} {cat.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Type */}
                  <div>
                    <h3 className="text-sm font-medium text-foreground mb-3">Type</h3>
                    <div className="flex flex-wrap gap-2">
                      {types.map((t) => (
                        <button
                          key={t}
                          onClick={() => setSelectedType(t)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all uppercase ${
                            selectedType === t
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary/60 text-muted-foreground hover:text-foreground hover:bg-secondary"
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Color */}
                  <div>
                    <h3 className="text-sm font-medium text-foreground mb-3">Color</h3>
                    <div className="flex flex-wrap gap-2">
                      {colorFilters.map((c) => (
                        <button
                          key={c.name}
                          onClick={() => setSelectedColor(c.name)}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            selectedColor === c.name
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary/60 text-muted-foreground hover:text-foreground hover:bg-secondary"
                          }`}
                        >
                          {c.color && (
                            <span
                              className="h-3 w-3 rounded-full border border-foreground/20"
                              style={{ backgroundColor: c.color }}
                            />
                          )}
                          {c.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Clear */}
                  {activeFilterCount > 0 && (
                    <button
                      onClick={clearFilters}
                      className="text-xs text-primary hover:underline"
                    >
                      Clear all filters
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-muted-foreground">
              {filtered.length} wallpaper{filtered.length !== 1 ? "s" : ""} found
            </p>
          </div>

          {/* Grid */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {filtered.map((w, i) => (
                <WallpaperCard key={w.id} wallpaper={w} index={i} />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p className="text-4xl mb-4">🔍</p>
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                No wallpapers found
              </h3>
              <p className="text-muted-foreground text-sm mb-4">
                Try adjusting your search or filters
              </p>
              <Button variant="outline" onClick={clearFilters}>
                Clear filters
              </Button>
            </motion.div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Explore;
