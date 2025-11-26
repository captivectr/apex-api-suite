import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Plus, Trash2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface WhitelistedIP {
  id: string;
  ip_address: string;
  added_at: string;
}

const Settings = () => {
  const navigate = useNavigate();
  const [settingsKey, setSettingsKey] = useState("");
  const [newIP, setNewIP] = useState("");
  const [whitelistedIPs, setWhitelistedIPs] = useState<WhitelistedIP[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validateSettingsKey = async () => {
    if (!settingsKey.trim()) {
      toast.error("Please enter a settings key");
      return;
    }

    setIsLoading(true);
    const { data, error } = await supabase
      .from("api_keys")
      .select("id")
      .eq("settings_key", settingsKey)
      .single();

    setIsLoading(false);

    if (error || !data) {
      toast.error("Invalid settings key");
      return;
    }

    setIsAuthenticated(true);
    toast.success("Settings key validated");
    loadWhitelistedIPs();
  };

  const loadWhitelistedIPs = async () => {
    const { data: apiKeyData } = await supabase
      .from("api_keys")
      .select("id")
      .eq("settings_key", settingsKey)
      .single();

    if (!apiKeyData) return;

    const { data, error } = await supabase
      .from("whitelisted_ips")
      .select("*")
      .eq("api_key_id", apiKeyData.id)
      .order("added_at", { ascending: false });

    if (!error && data) {
      setWhitelistedIPs(data);
    }
  };

  const addIP = async () => {
    if (!newIP.trim()) {
      toast.error("Please enter an IP address");
      return;
    }

    // Basic IP validation
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!ipRegex.test(newIP)) {
      toast.error("Please enter a valid IP address");
      return;
    }

    const { data: apiKeyData } = await supabase
      .from("api_keys")
      .select("id")
      .eq("settings_key", settingsKey)
      .single();

    if (!apiKeyData) {
      toast.error("Invalid settings key");
      return;
    }

    setIsLoading(true);
    const { error } = await supabase
      .from("whitelisted_ips")
      .insert({
        api_key_id: apiKeyData.id,
        ip_address: newIP.trim(),
      });

    setIsLoading(false);

    if (error) {
      if (error.code === "23505") {
        toast.error("This IP is already whitelisted");
      } else {
        toast.error("Failed to add IP");
      }
      return;
    }

    toast.success("IP added to whitelist");
    setNewIP("");
    loadWhitelistedIPs();
  };

  const removeIP = async (id: string) => {
    setIsLoading(true);
    const { error } = await supabase
      .from("whitelisted_ips")
      .delete()
      .eq("id", id);

    setIsLoading(false);

    if (error) {
      toast.error("Failed to remove IP");
      return;
    }

    toast.success("IP removed from whitelist");
    loadWhitelistedIPs();
  };

  return (
    <div className="min-h-screen bg-background cyber-grid">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-8 text-primary hover:text-primary/80"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <div className="flex items-center gap-4 mb-8">
          <Shield className="h-12 w-12 text-primary glow-text" />
          <div>
            <h1 className="text-4xl font-bold text-primary glow-text">API Settings</h1>
            <p className="text-muted-foreground">Manage your IP whitelist</p>
          </div>
        </div>

        {!isAuthenticated ? (
          <Card className="border-primary/20 bg-card/50 backdrop-blur glow-border">
            <CardHeader>
              <CardTitle className="text-primary">Authenticate</CardTitle>
              <CardDescription>Enter your settings key to manage your API</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Input
                  type="password"
                  placeholder="Enter your settings key"
                  value={settingsKey}
                  onChange={(e) => setSettingsKey(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && validateSettingsKey()}
                  className="bg-input border-primary/30 text-foreground"
                />
                <Button
                  onClick={validateSettingsKey}
                  disabled={isLoading}
                  className="bg-primary hover:bg-primary/80 text-primary-foreground"
                >
                  Validate
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <Card className="border-primary/20 bg-card/50 backdrop-blur glow-border">
              <CardHeader>
                <CardTitle className="text-primary">Add IP to Whitelist</CardTitle>
                <CardDescription>Only whitelisted IPs can use your API key</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <Input
                    placeholder="Enter IP address (e.g., 192.168.1.1)"
                    value={newIP}
                    onChange={(e) => setNewIP(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addIP()}
                    className="bg-input border-primary/30 text-foreground"
                  />
                  <Button
                    onClick={addIP}
                    disabled={isLoading}
                    className="bg-primary hover:bg-primary/80 text-primary-foreground"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add IP
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-card/50 backdrop-blur glow-border">
              <CardHeader>
                <CardTitle className="text-primary">Whitelisted IPs</CardTitle>
                <CardDescription>
                  {whitelistedIPs.length} IP{whitelistedIPs.length !== 1 ? "s" : ""} whitelisted
                </CardDescription>
              </CardHeader>
              <CardContent>
                {whitelistedIPs.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No IPs whitelisted yet. Add one above to get started.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {whitelistedIPs.map((ip) => (
                      <div
                        key={ip.id}
                        className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 border border-primary/10"
                      >
                        <div>
                          <p className="font-mono text-primary">{ip.ip_address}</p>
                          <p className="text-xs text-muted-foreground">
                            Added {new Date(ip.added_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeIP(ip.id)}
                          disabled={isLoading}
                          className="text-destructive hover:text-destructive/80"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
