'use client';
import Image from 'next/image';
import { LogOut } from 'lucide-react';
import { useUser } from "@/context/AuthContext";

export default function TopBar({ user }: { user: any }) {
  const { logout } = useUser(); // Access the global logout function

  return (
    <header className="h-16 bg-white border-b border-zinc-200 flex items-center justify-end px-8">
      <div className="flex items-center gap-6">
        {/* User Profile Section */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-medium text-zinc-900">{user?.name}</p>
            <p className="text-xs text-zinc-500">{user?.role || 'User'}</p>
          </div>
          {user?.picture && (
            <Image 
              src={user.picture} 
              alt="Profile" 
              width={36} 
              height={36} 
              className="rounded-full border border-zinc-200"
            />
          )}
        </div>

        {/* Separator */}
        <div className="h-8 w-px bg-zinc-200" />

        {/* Logout Button */}
        <button 
          onClick={logout}
          className="flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-lg transition-all"
        >
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </header>
  );
}