import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms and Conditions - PredictOcean",
  description: "Read our terms and conditions for using PredictOcean services.",
};

export default function TermsPage() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="bg-card rounded-lg shadow-sm p-6 md:p-8">
        <h1 className="text-3xl font-bold mb-6 text-foreground">Terms and Conditions</h1>
        
        <div className="prose prose-gray max-w-none">
          <p className="mb-4 text-muted-foreground">
            <strong>Last updated:</strong> January 3, 2026
          </p>
          
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3 text-foreground">1. Introduction</h2>
            <p className="mb-3">
              Welcome to PredictOcean ("we", "us", "our", or "the Service"). These Terms and Conditions ("Terms") govern your use of our football prediction platform, including all related services, features, and content.
            </p>
            <p>
              By accessing or using PredictOcean, you agree to be bound by these Terms. If you disagree with any part of these Terms, you may not access the Service.
            </p>
          </section>
          
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3 text-foreground">2. Eligibility</h2>
            <p className="mb-3">
              By using our Service, you represent and warrant that you are at least 13 years of age and have the legal capacity to enter into these Terms.
            </p>
            <p>
              If you are under 18 years of age, you represent and warrant that you have obtained parental or guardian consent to use the Service.
            </p>
          </section>
          
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3 text-foreground">3. Account Registration</h2>
            <p className="mb-3">
              To access certain features of our Service, you may be required to create an account. When creating an account, you agree to:
            </p>
            <ul className="list-disc pl-6 mb-3">
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain and update your information to keep it accurate</li>
              <li>Maintain the security of your account credentials</li>
              <li>Accept all risks of unauthorized access to your account</li>
            </ul>
            <p>
              You are responsible for all activities that occur under your account.
            </p>
          </section>
          
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3 text-foreground">4. User Content</h2>
            <p className="mb-3">
              Our Service allows you to submit, post, and share content including predictions, comments, and other materials ("User Content"). By submitting User Content, you grant PredictOcean a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, adapt, publish, translate, create derivative works from, distribute, and display such content.
            </p>
            <p>
              You retain ownership of your User Content and are responsible for it. You represent that your User Content does not violate any third-party rights or applicable laws.
            </p>
          </section>
          
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3 text-foreground">5. Prohibited Activities</h2>
            <p className="mb-3">
              You agree not to:
            </p>
            <ul className="list-disc pl-6 mb-3">
              <li>Violate applicable laws or regulations</li>
              <li>Infringe upon the rights of others</li>
              <li>Post content that is unlawful, offensive, threatening, defamatory, or otherwise objectionable</li>
              <li>Engage in any automated use of the system, such as using scripts to send comments or predictions</li>
              <li>Use the Service for any commercial purpose without our prior written consent</li>
            </ul>
          </section>
          
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3 text-foreground">6. Intellectual Property</h2>
            <p className="mb-3">
              The Service and its original content, features, and functionality are owned by PredictOcean and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
            </p>
            <p>
              Our trademarks and trade dress may not be used in connection with any product or service without our prior written consent.
            </p>
          </section>
          
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3 text-foreground">7. Limitation of Liability</h2>
            <p>
              In no event shall PredictOcean, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
            </p>
          </section>
          
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3 text-foreground">8. Disclaimer</h2>
            <p>
              The Service is provided on an "AS IS" and "AS AVAILABLE" basis. The Service is provided without warranties of any kind, whether express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, and non-infringement.
            </p>
          </section>
          
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3 text-foreground">9. Changes to Terms</h2>
            <p>
              We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
            </p>
          </section>
          
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3 text-foreground">10. Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at <a href="mailto:legal@predictocean.com" className="text-blue-500 hover:underline">legal@predictocean.com</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}