import { Card, CardContent } from "@/components/ui/card";
import { Construction, Zap, ArrowLeft, Rocket } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";

export default function NotFound() {
  const [, setLocation] = useLocation();
  const [progress, setProgress] = useState(0);
  const targetProgress = 75; // 75% completion

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= targetProgress) {
          clearInterval(timer);
          return targetProgress;
        }
        return prev + 1;
      });
    }, 20); // Increment every 20ms for smooth animation

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated Background Elements - matching Landing page */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Main Card - Everything Inside */}
      <Card className="relative z-10 w-full max-w-xl shadow-2xl border-2 bg-card/95 backdrop-blur-xl">
        <CardContent className="p-5 md:p-8 space-y-5">
          {/* Badge */}
          <div className="text-center animate-fade-in">
            <Badge variant="secondary" className="px-4 py-2 text-sm font-medium animate-pulse">
              <Zap className="w-4 h-4 mr-2 inline animate-bounce" />
              Coming Soon
            </Badge>
          </div>

          {/* Icon with gradient background */}
          <div className="relative animate-fade-in animation-delay-200">
            <div className="text-center">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl animate-pulse" />
                <div className="relative w-24 h-24 mx-auto bg-gradient-to-br from-blue-500 to-cyan-500 rounded-3xl flex items-center justify-center shadow-2xl">
                  <Construction className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                  <Rocket className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Title Section */}
          <div className="text-center space-y-3 animate-fade-in animation-delay-300">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-pink-500">
                Under Development
              </span>
            </h1>
            
            <h2 className="text-xl md:text-2xl font-bold text-foreground">
              Building Something Amazing
            </h2>
            
            <p className="text-base md:text-lg text-muted-foreground">
              We're crafting an exceptional pricing experience just for you
            </p>
          </div>

          {/* Divider */}
          <div className="relative animate-fade-in animation-delay-400">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-muted"></div>
            </div>
            <div className="relative flex justify-center">
              <div className="bg-card px-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full animate-ping" />
                  <span className="text-sm text-muted-foreground font-medium">Progress Update</span>
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-ping animation-delay-200" />
                </div>
              </div>
            </div>
          </div>

          {/* Large Percentage Display */}
          <div className="text-center animate-scale-in animation-delay-500">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse" />
              <div className="relative text-6xl md:text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-pink-500">
                {progress}%
              </div>
            </div>
            <p className="mt-2 text-sm font-semibold text-muted-foreground">
              Development Complete
            </p>
          </div>

          {/* Progress Bar */}
          <div className="space-y-3 animate-fade-in animation-delay-600">
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground font-medium">
                Development Progress
              </p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-ping" />
                <span className="text-xs text-primary font-semibold">In Progress</span>
              </div>
            </div>
            <div className="w-full bg-muted rounded-full h-4 overflow-hidden shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-primary via-purple-500 to-pink-500 rounded-full transition-all duration-300 ease-out shadow-lg" 
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Description */}
          <p className="text-center text-base text-muted-foreground animate-fade-in animation-delay-700">
            Our team is working hard to bring you the best pricing plans and features. Check back soon for exciting updates!
          </p>

          {/* Features Badges */}
          <div className="text-center space-y-3 animate-fade-in animation-delay-800">
            <p className="text-sm text-muted-foreground font-medium">
              What's Coming:
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              <Badge variant="outline" className="px-3 py-1.5 text-sm">💎 Free Plan</Badge>
              <Badge variant="outline" className="px-3 py-1.5 text-sm">⚡ Pro Plan</Badge>
              <Badge variant="outline" className="px-3 py-1.5 text-sm">🚀 Enterprise</Badge>
              <Badge variant="outline" className="px-3 py-1.5 text-sm">🎯 Custom Solutions</Badge>
            </div>
          </div>

          {/* Back Button */}
          <div className="text-center pt-2 animate-fade-in animation-delay-800">
            <Button
              onClick={() => setLocation("/")}
              variant="outline"
              size="lg"
              className="group hover:bg-primary hover:text-primary-foreground transition-all duration-300"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
              Back to Home
            </Button>
          </div>
        </CardContent>
      </Card>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scale-in {
          0% {
            opacity: 0;
            transform: scale(0.8);
          }
          50% {
            transform: scale(1.02);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-scale-in {
          animation: scale-in 0.8s ease-out forwards;
          opacity: 0;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
        }

        .animation-delay-300 {
          animation-delay: 0.3s;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
        }

        .animation-delay-500 {
          animation-delay: 0.5s;
        }

        .animation-delay-600 {
          animation-delay: 0.6s;
        }

        .animation-delay-700 {
          animation-delay: 0.7s;
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
