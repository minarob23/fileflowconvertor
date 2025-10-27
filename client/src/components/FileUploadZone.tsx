import { Upload, FileText, FileSpreadsheet, Presentation, Check, X } from "lucide-react";
import { useCallback, useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const ACCEPTED_FORMATS = ['.docx', '.xlsx', '.pptx', '.pdf'];
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export function FileUploadZone() {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [targetFormat, setTargetFormat] = useState<string>('pdf');
  const [showModal, setShowModal] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: async ({ file, format }: { file: File; format: string }) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('targetFormat', format);
      
      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('401: Unauthorized');
      }

      const response = await fetch('/api/conversions/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('401: Unauthorized');
        }
        const error = await response.json();
        throw new Error(error.message || 'Upload failed');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/conversions'] });
      queryClient.invalidateQueries({ queryKey: ['/api/conversions/stats'] });
      setSelectedFile(null);
      setTargetFormat('pdf');
      setShowModal(false);
      
      const conversionType = selectedFile?.name.endsWith('.pdf') 
        ? `${targetFormat.toUpperCase()} document`
        : 'PDF';
        
      toast({
        title: "File uploaded successfully",
        description: `Your document is being converted to ${conversionType}`,
      });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Session expired",
          description: "Please log in again",
          variant: "destructive",
        });
        localStorage.removeItem('auth_token');
        setTimeout(() => {
          window.location.href = "/login";
        }, 1000);
        return;
      }
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const validateFile = (file: File): string | null => {
    const extension = `.${file.name.split('.').pop()?.toLowerCase()}`;
    
    if (!ACCEPTED_FORMATS.includes(extension)) {
      return `Unsupported file type. Please upload ${ACCEPTED_FORMATS.join(', ')} files only.`;
    }
    
    if (file.size > MAX_FILE_SIZE) {
      return `File size exceeds 50MB limit.`;
    }
    
    return null;
  };

  const handleFile = useCallback((file: File) => {
    const error = validateFile(file);
    if (error) {
      toast({
        title: "Invalid file",
        description: error,
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
    
    // Auto-set target format based on file type
    const isPdf = file.name.toLowerCase().endsWith('.pdf');
    if (isPdf) {
      setTargetFormat('word'); // Default to Word for PDF conversions
    } else {
      setTargetFormat('pdf'); // Default to PDF for Office files
    }
    
    // Open modal
    setShowModal(true);
  }, [toast]);

  const handleUpload = () => {
    if (!selectedFile) return;
    uploadMutation.mutate({ file: selectedFile, format: targetFormat });
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  }, [handleFile]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
    e.target.value = ''; // Reset input
  };

  const isPdfFile = selectedFile?.name.toLowerCase().endsWith('.pdf');

  return (
    <div className="space-y-6">
      <div
        className={`
          relative border-2 border-dashed rounded-xl p-12 text-center
          transition-all duration-200 hover-elevate
          ${isDragging ? 'border-primary bg-primary/5' : 'border-border'}
          ${uploadMutation.isPending ? 'opacity-60 pointer-events-none' : ''}
        `}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        data-testid="zone-file-upload"
      >
        <input
          type="file"
          id="file-input"
          className="hidden"
          accept={ACCEPTED_FORMATS.join(',')}
          onChange={handleFileInput}
          disabled={uploadMutation.isPending}
          data-testid="input-file"
        />
        
        <div className="space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
            {uploadMutation.isPending ? (
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            ) : (
              <Upload className="w-8 h-8 text-primary" />
            )}
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">
              {uploadMutation.isPending ? 'Uploading...' : selectedFile ? selectedFile.name : 'Drop your file here'}
            </h3>
            <p className="text-sm text-muted-foreground">
              or{' '}
              <label
                htmlFor="file-input"
                className="text-primary font-medium cursor-pointer hover:underline"
                data-testid="button-browse"
              >
                browse files
              </label>
            </p>
          </div>

          <div className="flex items-center justify-center gap-4 pt-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <FileText className="w-4 h-4" />
              <span>.docx</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <FileText className="w-4 h-4" />
              <span>.xlsx</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <FileText className="w-4 h-4" />
              <span>.pptx</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <FileText className="w-4 h-4" />
              <span>.pdf</span>
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            Maximum file size: 50MB
          </p>
        </div>
      </div>

      {/* Beautiful Modal for Conversion Options */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden">
          <div className="relative bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-950/30 dark:to-pink-950/30 p-8">
            <DialogHeader className="space-y-4">
              <div className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-2xl">
                <Upload className="w-10 h-10 text-white" />
              </div>
              <DialogTitle className="text-3xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Choose Your Conversion Format
              </DialogTitle>
              <DialogDescription className="text-center text-base">
                Convert <span className="font-semibold text-foreground">{selectedFile?.name}</span> to your desired format
              </DialogDescription>
            </DialogHeader>

            <div className="mt-8 space-y-6">
              {isPdfFile ? (
                // PDF to Office - Beautiful 3-card layout
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Word Card */}
                  <Card 
                    className={`
                      relative p-6 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-1
                      ${targetFormat === 'word' 
                        ? 'border-2 border-blue-500 bg-blue-50 dark:bg-blue-950/40 shadow-lg' 
                        : 'border-2 border-border hover:border-blue-300 bg-white dark:bg-gray-800'
                      }
                    `}
                    onClick={() => setTargetFormat('word')}
                  >
                    {targetFormat === 'word' && (
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg animate-in zoom-in">
                        <Check className="w-5 h-5 text-white" />
                      </div>
                    )}
                    <div className="space-y-4 text-center">
                      <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                        <FileText className="w-8 h-8 text-white" />
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-bold text-lg">Word</h4>
                        <p className="text-xs text-muted-foreground">.docx</p>
                        <div className="pt-2 space-y-1">
                          <p className="text-xs text-muted-foreground">✓ Editable text</p>
                          <p className="text-xs text-muted-foreground">✓ Keep formatting</p>
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Excel Card */}
                  <Card 
                    className={`
                      relative p-6 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-1
                      ${targetFormat === 'excel' 
                        ? 'border-2 border-green-500 bg-green-50 dark:bg-green-950/40 shadow-lg' 
                        : 'border-2 border-border hover:border-green-300 bg-white dark:bg-gray-800'
                      }
                    `}
                    onClick={() => setTargetFormat('excel')}
                  >
                    {targetFormat === 'excel' && (
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg animate-in zoom-in">
                        <Check className="w-5 h-5 text-white" />
                      </div>
                    )}
                    <div className="space-y-4 text-center">
                      <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
                        <FileSpreadsheet className="w-8 h-8 text-white" />
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-bold text-lg">Excel</h4>
                        <p className="text-xs text-muted-foreground">.xlsx</p>
                        <div className="pt-2 space-y-1">
                          <p className="text-xs text-muted-foreground">✓ Extract tables</p>
                          <p className="text-xs text-muted-foreground">✓ Data analysis</p>
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* PowerPoint Card */}
                  <Card 
                    className={`
                      relative p-6 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-1
                      ${targetFormat === 'ppt' 
                        ? 'border-2 border-orange-500 bg-orange-50 dark:bg-orange-950/40 shadow-lg' 
                        : 'border-2 border-border hover:border-orange-300 bg-white dark:bg-gray-800'
                      }
                    `}
                    onClick={() => setTargetFormat('ppt')}
                  >
                    {targetFormat === 'ppt' && (
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center shadow-lg animate-in zoom-in">
                        <Check className="w-5 h-5 text-white" />
                      </div>
                    )}
                    <div className="space-y-4 text-center">
                      <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg">
                        <Presentation className="w-8 h-8 text-white" />
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-bold text-lg">PowerPoint</h4>
                        <p className="text-xs text-muted-foreground">.pptx</p>
                        <div className="pt-2 space-y-1">
                          <p className="text-xs text-muted-foreground">✓ Page to slide</p>
                          <p className="text-xs text-muted-foreground">✓ High quality</p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              ) : (
                // Office to PDF - Single centered card
                <div className="max-w-xs mx-auto">
                  <Card className="p-8 border-2 border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/40 dark:to-pink-950/40 shadow-xl">
                    <div className="space-y-6 text-center">
                      <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                        <FileText className="w-10 h-10 text-white" />
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-bold text-2xl">PDF</h4>
                        <p className="text-sm text-muted-foreground">.pdf format</p>
                        <div className="pt-3 space-y-2">
                          <p className="text-sm text-muted-foreground">✓ Universal format</p>
                          <p className="text-sm text-muted-foreground">✓ Easy sharing</p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button 
                  onClick={handleUpload} 
                  className="flex-1 h-12 text-base bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all"
                  disabled={uploadMutation.isPending}
                >
                  {uploadMutation.isPending ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Converting...
                    </span>
                  ) : (
                    'Start Conversion'
                  )}
                </Button>
                <Button 
                  onClick={() => {
                    setShowModal(false);
                    setSelectedFile(null);
                  }} 
                  variant="outline"
                  className="h-12 px-6"
                  disabled={uploadMutation.isPending}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
