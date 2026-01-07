import Link from 'next/link';
import { Smartphone } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="text-center space-y-6 px-4">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-slate-900 dark:bg-slate-100 mb-4">
          <Smartphone className="w-12 h-12 text-white dark:text-slate-900" />
        </div>
        <h1 className="text-5xl font-bold">Welcome to A2H App</h1>
        <p className="text-xl text-muted-foreground max-w-md mx-auto">
          Experience our Progressive Web App with Add to Home Screen functionality
        </p>
        <div className="pt-4">
          <Link href="/install">
            <button className="text-lg px-8 py-6">
              Go to Install Page
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
