import { Link } from "wouter";
import { Button } from "./ui/button";
import { FileText, Menu, X } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { useState } from "react";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/features", label: "Features" },
    { href: "/pricing", label: "Pricing" },
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
    { href: "/contact", label: "Contact Us" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <a className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <FileText className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">FileFlow Converter</span>
          </a>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <a className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                {link.label}
              </a>
            </Link>
          ))}
        </nav>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          
          <div className="hidden md:flex items-center space-x-2">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Log In
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">
                Sign Up
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t">
          <nav className="container py-4 flex flex-col space-y-3">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <a
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              </Link>
            ))}
            <div className="pt-2 border-t flex flex-col space-y-2">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="w-full">
                  Log In
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm" className="w-full">
                  Sign Up
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
