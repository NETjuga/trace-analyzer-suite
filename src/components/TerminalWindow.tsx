import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface TerminalWindowProps {
  title: string;
  children: ReactNode;
  className?: string;
  status?: "online" | "scanning" | "warning" | "error";
}

export const TerminalWindow = ({ 
  title, 
  children, 
  className,
  status = "online" 
}: TerminalWindowProps) => {
  const statusColors = {
    online: "text-terminal-green",
    scanning: "text-terminal-cyan",
    warning: "text-terminal-amber",
    error: "text-destructive"
  };

  const statusIndicators = {
    online: "●",
    scanning: "◐",
    warning: "◑",
    error: "◯"
  };

  return (
    <div className={cn("terminal-window matrix-bg animate-fade-in-up", className)}>
      <div className="terminal-header">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className={cn("font-mono text-lg animate-glow-pulse", statusColors[status])}>
              {statusIndicators[status]}
            </span>
            <h2 className="font-display text-xl font-semibold text-terminal-green">
              {title}
            </h2>
          </div>
          <div className="text-xs font-mono text-muted-foreground">
            [{status.toUpperCase()}]
          </div>
        </div>
      </div>
      
      <div className="terminal-content">
        {children}
      </div>
    </div>
  );
};