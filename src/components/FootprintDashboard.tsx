import { useState, useEffect } from "react";
import { TerminalHeader } from "./TerminalHeader";
import { SecurityMetrics } from "./SecurityMetrics";
import { IPLocationAnalyzer } from "./IPLocationAnalyzer";
import { BrowserAnalyzer } from "./BrowserAnalyzer";
import { PasswordAnalyzer } from "./PasswordAnalyzer";
import { MetadataAnalyzer } from "./MetadataAnalyzer";

export const FootprintDashboard = () => {
  const [securityData, setSecurityData] = useState<{
    privacyScore: number;
    exposureLevel: number;
    trackingRisk: number;
    securityGrade: 'A' | 'B' | 'C' | 'D' | 'F';
  }>({
    privacyScore: 65,
    exposureLevel: 78,
    trackingRisk: 82,
    securityGrade: 'C'
  });

  useEffect(() => {
    // Simulate dynamic security score calculation
    const updateSecurityMetrics = () => {
      const scores = [60, 65, 70, 75, 72, 68];
      const randomScore = scores[Math.floor(Math.random() * scores.length)];
      
      let grade: 'A' | 'B' | 'C' | 'D' | 'F' = 'F';
      if (randomScore >= 90) grade = 'A';
      else if (randomScore >= 80) grade = 'B';
      else if (randomScore >= 70) grade = 'C';
      else if (randomScore >= 60) grade = 'D';
      
      setSecurityData({
        privacyScore: randomScore,
        exposureLevel: Math.min(85, randomScore + Math.random() * 20),
        trackingRisk: Math.min(95, randomScore + Math.random() * 30),
        securityGrade: grade
      });
    };

    const interval = setInterval(updateSecurityMetrics, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background matrix-bg">
      {/* Matrix rain effect background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute text-terminal-green opacity-20 font-mono text-xs animate-matrix-rain"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 20}s`,
              animationDuration: `${20 + Math.random() * 10}s`
            }}
          >
            {Array.from({ length: 50 }).map((_, j) => (
              <div key={j} className="mb-1">
                {Math.random() > 0.5 ? '1' : '0'}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 space-y-8">
        <TerminalHeader />
        
        <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <SecurityMetrics data={securityData} />
        </div>
        
        <div className="animate-slide-in-left" style={{ animationDelay: '0.4s' }}>
          <IPLocationAnalyzer />
        </div>
        
        <div className="animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <BrowserAnalyzer />
        </div>
        
        <div className="animate-slide-in-left" style={{ animationDelay: '0.8s' }}>
          <PasswordAnalyzer />
        </div>
        
        <div className="animate-fade-in-up" style={{ animationDelay: '1.0s' }}>
          <MetadataAnalyzer />
        </div>
      </div>

      {/* Terminal footer */}
      <footer className="relative z-10 border-t border-terminal-border bg-terminal-panel/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between text-sm font-mono">
            <div className="text-muted-foreground">
              FOOTPRINT v2.0.1 | Advanced Digital Privacy Analysis
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-terminal-green rounded-full animate-pulse"></div>
                <span className="text-terminal-green">SYSTEM ONLINE</span>
              </div>
              <div className="text-terminal-cyan">
                {new Date().getFullYear()} | SECURITY FIRST
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};