import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Wallet, TrendingUp, DollarSign, Activity, AlertCircle } from "lucide-react";

interface WalletData {
  address: string;
  balance: string;
  usdValue: string;
  transactions: number;
  firstSeen: string;
  lastActive: string;
  riskScore: "low" | "medium" | "high";
}

export const CryptoWalletAnalyzer = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [walletData, setWalletData] = useState<WalletData | null>(null);

  const handleAnalyze = async () => {
    if (!walletAddress.trim()) return;
    
    setIsAnalyzing(true);
    
    // Simulate API call with mock data
    setTimeout(() => {
      setWalletData({
        address: walletAddress,
        balance: (Math.random() * 100).toFixed(4),
        usdValue: (Math.random() * 50000).toFixed(2),
        transactions: Math.floor(Math.random() * 1000),
        firstSeen: "2023-01-15",
        lastActive: "2024-01-10",
        riskScore: Math.random() > 0.7 ? "high" : Math.random() > 0.4 ? "medium" : "low"
      });
      setIsAnalyzing(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Crypto Wallet Analyzer</h1>
        <p className="text-muted-foreground">
          Analyze cryptocurrency wallet balances and transaction history
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Wallet className="h-5 w-5 text-primary" />
            <span>Wallet Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Input
              placeholder="Enter wallet address (e.g., 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa)"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAnalyze()}
            />
            <Button onClick={handleAnalyze} disabled={isAnalyzing}>
              {isAnalyzing ? "Analyzing..." : "Analyze"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {walletData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Wallet Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Address</p>
                <p className="font-mono text-sm break-all">{walletData.address}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Balance</p>
                  <p className="text-2xl font-bold">{walletData.balance} BTC</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">USD Value</p>
                  <p className="text-2xl font-bold">${walletData.usdValue}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Activity Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Transactions</p>
                  <p className="text-2xl font-bold">{walletData.transactions}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Risk Score</p>
                  <div className={`px-2 py-1 rounded text-sm font-medium ${
                    walletData.riskScore === "high" ? "bg-destructive/20 text-destructive" :
                    walletData.riskScore === "medium" ? "bg-warning/20 text-warning" :
                    "bg-success/20 text-success"
                  }`}>
                    {walletData.riskScore.toUpperCase()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card className="border-primary/50 bg-primary/5">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="font-medium text-primary">Blockchain Intelligence</p>
              <p className="text-sm text-muted-foreground mt-1">
                This analyzer simulates cryptocurrency wallet analysis. In production, it would integrate with 
                blockchain APIs and intelligence services for real wallet balance and transaction data.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};