"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { api, Campaign, Lead } from "@/lib/api";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, Bot, ExternalLink, Loader2, Mail, Users } from "lucide-react";
import Link from "next/link";
import clsx from "clsx";

export default function CampaignDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { getToken } = useAuth();
  
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const token = await getToken();
        if (token) {
          const [campData, leadsData] = await Promise.all([
            api.campaigns.get(id, token),
            api.campaigns.getLeads(id, token)
          ]);
          setCampaign(campData);
          setLeads(leadsData || []);
        }
      } catch (err) {
        toast.error("Failed to load campaign details");
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [id, getToken]);

  const handleGenerateEmails = async () => {
    if (leads.length === 0) {
      toast.error("Upload leads before generating emails");
      return;
    }
    
    setIsGenerating(true);
    try {
      const token = await getToken();
      await api.campaigns.generateEmails(id, token);
      toast.success("Started generating emails! This might take a few minutes.");
      
      // Refresh status
      const campData = await api.campaigns.get(id, token);
      setCampaign(campData);
    } catch (err: any) {
      toast.error(err.message || "Failed to generate emails");
    } finally {
      setIsGenerating(false);
    }
  };

  if (isLoading) {
    return <div className="flex h-64 items-center justify-center"><div className="animate-pulse flex space-x-2"><div className="h-3 w-3 bg-blue-500 rounded-full"></div><div className="h-3 w-3 bg-blue-500 rounded-full animation-delay-200"></div><div className="h-3 w-3 bg-blue-500 rounded-full animation-delay-400"></div></div></div>;
  }

  if (!campaign) {
    return <div className="text-center py-12">Campaign not found</div>;
  }

  return (
    <div className="space-y-6">
      <Link href="/dashboard/campaigns" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Back to Campaigns
      </Link>

      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold">{campaign.name}</h1>
            <span className="px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider bg-white/10 text-slate-300">
              {campaign.status}
            </span>
          </div>
          <p className="text-slate-400 max-w-2xl line-clamp-2">{campaign.product_description}</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Link 
            href={`/dashboard/campaigns/${id}/review`}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <Mail className="h-4 w-4" />
            Review Emails
          </Link>
          
          <button 
            onClick={handleGenerateEmails}
            disabled={isGenerating || campaign.status === 'generating'}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-[0_0_15px_rgba(59,130,246,0.3)]"
          >
            {isGenerating || campaign.status === 'generating' ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Generating...</>
            ) : (
              <><Bot className="h-4 w-4" /> Generate Emails</>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-5">
          <div className="flex items-center gap-3 text-slate-400 mb-2">
            <Users className="h-5 w-5" />
            <span className="font-medium">Total Leads</span>
          </div>
          <p className="text-3xl font-semibold">{leads.length}</p>
        </div>
        
        <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-5">
          <div className="flex items-center gap-3 text-slate-400 mb-2">
            <Mail className="h-5 w-5" />
            <span className="font-medium">Emails Generated</span>
          </div>
          <p className="text-3xl font-semibold">{campaign.emails_generated || 0}</p>
        </div>
      </div>

      <div className="bg-white/[0.02] border border-white/10 rounded-2xl overflow-hidden mt-8">
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Leads</h2>
        </div>
        
        {leads.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p>No leads found for this campaign.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  <th className="p-4 font-medium text-slate-300">Name</th>
                  <th className="p-4 font-medium text-slate-300">Company</th>
                  <th className="p-4 font-medium text-slate-300">Email</th>
                  <th className="p-4 font-medium text-slate-300">Status</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 font-medium">
                      {lead.first_name} {lead.last_name}
                    </td>
                    <td className="p-4 text-slate-300">
                      <div className="flex items-center gap-2">
                        {lead.company_name}
                        {lead.website && (
                          <a href={lead.website.startsWith('http') ? lead.website : `https://${lead.website}`} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-blue-400">
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-slate-400">{lead.email}</td>
                    <td className="p-4">
                      <span className={clsx(
                        "px-2 py-1 rounded-full text-xs font-medium border",
                        lead.status === 'pending' ? "bg-slate-500/10 text-slate-400 border-slate-500/20" :
                        lead.status === 'researched' ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                        "bg-green-500/10 text-green-400 border-green-500/20"
                      )}>
                        {lead.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
