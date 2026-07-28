"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { api, Campaign, Email } from "@/lib/api";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, Check, Send, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";
import clsx from "clsx";

export default function EmailReviewPage() {
  const params = useParams();
  const id = params.id as string;
  const { getToken } = useAuth();
  const router = useRouter();
  
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [emails, setEmails] = useState<Email[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [editingEmailId, setEditingEmailId] = useState<string | null>(null);
  const [editSubject, setEditSubject] = useState("");
  const [editBody, setEditBody] = useState("");

  const [isApproving, setIsApproving] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const token = await getToken();
        if (token) {
          const [campData, emailsData] = await Promise.all([
            api.campaigns.get(id, token),
            api.campaigns.getEmails(id, token)
          ]);
          setCampaign(campData);
          setEmails(emailsData || []);
        }
      } catch (err) {
        toast.error("Failed to load emails");
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [id, getToken]);

  const handleEditClick = (email: Email) => {
    setEditingEmailId(email.id);
    setEditSubject(email.subject);
    setEditBody(email.body);
  };

  const handleSaveEdit = async (emailId: string) => {
    try {
      const token = await getToken();
      await api.emails.update(emailId, {
        subject: editSubject,
        body: editBody
      }, token);
      
      setEmails(emails.map(e => e.id === emailId ? { ...e, subject: editSubject, body: editBody } : e));
      setEditingEmailId(null);
      toast.success("Email updated successfully");
    } catch (err) {
      toast.error("Failed to update email");
    }
  };

  const handleApprove = async (emailId: string) => {
    try {
      const token = await getToken();
      await api.emails.approve(emailId, token);
      setEmails(emails.map(e => e.id === emailId ? { ...e, status: 'approved' } : e));
      toast.success("Email approved");
    } catch (err) {
      toast.error("Failed to approve email");
    }
  };
  
  const handleApproveAll = async () => {
    const draftIds = emails.filter(e => e.status === 'draft').map(e => e.id);
    if (draftIds.length === 0) return;
    
    setIsApproving(true);
    try {
      const token = await getToken();
      await api.emails.bulkApprove(draftIds, token);
      setEmails(emails.map(e => draftIds.includes(e.id) ? { ...e, status: 'approved' } : e));
      toast.success(`Approved ${draftIds.length} emails`);
    } catch (err) {
      toast.error("Failed to approve all emails");
    } finally {
      setIsApproving(false);
    }
  };

  if (isLoading) {
    return <div className="flex h-64 items-center justify-center"><div className="animate-pulse flex space-x-2"><div className="h-3 w-3 bg-blue-500 rounded-full"></div><div className="h-3 w-3 bg-blue-500 rounded-full animation-delay-200"></div><div className="h-3 w-3 bg-blue-500 rounded-full animation-delay-400"></div></div></div>;
  }

  return (
    <div className="space-y-6 pb-12">
      <Link href={`/dashboard/campaigns/${id}`} className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Back to Campaign
      </Link>

      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Review Emails</h1>
          <p className="text-slate-400 mt-1">Review, edit, and approve AI-generated emails for <span className="text-white font-medium">{campaign?.name}</span>.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={handleApproveAll}
            disabled={isApproving || emails.filter(e => e.status === 'draft').length === 0}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <CheckCircle2 className="h-4 w-4" />
            Approve All Drafts
          </button>
        </div>
      </div>

      {emails.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white/[0.02] border border-white/10 rounded-2xl">
          <Send className="h-12 w-12 text-slate-500 mb-4 opacity-50" />
          <h3 className="text-lg font-medium mb-2">No emails generated yet</h3>
          <p className="text-slate-400 mb-6 text-center max-w-sm">Go back to the campaign page and click Generate Emails to get started.</p>
          <Link href={`/dashboard/campaigns/${id}`} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-medium transition-colors">
            Go to Campaign
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {emails.map(email => (
            <div key={email.id} className={clsx(
              "bg-white/[0.02] border rounded-2xl overflow-hidden transition-all",
              email.status === 'approved' ? "border-green-500/30" : "border-white/10"
            )}>
              <div className="p-4 border-b border-white/10 bg-white/5 flex flex-wrap gap-4 justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center font-bold text-blue-400">
                    {email.lead?.first_name?.charAt(0) || '?'}
                  </div>
                  <div>
                    <h3 className="font-semibold">{email.lead?.first_name} {email.lead?.last_name}</h3>
                    <p className="text-xs text-slate-400">{email.lead?.email} • {email.lead?.company_name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={clsx(
                    "px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider",
                    email.status === 'approved' ? "bg-green-500/20 text-green-400" :
                    email.status === 'sent' ? "bg-blue-500/20 text-blue-400" :
                    "bg-slate-500/20 text-slate-300"
                  )}>
                    {email.status}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                {editingEmailId === email.id ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1">Subject</label>
                      <input 
                        type="text" 
                        value={editSubject}
                        onChange={e => setEditSubject(e.target.value)}
                        className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1">Body</label>
                      <textarea 
                        value={editBody}
                        onChange={e => setEditBody(e.target.value)}
                        rows={6}
                        className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-sans"
                      />
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                      <button 
                        onClick={() => setEditingEmailId(null)}
                        className="px-4 py-2 text-sm text-slate-300 hover:text-white"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={() => handleSaveEdit(email.id)}
                        className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-500 text-white rounded-lg"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="mb-4">
                      <span className="text-sm font-medium text-slate-400 mr-2">Subject:</span>
                      <span className="font-semibold text-lg">{email.subject}</span>
                    </div>
                    <div className="bg-black/30 rounded-lg p-4 text-slate-300 whitespace-pre-wrap font-sans text-sm border border-white/5">
                      {email.body}
                    </div>
                    
                    {email.status === 'draft' && (
                      <div className="flex justify-end gap-3 mt-4">
                        <button 
                          onClick={() => handleEditClick(email)}
                          className="px-4 py-2 text-sm bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleApprove(email.id)}
                          className="px-4 py-2 text-sm flex items-center gap-2 bg-green-600/80 hover:bg-green-500 text-white rounded-lg transition-colors"
                        >
                          <Check className="h-4 w-4" />
                          Approve
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
