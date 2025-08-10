import { useState } from "react";
import { TerminalWindow } from "./TerminalWindow";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Shield, Lock, Eye, EyeOff } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

interface PasswordAnalysis {
  score: number;
  crackTime: string;
  strength: 'weak' | 'moderate' | 'strong';
  feedback: string[];
  composition: {
    length: number;
    hasLower: boolean;
    hasUpper: boolean;
    hasNumbers: boolean;
    hasSpecial: boolean;
  };
}

export const PasswordAnalyzer = () => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [analysis, setAnalysis] = useState<PasswordAnalysis | null>(null);

  const analyzePassword = (pwd: string): PasswordAnalysis => {
    const composition = {
      length: pwd.length,
      hasLower: /[a-z]/.test(pwd),
      hasUpper: /[A-Z]/.test(pwd),
      hasNumbers: /[0-9]/.test(pwd),
      hasSpecial: /[^A-Za-z0-9]/.test(pwd),
    };

    let charsetSize = 0;
    if (composition.hasLower) charsetSize += 26;
    if (composition.hasUpper) charsetSize += 26;
    if (composition.hasNumbers) charsetSize += 10;
    if (composition.hasSpecial) charsetSize += 33;

    const entropy = pwd.length * Math.log2(charsetSize || 1);
    const guessesPerSecond = 1e9;
    const seconds = Math.pow(2, entropy) / guessesPerSecond;
    
    const crackTime = formatTime(seconds);
    
    let score = 0;
    if (pwd.length >= 12) score += 25;
    else if (pwd.length >= 8) score += 15;
    
    if (composition.hasLower) score += 15;
    if (composition.hasUpper) score += 15;
    if (composition.hasNumbers) score += 15;
    if (composition.hasSpecial) score += 25;
    
    if (seconds > 1e9) score += 5;

    const feedback = [];
    if (pwd.length < 8) feedback.push("Password too short (minimum 8 characters)");
    if (!composition.hasLower) feedback.push("Add lowercase letters");
    if (!composition.hasUpper) feedback.push("Add uppercase letters");
    if (!composition.hasNumbers) feedback.push("Add numbers");
    if (!composition.hasSpecial) feedback.push("Add special characters (!@#$%^&*)");
    
    const commonPasswords = ["password", "123456", "123456789", "qwerty", "abc123"];
    if (commonPasswords.includes(pwd.toLowerCase())) {
      feedback.push("This is a common password - avoid using it");
      score = Math.min(score, 20);
    }

    let strength: 'weak' | 'moderate' | 'strong' = 'weak';
    if (score >= 70) strength = 'strong';
    else if (score >= 40) strength = 'moderate';

    return { score, crackTime, strength, feedback, composition };
  };

  const formatTime = (seconds: number): string => {
    if (seconds < 1) return "less than 1 second";
    
    const units = [
      { label: "century", sec: 3153600000 },
      { label: "year", sec: 31536000 },
      { label: "month", sec: 2628000 },
      { label: "day", sec: 86400 },
      { label: "hour", sec: 3600 },
      { label: "minute", sec: 60 },
      { label: "second", sec: 1 }
    ];

    for (const unit of units) {
      const quotient = Math.floor(seconds / unit.sec);
      if (quotient >= 1) {
        return `${quotient} ${unit.label}${quotient > 1 ? "s" : ""}`;
      }
    }
    return "less than 1 second";
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (value) {
      setAnalysis(analyzePassword(value));
    } else {
      setAnalysis(null);
    }
  };

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'strong': return 'text-terminal-green';
      case 'moderate': return 'text-terminal-amber';
      default: return 'text-destructive';
    }
  };

  const compositionData = analysis ? [
    { name: 'Length', value: Math.min(analysis.composition.length, 20), max: 20 },
    { name: 'Lowercase', value: analysis.composition.hasLower ? 100 : 0, max: 100 },
    { name: 'Uppercase', value: analysis.composition.hasUpper ? 100 : 0, max: 100 },
    { name: 'Numbers', value: analysis.composition.hasNumbers ? 100 : 0, max: 100 },
    { name: 'Special', value: analysis.composition.hasSpecial ? 100 : 0, max: 100 },
  ] : [];

  return (
    <TerminalWindow title="PASSWORD SECURITY ANALYZER" status={analysis ? "online" : "warning"}>
      <div className="space-y-6">
        <Card className="bg-terminal-panel border-terminal-border p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Lock className="text-terminal-cyan w-6 h-6" />
            <h3 className="font-display text-lg font-semibold text-terminal-cyan">
              PASSWORD INPUT
            </h3>
          </div>
          
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => handlePasswordChange(e.target.value)}
              placeholder="Enter password to analyze..."
              className="bg-terminal-bg border-terminal-border text-terminal-green font-mono pr-12"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-terminal-amber hover:text-terminal-cyan"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
          </div>
        </Card>

        {analysis && (
          <>
            {/* Security Score */}
            <Card className="bg-terminal-panel border-terminal-border p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <Shield className={`w-8 h-8 ${getStrengthColor(analysis.strength)}`} />
                  <div>
                    <h3 className="font-display text-xl font-semibold text-terminal-green">
                      SECURITY ASSESSMENT
                    </h3>
                    <p className={`font-mono text-sm ${getStrengthColor(analysis.strength)}`}>
                      {analysis.strength.toUpperCase()} PASSWORD
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-4xl font-display font-bold ${getStrengthColor(analysis.strength)} glow-text`}>
                    {analysis.score}%
                  </div>
                  <div className="text-xs text-muted-foreground">STRENGTH SCORE</div>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Password Strength</span>
                  <span className={getStrengthColor(analysis.strength)}>{analysis.score}%</span>
                </div>
                <Progress value={analysis.score} className="h-3" />
              </div>

              <div className="bg-muted/30 rounded border border-terminal-border p-4">
                <p className="font-mono text-sm">
                  <span className="text-terminal-cyan">Estimated crack time:</span> {analysis.crackTime}
                </p>
              </div>
            </Card>

            {/* Composition Analysis */}
            <Card className="bg-terminal-panel border-terminal-border p-6">
              <h3 className="font-display text-lg font-semibold text-terminal-purple mb-4">
                COMPOSITION ANALYSIS
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={compositionData} layout="horizontal">
                  <XAxis type="number" domain={[0, 100]} hide />
                  <YAxis 
                    type="category" 
                    dataKey="name" 
                    tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                    width={70}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      fontFamily: 'monospace'
                    }}
                    formatter={(value: any, name: string) => [
                      name === 'Length' ? `${value}/20 chars` : value === 100 ? 'Present' : 'Missing',
                      name
                    ]}
                  />
                  <Bar 
                    dataKey="value" 
                    fill="hsl(var(--terminal-purple))"
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Feedback */}
            {analysis.feedback.length > 0 && (
              <Card className="bg-terminal-panel border-terminal-border p-6">
                <h3 className="font-display text-lg font-semibold text-terminal-amber mb-4">
                  SECURITY RECOMMENDATIONS
                </h3>
                <div className="space-y-2">
                  {analysis.feedback.map((item, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-terminal-amber rounded-full"></div>
                      <span className="font-mono text-sm text-muted-foreground">{item}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </>
        )}

        {!password && (
          <div className="text-center py-8">
            <Lock className="w-16 h-16 text-terminal-cyan mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground font-mono">
              Enter a password above to begin security analysis
            </p>
          </div>
        )}
      </div>
    </TerminalWindow>
  );
};