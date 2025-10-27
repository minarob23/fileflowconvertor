import { useQuery } from "@tanstack/react-query";
import { ConversionCard } from "./ConversionCard";
import type { Conversion } from "@shared/schema";
import { FileQuestion } from "lucide-react";
import { useEffect } from "react";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useToast } from "@/hooks/use-toast";

export function ConversionHistory() {
  const { toast } = useToast();
  
  const { data: conversions, isLoading, error, refetch } = useQuery<Conversion[]>({
    queryKey: ['/api/conversions'],
    refetchInterval: (query) => {
      // Poll every 3 seconds if there are any processing/pending conversions
      const data = query.state.data as Conversion[] | undefined;
      const hasActiveConversions = data?.some(
        c => c.status === 'processing' || c.status === 'pending'
      );
      return hasActiveConversions ? 3000 : false;
    },
  });

  useEffect(() => {
    if (error && isUnauthorizedError(error as Error)) {
      toast({
        title: "Session expired",
        description: "Please log in again",
        variant: "destructive",
      });
      localStorage.removeItem('auth_token');
      setTimeout(() => {
        window.location.href = "/login";
      }, 1000);
    }
  }, [error, toast]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 bg-card rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (!conversions || conversions.length === 0) {
    return (
      <div className="text-center py-16 space-y-4">
        <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center">
          <FileQuestion className="w-8 h-8 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold" data-testid="text-empty-state">No conversions yet</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Upload your first document to get started. Your conversion history will appear here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Conversion History</h2>
        <span className="text-sm text-muted-foreground" data-testid="text-conversion-count">
          {conversions.length} {conversions.length === 1 ? 'conversion' : 'conversions'}
        </span>
      </div>
      
      {conversions.map((conversion) => (
        <ConversionCard key={conversion.id} conversion={conversion} />
      ))}
    </div>
  );
}
