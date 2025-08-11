import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Globe, Search, AlertCircle } from "lucide-react";

interface IPData {
  ip: string;
  city: string;
  region: string;
  country: string;
  lat: number;
  lng: number;
  isp: string;
  org: string;
  timezone: string;
  threat_level: "low" | "medium" | "high";
}

export const GeoIPMapper = () => {
  const [ipAddress, setIpAddress] = useState("");
  const [currentIP, setCurrentIP] = useState<IPData | null>(null);
  const [searchResults, setSearchResults] = useState<IPData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Mock data for current IP (GitHub Pages compatible)
  useEffect(() => {
    // Simulate fetching current IP data
    setCurrentIP({
      ip: "203.0.113.195",
      city: "San Francisco",
      region: "California",
      country: "United States",
      lat: 37.7749,
      lng: -122.4194,
      isp: "Example ISP",
      org: "Example Organization",
      timezone: "America/Los_Angeles",
      threat_level: "low"
    });
  }, []);

  const handleSearch = async () => {
    if (!ipAddress.trim()) return;
    
    setIsLoading(true);
    
    // Simulate API call with mock data
    setTimeout(() => {
      setSearchResults({
        ip: ipAddress,
        city: "New York",
        region: "New York",
        country: "United States", 
        lat: 40.7128,
        lng: -74.0060,
        isp: "Sample ISP",
        org: "Sample Organization",
        timezone: "America/New_York",
        threat_level: Math.random() > 0.7 ? "high" : Math.random() > 0.4 ? "medium" : "low"
      });
      setIsLoading(false);
    }, 1500);
  };

  const IPInfoCard = ({ data, title }: { data: IPData; title: string }) => (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MapPin className="h-5 w-5 text-primary" />
          <span>{title}</span>
          <div className={`px-2 py-1 rounded text-xs ${
            data.threat_level === "high" ? "bg-destructive/20 text-destructive" :
            data.threat_level === "medium" ? "bg-warning/20 text-warning" :
            "bg-success/20 text-success"
          }`}>
            {data.threat_level.toUpperCase()} RISK
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">IP Address</p>
            <p className="text-lg font-mono">{data.ip}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Location</p>
            <p className="text-lg">{data.city}, {data.region}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Country</p>
            <p className="text-lg">{data.country}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Coordinates</p>
            <p className="text-lg font-mono">{data.lat.toFixed(4)}, {data.lng.toFixed(4)}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">ISP</p>
            <p className="text-lg">{data.isp}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Organization</p>
            <p className="text-lg">{data.org}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Timezone</p>
            <p className="text-lg">{data.timezone}</p>
          </div>
        </div>
        
        {/* Simulated Map View */}
        <div className="bg-muted rounded-lg p-8 text-center">
          <Globe className="h-16 w-16 mx-auto text-primary mb-4" />
          <p className="text-lg font-medium">Geographic Location</p>
          <p className="text-sm text-muted-foreground">
            Coordinates: {data.lat.toFixed(4)}°, {data.lng.toFixed(4)}°
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Interactive map would be displayed here in production
          </p>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Geo IP Mapping</h1>
        <p className="text-muted-foreground">
          Analyze geographic location and threat intelligence for IP addresses
        </p>
      </div>

      {/* Search Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5 text-primary" />
            <span>IP Address Lookup</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Input
              placeholder="Enter IP address (e.g., 8.8.8.8)"
              value={ipAddress}
              onChange={(e) => setIpAddress(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button onClick={handleSearch} disabled={isLoading}>
              {isLoading ? "Searching..." : "Analyze"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {currentIP && (
          <IPInfoCard data={currentIP} title="Your Current IP" />
        )}
        
        {searchResults && (
          <IPInfoCard data={searchResults} title="Search Results" />
        )}
      </div>

      {/* Security Notice */}
      <Card className="border-warning/50 bg-warning/5">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-warning mt-0.5" />
            <div>
              <p className="font-medium text-warning">Security Notice</p>
              <p className="text-sm text-muted-foreground mt-1">
                This tool provides geographic location data for educational purposes. 
                In production, this would integrate with threat intelligence databases for enhanced security analysis.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};