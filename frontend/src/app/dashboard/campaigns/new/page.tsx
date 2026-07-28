"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { UploadCloud, FileText, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import Papa from "papaparse";

export default function NewCampaignPage() {
  const { getToken } = useAuth();
  const router = useRouter();
  
  const [name, setName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [tone, setTone] = useState("Professional");
  
  const [leads, setLeads] = useState<any[]>([]);
  const [fileError, setFileError] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      setFileError("Please upload a valid CSV file");
      return;
    }

    setFileError("");
    
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsedLeads = results.data.map((row: any) => ({
          first_name: row.first_name || row.firstName || row.First_Name || "",
          last_name: row.last_name || row.lastName || row.Last_Name || "",
          email: row.email || row.Email || "",
          company_name: row.company_name || row.companyName || row.Company_Name || row.Company || "",
          website: row.website || row.Website || ""
        })).filter((lead: any) => lead.email); // Must have email
        
        if (parsedLeads.length === 0) {
          setFileError("No valid leads found. Please ensure your CSV has at least an 'email' column.");
          setLeads([]);
        } else {
          setLeads(parsedLeads);
          toast.success(`Successfully parsed ${parsedLeads.length} leads`);
        }
      },
      error: () => {
        setFileError("Failed to parse CSV file");
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !productDescription) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const token = await getToken();
      
      // 1. Create Campaign
      const campaign = await api.campaigns.create({
        name,
        product_description: productDescription,
        tone
      }, token);

      // 2. Upload Leads
      if (leads.length > 0) {
        await api.campaigns.uploadLeads(campaign.id, leads, token);
      }

      toast.success("Campaign created successfully");
      router.push(`/dashboard/campaigns/${campaign.id}`);
    } catch (err: any) {
      toast.error(err.message || "Failed to create campaign");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      <Link href="/dashboard/campaigns" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Back to Campaigns
      </Link>
      
      <div>
        <h1 className="text-3xl font-bold">Create New Campaign</h1>
        <p className="text-slate-400 mt-1">Define your product offering and upload your target leads.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Campaign Name <span className="text-red-500">*</span></label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
              placeholder="e.g. Q3 SaaS Founders Outreach"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Product / Service Description <span className="text-red-500">*</span></label>
            <p className="text-xs text-slate-400 mb-3">Explain what you're selling. The AI uses this to pitch to your leads.</p>
            <textarea 
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
              rows={4}
              className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
              placeholder="We provide an AI-powered lead generation tool that helps B2B sales teams find and engage with their ideal customers automatically..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Email Tone</label>
            <select 
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all appearance-none"
            >
              <option value="Professional">Professional & Direct</option>
              <option value="Friendly">Friendly & Casual</option>
              <option value="Humorous">Witty & Humorous</option>
              <option value="Aggressive">Bold & Persuasive</option>
            </select>
          </div>
        </div>

        <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-4">Upload Leads (Optional)</h2>
          <p className="text-sm text-slate-400 mb-6">
            Upload a CSV file with your leads. Expected columns: <code className="bg-white/10 px-1 py-0.5 rounded">email</code>, <code className="bg-white/10 px-1 py-0.5 rounded">first_name</code>, <code className="bg-white/10 px-1 py-0.5 rounded">last_name</code>, <code className="bg-white/10 px-1 py-0.5 rounded">company_name</code>, <code className="bg-white/10 px-1 py-0.5 rounded">website</code>
          </p>

          <div className="relative border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:bg-white/5 transition-colors group">
            <input 
              type="file" 
              accept=".csv"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            
            {leads.length > 0 ? (
              <div className="flex flex-col items-center">
                <div className="h-12 w-12 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6" />
                </div>
                <p className="font-medium text-green-400">{leads.length} leads ready to upload</p>
                <p className="text-sm text-slate-400 mt-1">Click or drag to replace file</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="h-12 w-12 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <UploadCloud className="h-6 w-6" />
                </div>
                <p className="font-medium">Drop your CSV here, or click to browse</p>
              </div>
            )}
          </div>
          {fileError && <p className="text-red-400 text-sm mt-3">{fileError}</p>}
        </div>

        <div className="flex justify-end gap-4">
          <Link href="/dashboard/campaigns" className="px-6 py-3 rounded-lg font-medium hover:bg-white/5 transition-colors">
            Cancel
          </Link>
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-medium transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)]"
          >
            {isSubmitting ? (
              <><Loader2 className="h-5 w-5 animate-spin" /> Creating...</>
            ) : (
              'Create Campaign'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
