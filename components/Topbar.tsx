// components/TopBar.tsx
import Image from 'next/image';

export default function TopBar({ user }: { user: any }) {
  return (
    <header className="h-16 bg-white border-bottom border-zinc-200 flex items-center justify-end px-8">
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-medium text-zinc-900">{user?.name}</p>
          <p className="text-xs text-zinc-500">{user?.role}</p>
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
    </header>
  );
}