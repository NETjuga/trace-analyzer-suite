import { useState } from "react";
import { Sidebar, SidebarContent, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { IPLocationAnalyzer } from "@/components/IPLocationAnalyzer";
import { BrowserAnalyzer } from "@/components/BrowserAnalyzer";
import { PasswordAnalyzer } from "@/components/PasswordAnalyzer";
import { MetadataAnalyzer } from "@/components/MetadataAnalyzer";
import { GeoIPMapper } from "@/components/GeoIPMapper";
import { LinkScanner } from "@/components/LinkScanner";
import { SecurityAssistant } from "@/components/SecurityAssistant";
import { CryptoWalletAnalyzer } from "@/components/CryptoWalletAnalyzer";
import { DashboardOverview } from "@/components/DashboardOverview";
import { Shield } from "lucide-react";

export type DashboardView = 
  | "overview"
  | "ip-analysis" 
  | "browser-fingerprint"
  | "password-security"
  | "metadata-extraction"
  | "geo-mapping"
  | "link-scanner"
  | "security-assistant"
  | "crypto-analysis";

interface DashboardProps {
  onBack: () => void;
}

export const Dashboard = ({ onBack }: DashboardProps) => {
  const [activeView, setActiveView] = useState<DashboardView>("overview");

  const renderContent = () => {
    switch (activeView) {
      case "overview":
        return <DashboardOverview onNavigate={setActiveView} />;
      case "ip-analysis":
        return <IPLocationAnalyzer />;
      case "browser-fingerprint":
        return <BrowserAnalyzer />;
      case "password-security":
        return <PasswordAnalyzer />;
      case "metadata-extraction":
        return <MetadataAnalyzer />;
      case "geo-mapping":
        return <GeoIPMapper />;
      case "link-scanner":
        return <LinkScanner />;
      case "security-assistant":
        return <SecurityAssistant />;
      case "crypto-analysis":
        return <CryptoWalletAnalyzer />;
      default:
        return <DashboardOverview onNavigate={setActiveView} />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar 
          activeView={activeView}
          onViewChange={setActiveView}
          onBack={onBack}
        />
        
        <main className="flex-1 flex flex-col">
          {/* Header */}
          <header className="border-b border-border bg-card/50 backdrop-blur-sm p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <SidebarTrigger />
                <div className="flex items-center space-x-2">
                  <Shield className="h-6 w-6 text-primary" />
                  <span className="text-xl font-semibold text-foreground">Cyberskoped.online</span>
                </div>
              </div>
              <div className="text-sm text-muted-foreground bg-accent/20 px-3 py-1 rounded-full">
                API Coming Soon
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="flex-1 p-6 overflow-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};