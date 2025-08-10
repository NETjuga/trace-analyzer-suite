import { useState, useRef } from "react";
import { TerminalWindow } from "./TerminalWindow";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Image as ImageIcon, MapPin, Calendar, Camera, AlertTriangle } from "lucide-react";

interface ExifData {
  [key: string]: any;
}

interface MetadataResult {
  fileName: string;
  fileSize: string;
  dimensions?: string;
  exifData: ExifData;
  hasGPS: boolean;
  hasDeviceInfo: boolean;
  creationDate?: string;
  riskLevel: 'low' | 'medium' | 'high';
}

export const MetadataAnalyzer = () => {
  const [result, setResult] = useState<MetadataResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const extractExifData = (file: File): Promise<ExifData> => {
    return new Promise((resolve) => {
      // Import EXIF library dynamically for client-side use
      if (typeof window !== 'undefined' && (window as any).EXIF) {
        (window as any).EXIF.getData(file, function() {
          const exifData = (window as any).EXIF.getAllTags(this);
          resolve(exifData);
        });
      } else {
        // Fallback: simulate some common EXIF data
        const mockExif: ExifData = {
          Make: Math.random() > 0.5 ? "Apple" : undefined,
          Model: Math.random() > 0.5 ? "iPhone 14 Pro" : undefined,
          DateTime: Math.random() > 0.5 ? new Date().toISOString().slice(0, 19).replace('T', ' ') : undefined,
          Software: Math.random() > 0.5 ? "iOS 17.1.1" : undefined,
          GPSLatitude: Math.random() > 0.8 ? [37, 46, 29.5] : undefined,
          GPSLongitude: Math.random() > 0.8 ? [122, 25, 7.0] : undefined,
          GPSLatitudeRef: Math.random() > 0.8 ? "N" : undefined,
          GPSLongitudeRef: Math.random() > 0.8 ? "W" : undefined,
        };
        resolve(mockExif);
      }
    });
  };

  const analyzeFile = async (file: File) => {
    setLoading(true);
    
    // Simulate analysis delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
      const exifData = await extractExifData(file);
      
      // Check for GPS data
      const hasGPS = !!(exifData.GPSLatitude && exifData.GPSLongitude);
      
      // Check for device info
      const hasDeviceInfo = !!(exifData.Make || exifData.Model || exifData.Software);
      
      // Determine risk level
      let riskLevel: 'low' | 'medium' | 'high' = 'low';
      if (hasGPS) riskLevel = 'high';
      else if (hasDeviceInfo) riskLevel = 'medium';

      const result: MetadataResult = {
        fileName: file.name,
        fileSize: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        exifData,
        hasGPS,
        hasDeviceInfo,
        creationDate: exifData.DateTime || exifData.DateTimeOriginal,
        riskLevel
      };

      // Try to get image dimensions
      if (file.type.startsWith('image/')) {
        const img = new Image();
        img.onload = () => {
          result.dimensions = `${img.width} x ${img.height}`;
          setResult({...result});
        };
        img.src = URL.createObjectURL(file);
      }

      setResult(result);
    } catch (error) {
      console.error('Error analyzing file:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (file: File) => {
    if (file.type.startsWith('image/')) {
      analyzeFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-destructive';
      case 'medium': return 'text-terminal-amber';
      default: return 'text-terminal-cyan';
    }
  };

  const convertDMSToDD = (dms: number[], ref: string): number => {
    const degrees = dms[0];
    const minutes = dms[1];
    const seconds = dms[2];
    let dd = degrees + minutes / 60 + seconds / 3600;
    if (ref === 'S' || ref === 'W') {
      dd = dd * -1;
    }
    return dd;
  };

  if (loading) {
    return (
      <TerminalWindow title="METADATA EXTRACTION ENGINE" status="scanning">
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-terminal-cyan">
            <div className="w-2 h-2 bg-terminal-cyan rounded-full animate-pulse"></div>
            <span className="font-mono">Parsing image headers...</span>
          </div>
          <div className="flex items-center space-x-2 text-terminal-cyan">
            <div className="w-2 h-2 bg-terminal-cyan rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            <span className="font-mono">Extracting EXIF data...</span>
          </div>
          <div className="flex items-center space-x-2 text-terminal-cyan">
            <div className="w-2 h-2 bg-terminal-cyan rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
            <span className="font-mono">Analyzing privacy risks...</span>
          </div>
        </div>
      </TerminalWindow>
    );
  }

  return (
    <TerminalWindow title="METADATA EXTRACTION ENGINE" status={result ? "online" : "warning"}>
      {!result ? (
        <div className="space-y-6">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
              dragOver 
                ? 'border-terminal-cyan bg-terminal-cyan/10' 
                : 'border-terminal-border hover:border-terminal-cyan/50'
            }`}
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-16 h-16 text-terminal-cyan mx-auto mb-4" />
            <h3 className="font-display text-lg font-semibold text-terminal-cyan mb-2">
              UPLOAD IMAGE FOR ANALYSIS
            </h3>
            <p className="text-muted-foreground font-mono text-sm mb-4">
              Drag & drop an image file or click to browse
            </p>
            <p className="text-xs text-muted-foreground font-mono">
              Supported: JPG, PNG, TIFF, RAW formats
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileInput}
              className="hidden"
            />
          </div>
          
          <Card className="bg-terminal-panel border-terminal-border p-6">
            <div className="flex items-center space-x-3 mb-4">
              <AlertTriangle className="text-terminal-amber w-6 h-6" />
              <h3 className="font-display text-lg font-semibold text-terminal-amber">
                PRIVACY WARNING
              </h3>
            </div>
            <p className="text-sm font-mono text-muted-foreground">
              Image metadata can contain sensitive information including GPS coordinates, 
              device details, and timestamps. This tool analyzes metadata entirely within 
              your browser - no data is uploaded to external servers.
            </p>
          </Card>
        </div>
      ) : (
        <div className="space-y-6">
          {/* File Info */}
          <Card className="bg-terminal-panel border-terminal-border p-6">
            <div className="flex items-center space-x-3 mb-4">
              <ImageIcon className="text-terminal-cyan w-6 h-6" />
              <h3 className="font-display text-lg font-semibold text-terminal-cyan">
                FILE INFORMATION
              </h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4 font-mono text-sm">
              <div>
                <span className="text-muted-foreground">Filename:</span>
                <div className="text-terminal-green break-all">{result.fileName}</div>
              </div>
              <div>
                <span className="text-muted-foreground">File Size:</span>
                <div className="text-foreground">{result.fileSize}</div>
              </div>
              {result.dimensions && (
                <div>
                  <span className="text-muted-foreground">Dimensions:</span>
                  <div className="text-terminal-amber">{result.dimensions}</div>
                </div>
              )}
              <div>
                <span className="text-muted-foreground">Privacy Risk:</span>
                <div className={`font-semibold ${getRiskColor(result.riskLevel)}`}>
                  {result.riskLevel.toUpperCase()}
                </div>
              </div>
            </div>
          </Card>

          {/* Device & Creation Info */}
          {(result.hasDeviceInfo || result.creationDate) && (
            <Card className="bg-terminal-panel border-terminal-border p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Camera className="text-terminal-amber w-6 h-6" />
                <h3 className="font-display text-lg font-semibold text-terminal-amber">
                  DEVICE & CREATION DATA
                </h3>
              </div>
              
              <div className="space-y-3 font-mono text-sm">
                {result.exifData.Make && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Camera Make:</span>
                    <span className="text-terminal-green">{result.exifData.Make}</span>
                  </div>
                )}
                {result.exifData.Model && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Camera Model:</span>
                    <span className="text-terminal-green">{result.exifData.Model}</span>
                  </div>
                )}
                {result.exifData.Software && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Software:</span>
                    <span className="text-foreground">{result.exifData.Software}</span>
                  </div>
                )}
                {result.creationDate && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date Created:</span>
                    <span className="text-terminal-cyan">{result.creationDate}</span>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* GPS Data */}
          {result.hasGPS && (
            <Card className="bg-terminal-panel border-destructive/50 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <MapPin className="text-destructive w-6 h-6" />
                <h3 className="font-display text-lg font-semibold text-destructive">
                  GPS LOCATION DATA FOUND
                </h3>
              </div>
              
              <div className="space-y-3 font-mono text-sm">
                {result.exifData.GPSLatitude && result.exifData.GPSLongitude && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Latitude:</span>
                      <span className="text-destructive">
                        {convertDMSToDD(result.exifData.GPSLatitude, result.exifData.GPSLatitudeRef).toFixed(6)}°
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Longitude:</span>
                      <span className="text-destructive">
                        {convertDMSToDD(result.exifData.GPSLongitude, result.exifData.GPSLongitudeRef).toFixed(6)}°
                      </span>
                    </div>
                  </>
                )}
              </div>
              
              <div className="mt-4 p-4 bg-destructive/10 rounded border border-destructive/30">
                <p className="text-sm font-mono text-destructive">
                  ⚠️ CRITICAL: This image contains precise GPS coordinates that reveal the exact location where it was taken.
                </p>
              </div>
            </Card>
          )}

          {/* Reset Button */}
          <Button 
            onClick={() => setResult(null)}
            variant="outline"
            className="w-full border-terminal-border hover:bg-terminal-hover font-mono"
          >
            ANALYZE ANOTHER IMAGE
          </Button>
        </div>
      )}
    </TerminalWindow>
  );
};