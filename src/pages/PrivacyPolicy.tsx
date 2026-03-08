import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const PrivacyPolicy = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy – WallNova</title>
        <meta name="description" content="WallNova privacy policy. Learn how we collect, use, and protect your personal data." />
        <link rel="canonical" href="/privacy-policy" />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-16 container mx-auto px-4 max-w-3xl">
          <h1 className="font-display text-3xl font-bold text-foreground mb-8">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground mb-6">Last updated: March 8, 2026</p>

          <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground text-sm leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">1. Information We Collect</h2>
              <p>We collect limited personal information to provide and improve our services:</p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li><strong className="text-foreground">Account Data:</strong> Email address and username when you create an account.</li>
                <li><strong className="text-foreground">Profile Data:</strong> Optional display name, bio, and avatar you choose to provide.</li>
                <li><strong className="text-foreground">Usage Data:</strong> Pages visited, features used, and interactions with the platform.</li>
                <li><strong className="text-foreground">Upload Data:</strong> Images and metadata you upload to the platform.</li>
                <li><strong className="text-foreground">Device Data:</strong> Browser type, operating system, and screen resolution for analytics.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">2. How We Use Your Data</h2>
              <p>Your data is used solely for:</p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>Providing and maintaining platform functionality.</li>
                <li>User authentication and account security.</li>
                <li>Content moderation and enforcing community guidelines.</li>
                <li>Improving our services and user experience.</li>
                <li>Sending essential service notifications (e.g., account verification, policy violations).</li>
              </ul>
              <p className="mt-3 font-semibold text-foreground">We do not sell your personal data to third parties.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">3. Cookies</h2>
              <p>We use cookies and similar technologies for:</p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li><strong className="text-foreground">Essential cookies:</strong> Required for authentication and core site functionality.</li>
                <li><strong className="text-foreground">Analytics cookies:</strong> To understand how users interact with the platform.</li>
                <li><strong className="text-foreground">Preference cookies:</strong> To remember your settings and preferences.</li>
              </ul>
              <p className="mt-2">You can manage cookie preferences in your browser settings.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">4. Notifications</h2>
              <p>We may send you notifications related to your account activity, content moderation decisions, and important service updates. You can manage notification preferences in your account settings.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">5. Advertising</h2>
              <p>We may integrate third-party advertising services such as Google AdSense in the future. If implemented, these services may use cookies to serve ads based on your browsing activity. We will update this policy accordingly.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">6. Data Security</h2>
              <p>We implement industry-standard security measures to protect your data, including encrypted connections (HTTPS), secure authentication, and AI-powered content moderation. However, no system is 100% secure.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">7. Data Retention</h2>
              <p>Your data is retained as long as your account is active. You may request deletion of your account and associated data at any time.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">8. Contact Us</h2>
              <p>For privacy concerns or data requests, please contact us at:</p>
              <p className="mt-2 text-primary font-medium">privacy@wallnova.com</p>
            </section>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default PrivacyPolicy;
