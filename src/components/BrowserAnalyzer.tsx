import { useState } from "react";
import { TerminalWindow } from "./TerminalWindow";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Monitor, Camera, Mic, Info, ChevronRight } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

interface BrowserInfo {
  userAgent: string;
  language: string;
  platform: string;
  screenResolution: string;
  timezone: string;
  cookiesEnabled: boolean;
  doNotTrack: boolean;
  deviceMemory?: number;
  mediaDevices?: {
    audioinput: number;
    audiooutput: number;
    videoinput: number;
  };
  mediaPermissions?: {
    camera: string;
    microphone: string;
  };
}

export const BrowserAnalyzer = () => {
  const [browserInfo, setBrowserInfo] = useState<BrowserInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const runBrowserCheck = async () => {
    setLoading(true);
    
    // Simulate scanning delay for dramatic effect
    await new Promise(resolve => setTimeout(resolve, 2000));

    const info: BrowserInfo = {
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      cookiesEnabled: navigator.cookieEnabled,
      doNotTrack: navigator.doNotTrack === "1",
      deviceMemory: (navigator as any).deviceMemory,
    };

    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const counts = { audioinput: 0, audiooutput: 0, videoinput: 0 };
      devices.forEach(d => (counts as any)[d.kind]++);
      info.mediaDevices = counts;

      const camera = await navigator.permissions.query({ name: 'camera' as PermissionName });
      const mic = await navigator.permissions.query({ name: 'microphone' as PermissionName });
      info.mediaPermissions = {
        camera: camera.state,
        microphone: mic.state
      };
    } catch (error) {
      console.log('Media permissions check failed:', error);
    }

    setBrowserInfo(info);
    setLoading(false);
  };

  const fingerprintData = browserInfo ? [
    { name: 'User Agent', value: browserInfo.userAgent.length },
    { name: 'Screen', value: parseInt(browserInfo.screenResolution.split('x')[0]) / 10 },
    { name: 'Timezone', value: browserInfo.timezone.length * 5 },
    { name: 'Language', value: browserInfo.language.length * 10 },
    { name: 'Platform', value: browserInfo.platform.length * 8 },
  ] : [];

  if (loading) {
    return (
      <TerminalWindow title="BROWSER ENVIRONMENT SCAN" status="scanning">
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-terminal-cyan">
            <div className="w-2 h-2 bg-terminal-cyan rounded-full animate-pulse"></div>
            <span className="font-mono">Analyzing browser fingerprint...</span>
          </div>
          <div className="flex items-center space-x-2 text-terminal-cyan">
            <div className="w-2 h-2 bg-terminal-cyan rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            <span className="font-mono">Detecting media devices...</span>
          </div>
          <div className="flex items-center space-x-2 text-terminal-cyan">
            <div className="w-2 h-2 bg-terminal-cyan rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
            <span className="font-mono">Checking permissions...</span>
          </div>
        </div>
      </TerminalWindow>
    );
  }

  return (
    <TerminalWindow title="BROWSER ENVIRONMENT SCAN" status={browserInfo ? "online" : "warning"}>
      {!browserInfo ? (
        <div className="text-center py-8">
          <Monitor className="w-16 h-16 text-terminal-cyan mx-auto mb-4" />
          <p className="text-muted-foreground font-mono mb-6">
            Click to analyze your browser's digital fingerprint
          </p>
          <Button 
            onClick={runBrowserCheck}
            className="bg-terminal-green hover:bg-terminal-green/80 text-terminal-bg font-mono font-semibold"
          >
            <ChevronRight className="w-4 h-4 mr-2" />
            INITIATE SCAN
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Fingerprint Visualization */}
          <Card className="bg-terminal-panel border-terminal-border p-6">
            <h3 className="font-display text-lg font-semibold text-terminal-green mb-4">
              FINGERPRINT ENTROPY ANALYSIS
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={fingerprintData}>
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="hsl(var(--terminal-green))" 
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--terminal-green))', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Core Browser Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-terminal-panel border-terminal-border p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Info className="text-terminal-cyan w-6 h-6" />
                <h3 className="font-display text-lg font-semibold text-terminal-cyan">
                  SYSTEM PROFILE
                </h3>
              </div>
              
              <div className="space-y-3 font-mono text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Platform:</span>
                  <span className="text-terminal-green">{browserInfo.platform}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Language:</span>
                  <span className="text-foreground">{browserInfo.language}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Screen:</span>
                  <span className="text-terminal-amber">{browserInfo.screenResolution}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Timezone:</span>
                  <span className="text-foreground">{browserInfo.timezone}</span>
                </div>
                {browserInfo.deviceMemory && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">RAM:</span>
                    <span className="text-terminal-green">{browserInfo.deviceMemory} GB</span>
                  </div>
                )}
              </div>
            </Card>

            <Card className="bg-terminal-panel border-terminal-border p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Camera className="text-terminal-amber w-6 h-6" />
                <h3 className="font-display text-lg font-semibold text-terminal-amber">
                  MEDIA DEVICES
                </h3>
              </div>
              
              {browserInfo.mediaDevices ? (
                <div className="space-y-3 font-mono text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Microphones:</span>
                    <span className="text-terminal-green">{browserInfo.mediaDevices.audioinput}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Speakers:</span>
                    <span className="text-terminal-green">{browserInfo.mediaDevices.audiooutput}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cameras:</span>
                    <span className="text-terminal-green">{browserInfo.mediaDevices.videoinput}</span>
                  </div>
                  
                  {browserInfo.mediaPermissions && (
                    <>
                      <div className="border-t border-terminal-border pt-3 mt-3">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Camera Access:</span>
                          <span className={`${
                            browserInfo.mediaPermissions.camera === 'granted' ? 'text-destructive' : 'text-terminal-green'
                          }`}>
                            {browserInfo.mediaPermissions.camera.toUpperCase()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Mic Access:</span>
                          <span className={`${
                            browserInfo.mediaPermissions.microphone === 'granted' ? 'text-destructive' : 'text-terminal-green'
                          }`}>
                            {browserInfo.mediaPermissions.microphone.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground font-mono text-sm">
                  Media device enumeration blocked
                </p>
              )}
            </Card>
          </div>

          {/* User Agent Details (Expandable) */}
          <Card className="bg-terminal-panel border-terminal-border p-6">
            <div 
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setExpanded(!expanded)}
            >
              <h3 className="font-display text-lg font-semibold text-terminal-purple">
                USER AGENT STRING
              </h3>
              <ChevronRight 
                className={`w-5 h-5 text-terminal-purple transition-transform ${
                  expanded ? 'rotate-90' : ''
                }`} 
              />
            </div>
            
            {expanded && (
              <div className="mt-4 p-4 bg-muted/30 rounded border border-terminal-border">
                <p className="font-mono text-xs text-muted-foreground break-all">
                  {browserInfo.userAgent}
                </p>
              </div>
            )}
          </Card>

          <Button 
            onClick={runBrowserCheck}
            variant="outline"
            className="w-full border-terminal-border hover:bg-terminal-hover font-mono"
          >
            RE-SCAN ENVIRONMENT
          </Button>
        </div>
      )}
    </TerminalWindow>
  );
};