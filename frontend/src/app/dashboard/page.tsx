"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { api, User, Campaign } from "@/lib/api";
import { BarChart3, Mail, Users, Zap } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function DashboardOverview() {
  const { getToken } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const token = await getToken();
        if (!token) return;

        const [userData, campaignsData] = await Promise.all([
          api.users.me(token).catch(() => null),
          api.campaigns.list(token).catch(() => [])
        ]);

        if (userData) setUser(userData);
        setCampaigns(campaignsData || []);
      } catch (err) {
        toast.error("Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [getToken]);

  if (isLoading) {
    return <div className="flex h-64 items-center justify-center"><div className="animate-pulse flex space-x-2"><div className="h-3 w-3 bg-blue-500 rounded-full"></div><div className="h-3 w-3 bg-blue-500 rounded-full animation-delay-200"></div><div className="h-3 w-3 bg-blue-500 rounded-full animation-delay-400"></div></div></div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Welcome back{user?.name ? `, ${user.name}` : ''}</h1>
        <p className="text-slate-400 mt-2">Here's an overview of your outreach engine.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-slate-400 font-medium">Total Campaigns</h3>
            <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
              <Zap className="h-5 w-5" />
            </div>
          </div>
          <div className="text-3xl font-bold">{campaigns.length}</div>
        </div>

        <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-slate-400 font-medium">Leads Uploaded</h3>
            <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="text-3xl font-bold">
            {campaigns.reduce((acc, curr) => acc + (curr.leads_count || 0), 0)}
          </div>
        </div>

        <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-slate-400 font-medium">Emails Generated</h3>
            <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
              <Mail className="h-5 w-5" />
            </div>
          </div>
          <div className="text-3xl font-bold">
            {campaigns.reduce((acc, curr) => acc + (curr.emails_generated || 0), 0)}
          </div>
        </div>

        <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-slate-400 font-medium">Leads Used This Month</h3>
            <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <BarChart3 className="h-5 w-5" />
            </div>
          </div>
          <div className="text-3xl font-bold">{user?.leads_used_this_month || 0}</div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-12 mb-6">
        <h2 className="text-2xl font-bold">Recent Campaigns</h2>
        <Link href="/dashboard/campaigns/new" className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          + New Campaign
        </Link>
      </div>

      <div className="bg-white/[0.02] border border-white/10 rounded-2xl overflow-hidden">
        {campaigns.length === 0 ? (
          <div className="p-12 text-center text-slate-400 flex flex-col items-center">
            <Mail className="h-12 w-12 mb-4 opacity-50" />
            <p>You haven't created any campaigns yet.</p>
            <Link href="/dashboard/campaigns/new" className="mt-4 text-blue-400 hover:text-blue-300">
              Create your first campaign &rarr;
            </Link>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="p-4 font-medium text-slate-300">Name</th>
                <th className="p-4 font-medium text-slate-300">Status</th>
                <th className="p-4 font-medium text-slate-300">Leads</th>
                <th className="p-4 font-medium text-slate-300">Created</th>
                <th className="p-4 font-medium text-slate-300"></th>
              </tr>
            </thead>
            <tbody>
              {campaigns.slice(0, 5).map(campaign => (
                <tr key={campaign.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-4 font-medium">{campaign.name}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      {campaign.status}
                    </span>
                  </td>
                  <td className="p-4 text-slate-300">{campaign.leads_count || 0}</td>
                  <td className="p-4 text-slate-400 text-sm">{new Date(campaign.created_at).toLocaleDateString()}</td>
                  <td className="p-4 text-right">
                    <Link href={`/dashboard/campaigns/${campaign.id}`} className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
