import wallpaper1 from "@/assets/wallpaper-1.jpg";
import wallpaper2 from "@/assets/wallpaper-2.jpg";
import wallpaper3 from "@/assets/wallpaper-3.jpg";
import wallpaper4 from "@/assets/wallpaper-4.jpg";
import wallpaper5 from "@/assets/wallpaper-5.jpg";
import wallpaper6 from "@/assets/wallpaper-6.jpg";
import wallpaper7 from "@/assets/wallpaper-7.jpg";
import wallpaper8 from "@/assets/wallpaper-8.jpg";

export interface Wallpaper {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  resolution: string;
  type: "mobile" | "desktop" | "4k";
  tags: string[];
  downloads: number;
  likes: number;
  rating: number;
  creator: {
    name: string;
    avatar: string;
    id: string;
  };
  createdAt: string;
  featured?: boolean;
  trending?: boolean;
}

export const categories = [
  { name: "Nature", icon: "🌿", count: 2840 },
  { name: "Gaming", icon: "🎮", count: 1920 },
  { name: "Anime", icon: "🌸", count: 3100 },
  { name: "Cars", icon: "🏎️", count: 1560 },
  { name: "Space", icon: "🚀", count: 2200 },
  { name: "Cyberpunk", icon: "🌆", count: 1780 },
  { name: "Minimal", icon: "◻️", count: 2450 },
  { name: "AI Generated", icon: "🤖", count: 4200 },
  { name: "Abstract", icon: "🎨", count: 1890 },
  { name: "Dark", icon: "🌑", count: 3400 },
  { name: "Animals", icon: "🐾", count: 1340 },
  { name: "Fantasy", icon: "🐉", count: 2100 },
];

export const wallpapers: Wallpaper[] = [
  {
    id: "1",
    title: "Cosmic Nebula Dreams",
    description: "A stunning cosmic nebula with purple and blue stars in deep space. Perfect for phone wallpapers with vivid colors.",
    imageUrl: wallpaper1,
    category: "Space",
    resolution: "768x1024",
    type: "mobile",
    tags: ["space", "nebula", "cosmic", "purple", "stars"],
    downloads: 12400,
    likes: 8920,
    rating: 4.8,
    creator: { name: "CosmicArtist", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=cosmic", id: "u1" },
    createdAt: "2026-03-07",
    trending: true,
  },
  {
    id: "2",
    title: "Sunset Mountain Silhouette",
    description: "Minimalist geometric mountain landscape at sunset with stunning dark blue and orange gradient sky.",
    imageUrl: wallpaper2,
    category: "Minimal",
    resolution: "768x1024",
    type: "mobile",
    tags: ["minimal", "sunset", "mountain", "geometric", "vector"],
    downloads: 9800,
    likes: 7200,
    rating: 4.7,
    creator: { name: "MinimalVibes", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=minimal", id: "u2" },
    createdAt: "2026-03-06",
    featured: true,
  },
  {
    id: "3",
    title: "Neon City Nights",
    description: "Cyberpunk city skyline at night with neon lights reflecting on wet streets. Cinematic gaming wallpaper.",
    imageUrl: wallpaper3,
    category: "Cyberpunk",
    resolution: "1920x1080",
    type: "desktop",
    tags: ["cyberpunk", "neon", "city", "night", "gaming"],
    downloads: 18600,
    likes: 14200,
    rating: 4.9,
    creator: { name: "NeonDreamer", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=neon", id: "u3" },
    createdAt: "2026-03-05",
    trending: true,
    featured: true,
  },
  {
    id: "4",
    title: "Cherry Blossom Night",
    description: "Japanese anime style cherry blossom tree at night with glowing lanterns. Serene aesthetic wallpaper.",
    imageUrl: wallpaper4,
    category: "Anime",
    resolution: "768x1024",
    type: "mobile",
    tags: ["anime", "cherry blossom", "japan", "night", "aesthetic"],
    downloads: 15300,
    likes: 11800,
    rating: 4.9,
    creator: { name: "SakuraArt", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sakura", id: "u4" },
    createdAt: "2026-03-04",
    trending: true,
  },
  {
    id: "5",
    title: "Neon Supercar",
    description: "Sleek futuristic sports car with neon underglow in a dark tunnel. Cinematic gaming wallpaper.",
    imageUrl: wallpaper5,
    category: "Cars",
    resolution: "1920x1080",
    type: "desktop",
    tags: ["car", "neon", "supercar", "tunnel", "futuristic"],
    downloads: 22100,
    likes: 16500,
    rating: 4.8,
    creator: { name: "SpeedArt", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=speed", id: "u5" },
    createdAt: "2026-03-03",
    featured: true,
  },
  {
    id: "6",
    title: "Dark Flow",
    description: "Dark minimal abstract wallpaper with flowing gradient lines in deep blue and black.",
    imageUrl: wallpaper6,
    category: "Minimal",
    resolution: "768x1024",
    type: "mobile",
    tags: ["minimal", "dark", "abstract", "blue", "elegant"],
    downloads: 7600,
    likes: 5400,
    rating: 4.5,
    creator: { name: "DarkMinimal", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=dark", id: "u6" },
    createdAt: "2026-03-02",
  },
  {
    id: "7",
    title: "Aurora Borealis",
    description: "Breathtaking northern lights aurora borealis over snowy mountains with vivid green and blue colors.",
    imageUrl: wallpaper7,
    category: "Nature",
    resolution: "1920x1080",
    type: "4k",
    tags: ["aurora", "nature", "mountains", "snow", "northern lights"],
    downloads: 28900,
    likes: 21300,
    rating: 5.0,
    creator: { name: "NatureShots", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=nature", id: "u7" },
    createdAt: "2026-03-01",
    trending: true,
    featured: true,
  },
  {
    id: "8",
    title: "Astronaut Drift",
    description: "Astronaut floating in deep space with Earth in background. Dramatic cinematic space wallpaper.",
    imageUrl: wallpaper8,
    category: "Space",
    resolution: "768x1024",
    type: "mobile",
    tags: ["space", "astronaut", "earth", "cinematic", "dark"],
    downloads: 19500,
    likes: 14800,
    rating: 4.7,
    creator: { name: "SpaceVoyager", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=voyager", id: "u8" },
    createdAt: "2026-02-28",
  },
];
