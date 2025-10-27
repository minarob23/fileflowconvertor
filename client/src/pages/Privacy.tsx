import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Shield, Lock, Eye, Database, Cloud, FileText } from "lucide-react";

export default function Privacy() {
  const sections = [
    { icon: Shield, color: "from-blue-500 to-cyan-500" },
    { icon: Lock, color: "from-green-500 to-emerald-500" },
    { icon: Eye, color: "from-purple-500 to-pink-500" },
    { icon: Database, color: "from-orange-500 to-red-500" },
    { icon: Cloud, color: "from-indigo-500 to-blue-500" },
    { icon: FileText, color: "from-yellow-500 to-orange-500" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse animation-delay-1000" />
      </div>

      <Header />
      
      <div className="container max-w-4xl px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        {/* Hero Section with Animation */}
        <div className="text-center mb-12 space-y-4 animate-fade-in-up">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-2xl mb-4 animate-bounce-slow">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
            Privacy Policy
          </h1>
          <p className="text-lg text-muted-foreground">
            Last updated: October 27, 2025
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full" />
        </div>

        <div className="space-y-8">
          <Card className="p-8 hover:shadow-xl transition-all duration-500 animate-fade-in-up animation-delay-200 border-l-4 border-l-blue-500">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shrink-0 shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Welcome to FileFlow Converter ("we," "our," or "us"). We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our document conversion service.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-8 hover:shadow-xl transition-all duration-500 animate-fade-in-up animation-delay-300 border-l-4 border-l-green-500">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shrink-0 shadow-lg">
                <Database className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
                <div className="space-y-4 text-muted-foreground">
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h3 className="font-semibold text-foreground mb-2">2.1 Personal Information</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Email address</li>
                      <li>Name (first and last)</li>
                      <li>Account credentials (encrypted passwords)</li>
                      <li>Google OAuth information (if you sign in with Google)</li>
                    </ul>
                  </div>
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h3 className="font-semibold text-foreground mb-2">2.2 Document Information</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Files you upload for conversion</li>
                      <li>File names, sizes, and formats</li>
                      <li>Conversion history and timestamps</li>
                      <li>Storage metadata (local or cloud storage identifiers)</li>
                    </ul>
                  </div>
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h3 className="font-semibold text-foreground mb-2">2.3 Technical Information</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>IP address</li>
                      <li>Browser type and version</li>
                      <li>Device information</li>
                      <li>Usage statistics and analytics</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-8 hover:shadow-xl transition-all duration-500 animate-fade-in-up animation-delay-400 border-l-4 border-l-purple-500">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shrink-0 shadow-lg">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>To provide and maintain our document conversion service</li>
                  <li>To process your file conversions securely</li>
                  <li>To manage your account and authentication</li>
                  <li>To store your converted files (temporarily or in cloud storage)</li>
                  <li>To send you service-related notifications</li>
                  <li>To improve our service and user experience</li>
                  <li>To prevent fraud and ensure platform security</li>
                  <li>To comply with legal obligations</li>
                </ul>
              </div>
            </div>
          </Card>

          <Card className="p-8 hover:shadow-xl transition-all duration-500 animate-fade-in-up animation-delay-500 border-l-4 border-l-orange-500">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shrink-0 shadow-lg">
                <Lock className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-semibold mb-4">4. Data Storage and Security</h2>
                <div className="space-y-4 text-muted-foreground">
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h3 className="font-semibold text-foreground mb-2">4.1 Cloud Storage (Cloudflare R2)</h3>
                    <p>
                      When configured, your converted files are stored in Cloudflare R2, a secure cloud storage service. Files are encrypted in transit and at rest. We use industry-standard security measures to protect your data.
                    </p>
                  </div>
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h3 className="font-semibold text-foreground mb-2">4.2 Local Storage</h3>
                    <p>
                      If cloud storage is not configured, files are temporarily stored on our secure servers and are automatically deleted after a specified retention period.
                    </p>
                  </div>
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h3 className="font-semibold text-foreground mb-2">4.3 Database Security</h3>
                    <p>
                      Your account information is stored in a secure PostgreSQL database (Neon) with encryption. Passwords are hashed using bcrypt, and we never store plain-text passwords.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-8 hover:shadow-xl transition-all duration-500 animate-fade-in-up animation-delay-600 border-l-4 border-l-indigo-500">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center shrink-0 shadow-lg">
                <Cloud className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-semibold mb-4">5. Authentication and Third-Party Services</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    We use Google OAuth for authentication. When you sign in with Google, we receive your email address, name, and profile information. We do not have access to your Google password.
                  </p>
                  <p>
                    Third-party services we use:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Google OAuth:</strong> For authentication</li>
                    <li><strong>Cloudflare R2:</strong> For cloud file storage</li>
                    <li><strong>Neon:</strong> For database hosting</li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-8 hover:shadow-xl transition-all duration-500 animate-fade-in-up animation-delay-700 border-l-4 border-l-yellow-500">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center shrink-0 shadow-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-semibold mb-4">6. File Retention and Deletion</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    <strong>Original files:</strong> Deleted immediately after conversion is completed.
                  </p>
                  <p>
                    <strong>Converted files:</strong> Stored for 30 days or until you manually delete them, whichever comes first.
                  </p>
                  <p>
                    <strong>Account data:</strong> Retained until you request account deletion.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Continue with remaining sections in a compact format */}
          {[
            { title: "7. Your Rights", content: "You have the right to access, correct, delete, export your data, opt-out of marketing, and withdraw consent." },
            { title: "8. Cookies and Tracking", content: "We use essential cookies for authentication (JWT tokens). No third-party tracking cookies." },
            { title: "9. Data Sharing", content: "We do not sell your data. We only share with your consent or when legally required." },
            { title: "10. Children's Privacy", content: "Not intended for users under 13. We don't knowingly collect children's data." },
            { title: "11. International Transfers", content: "Data may be transferred internationally with appropriate safeguards." },
            { title: "12. Policy Changes", content: "We may update this policy. Continued use means acceptance of changes." },
            { title: "13. Contact Us", content: "Questions? Contact us through our Contact Us page. We respond within 30 days." },
          ].map((section, index) => (
            <Card 
              key={index} 
              className={`p-6 hover:shadow-lg transition-all duration-300 animate-fade-in-up animation-delay-${800 + index * 100} hover:border-l-4 hover:border-l-primary`}
            >
              <h2 className="text-xl font-semibold mb-3">{section.title}</h2>
              <p className="text-muted-foreground">{section.content}</p>
            </Card>
          ))}
        </div>
      </div>

      <Footer />

      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
          opacity: 0;
        }

        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }

        .animation-delay-200 { animation-delay: 0.2s; }
        .animation-delay-300 { animation-delay: 0.3s; }
        .animation-delay-400 { animation-delay: 0.4s; }
        .animation-delay-500 { animation-delay: 0.5s; }
        .animation-delay-600 { animation-delay: 0.6s; }
        .animation-delay-700 { animation-delay: 0.7s; }
        .animation-delay-800 { animation-delay: 0.8s; }
        .animation-delay-900 { animation-delay: 0.9s; }
        .animation-delay-1000 { animation-delay: 1s; }
      `}</style>
    </div>
  );
}
