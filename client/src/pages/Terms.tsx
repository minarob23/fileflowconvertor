import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { FileCheck, Users, ShieldCheck, Upload, Scale, Bell } from "lucide-react";

export default function Terms() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl animate-pulse animation-delay-1000" />
      </div>

      <Header />
      
      <div className="container max-w-4xl px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        {/* Hero Section with Animation */}
        <div className="text-center mb-12 space-y-4 animate-fade-in-up">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 shadow-2xl mb-4 animate-bounce-slow">
            <Scale className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600">
            Terms of Service
          </h1>
          <p className="text-lg text-muted-foreground">
            Last updated: October 27, 2025
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-violet-500 mx-auto rounded-full" />
        </div>

        <div className="space-y-8">
          <Card className="p-8 hover:shadow-xl transition-all duration-500 animate-fade-in-up animation-delay-200 border-l-4 border-l-indigo-500">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center shrink-0 shadow-lg">
                <FileCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
                <p className="text-muted-foreground leading-relaxed">
                  By accessing and using FileFlow Converter ("the Service"), you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these terms, please do not use the Service.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-8 hover:shadow-xl transition-all duration-500 animate-fade-in-up animation-delay-300 border-l-4 border-l-violet-500">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center shrink-0 shadow-lg">
                <Bell className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    FileFlow Converter provides a document conversion service that allows users to convert files between PDF and Microsoft Office formats (Word, Excel, PowerPoint) in both directions.
                  </p>
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <p className="font-semibold text-foreground mb-2">The Service includes:</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Bidirectional file conversion (Office ↔ PDF)</li>
                      <li>Cloud storage for converted files</li>
                      <li>Conversion history and management</li>
                      <li>User authentication and account management</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-8 hover:shadow-xl transition-all duration-500 animate-fade-in-up animation-delay-400 border-l-4 border-l-purple-500">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shrink-0 shadow-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
                <div className="space-y-4 text-muted-foreground">
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h3 className="font-semibold text-foreground mb-2">3.1 Account Creation</h3>
                    <p>
                      You must create an account to use the Service. You may register using your email address or through Google OAuth authentication.
                    </p>
                  </div>
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h3 className="font-semibold text-foreground mb-2">3.2 Account Security</h3>
                    <p>
                      You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
                    </p>
                  </div>
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h3 className="font-semibold text-foreground mb-2">3.3 Account Accuracy</h3>
                    <p>
                      You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-8 hover:shadow-xl transition-all duration-500 animate-fade-in-up animation-delay-500 border-l-4 border-l-red-500">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center shrink-0 shadow-lg">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold mb-4">4. Acceptable Use</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p className="font-semibold text-foreground">You agree NOT to use the Service to:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Upload illegal, harmful, or objectionable content</li>
                    <li>Violate any applicable laws or regulations</li>
                    <li>Infringe upon intellectual property rights</li>
                    <li>Upload malware or malicious code</li>
                    <li>Attempt unauthorized access to our systems</li>
                    <li>Use automated systems without permission</li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-8 hover:shadow-xl transition-all duration-500 animate-fade-in-up animation-delay-600 border-l-4 border-l-blue-500">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shrink-0 shadow-lg">
                <Upload className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-semibold mb-4">5. File Upload and Storage</h2>
                <div className="space-y-4 text-muted-foreground">
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h3 className="font-semibold text-foreground mb-2">5.1 File Limitations</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Maximum file size: 50MB per file</li>
                      <li>Supported formats: .docx, .xlsx, .pptx, .pdf</li>
                      <li>Storage duration: 30 days from conversion date</li>
                    </ul>
                  </div>
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h3 className="font-semibold text-foreground mb-2">5.2 File Ownership & Deletion</h3>
                    <p>
                      You retain all rights to your files. Original files are deleted after conversion. Converted files are stored for 30 days and then permanently deleted.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Compact sections */}
          {[
            { title: "6. Intellectual Property", content: "The Service and its content are protected by international copyright and intellectual property laws." },
            { title: "7. Service Availability", content: "We strive for reliable service but don't guarantee uninterrupted or error-free operation." },
            { title: "8. Limitation of Liability", content: "We are not liable for indirect damages, data loss, or service interruptions." },
            { title: "9. Indemnification", content: "You agree to defend us from claims arising from your use of the Service." },
            { title: "10. Subscription & Cancellation", content: "Free and paid plans available. Cancel anytime. Refunds on a case-by-case basis." },
            { title: "11. Termination", content: "We may suspend accounts that violate these Terms without prior notice." },
            { title: "12. Privacy", content: "Your use is also governed by our Privacy Policy." },
            { title: "13. Changes to Terms", content: "We may modify these Terms. Continued use means acceptance." },
            { title: "14. Governing Law", content: "These Terms are governed by applicable jurisdiction laws." },
            { title: "15. Dispute Resolution", content: "Disputes shall be resolved through binding arbitration." },
            { title: "16. Contact", content: "Questions? Contact us through our Contact Us page. We respond within 30 days." },
          ].map((section, index) => (
            <Card 
              key={index} 
              className={`p-6 hover:shadow-lg transition-all duration-300 animate-fade-in-up animation-delay-${700 + index * 50} hover:border-l-4 hover:border-l-primary`}
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
        .animation-delay-750 { animation-delay: 0.75s; }
        .animation-delay-800 { animation-delay: 0.8s; }
        .animation-delay-850 { animation-delay: 0.85s; }
        .animation-delay-900 { animation-delay: 0.9s; }
        .animation-delay-950 { animation-delay: 0.95s; }
        .animation-delay-1000 { animation-delay: 1s; }
      `}</style>
    </div>
  );
}
