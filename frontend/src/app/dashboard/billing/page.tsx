"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { api, User } from "@/lib/api";
import { toast } from "sonner";
import { Check, CreditCard, Loader2, Zap } from "lucide-react";
import clsx from "clsx";

export default function BillingPage() {
  const { getToken } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    async function loadUser() {
      try {
        const token = await getToken();
        if (token) {
          const userData = await api.users.me(token);
          setUser(userData);
        }
      } catch (err) {
        toast.error("Failed to load billing info");
      } finally {
        setIsLoading(false);
      }
    }
    loadUser();
  }, [getToken]);

  const handleSubscribe = async () => {
    setIsProcessing(true);
    try {
      const token = await getToken();
      const session = await api.billing.checkout(token);
      if (session?.url) {
        window.location.href = session.url;
      } else {
        toast.error("Failed to create checkout session");
      }
    } catch (err: any) {
      toast.error(err.message || "Checkout failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleManageBilling = async () => {
    setIsProcessing(true);
    try {
      const token = await getToken();
      const session = await api.billing.portal(token);
      if (session?.url) {
        window.location.href = session.url;
      } else {
        toast.error("Failed to open billing portal");
      }
    } catch (err: any) {
      toast.error(err.message || "Portal access failed");
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return <div className="flex h-64 items-center justify-center"><div className="animate-pulse flex space-x-2"><div className="h-3 w-3 bg-blue-500 rounded-full"></div><div className="h-3 w-3 bg-blue-500 rounded-full animation-delay-200"></div><div className="h-3 w-3 bg-blue-500 rounded-full animation-delay-400"></div></div></div>;
  }

  const isPro = user?.plan === "pro";

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Billing & Plans</h1>
        <p className="text-slate-400 mt-1">Manage your subscription and usage limits.</p>
      </div>

      <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold mb-1">Current Plan: <span className="capitalize text-blue-400">{user?.plan || 'Free'}</span></h2>
            <p className="text-slate-400 text-sm">
              You have used <strong className="text-white">{user?.leads_used_this_month || 0}</strong> of your monthly leads limit.
            </p>
          </div>
          {isPro ? (
            <button 
              onClick={handleManageBilling}
              disabled={isProcessing}
              className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />}
              Manage Billing
            </button>
          ) : null}
        </div>
        
        <div className="mt-6">
          <div className="w-full bg-black/40 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ width: `${Math.min(100, ((user?.leads_used_this_month || 0) / (isPro ? 5000 : 100)) * 100)}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-2 text-xs text-slate-400">
            <span>0</span>
            <span>{isPro ? '5,000 Leads' : '100 Leads'}</span>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Free Plan */}
        <div className={clsx(
          "bg-white/[0.02] border rounded-2xl p-8 relative overflow-hidden transition-all",
          !isPro ? "border-blue-500/50 shadow-[0_0_30px_rgba(59,130,246,0.1)]" : "border-white/10 opacity-70"
        )}>
          {!isPro && (
            <div className="absolute top-0 right-0 bg-blue-500/20 text-blue-400 text-xs font-bold px-3 py-1 rounded-bl-lg">
              CURRENT
            </div>
          )}
          <h3 className="text-2xl font-bold mb-2">Starter</h3>
          <div className="flex items-baseline gap-1 mb-6">
            <span className="text-4xl font-extrabold">$0</span>
            <span className="text-slate-400">/month</span>
          </div>
          
          <ul className="space-y-4 mb-8">
            {['100 Leads per month', 'Basic AI personalization', 'Standard email sequences', 'Community support'].map((feature, i) => (
              <li key={i} className="flex items-center gap-3 text-slate-300">
                <Check className="h-5 w-5 text-blue-500 flex-shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          
          <button 
            disabled
            className="w-full py-3 px-4 bg-white/5 text-slate-400 rounded-lg font-medium cursor-not-allowed"
          >
            {!isPro ? 'Active' : 'Downgrade in Portal'}
          </button>
        </div>

        {/* Pro Plan */}
        <div className={clsx(
          "bg-white/[0.02] border rounded-2xl p-8 relative overflow-hidden transition-all",
          isPro ? "border-blue-500/50 shadow-[0_0_30px_rgba(59,130,246,0.1)]" : "border-white/10 hover:border-white/20"
        )}>
          {isPro && (
            <div className="absolute top-0 right-0 bg-blue-500/20 text-blue-400 text-xs font-bold px-3 py-1 rounded-bl-lg">
              CURRENT
            </div>
          )}
          {!isPro && (
            <div className="absolute -right-12 top-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold px-12 py-1 rotate-45 shadow-lg">
              POPULAR
            </div>
          )}
          <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
            Pro <Zap className="h-5 w-5 text-amber-400" />
          </h3>
          <div className="flex items-baseline gap-1 mb-6">
            <span className="text-4xl font-extrabold">$49</span>
            <span className="text-slate-400">/month</span>
          </div>
          
          <ul className="space-y-4 mb-8">
            {['5,000 Leads per month', 'Advanced AI scraping & research', 'Custom follow-up schedules', 'Priority email support', 'Remove branding'].map((feature, i) => (
              <li key={i} className="flex items-center gap-3 text-slate-300">
                <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          
          {!isPro ? (
            <button 
              onClick={handleSubscribe}
              disabled={isProcessing}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors flex justify-center items-center gap-2 shadow-[0_0_15px_rgba(59,130,246,0.3)]"
            >
              {isProcessing ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Upgrade to Pro'}
            </button>
          ) : (
            <button 
              disabled
              className="w-full py-3 px-4 bg-blue-600/20 text-blue-400 rounded-lg font-medium cursor-not-allowed"
            >
              Active Subscription
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
