'use client';
import { useUser } from "@/context/AuthContext";
import Link from "next/link";

export default function Home() {
  const { user, loading, login } = useUser();

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black p-8">
      <main className="max-w-4xl w-full text-center sm:text-left space-y-8">
        <header>
           <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-6xl">
            Arihant GRC Tool
          </h1>
          <p className="mt-6 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Enterprise Governance, Risk Management, and Compliance. Securely managed via Spring Boot & OAuth2.
          </p>
        </header>

        <div className="flex flex-col gap-4 sm:flex-row">
          {loading ? (
            <div className="h-12 w-32 animate-pulse bg-zinc-200 dark:bg-zinc-800 rounded-full" />
          ) : user ? (
            <Link
              href="/dashboard"
              className="flex h-12 items-center justify-center rounded-full bg-blue-600 px-8 text-white font-medium hover:bg-blue-700 transition-all"
            >
              Go to Dashboard
            </Link>
          ) : (
            <button
              onClick={login}
              className="flex h-12 items-center justify-center rounded-full bg-zinc-900 px-8 text-white font-medium hover:bg-zinc-800 dark:bg-white dark:text-black transition-all"
            >
              Sign in with Google
            </button>
          )}
          
          <Link
            href="/docs"
            className="flex h-12 items-center justify-center rounded-full border border-zinc-300 px-8 text-zinc-900 font-medium hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900 transition-all"
          >
            Compliance Docs
          </Link>
        </div>
      </main>
    </div>
  );
}