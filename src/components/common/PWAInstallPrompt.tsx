import React, { useState } from 'react';
import { Download, X, Smartphone, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { usePWA } from '@/hooks/usePWA';

export function PWAInstallPrompt() {
  const { isInstallable, isInstalled, installApp } = usePWA();
  const [dismissed, setDismissed] = useState(false);

  // Check if user previously dismissed
  React.useEffect(() => {
    const wasDismissed = localStorage.getItem('regalytics-pwa-dismissed');
    if (wasDismissed) {
      setDismissed(true);
    }
  }, []);

  if (isInstalled || !isInstallable || dismissed) {
    return null;
  }

  const handleInstall = async () => {
    const success = await installApp();
    if (success) {
      setDismissed(true);
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem('regalytics-pwa-dismissed', 'true');
  };

  return (
    <Card className="fixed bottom-4 right-4 w-80 z-50 shadow-lg border-2 border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Download className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-sm">Install Regalytics</CardTitle>
              <CardDescription className="text-xs">
                Get the full app experience
              </CardDescription>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Smartphone className="h-4 w-4" />
            <span>Access from your home screen</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Monitor className="h-4 w-4" />
            <span>Works offline</span>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleInstall} size="sm" className="flex-1">
              <Download className="h-4 w-4 mr-2" />
              Install
            </Button>
            <Button variant="outline" size="sm" onClick={handleDismiss}>
              Later
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
