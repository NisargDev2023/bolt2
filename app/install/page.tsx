'use client';

import { useState, useEffect } from 'react';
import { Download, Smartphone, Check, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallPage() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [installStatus, setInstallStatus] = useState<'idle' | 'installing' | 'success' | 'dismissed'>('idle');

  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered successfully:', registration);
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    }

    const handler = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);
      setIsInstallable(true);
      console.log('beforeinstallprompt event fired');
    };

    window.addEventListener('beforeinstallprompt', handler);

    const installedHandler = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setInstallStatus('success');
      console.log('PWA was installed');
    };

    window.addEventListener('appinstalled', installedHandler);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      setIsInstallable(false);
      console.log('App is in standalone mode');
    }

    console.log('Install page mounted');

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('appinstalled', installedHandler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      return;
    }

    setInstallStatus('installing');

    deferredPrompt.prompt();

    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setInstallStatus('success');
      console.log('User accepted the install prompt');
    } else {
      setInstallStatus('dismissed');
      console.log('User dismissed the install prompt');
    }

    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-900 dark:bg-slate-100 mb-4">
            <Smartphone className="w-10 h-10 text-white dark:text-slate-900" />
          </div>
          <h1 className="text-4xl font-bold mb-2">Install Our App</h1>
          <p className="text-lg text-muted-foreground">
            Add this app to your home screen for quick and easy access
          </p>
        </div>

              <Download className="w-5 h-5" />
              Add to Home Screen

              Install this app on your device for a native app experience

            {isInstalled ? (
              <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    <Check className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-green-900 dark:text-green-100">
                      App Already Installed
                    </h3>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      This app is already installed on your device or running in standalone mode
                    </p>
                  </div>
                </div>
              </div>
            ) : installStatus === 'success' ? (
              <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    <Check className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-green-900 dark:text-green-100">
                      Installation Successful!
                    </h3>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      The app has been added to your home screen
                    </p>
                  </div>
                </div>
              </div>
            ) : installStatus === 'dismissed' ? (
              <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    <X className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-amber-900 dark:text-amber-100">
                      Installation Cancelled
                    </h3>
                    <p className="text-sm text-amber-700 dark:text-amber-300">
                      You can install the app later by clicking the button again
                    </p>
                  </div>
                </div>
              </div>
            ) : null}

            {isInstallable && (
              <button
                onClick={handleInstallClick}
                disabled={installStatus === 'installing'}
                className="w-full"
              >
                <Download className="w-5 h-5 mr-2" />
                {installStatus === 'installing' ? 'Installing...' : 'Add to Home Screen'}
              </button>
            )}

            {!isInstallable && !isInstalled && installStatus === 'idle' && (
              <div className="bg-slate-50 dark:bg-slate-900 border rounded-lg p-4">
                <h3 className="font-semibold mb-2">Installation Not Available</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  The install prompt is not available. This could be because:
                </p>
                <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                  <li>The app is already installed</li>
                  <li>You are not on a mobile device</li>
                  <li>Your browser does not support PWA installation</li>
                  <li>The site is not served over HTTPS (in production)</li>
                </ul>
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm font-medium mb-2">Manual Installation:</p>
                  <p className="text-sm text-muted-foreground">
                    You can manually add this site to your home screen using your browser&apos;s menu:
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside mt-2">
                    <li><strong>iOS Safari:</strong> Tap Share → Add to Home Screen</li>
                    <li><strong>Android Chrome:</strong> Tap Menu → Add to Home Screen</li>
                  </ul>
                </div>
              </div>
            )}

            <div className="border-t pt-6">
              <h3 className="font-semibold mb-3">Benefits of Installing</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Quick Access</p>
                    <p className="text-sm text-muted-foreground">
                      Launch directly from your home screen
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Offline Support</p>
                    <p className="text-sm text-muted-foreground">
                      Works even without an internet connection
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Full Screen Experience</p>
                    <p className="text-sm text-muted-foreground">
                      Runs like a native mobile app
                    </p>
                  </div>
                </div>
              </div>
            </div>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>
            This is a Progressive Web App (PWA) that can be installed on your device
          </p>
        </div>
      </div>
    </div>
  );
}
