import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Shield, 
  Activity, 
  AlertTriangle, 
  CheckCircle,
  Globe,
  Fingerprint,
  Lock,
  FileImage,
  MapPin,
  Link,
  Bot,
  Wallet
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import type { DashboardView } from "./Dashboard";

interface DashboardOverviewProps {
  onNavigate: (view: DashboardView) => void;
}

const securityMetrics = [
  { name: "IP Security", score: 85, color: "hsl(var(--success))" },
  { name: "Browser Privacy", score: 72, color: "hsl(var(--warning))" },
  { name: "Password Strength", score: 90, color: "hsl(var(--success))" },
  { name: "Metadata Exposure", score: 45, color: "hsl(var(--destructive))" },
];

const quickActions = [
  { id: "ip-analysis", title: "IP Analysis", icon: Globe, description: "Check your IP exposure" },
  { id: "browser-fingerprint", title: "Browser Scan", icon: Fingerprint, description: "Analyze fingerprint" },
  { id: "password-security", title: "Password Check", icon: Lock, description: "Test password strength" },
  { id: "link-scanner", title: "Link Scanner", icon: Link, description: "Scan suspicious URLs" },
  { id: "security-assistant", title: "AI Assistant", icon: Bot, description: "Get security advice" },
  { id: "crypto-analysis", title: "Crypto Wallet", icon: Wallet, description: "Analyze wallet balance" },
];

export const DashboardOverview = ({ onNavigate }: DashboardOverviewProps) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Security Dashboard</h1>
          <p className="text-muted-foreground">Monitor and analyze your digital security posture</p>
        </div>
        <div className="flex items-center space-x-2 bg-card border border-border rounded-lg px-4 py-2">
          <Shield className="h-5 w-5 text-primary" />
          <span className="text-sm font-medium">Security Score: 78%</span>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Scans</p>
                <p className="text-2xl font-bold text-foreground">24</p>
              </div>
              <Activity className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Threats Detected</p>
                <p className="text-2xl font-bold text-destructive">3</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Secure Elements</p>
                <p className="text-2xl font-bold text-success">18</p>
              </div>
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Overall Score</p>
                <p className="text-2xl font-bold text-primary">78%</p>
              </div>
              <Shield className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Security Metrics Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Security Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={securityMetrics}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Bar dataKey="score" fill="hsl(var(--primary))" radius={4} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security Recommendations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Password Strength</span>
                <span>90%</span>
              </div>
              <Progress value={90} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Browser Privacy</span>
                <span>72%</span>
              </div>
              <Progress value={72} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Metadata Security</span>
                <span>45%</span>
              </div>
              <Progress value={45} className="h-2" />
            </div>
            <div className="pt-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onNavigate("metadata-extraction")}
              >
                View Detailed Analysis
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Security Tools</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {quickActions.map((action) => (
              <Button
                key={action.id}
                variant="outline"
                className="h-auto p-4 flex flex-col items-center space-y-2"
                onClick={() => onNavigate(action.id as DashboardView)}
              >
                <action.icon className="h-6 w-6 text-primary" />
                <div className="text-center">
                  <p className="text-sm font-medium">{action.title}</p>
                  <p className="text-xs text-muted-foreground">{action.description}</p>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};