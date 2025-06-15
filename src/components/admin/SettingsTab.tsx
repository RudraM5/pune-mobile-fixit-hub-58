import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const SettingsTab = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>System Settings</CardTitle>
          <CardDescription>Configure system preferences and notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Business Hours</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span>Monday - Friday</span>
                  <span>9:00 AM - 8:00 PM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Saturday</span>
                  <span>10:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Sunday</span>
                  <span>11:00 AM - 5:00 PM</span>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Contact Information</h3>
              <div className="space-y-2 text-sm">
                <p>📞 +91 98765 43210</p>
                <p>📧 info@mobilerepairwala.com</p>
                <p>📍 Multiple locations in Pune</p>
                <p>💬 WhatsApp support available</p>
              </div>
            </div>
          </div>
          <div className="pt-4">
            <Button>Update Settings</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsTab;