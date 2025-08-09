import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, BarChart, Bar } from "recharts";

interface SecurityMetricsProps {
  data: {
    privacyScore: number;
    exposureLevel: number;
    trackingRisk: number;
    securityGrade: 'A' | 'B' | 'C' | 'D' | 'F';
  };
}

export const SecurityMetrics = ({ data }: SecurityMetricsProps) => {
  const pieData = [
    { name: 'Protected', value: data.privacyScore, color: '#22c55e' },
    { name: 'Exposed', value: 100 - data.privacyScore, color: '#ef4444' }
  ];

  const riskData = [
    { category: 'Browser Fingerprint', risk: data.trackingRisk },
    { category: 'IP Exposure', risk: 75 },
    { category: 'Cookie Tracking', risk: 60 },
    { category: 'Device Info', risk: data.exposureLevel },
  ];

  const gradeColors = {
    'A': 'text-terminal-green',
    'B': 'text-terminal-cyan', 
    'C': 'text-terminal-amber',
    'D': 'text-destructive',
    'F': 'text-destructive'
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Privacy Score */}
      <Card className="terminal-window p-6">
        <div className="text-center">
          <h3 className="font-display text-lg font-semibold text-terminal-cyan mb-4">
            PRIVACY SCORE
          </h3>
          <div className="relative w-32 h-32 mx-auto mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={50}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-terminal-green glow-text">
                {data.privacyScore}%
              </span>
            </div>
          </div>
          <div className={`text-4xl font-display font-bold ${gradeColors[data.securityGrade]} glow-text`}>
            {data.securityGrade}
          </div>
        </div>
      </Card>

      {/* Exposure Metrics */}
      <Card className="terminal-window p-6">
        <h3 className="font-display text-lg font-semibold text-terminal-cyan mb-4">
          EXPOSURE ANALYSIS
        </h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Browser Tracking</span>
              <span className="text-terminal-amber">{data.trackingRisk}%</span>
            </div>
            <Progress value={data.trackingRisk} className="h-2" />
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Device Fingerprint</span>
              <span className="text-terminal-amber">{data.exposureLevel}%</span>
            </div>
            <Progress value={data.exposureLevel} className="h-2" />
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">IP Visibility</span>
              <span className="text-destructive">85%</span>
            </div>
            <Progress value={85} className="h-2" />
          </div>
        </div>
      </Card>

      {/* Risk Analysis Chart */}
      <Card className="terminal-window p-6">
        <h3 className="font-display text-lg font-semibold text-terminal-cyan mb-4">
          RISK ANALYSIS
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={riskData}>
            <XAxis 
              dataKey="category" 
              tick={false}
              axisLine={false}
            />
            <YAxis hide />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
            />
            <Bar 
              dataKey="risk" 
              fill="hsl(var(--terminal-amber))"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};