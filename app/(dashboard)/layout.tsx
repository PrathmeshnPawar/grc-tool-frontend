// app/(dashboard)/layout.tsx
'use client';
import { useUser } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/Topbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/"); // Redirect to landing if session is lost
    }
  }, [user, loading, router]);

  if (loading) return <div className="flex h-screen items-center justify-center">Loading Arihant GRC...</div>;

  return (
    <div className="flex h-screen bg-zinc-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar user={user} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}