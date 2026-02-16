// components/Sidebar.tsx
import Link from 'next/link';
import { LayoutDashboard, ShieldAlert, FileText, ClipboardCheck } from 'lucide-react';

const menuItems = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Risk Management', href: '/dashboard/risks', icon: ShieldAlert },
  { name: 'Policies', href: '/dashboard/policies', icon: FileText },
  { name: 'Audit Logs', href: '/dashboard/audit-logs', icon: ClipboardCheck },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-zinc-200 flex flex-col">
      <div className="p-6 font-bold text-xl text-blue-600">Arihant GRC</div>
      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => (
          <Link key={item.name} href={item.href} className="flex items-center gap-3 p-3 text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors">
            <item.icon size={20} />
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}