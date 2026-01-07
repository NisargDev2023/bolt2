import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="text-center space-y-6 px-4">
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
