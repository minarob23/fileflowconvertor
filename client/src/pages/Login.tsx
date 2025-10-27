
import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("auth_token", data.token);
      
      // Invalidate and refetch user data immediately
      await queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      
      // Wait for the user data to be fetched before navigating
      await queryClient.fetchQuery({
        queryKey: ["/api/auth/user"],
        queryFn: async () => {
          const response = await fetch("/api/auth/user", {
            headers: {
              Authorization: `Bearer ${data.token}`,
            },
          });
          if (!response.ok) {
            throw new Error("Failed to fetch user");
          }
          return response.json();
        },
      });
      
      toast({ title: "Success", description: "Logged in successfully" });
      setLocation("/");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "/api/auth/google";
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 dark:bg-blue-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/20 dark:bg-purple-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-400/10 dark:bg-pink-600/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <Card className="w-full max-w-md relative z-10 shadow-2xl border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4 duration-700">
        <CardHeader className="space-y-1 text-center pb-6">
          <div className="flex items-center justify-center gap-2 mb-6 animate-in zoom-in duration-500">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
              <FileText className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-in slide-in-from-top-2 duration-500" style={{ animationDelay: '100ms' }}>
            Welcome Back
          </CardTitle>
          <CardDescription className="text-base animate-in slide-in-from-top-2 duration-500" style={{ animationDelay: '200ms' }}>
            Sign in to your FileFlowConvertor account
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2 animate-in slide-in-from-left duration-500" style={{ animationDelay: '300ms' }}>
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11 transition-all duration-300 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            
            <div className="space-y-2 animate-in slide-in-from-left duration-500" style={{ animationDelay: '400ms' }}>
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11 transition-all duration-300 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] animate-in slide-in-from-bottom duration-500" 
              style={{ animationDelay: '500ms' }}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="relative my-6 animate-in fade-in duration-500" style={{ animationDelay: '600ms' }}>
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300 dark:border-gray-700" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-gray-900 px-2 text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full h-11 border-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all hover:scale-[1.02] hover:shadow-md animate-in slide-in-from-bottom duration-500"
            style={{ animationDelay: '700ms' }}
            onClick={handleGoogleLogin}
          >
            <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Sign in with Google
          </Button>
        </CardContent>
        
        <CardFooter className="flex-col space-y-2 animate-in fade-in duration-500" style={{ animationDelay: '800ms' }}>
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
            Don't have an account?{" "}
            <a 
              href="/signup" 
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium hover:underline transition-colors"
            >
              Sign up
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
