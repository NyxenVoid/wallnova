import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

const TermsOfService = () => {
  return (
    <>
      <SEOHead
        title="Terms of Service – Rules & Responsibilities"
        description="WallNova terms of service. Understand the rules and responsibilities when using our wallpaper platform."
        canonical="/terms-of-service"
      />
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-16 container mx-auto px-4 max-w-3xl">
          <h1 className="font-display text-3xl font-bold text-foreground mb-8">Terms of Service</h1>
          <p className="text-sm text-muted-foreground mb-6">Last updated: March 8, 2026</p>

          <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground text-sm leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">1. Acceptance of Terms</h2>
              <p>By accessing or using WallNova, you agree to be bound by these Terms of Service. If you do not agree, you must not use the platform.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">2. User Responsibilities</h2>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>You are solely responsible for all content you upload to the platform.</li>
                <li>You must only upload content that you own or have explicit permission to share.</li>
                <li>You must not upload content that violates our Content Policy.</li>
                <li>You must provide accurate information when creating your account.</li>
                <li>You are responsible for maintaining the security of your account credentials.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">3. Platform Rights</h2>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>WallNova reserves the right to remove any content that violates our policies without prior notice.</li>
                <li>We may suspend or permanently ban accounts that repeatedly violate our rules.</li>
                <li>We reserve the right to modify or discontinue any feature of the platform at any time.</li>
                <li>We may use automated AI systems to moderate content and enforce community guidelines.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">4. Prohibited Activities</h2>
              <p>Users must not:</p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>Attempt to hack, exploit, or disrupt the platform or its infrastructure.</li>
                <li>Use automated scripts or bots to access the platform without permission.</li>
                <li>Circumvent content moderation or security measures.</li>
                <li>Impersonate other users or entities.</li>
                <li>Use the platform for any illegal purpose.</li>
                <li>Spam or flood the platform with low-quality content.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">5. Disclaimer of Warranties</h2>
              <p>The platform is provided <strong className="text-foreground">"as-is"</strong> and <strong className="text-foreground">"as-available"</strong> without any warranties of any kind, express or implied. We do not guarantee:</p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>Uninterrupted or error-free service.</li>
                <li>That the platform will meet your specific requirements.</li>
                <li>The accuracy or reliability of any content on the platform.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">6. Limitation of Liability</h2>
              <p>WallNova shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the platform.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">7. Changes to Terms</h2>
              <p>We may update these terms at any time. Continued use of the platform after changes constitutes acceptance of the new terms.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">8. Contact</h2>
              <p>For questions about these terms, contact us at:</p>
              <p className="mt-2 text-primary font-medium">legal@wallnova.com</p>
            </section>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default TermsOfService;
