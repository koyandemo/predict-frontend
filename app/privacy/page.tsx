import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - PredictOcean",
  description: "Learn how PredictOcean collects, uses, and protects your personal information.",
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="bg-card rounded-lg shadow-sm p-6 md:p-8">
        <h1 className="text-3xl font-bold mb-6 text-foreground">Privacy Policy</h1>
        
        <div className="prose prose-gray max-w-none">
          <p className="mb-4 text-muted-foreground">
            <strong>Last updated:</strong> January 3, 2026
          </p>
          
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3 text-foreground">1. Introduction</h2>
            <p className="mb-3">
              PredictOcean ("we", "us", "our", or "the Service") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our football prediction platform at https://www.predictocean.com ("Site").
            </p>
            <p>
              Please read this Privacy Policy carefully. If you do not agree with the terms of this Privacy Policy, please do not access the Site.
            </p>
          </section>
          
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3 text-foreground">2. Information We Collect</h2>
            <p className="mb-3">
              We may collect information about you in various ways when you use our Service:
            </p>
            <h3 className="font-medium mb-2 text-foreground">Personal Information</h3>
            <ul className="list-disc pl-6 mb-3">
              <li>Name</li>
              <li>Email address</li>
              <li>Username</li>
              <li>Profile picture</li>
              <li>Account preferences</li>
            </ul>
            <h3 className="font-medium mb-2 text-foreground">Usage Data</h3>
            <ul className="list-disc pl-6 mb-3">
              <li>IP address</li>
              <li>Browser type and version</li>
              <li>Pages visited on our Site</li>
              <li>Time and date of visit</li>
              <li>Time spent on pages</li>
              <li>Operating system</li>
            </ul>
            <h3 className="font-medium mb-2 text-foreground">Cookies and Tracking Technologies</h3>
            <p>
              We may use cookies and similar tracking technologies to track the activity on our Service and store certain information.
            </p>
          </section>
          
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3 text-foreground">3. How We Use Your Information</h2>
            <p className="mb-3">
              We may use the information we collect in various ways, including to:
            </p>
            <ul className="list-disc pl-6 mb-3">
              <li>Provide, operate, and maintain our Service</li>
              <li>Improve, personalize, and expand our Service</li>
              <li>Understand and analyze how you use our Service</li>
              <li>Develop new products, services, features, and functionality</li>
              <li>Communicate with you, either directly or through one of our partners</li>
              <li>Send you emails and push notifications</li>
              <li>Find and prevent fraud</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>
          
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3 text-foreground">4. Sharing Your Information</h2>
            <p className="mb-3">
              We may share your information in the following situations:
            </p>
            <ul className="list-disc pl-6 mb-3">
              <li>With service providers to monitor and analyze the use of our Service</li>
              <li>With business partners to offer you certain products, services, or promotions</li>
              <li>With your consent</li>
              <li>For legal compliance or to protect our rights</li>
              <li>In connection with any merger, sale of company assets, financing, or acquisition</li>
            </ul>
          </section>
          
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3 text-foreground">5. Data Security</h2>
            <p>
              We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable.
            </p>
          </section>
          
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3 text-foreground">6. Data Retention</h2>
            <p>
              We will retain your personal information only for as long as is necessary for the purposes set out in this Privacy Policy, unless a longer retention period is required or permitted by law. When we have no ongoing legitimate business need to process your personal information, we will either delete or anonymize it.
            </p>
          </section>
          
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3 text-foreground">7. Your Data Protection Rights</h2>
            <p className="mb-3">
              Depending on your location, you may have the following rights regarding your personal data:
            </p>
            <ul className="list-disc pl-6 mb-3">
              <li>The right to access personal data we hold about you</li>
              <li>The right to rectify inaccurate data</li>
              <li>The right to request erasure of your data</li>
              <li>The right to restrict processing of your data</li>
              <li>The right to data portability</li>
              <li>The right to withdraw consent</li>
            </ul>
          </section>
          
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3 text-foreground">8. Children's Privacy</h2>
            <p>
              Our Service does not address anyone under the age of 13. We do not knowingly collect personally identifiable information from anyone under the age of 13. If you are a parent or guardian and you are aware that your child has provided us with personal information, please contact us.
            </p>
          </section>
          
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3 text-foreground">9. Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
            </p>
          </section>
          
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3 text-foreground">10. Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy, please contact us at <a href="mailto:privacy@predictocean.com" className="text-blue-500 hover:underline">privacy@predictocean.com</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}