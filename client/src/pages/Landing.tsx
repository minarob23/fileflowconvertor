import { FileText, ArrowRight, Zap, Shield, Cloud, ArrowLeftRight, CheckCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLocation } from "wouter";

export default function Landing() {
  const [, setLocation] = useLocation();

  const features = [
    {
      icon: ArrowLeftRight,
      title: "Bidirectional Conversion",
      description: "Convert Office files to PDF and PDF back to Office formats seamlessly",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Process your documents in seconds with our optimized conversion engine",
      gradient: "from-yellow-500 to-orange-500"
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your files are encrypted and automatically deleted after 30 days",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: Cloud,
      title: "Cloud Storage",
      description: "Powered by Cloudflare R2 for reliable and fast file storage",
      gradient: "from-green-500 to-emerald-500"
    }
  ];

  const supportedFormats = [
    { from: "Word", to: "PDF", icon: "📄" },
    { from: "Excel", to: "PDF", icon: "📊" },
    { from: "PowerPoint", to: "PDF", icon: "📽️" },
    { from: "PDF", to: "Word", icon: "📝" },
    { from: "PDF", to: "Excel", icon: "📈" },
    { from: "PDF", to: "PowerPoint", icon: "🎬" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Header />
      
      {/* Hero Section with Animations */}
      <section className="relative overflow-hidden py-20 md:py-32">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Badge with animation */}
            <div className="animate-fade-in-up">
              <Badge variant="secondary" className="px-4 py-2 text-sm font-medium animate-pulse">
                <Sparkles className="w-4 h-4 mr-2 inline animate-spin" style={{ animationDuration: '3s' }} />
                Free Forever • Unlimited Conversions
              </Badge>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight animate-fade-in-up animation-delay-200">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-pink-500">
                Convert Documents
              </span>
              <br />
              <span className="text-foreground">Both Ways, Instantly</span>
            </h1>

            {/* Subheading */}
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto animate-fade-in-up animation-delay-400">
              Transform Office files to PDF and PDF back to editable formats with our powerful, secure converter
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-600">
              <Button 
                size="lg" 
                onClick={() => setLocation("/signup")}
                className="group text-lg px-8 py-6 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Start Converting Free
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => setLocation("/features")}
                className="text-lg px-8 py-6 border-2 hover:bg-muted/50 transition-all duration-300"
              >
                View All Features
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-8 animate-fade-in-up animation-delay-800">
              <div>
                <div className="text-3xl md:text-4xl font-bold text-primary">50MB</div>
                <div className="text-sm text-muted-foreground">Max File Size</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-purple-500">6</div>
                <div className="text-sm text-muted-foreground">Formats Supported</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-pink-500">∞</div>
                <div className="text-sm text-muted-foreground">Free Conversions</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Powerful Features Built for You
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need for seamless document conversion
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card 
                key={index}
                className="group border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-card/50 backdrop-blur"
              >
                <CardContent className="p-6 space-y-4">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-6 h-6 text-white animate-bounce group-hover:animate-spin" style={{ animationDuration: '2s' }} />
                  </div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Supported Formats Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              All Your Favorite Formats
            </h2>
            <p className="text-lg text-muted-foreground">
              Convert between PDF and Office formats effortlessly
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {supportedFormats.map((format, index) => (
              <Card 
                key={index}
                className="group hover:shadow-lg transition-all duration-300 hover:scale-105 bg-gradient-to-br from-card to-muted/20"
              >
                <CardContent className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{format.icon}</span>
                    <span className="font-semibold text-lg">{format.from}</span>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-lg">{format.to}</span>
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-muted-foreground">
              Join thousands of users converting documents every day. It's free forever.
            </p>
            <Button 
              size="lg"
              onClick={() => setLocation("/signup")}
              className="group text-lg px-8 py-6 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 transition-all duration-300 shadow-xl"
            >
              Create Free Account
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
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

        .animation-delay-200 {
          animation-delay: 0.2s;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
        }

        .animation-delay-600 {
          animation-delay: 0.6s;
        }

        .animation-delay-800 {
          animation-delay: 0.8s;
        }

        .delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
}
