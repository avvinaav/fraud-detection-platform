'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, X, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FileUploadZoneProps {
  onFileSelect: (file: File) => void;
  onClear?: () => void;
  selectedFile?: File | null;
  isProcessing?: boolean;
}

const ACCEPTED_TYPES = ['.txt', '.pdf', '.docx'];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

export function FileUploadZone({ onFileSelect, onClear, selectedFile, isProcessing }: FileUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File): boolean => {
    setError(null);
    
    const extension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!ACCEPTED_TYPES.includes(extension)) {
      setError(`File type not supported. Please upload ${ACCEPTED_TYPES.join(', ')} files.`);
      return false;
    }

    if (file.size > MAX_SIZE) {
      setError('File size exceeds 10MB limit.');
      return false;
    }

    return true;
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && validateFile(file)) {
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && validateFile(file)) {
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const handleClear = () => {
    setError(null);
    onClear?.();
  };

  return (
    <div className="space-y-4">
      <AnimatePresence mode="wait">
        {!selectedFile ? (
          <motion.div
            key="upload-zone"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
              relative border-2 border-dashed rounded-lg p-12 
              transition-all duration-200 cursor-pointer
              ${isDragging 
                ? 'border-emerald-500 bg-emerald-500/5 scale-[1.02]' 
                : 'border-zinc-700 hover:border-zinc-600 hover:bg-zinc-900/30'
              }
            `}
          >
            <input
              type="file"
              accept={ACCEPTED_TYPES.join(',')}
              onChange={handleFileInput}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={isProcessing}
            />
            
            <div className="flex flex-col items-center justify-center text-center space-y-4">
              <motion.div
                animate={isDragging ? { scale: 1.1 } : { scale: 1 }}
                transition={{ duration: 0.2 }}
                className={`
                  p-4 rounded-full 
                  ${isDragging ? 'bg-emerald-500/20' : 'bg-zinc-800'}
                `}
              >
                <Upload className={`w-8 h-8 ${isDragging ? 'text-emerald-500' : 'text-zinc-400'}`} />
              </motion.div>

              <div>
                <h3 className="text-lg font-semibold mb-1">
                  {isDragging ? 'Drop your file here' : 'Upload Document'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Drag and drop or click to browse
                </p>
              </div>

              <div className="text-xs text-muted-foreground space-y-1">
                <p>Supported formats: TXT, PDF, DOCX</p>
                <p>Maximum file size: 10MB</p>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="file-selected"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="border rounded-lg p-6 bg-zinc-900/50"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                  <FileText className="w-6 h-6 text-emerald-500" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1">{selectedFile.name}</h4>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>Size: {(selectedFile.size / 1024).toFixed(2)} KB</p>
                    <p>Type: {selectedFile.type || 'Unknown'}</p>
                  </div>
                </div>
              </div>
              
              {!isProcessing && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClear}
                  className="text-zinc-400 hover:text-zinc-100"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-start gap-2 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-sm"
          >
            <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
            <p className="text-red-500">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
