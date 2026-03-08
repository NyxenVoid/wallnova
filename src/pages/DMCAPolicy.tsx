import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const DMCAPolicy = () => {
  return (
    <>
      <Helmet>
        <title>DMCA Copyright Policy – WallNova</title>
        <meta name="description" content="WallNova DMCA copyright policy. Learn how to submit a takedown request for copyrighted content." />
        <link rel="canonical" href="/dmca" />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-16 container mx-auto px-4 max-w-3xl">
          <h1 className="font-display text-3xl font-bold text-foreground mb-8">DMCA Copyright Policy</h1>
          <p className="text-sm text-muted-foreground mb-6">Last updated: March 8, 2026</p>

          <div className="prose prose-invert max-w-none space-y-6 text-muted-foreground text-sm leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">1. Overview</h2>
              <p>WallNova respects the intellectual property rights of others. We comply with the Digital Millennium Copyright Act (DMCA) and will respond promptly to valid takedown requests from copyright owners.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">2. Filing a DMCA Takedown Request</h2>
              <p>If you believe that your copyrighted work has been uploaded to WallNova without your permission, you may submit a DMCA takedown request. Your request must include:</p>
              <ol className="list-decimal pl-6 space-y-2 mt-2">
                <li>Your full legal name and contact information (email address, mailing address, phone number).</li>
                <li>A description of the copyrighted work you claim has been infringed.</li>
                <li>The URL(s) of the infringing content on WallNova.</li>
                <li>Proof of ownership (e.g., original file, registration certificate, link to original publication).</li>
                <li>A statement that you have a good faith belief that the use is not authorized by the copyright owner, its agent, or the law.</li>
                <li>A statement, under penalty of perjury, that the information in your notice is accurate and that you are the copyright owner or authorized to act on their behalf.</li>
                <li>Your physical or electronic signature.</li>
              </ol>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">3. How to Submit</h2>
              <p>Send your DMCA takedown request to:</p>
              <p className="mt-2 text-primary font-medium">dmca@wallnova.com</p>
              <p className="mt-3">Please use the subject line: <strong className="text-foreground">"DMCA Takedown Request"</strong></p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">4. Processing</h2>
              <p>Upon receiving a valid DMCA takedown request:</p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>We will review the request and verify the provided information.</li>
                <li>If valid, the infringing content will be removed promptly (typically within 24–48 hours).</li>
                <li>The uploader will be notified of the takedown and the reason.</li>
                <li>Repeat offenders may have their accounts suspended or permanently banned.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">5. Counter-Notification</h2>
              <p>If you believe your content was removed in error, you may file a counter-notification including:</p>
              <ul className="list-disc pl-6 space-y-1 mt-2">
                <li>Your name, address, and phone number.</li>
                <li>The URL of the removed content.</li>
                <li>A statement under penalty of perjury that you believe the content was removed by mistake.</li>
                <li>Your consent to the jurisdiction of your local federal court.</li>
                <li>Your physical or electronic signature.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mt-8 mb-3">6. Good Faith</h2>
              <p>Please note that filing a false DMCA takedown request is a serious matter. Misrepresentation of a claim may result in legal liability under the DMCA.</p>
            </section>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default DMCAPolicy;
