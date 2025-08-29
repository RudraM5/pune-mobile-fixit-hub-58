import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

const SettingsTab = () => {
  const [settings, setSettings] = useState({
    businessName: "Mobile Repairwala",
    phone: "+91 93256 73075",
    email: "info@mobilerepairwala.com",
    enableNotifications: true,
    enableWhatsApp: true,
    emergencyMode: false
  });

  const handleSave = () => {
    toast.success("Settings updated successfully!");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Business Settings</CardTitle>
          <CardDescription>Configure business information and preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="businessName">Business Name</Label>
                <Input
                  id="businessName"
                  value={settings.businessName}
                  onChange={(e) => setSettings({...settings, businessName: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={settings.phone}
                  onChange={(e) => setSettings({...settings, phone: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings({...settings, email: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Notifications</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="notifications">Enable Notifications</Label>
                  <Switch
                    id="notifications"
                    checked={settings.enableNotifications}
                    onCheckedChange={(checked) => setSettings({...settings, enableNotifications: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="whatsapp">WhatsApp Integration</Label>
                  <Switch
                    id="whatsapp"
                    checked={settings.enableWhatsApp}
                    onCheckedChange={(checked) => setSettings({...settings, enableWhatsApp: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="emergency">Emergency Mode</Label>
                  <Switch
                    id="emergency"
                    checked={settings.emergencyMode}
                    onCheckedChange={(checked) => setSettings({...settings, emergencyMode: checked})}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="pt-4">
            <Button onClick={handleSave}>Update Settings</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsTab;