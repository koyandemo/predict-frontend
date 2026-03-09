import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="w-[60%] mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 justify-center  gap-8">
          <div>
            <h4 className="font-medium mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/matches" className="text-muted-foreground hover:text-primary text-sm">
                  Matches
                </Link>
              </li>
              <li>
                <Link href="/leaderboard" className="text-muted-foreground hover:text-primary text-sm">
                  Leaderboard
                </Link>
              </li>
              <li>
                <Link href="/profile" className="text-muted-foreground hover:text-primary text-sm">
                  Profile
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-primary text-sm">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-primary text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-muted-foreground hover:text-primary text-sm">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Contact</h4>
            <ul className="space-y-2">
              <li>
                <a href="mailto:support@footballprediction.com" className="text-muted-foreground hover:text-primary text-sm">
                  support@footballprediction.com
                </a>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary text-sm">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} Football Predictor. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}