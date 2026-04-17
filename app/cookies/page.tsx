import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy - PredictOcean",
  description: "Learn how PredictOcean uses cookies to enhance your experience on our platform.",
};

export default function CookiePage() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="bg-card rounded-lg shadow-sm p-6 md:p-8">
        <h1 className="text-3xl font-bold mb-6 text-foreground">Cookie Policy</h1>
        
        <div className="prose prose-gray max-w-none">
          <p className="mb-4 text-muted-foreground">
            <strong>Last updated:</strong> January 3, 2026
          </p>
          
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3 text-foreground">1. What Are Cookies</h2>
            <p className="mb-3">
              As is common practice with almost all professional websites, this site uses cookies, which are tiny files that are downloaded to your computer, to improve your experience. This page describes what information they gather, how we use it, and some of the ways in which you can manage them.
            </p>
            <p>
              A cookie is a small text file that a website saves on your computer or mobile device when you visit the site. It enables the website to remember your actions and preferences (such as login, language, font size, and other display preferences) over a period of time, so you don't have to keep re-entering them whenever you come back to the site or browse from one page to another.
            </p>
          </section>
          
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3 text-foreground">2. How We Use Cookies</h2>
            <p className="mb-3">
              We use cookies for several purposes on PredictOcean:
            </p>
            <ul className="list-disc pl-6 mb-3">
              <li><strong>Authentication:</strong> To remember your login status and provide access to protected areas</li>
              <li><strong>Preferences:</strong> To remember your preferences and settings</li>
              <li><strong>Analytics:</strong> To analyze how visitors interact with our website</li>
              <li><strong>Security:</strong> To detect and prevent fraud and security threats</li>
              <li><strong>Performance:</strong> To measure and improve the performance of our services</li>
              <li><strong>Personalization:</strong> To provide personalized content and recommendations</li>
            </ul>
          </section>
          
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3 text-foreground">3. Types of Cookies We Use</h2>
            <h3 className="font-medium mb-2 text-foreground">Essential Cookies</h3>
            <p className="mb-3">
              These cookies are necessary for the proper functioning of our website. They enable core functionality such as security, network management, and accessibility. You cannot opt out of these cookies.
            </p>
            
            <h3 className="font-medium mb-2 text-foreground">Performance Cookies</h3>
            <p className="mb-3">
              These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This helps us improve the way our website works.
            </p>
            
            <h3 className="font-medium mb-2 text-foreground">Functionality Cookies</h3>
            <p className="mb-3">
              These cookies enable the website to provide enhanced functionality and personalization. They may be set by us or by third-party providers whose services we have added to our pages.
            </p>
            
            <h3 className="font-medium mb-2 text-foreground">Targeting Cookies</h3>
            <p>
              These cookies may be set through our site by our advertising partners. They may be used by those companies to build a profile of your interests and show you relevant advertisements on other sites.
            </p>
          </section>
          
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3 text-foreground">4. Third-Party Cookies</h2>
            <p className="mb-3">
              We may use third-party services that use cookies for various purposes:
            </p>
            <ul className="list-disc pl-6 mb-3">
              <li><strong>Analytics:</strong> Google Analytics and similar services to analyze website traffic</li>
              <li><strong>Advertising:</strong> Google AdSense and other advertising networks</li>
              <li><strong>Social Media:</strong> Facebook, Twitter, and other social media platforms</li>
              <li><strong>Payment Processors:</strong> For processing payments securely</li>
            </ul>
            <p>
              These third parties may use cookies to track your online activities over time and across different websites for advertising purposes.
            </p>
          </section>
          
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3 text-foreground">5. Managing Cookies</h2>
            <p className="mb-3">
              You can control and/or delete cookies as you wish. You can delete all cookies that are already on your computer and you can set most browsers to prevent them from being placed. If you do this, however, you may have to manually adjust some preferences every time you visit a site, and some services and functionalities may not work.
            </p>
            <p className="mb-3">
              To manage cookies through your browser settings:
            </p>
            <ul className="list-disc pl-6 mb-3">
              <li><strong>Chrome:</strong> Settings {'>'} Privacy and security {'>'} Cookies and other site data</li>
              <li><strong>Firefox:</strong> Options {'>'} Privacy {'&'} Security {'>'} Cookies and Site Data</li>
              <li><strong>Safari:</strong> Preferences {'>'} Privacy {'>'} Cookies and website data</li>
              <li><strong>Edge:</strong> Settings {'>'} Cookies and site permissions</li>
            </ul>
          </section>
          
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3 text-foreground">6. Cookie Consent</h2>
            <p>
              By using our website, you consent to the use of cookies as described in this policy. You can withdraw your consent at any time by adjusting your browser settings or using the cookie management tools provided on our website.
            </p>
          </section>
          
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3 text-foreground">7. Changes to This Cookie Policy</h2>
            <p>
              We may update our Cookie Policy from time to time. We will notify you of any changes by posting the new Cookie Policy on this page and updating the "Last updated" date.
            </p>
          </section>
          
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3 text-foreground">8. Contact Us</h2>
            <p>
              If you have questions about this Cookie Policy, please contact us at <a href="mailto:cookies@predictocean.com" className="text-blue-500 hover:underline">cookies@predictocean.com</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}