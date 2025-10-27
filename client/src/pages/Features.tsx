import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  ArrowLeftRight, 
  Cloud, 
  Shield, 
  Zap, 
  Layout, 
  CheckCircle,
  Sparkles,
  Upload,
  Download,
  FileCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function Features() {
  const [, setLocation] = useLocation();

  const mainFeatures = [
    {
      icon: ArrowLeftRight,
      title: "Bidirectional Conversion",
      description: "Convert Office to PDF and PDF back to editable formats",
      gradient: "from-blue-500 to-cyan-500",
      features: ["Word ↔ PDF", "Excel ↔ PDF", "PowerPoint ↔ PDF"]
    },
    {
      icon: Zap,
      title: "Lightning Fast Processing",
      description: "Advanced conversion engine optimized for speed",
      gradient: "from-yellow-500 to-orange-500",
      features: ["< 5 second conversions", "Batch processing", "Real-time updates"]
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-level encryption and privacy protection",
      gradient: "from-purple-500 to-pink-500",
      features: ["End-to-end encryption", "Auto-delete after 30 days", "SOC 2 compliant"]
    },
    {
      icon: Cloud,
      title: "Cloud-Based Processing",
      description: "No software installation required, convert anywhere",
      gradient: "from-green-500 to-emerald-500",
      features: ["Works in browser", "Access from any device", "No downloads needed"]
    },
    {
      icon: Layout,
      title: "Preserve Formatting",
      description: "Maintain original layout, fonts, and styling",
      gradient: "from-red-500 to-rose-500",
      features: ["Perfect layouts", "Font preservation", "Image quality retained"]
    },
    {
      icon: FileCheck,
      title: "Quality Guarantee",
      description: "High-fidelity conversions every time",
      gradient: "from-indigo-500 to-purple-500",
      features: ["Accurate conversions", "No quality loss", "Professional results"]
    }
  ];

  const supportedFormats = [
    { name: "Microsoft Word", ext: ".docx", color: "bg-blue-500" },
    { name: "Microsoft Excel", ext: ".xlsx", color: "bg-green-500" },
    { name: "Microsoft PowerPoint", ext: ".pptx", color: "bg-orange-500" },
    { name: "PDF Document", ext: ".pdf", color: "bg-red-500" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="container relative z-10">
          <div className="text-center mb-16 space-y-6 animate-fade-in-up">
            <Badge variant="secondary" className="px-4 py-2">
              <Sparkles className="w-4 h-4 mr-2 inline" />
              Powerful Features
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold">
              Everything You Need
              <span className="block mt-2 bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-pink-500">
                For Document Conversion
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Professional-grade tools designed to make document conversion fast, secure, and effortless
            </p>
          </div>

          {/* Main Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20 animate-fade-in-up animation-delay-200">
            {mainFeatures.map((feature, index) => (
              <Card 
                key={index}
                className="group border-2 hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 bg-card/50 backdrop-blur overflow-hidden relative"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                <CardContent className="p-8 space-y-4 relative z-10">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                  <ul className="space-y-2 pt-2">
                    {feature.features.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Supported Formats Section */}
          <div className="text-center mb-12 animate-fade-in-up animation-delay-400">
            <h2 className="text-4xl font-bold mb-4">Supported File Formats</h2>
            <p className="text-lg text-muted-foreground">
              Work with all major document formats seamlessly
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto mb-20 animate-fade-in-up animation-delay-600">
            {supportedFormats.map((format, index) => (
              <Card 
                key={index}
                className="group hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-card to-muted/20"
              >
                <CardContent className="p-6 text-center space-y-3">
                  <div className={`w-16 h-16 ${format.color} rounded-xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <FileText className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg">{format.name}</h3>
                  <Badge variant="secondary">{format.ext}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* How It Works */}
          <div className="max-w-4xl mx-auto animate-fade-in-up animation-delay-800">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">How It Works</h2>
              <p className="text-lg text-muted-foreground">
                Three simple steps to convert your documents
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { step: "1", icon: Upload, title: "Upload", description: "Drag and drop or select your file" },
                { step: "2", icon: Zap, title: "Convert", description: "We process it in seconds" },
                { step: "3", icon: Download, title: "Download", description: "Get your converted file" }
              ].map((step, index) => (
                <div key={index} className="text-center space-y-4">
                  <div className="relative inline-flex">
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
                    <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-2xl">
                      <step.icon className="w-10 h-10 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center text-sm font-bold shadow-lg">
                      {step.step}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center mt-20 space-y-6 animate-fade-in-up animation-delay-1000">
            <h2 className="text-4xl font-bold">Ready to Start Converting?</h2>
            <p className="text-xl text-muted-foreground">
              Join thousands of users who trust FileFlow Converter
            </p>
            <Button 
              size="lg"
              onClick={() => setLocation("/signup")}
              className="text-lg px-8 py-6 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 transition-all duration-300 shadow-xl group"
            >
              Get Started Free
              <Sparkles className="ml-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
            </Button>
          </div>
        </div>
      </section>

      <Footer />

      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0;
        }

        .animation-delay-200 { animation-delay: 0.2s; }
        .animation-delay-400 { animation-delay: 0.4s; }
        .animation-delay-600 { animation-delay: 0.6s; }
        .animation-delay-800 { animation-delay: 0.8s; }
        .animation-delay-1000 { animation-delay: 1s; }
        .delay-1000 { animation-delay: 1s; }
      `}</style>
    </div>
  );
}
