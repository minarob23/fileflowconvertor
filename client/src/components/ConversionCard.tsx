import { FileText, Download, AlertCircle, CheckCircle, Clock, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Conversion } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";

interface ConversionCardProps {
  conversion: Conversion;
}

export function ConversionCard({ conversion }: ConversionCardProps) {
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileIcon = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    return <FileText className="w-5 h-5" />;
  };

  const getFileTypeColor = (filename: string): string => {
    const ext = filename.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'docx':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400';
      case 'xlsx':
        return 'bg-green-500/10 text-green-600 dark:text-green-400';
      case 'pptx':
        return 'bg-orange-500/10 text-orange-600 dark:text-orange-400';
      default:
        return 'bg-primary/10 text-primary';
    }
  };

  const getStatusBadge = () => {
    switch (conversion.status) {
      case 'completed':
        return (
          <Badge variant="outline" className="bg-chart-2/10 text-chart-2 border-chart-2/20" data-testid={`badge-status-${conversion.id}`}>
            <CheckCircle className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        );
      case 'processing':
        return (
          <Badge variant="outline" className="bg-chart-3/10 text-chart-3 border-chart-3/20" data-testid={`badge-status-${conversion.id}`}>
            <Loader2 className="w-3 h-3 mr-1 animate-spin" />
            Processing
          </Badge>
        );
      case 'failed':
        return (
          <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20" data-testid={`badge-status-${conversion.id}`}>
            <AlertCircle className="w-3 h-3 mr-1" />
            Failed
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="outline" className="bg-muted text-muted-foreground" data-testid={`badge-status-${conversion.id}`}>
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      default:
        return null;
    }
  };

  const handleDownload = async () => {
    if (conversion.status !== 'completed' || !conversion.convertedFileName) return;
    
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        window.location.href = '/login';
        return;
      }

      // Create download URL with auth token as query parameter
      const downloadUrl = `/api/conversions/${conversion.id}/download?token=${encodeURIComponent(token)}`;
      
      // Check if File System Access API is supported
      if ('showSaveFilePicker' in window) {
        try {
          // Get file extension
          const fileExtension = conversion.convertedFileName.split('.').pop()?.toLowerCase() || '';
          
          // Map extensions to MIME types
          const mimeTypes: Record<string, string> = {
            'pdf': 'application/pdf',
            'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'doc': 'application/msword',
            'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'xls': 'application/vnd.ms-excel',
            'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            'ppt': 'application/vnd.ms-powerpoint',
            'txt': 'text/plain',
            'csv': 'text/csv',
            'html': 'text/html',
            'xml': 'application/xml',
            'json': 'application/json',
            'zip': 'application/zip',
            'png': 'image/png',
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'gif': 'image/gif',
            'svg': 'image/svg+xml',
          };

          const mimeType = mimeTypes[fileExtension] || 'application/octet-stream';
          
          // Show file picker dialog
          const fileHandle = await (window as any).showSaveFilePicker({
            suggestedName: conversion.convertedFileName,
            types: [{
              description: `${fileExtension.toUpperCase()} File`,
              accept: { [mimeType]: [`.${fileExtension}`] }
            }]
          });

          // Fetch the file
          const response = await fetch(downloadUrl);
          if (!response.ok) {
            throw new Error(`Download failed: ${response.statusText}`);
          }
          
          const blob = await response.blob();
          
          // Write to the selected file
          const writable = await fileHandle.createWritable();
          await writable.write(blob);
          await writable.close();
          
          // Optional: Show success message
          console.log('File saved successfully!');
        } catch (err: any) {
          // User cancelled the file picker
          if (err.name === 'AbortError') {
            console.log('Download cancelled by user');
            return;
          }
          
          // Other errors - fall back to default download
          console.error('File picker error:', err);
          fallbackDownload(downloadUrl, conversion.convertedFileName);
        }
      } else {
        // Fall back to default download for browsers that don't support File System Access API
        fallbackDownload(downloadUrl, conversion.convertedFileName);
      }
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download file. Please try again.');
    }
  };

  // Fallback download function for browsers without File System Access API
  const fallbackDownload = (url: string, filename: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <Card className="p-4 hover-elevate transition-all duration-200" data-testid={`card-conversion-${conversion.id}`}>
      <div className="flex items-center gap-4">
        {/* File Icon */}
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${getFileTypeColor(conversion.originalFileName)}`}>
          {getFileIcon(conversion.originalFileName)}
        </div>

        {/* File Info */}
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="font-medium truncate font-mono text-sm" data-testid={`text-filename-${conversion.id}`}>
              {conversion.originalFileName}
            </h3>
            {getStatusBadge()}
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span>{formatFileSize(conversion.fileSize)}</span>
            <span>•</span>
            <span data-testid={`text-time-${conversion.id}`}>
              {formatDistanceToNow(new Date(conversion.createdAt), { addSuffix: true })}
            </span>
          </div>
          {conversion.status === 'failed' && conversion.errorMessage && (
            <p className="text-xs text-destructive" data-testid={`text-error-${conversion.id}`}>
              {conversion.errorMessage}
            </p>
          )}
        </div>

        {/* Download Button */}
        {conversion.status === 'completed' && (
          <Button
            size="sm"
            variant="outline"
            onClick={handleDownload}
            data-testid={`button-download-${conversion.id}`}
            className="flex-shrink-0"
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        )}

        {conversion.status === 'processing' && (
          <div className="flex-shrink-0 w-20">
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full animate-pulse" style={{ width: '60%' }} />
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
