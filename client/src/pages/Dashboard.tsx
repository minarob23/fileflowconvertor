import { FileText, LogOut, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/hooks/useAuth";
import { FileUploadZone } from "@/components/FileUploadZone";
import { ConversionHistory } from "@/components/ConversionHistory";
import { StatsCards } from "@/components/StatsCards";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";

export default function Dashboard() {
  const { user } = useAuth();

  const { data: stats } = useQuery<{
    totalConversions: number;
    completedConversions: number;
    todayConversions: number;
  }>({
    queryKey: ["/api/conversions/stats"],
  });

  const getPlanLimits = (plan: string) => {
    switch (plan) {
      case 'pro':
        return { limit: 1000, label: 'Pro' };
      case 'enterprise':
        return { limit: Infinity, label: 'Enterprise' };
      default:
        return { limit: 100, label: 'Free' };
    }
  };

  const planInfo = getPlanLimits(user?.subscriptionPlan || 'free');
  const creditsUsed = stats?.totalConversions || 0;
  const creditsRemaining = planInfo.limit === Infinity 
    ? 'Unlimited' 
    : Math.max(0, planInfo.limit - creditsUsed);

  const getInitials = () => {
    if (!user) return 'U';
    const firstName = user.firstName || '';
    const lastName = user.lastName || '';
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    if (user.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <FileText className="h-6 w-6 text-primary" />
              <span className="text-xl font-semibold">FileFlowConvertor</span>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              
              {user && (
                <>
                  <Badge variant="outline" className="hidden md:flex items-center gap-1.5">
                    <Coins className="w-3.5 h-3.5" />
                    <span className="text-xs">
                      {creditsRemaining === 'Unlimited' 
                        ? 'Unlimited Credits' 
                        : `${creditsRemaining} / ${planInfo.limit} Credits`}
                    </span>
                  </Badge>
                  
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage 
                        src={user.profileImageUrl || undefined} 
                        alt={user.firstName || 'User'}
                        className="object-cover"
                      />
                      <AvatarFallback className="text-xs">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden sm:flex flex-col">
                      <span className="text-sm font-medium" data-testid="text-user-name">
                        {user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user.email}
                      </span>
                      <span className="text-xs text-muted-foreground capitalize">
                        {planInfo.label} Plan
                      </span>
                    </div>
                  </div>
                </>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  localStorage.removeItem("auth_token");
                  window.location.href = "/";
                }}
                data-testid="button-logout"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <StatsCards />

        {/* Upload Zone */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Upload Document</h2>
          <FileUploadZone />
        </div>

        {/* Conversion History */}
        <ConversionHistory />
      </main>
    </div>
  );
}
