"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already consented to cookies
    const hasConsented = localStorage.getItem("cookieConsent");
    if (!hasConsented) {
      setShowBanner(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookieConsent", "true");
    setShowBanner(false);
  };

  const declineCookies = () => {
    localStorage.setItem("cookieConsent", "false");
    setShowBanner(false);
  };

  if (!showBanner) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 z-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-foreground max-w-2xl">
            We use cookies to improve your experience on our football prediction platform. 
            By continuing to use our site, you agree to our use of cookies as described in our{" "}
            <Link href="/cookies" className="text-primary hover:underline font-medium">
              Cookie Policy
            </Link>.
          </p>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={declineCookies}
              className="text-xs"
            >
              Decline
            </Button>
            <Button 
              size="sm"
              onClick={acceptCookies}
              className="text-xs"
            >
              Accept
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}