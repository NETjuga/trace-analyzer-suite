import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Bot, Send, Code, Shield, Lightbulb, AlertCircle } from "lucide-react";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  type?: "code" | "text" | "security";
}

const securityPrompts = [
  "Generate a secure authentication middleware for Express.js",
  "How to implement JWT token validation with refresh tokens?",
  "Create a SQL injection prevention strategy",
  "Best practices for API rate limiting and security headers",
  "Generate a secure password hashing implementation",
  "How to implement CORS security properly?"
];

export const SecurityAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm your cybersecurity assistant. I specialize in generating secure backend code and providing theoretical cybersecurity guidance. How can I help you today?",
      isUser: false,
      timestamp: new Date(),
      type: "text"
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isThinking, setIsThinking] = useState(false);

  const generateMockResponse = (prompt: string): { content: string; type: "code" | "text" | "security" } => {
    if (prompt.toLowerCase().includes("code") || prompt.toLowerCase().includes("implement")) {
      return {
        content: `// Secure implementation based on your request
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Example secure authentication middleware
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

// Secure password hashing
const hashPassword = async (password) => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

module.exports = { authenticateToken, hashPassword };`,
        type: "code" as const
      };
    } else if (prompt.toLowerCase().includes("security") || prompt.toLowerCase().includes("threat")) {
      return {
        content: `🔐 **Security Analysis & Recommendations**

Based on your query, here are key security considerations:

**1. Authentication & Authorization**
- Implement multi-factor authentication (MFA)
- Use strong password policies (minimum 12 characters)
- Implement proper session management
- Regular token rotation and validation

**2. Data Protection**
- Encrypt sensitive data at rest and in transit
- Use HTTPS/TLS 1.3 for all communications
- Implement proper input validation and sanitization
- Regular security audits and penetration testing

**3. Infrastructure Security**
- Keep all dependencies and systems updated
- Implement proper firewall rules and network segmentation
- Use principle of least privilege for access control
- Regular backup and disaster recovery procedures

**4. Monitoring & Incident Response**
- Implement comprehensive logging and monitoring
- Set up automated threat detection systems
- Have an incident response plan ready
- Regular security training for team members

Would you like me to elaborate on any of these points or generate specific code implementations?`,
        type: "security" as const
      };
    } else {
      return {
        content: `I understand you're asking about "${prompt}". Here's my analysis:

**Key Considerations:**
- Always validate and sanitize user inputs
- Implement proper error handling without exposing sensitive information
- Use parameterized queries to prevent SQL injection
- Apply rate limiting to prevent abuse
- Implement proper logging for security monitoring

**Best Practices:**
- Follow the principle of least privilege
- Use established security frameworks and libraries
- Regular security code reviews
- Automated security testing in CI/CD pipeline

Would you like me to generate specific code examples or dive deeper into any particular aspect?`,
        type: "text" as const
      };
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      isUser: true,
      timestamp: new Date(),
      type: "text"
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsThinking(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const response = generateMockResponse(inputMessage);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.content,
        isUser: false,
        timestamp: new Date(),
        type: response.type
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsThinking(false);
    }, 1500);
  };

  const handlePromptClick = (prompt: string) => {
    setInputMessage(prompt);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Security Assistant</h1>
        <p className="text-muted-foreground">
          AI-powered cybersecurity expert for code generation and security guidance
        </p>
      </div>

      {/* Quick Prompts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            <span>Quick Security Prompts</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {securityPrompts.map((prompt, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="text-left justify-start h-auto p-3"
                onClick={() => handlePromptClick(prompt)}
              >
                {prompt}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Chat Messages */}
      <Card className="h-96 flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bot className="h-5 w-5 text-primary" />
            <span>Security Consultation</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col space-y-4 overflow-hidden">
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.isUser
                      ? 'bg-primary text-primary-foreground'
                      : message.type === 'code'
                      ? 'bg-muted border border-border'
                      : message.type === 'security'
                      ? 'bg-accent/20 border border-accent/30'
                      : 'bg-muted'
                  }`}
                >
                  {message.type === 'code' && !message.isUser && (
                    <div className="flex items-center space-x-2 mb-2 text-sm text-primary">
                      <Code className="h-4 w-4" />
                      <span>Generated Code</span>
                    </div>
                  )}
                  {message.type === 'security' && !message.isUser && (
                    <div className="flex items-center space-x-2 mb-2 text-sm text-accent">
                      <Shield className="h-4 w-4" />
                      <span>Security Analysis</span>
                    </div>
                  )}
                  <pre className={`whitespace-pre-wrap text-sm ${message.type === 'code' ? 'font-mono' : ''}`}>
                    {message.content}
                  </pre>
                  <div className="text-xs opacity-70 mt-2">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
            {isThinking && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg p-3 max-w-[80%]">
                  <div className="flex items-center space-x-2">
                    <Bot className="h-4 w-4 text-primary animate-pulse" />
                    <span className="text-sm">AI is analyzing your security requirements...</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Section */}
          <div className="flex space-x-2 border-t pt-4">
            <Input
              placeholder="Ask about cybersecurity best practices, code generation, or theoretical security concepts..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              disabled={isThinking}
            />
            <Button onClick={handleSendMessage} disabled={isThinking || !inputMessage.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <Card className="border-warning/50 bg-warning/5">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-warning mt-0.5" />
            <div>
              <p className="font-medium text-warning">AI Assistant Notice</p>
              <p className="text-sm text-muted-foreground mt-1">
                This is a demonstration of AI-powered security assistance. In production, this would integrate 
                with OpenAI GPT-4o Mini for real-time cybersecurity code generation and security analysis.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};