import { Helmet } from "react-helmet-async";
import { Shield, AlertTriangle, Ban, CheckCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const ContentPolicy = () => {
  return (
    <>
      <Helmet>
        <title>Content Policy & Upload Rules – WallNova</title>
        <meta name="description" content="WallNova content policy and community guidelines. Learn what content is allowed and prohibited on our wallpaper platform." />
        <link rel="canonical" href="/content-policy" />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-16 container mx-auto px-4 max-w-3xl">
          <h1 className="font-display text-3xl font-bold text-foreground mb-8">Content Policy & Upload Rules</h1>
          <p className="text-sm text-muted-foreground mb-6">Last updated: March 8, 2026</p>

          <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground text-sm leading-relaxed">
            <section>
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="text-primary" size={20} />
                <h2 className="text-xl font-semibold text-foreground">What's Allowed</h2>
              </div>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>High-quality wallpapers you created or have permission to share.</li>
                <li>Landscapes, nature, abstract art, digital art, illustrations.</li>
                <li>Gaming, anime (non-sexual), sci-fi, fantasy artwork.</li>
                <li>Minimalist designs, patterns, and textures.</li>
                <li>Photography you own the rights to.</li>
              </ul>
            </section>

            <section>
              <div className="flex items-center gap-2 mb-3">
                <Ban className="text-destructive" size={20} />
                <h2 className="text-xl font-semibold text-foreground">Strictly Prohibited Content</h2>
              </div>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li><strong className="text-foreground">Adult / NSFW content:</strong> Nudity, sexually explicit or suggestive imagery of any kind.</li>
                <li><strong className="text-foreground">Violence & disturbing imagery:</strong> Graphic violence, gore, self-harm, or traumatic content.</li>
                <li><strong className="text-foreground">Hate speech & offensive text:</strong> Slurs, discriminatory language, harassment, or threats in images or metadata.</li>
                <li><strong className="text-foreground">Copyrighted images:</strong> Content you don't own or have permission to share, including watermarked images.</li>
                <li><strong className="text-foreground">Spam & low-quality uploads:</strong> Repetitive, blurry, extremely low-resolution, or irrelevant content.</li>
                <li><strong className="text-foreground">Personal information:</strong> Selfies, personal photos with identifiable faces, phone numbers, or addresses.</li>
                <li><strong className="text-foreground">Illegal or harmful content:</strong> Content promoting illegal activities, drugs, or dangerous behavior.</li>
              </ul>
            </section>

            <section>
              <div className="flex items-center gap-2 mb-3">
                <Shield className="text-primary" size={20} />
                <h2 className="text-xl font-semibold text-foreground">AI Moderation</h2>
              </div>
              <p>All uploads are automatically scanned by our AI moderation system before publishing. The system checks for:</p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>NSFW or adult imagery</li>
                <li>Violent or disturbing content</li>
                <li>Copyrighted or watermarked images</li>
                <li>Extremely low resolution images</li>
                <li>Spam or duplicate content</li>
                <li>Offensive or abusive language in titles, descriptions, and tags</li>
              </ul>
              <p className="mt-3">Suspicious content is automatically blocked. If you believe your content was flagged in error, please contact us.</p>
            </section>

            <section>
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="text-accent-foreground" size={20} />
                <h2 className="text-xl font-semibold text-foreground">Upload Limits</h2>
              </div>
              <p>To maintain quality and reduce spam, users are limited to <strong className="text-foreground">3 uploads per day</strong>.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">Enforcement</h2>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li><strong className="text-foreground">First violation:</strong> Content removed with a warning.</li>
                <li><strong className="text-foreground">Repeated violations:</strong> Upload privileges temporarily suspended.</li>
                <li><strong className="text-foreground">Severe or repeated offenses:</strong> Permanent account ban.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">Contact</h2>
              <p>To report content violations or appeal a moderation decision:</p>
              <p className="mt-2 text-primary font-medium">moderation@wallnova.com</p>
            </section>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default ContentPolicy;
