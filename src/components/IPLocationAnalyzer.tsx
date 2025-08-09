import { useState, useEffect } from "react";
import { TerminalWindow } from "./TerminalWindow";
import { Card } from "@/components/ui/card";
import { MapPin, Globe, Shield, Wifi } from "lucide-react";

interface IPData {
  ip: string;
  city: string;
  country_name: string;
  org: string;
  latitude: number;
  longitude: number;
  timezone: string;
  currency: string;
}

export const IPLocationAnalyzer = () => {
  const [ipData, setIpData] = useState<IPData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIPData = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        
        // Simulate terminal loading effect
        setTimeout(() => {
          setIpData(data);
          setLoading(false);
        }, 1500);
      } catch (error) {
        console.error('Failed to fetch IP data:', error);
        setLoading(false);
      }
    };

    fetchIPData();
  }, []);

  const getLocationRisk = () => {
    if (!ipData) return "UNKNOWN";
    // Simple risk assessment based on location data availability
    const hasFullData = ipData.latitude && ipData.longitude && ipData.city;
    return hasFullData ? "HIGH" : "MEDIUM";
  };

  if (loading) {
    return (
      <TerminalWindow title="IP & LOCATION ANALYSIS" status="scanning">
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-terminal-cyan">
            <div className="w-2 h-2 bg-terminal-cyan rounded-full animate-pulse"></div>
            <span className="font-mono">Scanning network interfaces...</span>
          </div>
          <div className="flex items-center space-x-2 text-terminal-cyan">
            <div className="w-2 h-2 bg-terminal-cyan rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            <span className="font-mono">Resolving geolocation data...</span>
          </div>
          <div className="flex items-center space-x-2 text-terminal-cyan">
            <div className="w-2 h-2 bg-terminal-cyan rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
            <span className="font-mono">Analyzing ISP information...</span>
          </div>
        </div>
      </TerminalWindow>
    );
  }

  if (!ipData) {
    return (
      <TerminalWindow title="IP & LOCATION ANALYSIS" status="error">
        <div className="text-destructive font-mono">
          ERROR: Unable to retrieve network information
        </div>
      </TerminalWindow>
    );
  }

  return (
    <TerminalWindow title="IP & LOCATION ANALYSIS" status="online">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-terminal-panel border-terminal-border p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Globe className="text-terminal-green w-6 h-6" />
            <h3 className="font-display text-lg font-semibold text-terminal-green">
              NETWORK IDENTITY
            </h3>
          </div>
          
          <div className="space-y-3 font-mono">
            <div className="flex justify-between">
              <span className="text-muted-foreground">IP Address:</span>
              <span className="text-terminal-cyan font-semibold">{ipData.ip}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">ISP:</span>
              <span className="text-terminal-amber text-sm">{ipData.org}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Timezone:</span>
              <span className="text-foreground">{ipData.timezone}</span>
            </div>
          </div>
        </Card>

        <Card className="bg-terminal-panel border-terminal-border p-6">
          <div className="flex items-center space-x-3 mb-4">
            <MapPin className="text-terminal-cyan w-6 h-6" />
            <h3 className="font-display text-lg font-semibold text-terminal-cyan">
              GEOLOCATION
            </h3>
          </div>
          
          <div className="space-y-3 font-mono">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Location:</span>
              <span className="text-terminal-green">{ipData.city}, {ipData.country_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Coordinates:</span>
              <span className="text-terminal-amber text-sm">
                {ipData.latitude?.toFixed(4)}, {ipData.longitude?.toFixed(4)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Currency:</span>
              <span className="text-foreground">{ipData.currency}</span>
            </div>
          </div>
        </Card>
      </div>

      <Card className="bg-terminal-panel border-terminal-border p-6 mt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Shield className="text-destructive w-6 h-6" />
            <div>
              <h3 className="font-display text-lg font-semibold text-destructive">
                PRIVACY RISK ASSESSMENT
              </h3>
              <p className="text-sm text-muted-foreground font-mono">
                Location exposure level: <span className="text-destructive font-semibold">{getLocationRisk()}</span>
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-display font-bold text-destructive glow-text">
              {getLocationRisk()}
            </div>
            <div className="text-xs text-muted-foreground">RISK LEVEL</div>
          </div>
        </div>
        
        <div className="mt-4 p-4 bg-muted/30 rounded border border-destructive/30">
          <p className="text-sm font-mono text-muted-foreground">
            <span className="text-destructive">WARNING:</span> Your exact location can be determined from your IP address. 
            Consider using a VPN to mask your geographic location and enhance privacy.
          </p>
        </div>
      </Card>
    </TerminalWindow>
  );
};