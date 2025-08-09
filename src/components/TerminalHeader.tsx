import { useState, useEffect } from "react";

export const TerminalHeader = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="terminal-header">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-destructive animate-glow-pulse"></div>
            <div className="w-3 h-3 rounded-full bg-accent animate-glow-pulse" style={{ animationDelay: '0.5s' }}></div>
            <div className="w-3 h-3 rounded-full bg-terminal-green animate-glow-pulse" style={{ animationDelay: '1s' }}></div>
          </div>
          <h1 className="font-display text-3xl font-bold text-terminal-green glow-text">
            FOOTPRINT
            <span className="animate-terminal-cursor ml-1">_</span>
          </h1>
        </div>
        
        <div className="text-right font-mono text-sm">
          <div className="text-terminal-cyan">
            {currentTime.toLocaleDateString()} {currentTime.toLocaleTimeString()}
          </div>
          <div className="text-terminal-amber text-xs">
            SYSTEM STATUS: ONLINE
          </div>
        </div>
      </div>
      
      <p className="text-terminal-cyan mt-2 font-mono text-lg animate-fade-in-up">
        &gt; Catch your digital footprint before someone else does
      </p>
    </header>
  );
};