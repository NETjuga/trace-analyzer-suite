import { 
  Shield, 
  Globe, 
  Fingerprint, 
  Lock, 
  FileImage, 
  MapPin, 
  Link, 
  Bot, 
  Wallet,
  LayoutDashboard,
  ArrowLeft
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import type { DashboardView } from "./Dashboard";

interface AppSidebarProps {
  activeView: DashboardView;
  onViewChange: (view: DashboardView) => void;
  onBack: () => void;
}

const menuItems = [
  {
    id: "overview" as DashboardView,
    title: "Dashboard Overview",
    icon: LayoutDashboard,
    description: "System overview and metrics"
  },
  {
    id: "ip-analysis" as DashboardView,
    title: "IP Analysis",
    icon: Globe,
    description: "Location and ISP information"
  },
  {
    id: "browser-fingerprint" as DashboardView,
    title: "Browser Fingerprint",
    icon: Fingerprint,
    description: "Device identification analysis"
  },
  {
    id: "password-security" as DashboardView,
    title: "Password Security",
    icon: Lock,
    description: "Password strength evaluation"
  },
  {
    id: "metadata-extraction" as DashboardView,
    title: "Metadata Extraction",
    icon: FileImage,
    description: "Image metadata analysis"
  },
  {
    id: "geo-mapping" as DashboardView,
    title: "Geo IP Mapping",
    icon: MapPin,
    description: "Geographic IP visualization"
  },
  {
    id: "link-scanner" as DashboardView,
    title: "Link Scanner",
    icon: Link,
    description: "URL threat detection"
  },
  {
    id: "security-assistant" as DashboardView,
    title: "Security Assistant",
    icon: Bot,
    description: "AI-powered security guidance"
  },
  {
    id: "crypto-analysis" as DashboardView,
    title: "Crypto Analysis",
    icon: Wallet,
    description: "Blockchain wallet analysis"
  },
];

export function AppSidebar({ activeView, onViewChange, onBack }: AppSidebarProps) {
  return (
    <Sidebar className="w-80">
      <SidebarHeader className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="font-semibold text-foreground">Security Dashboard</span>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onBack}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Security Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => onViewChange(item.id)}
                    isActive={activeView === item.id}
                    className="w-full justify-start p-3 h-auto"
                  >
                    <item.icon className="h-5 w-5 mr-3 text-primary" />
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{item.title}</span>
                      <span className="text-xs text-muted-foreground">{item.description}</span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="text-xs text-muted-foreground text-center">
          <p>Cyberskoped.online v1.0</p>
          <p className="mt-1">Professional Security Platform</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}