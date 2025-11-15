'use client';

import React, { useState, useRef } from 'react';
import toast from 'react-hot-toast';

// UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

// Icons
import { 
  Upload as UploadIcon, 
  FileUpload as FileUploadIcon,
  CloudUpload as CloudUploadIcon,
  Check as CheckIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Download as DownloadIcon
} from '@mui/icons-material';

// Types
import { BulkUploadSimCardData, Provider } from '@/lib/types/simcards';

interface BulkUploadSimCardsDialogProps {
  onSubmit: (data: BulkUploadSimCardData[]) => Promise<void>;
  providers: Provider[];
}

interface ParsedSimCard extends BulkUploadSimCardData {
  row: number;
  errors: string[];
}

export function BulkUploadSimCardsDialog({ onSubmit, providers }: BulkUploadSimCardsDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadMode, setUploadMode] = useState<'file' | 'manual'>('file');
  const [parsedSimCards, setParsedSimCards] = useState<ParsedSimCard[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [manualData, setManualData] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      parseFile(selectedFile);
    }
  };

  const parseFile = async (file: File) => {
    try {
      const text = await file.text();
      parseCSVData(text);
    } catch (error) {
      toast.error('Failed to read file');
      console.error('File parsing error:', error);
    }
  };

  const parseManualData = () => {
    parseCSVData(manualData);
  };

  const parseCSVData = (csvText: string) => {
    const lines = csvText.trim().split('\n');
    const simCards: ParsedSimCard[] = [];

    lines.forEach((line, index) => {
      const row = index + 1;
      const columns = line.split(',').map(col => col.trim());
      
      if (columns.length < 2) {
        return; // Skip empty or incomplete lines
      }

      const simCard: ParsedSimCard = {
        simno: columns[0] || '',
        provider: columns[1] || '',
        imsi: columns[2] || undefined,
        iccid: columns[3] || undefined,
        row,
        errors: []
      };

      // Validation
      if (!simCard.simno) {
        simCard.errors.push('SIM number is required');
      }

      if (!simCard.provider) {
        simCard.errors.push('Provider is required');
      } else {
        // Check if provider exists
        const providerExists = providers.some(p => 
          p.name.toLowerCase() === simCard.provider.toLowerCase() || 
          p.id === simCard.provider
        );
        if (!providerExists) {
          simCard.errors.push('Provider not found');
        }
      }

      simCards.push(simCard);
    });

    setParsedSimCards(simCards);
  };

  const handleSubmit = async () => {
    const validSimCards = parsedSimCards.filter(simCard => simCard.errors.length === 0);
    
    if (validSimCards.length === 0) {
      toast.error('No valid SIM cards to upload');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit(validSimCards);
      toast.success(`Successfully uploaded ${validSimCards.length} SIM cards!`);
      resetForm();
      setIsOpen(false);
    } catch (error) {
      toast.error('Failed to upload SIM cards. Please try again.');
      console.error('Bulk upload error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setManualData('');
    setParsedSimCards([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const downloadTemplate = () => {
    const headers = ['simno', 'provider', 'imsi', 'iccid'];
    const sampleData = [
      '1234567890,Vodafone,123456789012345,89012345678901234567',
      '0987654321,Airtel,987654321098765,89987654321098765432'
    ];
    
    const csvContent = [headers.join(','), ...sampleData].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'simcard_template.csv';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const validCount = parsedSimCards.filter(simCard => simCard.errors.length === 0).length;
  const errorCount = parsedSimCards.filter(simCard => simCard.errors.length > 0).length;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" >
          <UploadIcon className="w-4 h-4 mr-2" />
          Bulk Upload
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Bulk Upload SIM Cards</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Upload Mode Selection */}
          <div className="flex space-x-4">
            <Button
              type="button"
              variant={uploadMode === 'file' ? 'default' : 'outline'}
              onClick={() => setUploadMode('file')}
              className="flex-1"
            >
              <FileUploadIcon className="w-4 h-4 mr-2" />
              File Upload
            </Button>
            <Button
              type="button"
              variant={uploadMode === 'manual' ? 'default' : 'outline'}
              onClick={() => setUploadMode('manual')}
              className="flex-1"
            >
              Manual Entry
            </Button>
          </div>

          {/* Template Download */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">CSV Format</CardTitle>
              <CardDescription className="text-xs">
                Format: simno, provider, imsi (optional), iccid (optional)
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={downloadTemplate}
                className="w-full"
              >
                <DownloadIcon className="w-4 h-4 mr-2" />
                Download Template
              </Button>
            </CardContent>
          </Card>

          {/* File Upload Mode */}
          {uploadMode === 'file' && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="file">Select CSV File</Label>
                <Input
                  id="file"
                  type="file"
                  accept=".csv,.txt"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  className="mt-1"
                />
              </div>
              {file && (
                <div className="text-sm text-gray-600">
                  Selected: {file.name} ({Math.round(file.size / 1024)} KB)
                </div>
              )}
            </div>
          )}

          {/* Manual Entry Mode */}
          {uploadMode === 'manual' && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="manual-data">Paste CSV Data</Label>
                <Textarea
                  id="manual-data"
                  placeholder="Paste your CSV data here..."
                  value={manualData}
                  onChange={(e) => setManualData(e.target.value)}
                  rows={6}
                  className="mt-1 font-mono text-sm"
                />
              </div>
              <Button
                type="button"
                onClick={parseManualData}
                disabled={!manualData.trim()}
                className="w-full"
              >
                Parse Data
              </Button>
            </div>
          )}

          {/* Parsed Results */}
          {parsedSimCards.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">Parsing Results</CardTitle>
                  <div className="flex space-x-2">
                    {validCount > 0 && (
                      <Badge className="bg-green-100 text-green-800 border-0">
                        <CheckIcon className="w-3 h-3 mr-1" />
                        {validCount} Valid
                      </Badge>
                    )}
                    {errorCount > 0 && (
                      <Badge className="bg-red-100 text-red-800 border-0">
                        <ErrorIcon className="w-3 h-3 mr-1" />
                        {errorCount} Errors
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <ScrollArea className="h-40">
                  <div className="space-y-2">
                    {parsedSimCards.map((simCard, index) => (
                      <div key={index} className="border rounded p-2">
                        <div className="flex items-center justify-between">
                          <div className="text-sm">
                            <strong>Row {simCard.row}:</strong> {simCard.simno} ({simCard.provider})
                          </div>
                          {simCard.errors.length === 0 ? (
                            <CheckIcon className="w-4 h-4 text-green-600" />
                          ) : (
                            <ErrorIcon className="w-4 h-4 text-red-600" />
                          )}
                        </div>
                        {simCard.errors.length > 0 && (
                          <div className="text-xs text-red-600 mt-1">
                            {simCard.errors.join(', ')}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              resetForm();
              setIsOpen(false);
            }}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || validCount === 0}
          >
            {isSubmitting ? 'Uploading...' : `Upload ${validCount} SIM Cards`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}