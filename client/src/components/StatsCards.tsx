import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { FileText, CheckCircle, Clock } from "lucide-react";

interface Stats {
  totalConversions: number;
  completedConversions: number;
  todayConversions: number;
}

export function StatsCards() {
  const { data: stats, isLoading } = useQuery<Stats>({
    queryKey: ['/api/conversions/stats'],
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-card rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card className="p-6 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">Total Conversions</span>
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <FileText className="w-5 h-5 text-primary" />
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-3xl font-bold" data-testid="stat-total">{stats?.totalConversions || 0}</p>
          <p className="text-xs text-muted-foreground">All time</p>
        </div>
      </Card>

      <Card className="p-6 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">Completed</span>
          <div className="w-10 h-10 rounded-lg bg-chart-2/10 flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-chart-2" />
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-3xl font-bold" data-testid="stat-completed">{stats?.completedConversions || 0}</p>
          <p className="text-xs text-muted-foreground">
            {stats?.totalConversions ? 
              `${Math.round((stats.completedConversions / stats.totalConversions) * 100)}% success rate` : 
              'No conversions yet'}
          </p>
        </div>
      </Card>

      <Card className="p-6 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">Today</span>
          <div className="w-10 h-10 rounded-lg bg-chart-3/10 flex items-center justify-center">
            <Clock className="w-5 h-5 text-chart-3" />
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-3xl font-bold" data-testid="stat-today">{stats?.todayConversions || 0}</p>
          <p className="text-xs text-muted-foreground">Last 24 hours</p>
        </div>
      </Card>
    </div>
  );
}
