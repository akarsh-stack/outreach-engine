import { UserButton } from "@clerk/nextjs";
import { BarChart3, Bot, CreditCard, LayoutDashboard, Megaphone, Settings } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-[#050714] text-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 bg-[#0a0e27]/50 backdrop-blur flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-white/10">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Bot className="h-6 w-6 text-blue-500" />
            <span className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              Outreach Engine
            </span>
          </Link>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-colors">
            <LayoutDashboard className="h-5 w-5" />
            Overview
          </Link>
          <Link href="/dashboard/campaigns" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-colors">
            <Megaphone className="h-5 w-5" />
            Campaigns
          </Link>
          <Link href="/dashboard/billing" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-colors">
            <CreditCard className="h-5 w-5" />
            Billing
          </Link>
          <Link href="/dashboard/settings" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-colors">
            <Settings className="h-5 w-5" />
            Settings
          </Link>
        </nav>
        
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-3 py-2">
            <UserButton afterSignOutUrl="/" appearance={{ elements: { userButtonAvatarBox: "h-8 w-8" } }} />
            <span className="text-sm font-medium text-slate-300">My Account</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
