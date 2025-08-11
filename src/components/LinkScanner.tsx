import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Link, Shield, AlertTriangle, CheckCircle, ExternalLink, Clock } from "lucide-react";

interface ScanResult {
  url: string;
  status: "safe" | "suspicious" | "malicious" | "unknown";
  score: number;
  detections: number;
  totalEngines: number;
  categories: string[];
  lastAnalysis: string;
  domain: string;
  certificate: "valid" | "invalid" | "expired";
}

export const LinkScanner = () => {
  const [url, setUrl] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [scanHistory, setScanHistory] = useState<ScanResult[]>([]);

  const handleScan = async () => {
    if (!url.trim()) return;
    
    setIsScanning(true);
    
    // Simulate VirusTotal API scan with mock data
    setTimeout(() => {
      const mockResult: ScanResult = {
        url: url,
        status: Math.random() > 0.8 ? "malicious" : Math.random() > 0.6 ? "suspicious" : "safe",
        score: Math.floor(Math.random() * 100),
        detections: Math.floor(Math.random() * 5),
        totalEngines: 70,
        categories: ["Technology", "Web Services"],
        lastAnalysis: new Date().toISOString(),
        domain: new URL(url).hostname,
        certificate: Math.random() > 0.2 ? "valid" : "invalid"
      };
      
      setScanResult(mockResult);
      setScanHistory(prev => [mockResult, ...prev.slice(0, 4)]);
      setIsScanning(false);
    }, 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "safe": return "text-success";
      case "suspicious": return "text-warning";
      case "malicious": return "text-destructive";
      default: return "text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "safe": return <CheckCircle className="h-5 w-5 text-success" />;
      case "suspicious": return <AlertTriangle className="h-5 w-5 text-warning" />;
      case "malicious": return <AlertTriangle className="h-5 w-5 text-destructive" />;
      default: return <Shield className="h-5 w-5 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Link Scanner</h1>
        <p className="text-muted-foreground">
          Analyze URLs for malicious content and security threats using threat intelligence
        </p>
      </div>

      {/* Scanner Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Link className="h-5 w-5 text-primary" />
            <span>URL Security Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Input
              placeholder="Enter URL to scan (e.g., https://example.com)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleScan()}
            />
            <Button onClick={handleScan} disabled={isScanning || !url.trim()}>
              {isScanning ? "Scanning..." : "Scan URL"}
            </Button>
          </div>
          
          {isScanning && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Scanning with 70+ security engines...</span>
                <span>Please wait</span>
              </div>
              <Progress value={33} className="h-2 animate-pulse" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Scan Results */}
      {scanResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {getStatusIcon(scanResult.status)}
                <span>Scan Results</span>
              </div>
              <div className={`px-3 py-1 rounded text-sm font-medium ${getStatusColor(scanResult.status)} bg-current/10`}>
                {scanResult.status.toUpperCase()}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* URL Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">URL</p>
                <p className="text-lg font-mono break-all">{scanResult.url}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Domain</p>
                <p className="text-lg">{scanResult.domain}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Security Score</p>
                <div className="flex items-center space-x-2">
                  <Progress value={scanResult.score} className="flex-1" />
                  <span className="text-lg font-bold">{scanResult.score}%</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Certificate Status</p>
                <div className="flex items-center space-x-2">
                  {scanResult.certificate === "valid" ? (
                    <CheckCircle className="h-4 w-4 text-success" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                  )}
                  <span className="capitalize">{scanResult.certificate}</span>
                </div>
              </div>
            </div>

            {/* Detection Results */}
            <div className="bg-muted/50 rounded-lg p-4">
              <h4 className="font-medium mb-2">Detection Summary</h4>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-destructive">{scanResult.detections}</p>
                  <p className="text-sm text-muted-foreground">Detections</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{scanResult.totalEngines}</p>
                  <p className="text-sm text-muted-foreground">Engines</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">
                    {Math.round(((scanResult.totalEngines - scanResult.detections) / scanResult.totalEngines) * 100)}%
                  </p>
                  <p className="text-sm text-muted-foreground">Clean</p>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Categories</p>
                <div className="flex flex-wrap gap-2">
                  {scanResult.categories.map((category, index) => (
                    <span key={index} className="px-2 py-1 bg-primary/20 text-primary rounded text-sm">
                      {category}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Last Analysis</p>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{new Date(scanResult.lastAnalysis).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Scan History */}
      {scanHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Scans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {scanHistory.map((result, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(result.status)}
                    <div>
                      <p className="font-medium">{result.domain}</p>
                      <p className="text-sm text-muted-foreground">{result.detections}/{result.totalEngines} detections</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Info Card */}
      <Card className="border-primary/50 bg-primary/5">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Shield className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="font-medium text-primary">Threat Intelligence</p>
              <p className="text-sm text-muted-foreground mt-1">
                This scanner simulates threat detection capabilities. In production, it would integrate with 
                VirusTotal and other threat intelligence providers for real-time malware detection.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};