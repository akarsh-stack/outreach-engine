"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { api, Campaign } from "@/lib/api";
import Link from "next/link";
import { toast } from "sonner";
import { Layers, Plus } from "lucide-react";

export default function CampaignsPage() {
  const { getToken } = useAuth();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadCampaigns() {
      try {
        const token = await getToken();
        if (token) {
          const data = await api.campaigns.list(token);
          setCampaigns(data || []);
        }
      } catch (err) {
        toast.error("Failed to load campaigns");
      } finally {
        setIsLoading(false);
      }
    }
    loadCampaigns();
  }, [getToken]);

  if (isLoading) {
    return <div className="animate-pulse space-y-4">
      <div className="h-8 w-48 bg-white/10 rounded"></div>
      <div className="h-64 bg-white/5 rounded-2xl"></div>
    </div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Campaigns</h1>
          <p className="text-slate-400 mt-1">Manage your outreach campaigns.</p>
        </div>
        <Link href="/dashboard/campaigns/new" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium transition-colors">
          <Plus className="h-4 w-4" />
          New Campaign
        </Link>
      </div>

      {campaigns.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white/[0.02] border border-white/10 rounded-2xl">
          <Layers className="h-12 w-12 text-slate-500 mb-4" />
          <h3 className="text-lg font-medium mb-2">No campaigns yet</h3>
          <p className="text-slate-400 mb-6 text-center max-w-sm">Create your first campaign to upload leads and start generating personalized emails.</p>
          <Link href="/dashboard/campaigns/new" className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-medium transition-colors">
            Create Campaign
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {campaigns.map(campaign => (
            <Link key={campaign.id} href={`/dashboard/campaigns/${campaign.id}`} className="group block bg-white/[0.02] hover:bg-white/[0.04] border border-white/10 hover:border-blue-500/30 rounded-2xl p-6 transition-all">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-semibold text-lg group-hover:text-blue-400 transition-colors line-clamp-1">{campaign.name}</h3>
                <span className="px-2 py-1 rounded-full text-[10px] uppercase tracking-wider font-semibold bg-white/10 text-slate-300">
                  {campaign.status}
                </span>
              </div>
              <p className="text-slate-400 text-sm line-clamp-2 mb-6 h-10">
                {campaign.product_description}
              </p>
              <div className="flex justify-between items-center text-sm border-t border-white/10 pt-4 mt-auto">
                <div className="flex flex-col">
                  <span className="text-slate-500 text-xs">Leads</span>
                  <span className="font-medium text-slate-300">{campaign.leads_count || 0}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-slate-500 text-xs">Emails</span>
                  <span className="font-medium text-slate-300">{campaign.emails_generated || 0}</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-slate-500 text-xs">Created</span>
                  <span className="font-medium text-slate-300">{new Date(campaign.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
