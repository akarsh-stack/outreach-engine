"use client";

import { useEffect, useState } from "react";
import { useAuth, UserProfile } from "@clerk/nextjs";
import { api, User } from "@/lib/api";
import { toast } from "sonner";
import { UserCircle } from "lucide-react";

export default function SettingsPage() {
  const { getToken } = useAuth();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function loadUser() {
      try {
        const token = await getToken();
        if (token) {
          const userData = await api.users.me(token);
          setUser(userData);
        }
      } catch (err) {
        toast.error("Failed to load user settings");
      }
    }
    loadUser();
  }, [getToken]);

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Account Settings</h1>
        <p className="text-slate-400 mt-1">Manage your account preferences and profile.</p>
      </div>

      <div className="bg-white/[0.02] border border-white/10 rounded-2xl overflow-hidden p-6">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <UserCircle className="h-6 w-6 text-blue-400" />
          Profile Details
        </h2>
        
        {/* Clerk Profile Component with Dark Mode theme applied via CSS variables mostly, but Clerk provides its own appearance prop */}
        <div className="clerk-profile-container">
          <UserProfile 
            appearance={{
              elements: {
                rootBox: "w-full",
                cardBox: "shadow-none border-none bg-transparent w-full",
                navbar: "hidden", // Hide clerk sidebar to integrate better
                pageScrollBox: "p-0",
                profileSectionTitle: "text-slate-200",
                profileSectionTitleText: "text-lg font-medium",
                formButtonPrimary: "bg-blue-600 hover:bg-blue-500",
                formFieldLabel: "text-slate-300",
                formFieldInput: "bg-black/30 border-white/10 text-white",
              },
              variables: {
                colorBackground: "transparent",
                colorText: "white",
                colorInputBackground: "rgba(0,0,0,0.3)",
                colorInputText: "white",
                colorDanger: "#ef4444",
                colorSuccess: "#10b981",
              }
            }}
          />
        </div>
      </div>
      
      <div className="bg-white/[0.02] border border-white/10 rounded-2xl overflow-hidden p-6 mt-8">
         <h2 className="text-xl font-semibold mb-6">System Data</h2>
         
         {user ? (
           <div className="space-y-4">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="bg-black/20 p-4 rounded-lg border border-white/5">
                 <p className="text-sm text-slate-500 mb-1">Internal User ID</p>
                 <p className="font-mono text-xs text-slate-300 break-all">{user.id}</p>
               </div>
               <div className="bg-black/20 p-4 rounded-lg border border-white/5">
                 <p className="text-sm text-slate-500 mb-1">Account Created</p>
                 <p className="text-sm text-slate-300">{new Date(user.created_at).toLocaleString()}</p>
               </div>
             </div>
           </div>
         ) : (
           <div className="h-20 animate-pulse bg-white/5 rounded-lg"></div>
         )}
      </div>
    </div>
  );
}
