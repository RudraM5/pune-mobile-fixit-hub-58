import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface PWAState {
  isInstallable: boolean;
  isInstalled: boolean;
  isOffline: boolean;
  installPrompt: BeforeInstallPromptEvent | null;
}

export function usePWA() {
  const [pwaState, setPWAState] = useState<PWAState>({
    isInstallable: false,
    isInstalled: false,
    isOffline: !navigator.onLine,
    installPrompt: null
  });

  useEffect(() => {
    // Check if already installed
    const isInstalled = window.matchMedia('(display-mode: standalone)').matches || 
                       (window.navigator as any).standalone === true;
    
    setPWAState(prev => ({ ...prev, isInstalled }));

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('PWA: Install prompt available');
      e.preventDefault();
      setPWAState(prev => ({
        ...prev,
        isInstallable: true,
        installPrompt: e as BeforeInstallPromptEvent
      }));
    };

    // Listen for successful installation
    const handleAppInstalled = () => {
      console.log('PWA: App installed successfully');
      setPWAState(prev => ({
        ...prev,
        isInstallable: false,
        isInstalled: true,
        installPrompt: null
      }));
    };

    // Listen for online/offline status
    const handleOnline = () => {
      console.log('PWA: Connection restored');
      setPWAState(prev => ({ ...prev, isOffline: false }));
    };

    const handleOffline = () => {
      console.log('PWA: Connection lost');
      setPWAState(prev => ({ ...prev, isOffline: true }));
    };

    // Add event listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Register service worker
    if ('serviceWorker' in navigator) {
      registerServiceWorker();
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const registerServiceWorker = async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('PWA: Service Worker registered successfully', registration);

      // Listen for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('PWA: New version available');
              // Could show update notification here
            }
          });
        }
      });
    } catch (error) {
      console.error('PWA: Service Worker registration failed', error);
    }
  };

  const installApp = async () => {
    if (!pwaState.installPrompt) {
      console.log('PWA: No install prompt available');
      return false;
    }

    try {
      console.log('PWA: Showing install prompt');
      await pwaState.installPrompt.prompt();
      const choice = await pwaState.installPrompt.userChoice;
      
      console.log('PWA: User choice:', choice.outcome);
      
      if (choice.outcome === 'accepted') {
        setPWAState(prev => ({
          ...prev,
          isInstallable: false,
          installPrompt: null
        }));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('PWA: Install failed', error);
      return false;
    }
  };

  const shareApp = async (data?: { title?: string; text?: string; url?: string }) => {
    const shareData = {
      title: data?.title || 'Mobile Repairwala - Mobile Repair Service',
      text: data?.text || 'Professional mobile repair services in Pune with same-day fixes and 6-month warranty.',
      url: data?.url || window.location.origin
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        console.log('PWA: Content shared successfully');
        return true;
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(shareData.url);
        console.log('PWA: URL copied to clipboard');
        return true;
      }
    } catch (error) {
      console.error('PWA: Share failed', error);
      return false;
    }
  };

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      console.log('PWA: Notifications not supported');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission === 'denied') {
      console.log('PWA: Notification permission denied');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      console.log('PWA: Notification permission:', permission);
      return permission === 'granted';
    } catch (error) {
      console.error('PWA: Notification permission request failed', error);
      return false;
    }
  };

  const showNotification = (title: string, options?: NotificationOptions) => {
    if (Notification.permission === 'granted') {
      const notificationOptions: NotificationOptions = {
        icon: '/icons/icon-192x192.png',
        badge: '/icons/badge-72x72.png',
        ...options
      };

      const notification = new Notification(title, notificationOptions);

      // Auto-close after 5 seconds
      setTimeout(() => notification.close(), 5000);
      
      return notification;
    }
    return null;
  };

  return {
    ...pwaState,
    installApp,
    shareApp,
    requestNotificationPermission,
    showNotification
  };
}