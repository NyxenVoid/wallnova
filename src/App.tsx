import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import WallpaperDetail from "./pages/WallpaperDetail";
import Explore from "./pages/Explore";
import Categories from "./pages/Categories";
import AdminUpload from "./pages/AdminUpload";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import ContentPolicy from "./pages/ContentPolicy";
import DMCAPolicy from "./pages/DMCAPolicy";
import NotFound from "./pages/NotFound";
import CookieConsent from "./components/CookieConsent";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/wallpaper/:id" element={<WallpaperDetail />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/admin/upload" element={<AdminUpload />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/content-policy" element={<ContentPolicy />} />
            <Route path="/dmca" element={<DMCAPolicy />} />
            <Route path="/dmca-copyright-policy" element={<DMCAPolicy />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <CookieConsent />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
