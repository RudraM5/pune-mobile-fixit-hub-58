import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, X, Smartphone, Wifi } from "lucide-react";
import { usePWA } from "@/hooks/usePWA";
import { Badge } from "@/components/ui/badge";

export function InstallPrompt() {
  const { isInstallable, isInstalled, isOffline, installApp } = usePWA();
  const [isInstalling, setIsInstalling] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  // Don't show if already installed, dismissed, or not installable
  if (isInstalled || isDismissed || !isInstallable) {
    return null;
  }

  const handleInstall = async () => {
    setIsInstalling(true);
    try {
      const success = await installApp();
      if (success) {
        setIsDismissed(true);
      }
    } catch (error) {
      console.error('Installation failed:', error);
    } finally {
      setIsInstalling(false);
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
  };

  return (
    <Card className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 z-50 shadow-2xl border-primary/20 bg-card/95 backdrop-blur-sm animate-slide-up">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
            <Smartphone className="w-6 h-6 text-primary" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-sm">Install FixMyPhone</h3>
              <Badge variant="secondary" className="text-xs">
                PWA
              </Badge>
            </div>
            
            <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
              Get instant access, work offline, and receive push notifications for your repairs.
            </p>
            
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
              <Wifi className="w-3 h-3" />
              <span>Works offline</span>
              <span className="w-1 h-1 bg-muted-foreground rounded-full"></span>
              <span>Push notifications</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                size="sm" 
                onClick={handleInstall}
                disabled={isInstalling}
                className="flex-1 h-8 text-xs"
              >
                {isInstalling ? (
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin"></div>
                    Installing...
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <Download className="w-3 h-3" />
                    Install App
                  </div>
                )}
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleDismiss}
                className="h-8 w-8 p-0"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function OfflineIndicator() {
  const { isOffline } = usePWA();

  if (!isOffline) {
    return null;
  }

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-slide-in-down">
      <Badge variant="destructive" className="bg-orange-500 hover:bg-orange-600">
        <Wifi className="w-3 h-3 mr-1" />
        You're offline
      </Badge>
    </div>
  );
}