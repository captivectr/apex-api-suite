import { useNavigate } from "react-router-dom";
import { Shield, Code, Lock, Zap, Settings, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Shield,
      title: "Secure Authentication",
      description: "API key-based authentication with IP whitelisting for maximum security",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Optimized endpoints with minimal latency and maximum throughput",
    },
    {
      icon: Lock,
      title: "IP Whitelisting",
      description: "Restrict API access to specific IPs for enhanced security",
    },
    {
      icon: Code,
      title: "Developer Friendly",
      description: "Clean, well-documented API with intuitive endpoints",
    },
  ];

  const plans = [
    {
      name: "Free",
      price: "$0",
      features: ["1,000 requests/month", "Basic support", "IP whitelisting", "Standard rate limits"],
    },
    {
      name: "Basic",
      price: "$29",
      features: ["50,000 requests/month", "Priority support", "IP whitelisting", "Higher rate limits"],
      highlighted: true,
    },
    {
      name: "Pro",
      price: "$99",
      features: ["500,000 requests/month", "24/7 support", "IP whitelisting", "No rate limits"],
    },
    {
      name: "Enterprise",
      price: "Custom",
      features: ["Unlimited requests", "Dedicated support", "Custom features", "SLA guarantee"],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden cyber-grid">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        
        <nav className="relative border-b border-primary/20 bg-background/50 backdrop-blur">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-8 w-8 text-primary glow-text" />
              <span className="text-2xl font-bold text-primary glow-text">SecureAPI</span>
            </div>
            <Button
              onClick={() => navigate("/settings")}
              variant="outline"
              className="border-primary/30 text-primary hover:bg-primary/10"
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </div>
        </nav>

        <div className="relative container mx-auto px-4 py-24 text-center">
          <div className="inline-block mb-4 px-4 py-2 rounded-full border border-primary/30 bg-primary/5">
            <span className="text-sm text-primary font-medium">🔒 Enterprise-Grade Security</span>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold mb-6 glow-text bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary to-primary/70">
            Secure API Access
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Professional API management with IP whitelisting, rate limiting, and advanced security features.
            Built for developers who prioritize security.
          </p>

          <div className="flex gap-4 justify-center mb-16">
            <Button 
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground glow-border"
            >
              <Terminal className="mr-2 h-5 w-5" />
              Get Started
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-primary/30 text-primary hover:bg-primary/10"
            >
              View Docs
            </Button>
          </div>

          {/* Add your catbox images here */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="border-primary/20 bg-card/50 backdrop-blur glow-border overflow-hidden">
              <div className="h-64 bg-gradient-to-br from-primary/20 to-transparent flex items-center justify-center">
                <Terminal className="h-24 w-24 text-primary opacity-50" />
              </div>
              <CardContent className="pt-4">
                <p className="text-sm text-muted-foreground">Replace with your catbox image</p>
              </CardContent>
            </Card>
            <Card className="border-primary/20 bg-card/50 backdrop-blur glow-border overflow-hidden">
              <div className="h-64 bg-gradient-to-br from-primary/20 to-transparent flex items-center justify-center">
                <Shield className="h-24 w-24 text-primary opacity-50" />
              </div>
              <CardContent className="pt-4">
                <p className="text-sm text-muted-foreground">Replace with your catbox image</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-primary mb-4 glow-text">Why Choose SecureAPI?</h2>
          <p className="text-muted-foreground text-lg">
            Industry-leading security features designed for modern applications
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border-primary/20 bg-card/50 backdrop-blur hover:glow-border transition-all duration-300"
            >
              <CardHeader>
                <feature.icon className="h-12 w-12 text-primary mb-4" />
                <CardTitle className="text-primary">{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>

      {/* Pricing Section */}
      <div className="container mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-primary mb-4 glow-text">Simple, Transparent Pricing</h2>
          <p className="text-muted-foreground text-lg">
            Choose the plan that fits your needs
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`border-primary/20 bg-card/50 backdrop-blur ${
                plan.highlighted ? "ring-2 ring-primary glow-border" : ""
              }`}
            >
              <CardHeader>
                {plan.highlighted && (
                  <div className="text-xs text-primary font-semibold mb-2">MOST POPULAR</div>
                )}
                <CardTitle className="text-primary text-2xl">{plan.name}</CardTitle>
                <div className="text-4xl font-bold text-primary mt-4">{plan.price}</div>
                {plan.price !== "Custom" && <div className="text-muted-foreground">/month</div>}
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-center gap-2 text-sm">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className={`w-full mt-6 ${
                    plan.highlighted
                      ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                      : "border-primary/30 text-primary hover:bg-primary/10"
                  }`}
                  variant={plan.highlighted ? "default" : "outline"}
                >
                  Get Started
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-primary/20 bg-card/30 backdrop-blur">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold text-primary">SecureAPI</span>
          </div>
          <p className="text-sm">© 2024 SecureAPI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
