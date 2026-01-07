'use client';

import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallPage() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [installStatus, setInstallStatus] = useState<'idle' | 'installing' | 'success' | 'dismissed'>('idle');
  const [checkingInstallability, setCheckingInstallability] = useState(true);

  useEffect(() => {
    const syncPrompt = () => {
      const prompt = (window as any).__A2HS_PROMPT__;
      if (prompt && !deferredPrompt) {
        setDeferredPrompt(prompt);
        setIsInstallable(true);
        setCheckingInstallability(false);
        console.log("[A2HS] prompt synced to page");
      }
    };

    // 1️⃣ immediate check
    syncPrompt();

    // 2️⃣ check after page becomes visible (Chrome fires late sometimes)
    document.addEventListener("visibilitychange", syncPrompt);

    const timeout = setTimeout(() => {
      syncPrompt();
      setCheckingInstallability(false); // 👈 stop loader even if not installable
    }, 1500);

    const installedHandler = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setInstallStatus("success");
      setCheckingInstallability(false);
    };

    window.addEventListener("appinstalled", installedHandler);

    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
      setIsInstallable(false);
      setCheckingInstallability(false);
    }

    return () => {
      clearTimeout(timeout);
      document.removeEventListener("visibilitychange", syncPrompt);
      window.removeEventListener("appinstalled", installedHandler);
    };
  }, [deferredPrompt]);

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
            {isInstalled ? (
              <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <div className="flex items-center gap-3">
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

            {checkingInstallability && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin h-8 w-8 rounded-full border-4 border-slate-300 border-t-slate-800 mx-auto mb-4" />
                  <p className="text-sm text-muted-foreground">
                    Checking installation availability…
                  </p>
                </div>
              </div>
            )}
      </div>
    </div>
  );
}
