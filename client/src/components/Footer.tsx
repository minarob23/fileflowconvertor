import { Link } from "wouter";
import { FileText } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <style>{`
        @keyframes blink {
          0%, 49% {
            opacity: 1;
            box-shadow: 0 0 8px rgba(34, 197, 94, 0.8);
          }
          50%, 100% {
            opacity: 0.2;
            box-shadow: 0 0 0px rgba(34, 197, 94, 0);
          }
        }
        .animate-blink {
          animation: blink 1.5s ease-in-out infinite;
        }
      `}</style>
    <footer className="border-t bg-muted/50">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg">FileFlow</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Convert your documents seamlessly between PDF and Office formats with ease.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/features">
                  <a className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Features
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/pricing">
                  <a className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Pricing
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/dashboard">
                  <a className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Dashboard
                  </a>
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy">
                  <a className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Privacy Policy
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/terms">
                  <a className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Terms of Service
                  </a>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Links */}
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/contact">
                  <a className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Contact Us
                  </a>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {currentYear} FileFlow Converter. All rights reserved.
            </p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-blink"></div>
              <span className="text-sm text-muted-foreground">All Systems Operational</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
    </>
  );
}
