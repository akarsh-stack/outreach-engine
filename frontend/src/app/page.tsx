import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Bot, Zap, BarChart3, Mail, Layers, ShieldCheck, Share2, Globe, Settings } from 'lucide-react';
import { SignInButton, SignUpButton } from '@clerk/nextjs';

const ReachyLogo = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-blue-500">
    <path d="M6 4V20" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    <path d="M6 10H14C16.2091 10 18 8.20914 18 6C18 3.79086 16.2091 2 14 2H6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    <path d="M12 10L18 20" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

export default async function Home() {
  const { userId } = await auth();

  if (userId) {
    redirect('/dashboard');
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#0b0a10] text-slate-50 font-sans selection:bg-blue-500/30">
      <header className="absolute top-0 z-50 w-full bg-transparent">
        <div className="container mx-auto flex h-20 items-center justify-between px-6 lg:px-10">
          <div className="flex items-center gap-2">
            <ReachyLogo />
            <span className="text-xl font-bold tracking-tight text-white">
              Reachy.ai
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <Link href="#features" className="text-slate-300 hover:text-white transition-colors">Features</Link>
            <Link href="#pricing" className="text-slate-300 hover:text-white transition-colors">Pricing</Link>
          </nav>
          <div className="flex items-center gap-6">
            <SignInButton mode="modal">
              <button className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Log in</button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-md transition-colors shadow-sm">
                Get Started
              </button>
            </SignUpButton>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-36 pb-20 flex flex-col items-center justify-center text-center">
          {/* Background Gradients */}
          <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center_40%,_var(--tw-gradient-stops))] from-blue-900/10 via-[#0b0a10] to-[#0b0a10]"></div>
          
          <div className="container relative z-10 px-4 md:px-6 flex flex-col items-center gap-8">
            {/* Pill Badge */}
            <div className="inline-flex items-center rounded-full border border-white/10 bg-[#161324]/50 px-4 py-1.5 text-xs font-semibold tracking-wider text-slate-300 uppercase backdrop-blur-sm shadow-sm">
              <span className="mr-2 text-white/70">★</span>
              AI-POWERED COLD EMAIL SEQUENCES
            </div>
            
            {/* Headline */}
            <h1 className="max-w-4xl text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1]">
              Scale your outreach with <br className="hidden md:block"/>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-purple-300 to-pink-400">
                Hyper-Personalized AI
              </span>
            </h1>
            
            {/* Subheadline */}
            <p className="max-w-[650px] text-lg text-slate-400 leading-relaxed font-medium">
              Upload your leads, let our AI research their background, and automatically generate highly personalized cold email sequences that convert.
            </p>
            
            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-2">
              <SignUpButton mode="modal">
                <button className="flex items-center justify-center gap-2 h-12 px-8 rounded-md bg-white text-black font-semibold hover:bg-slate-200 transition-colors">
                  Start for free
                  <ArrowRight className="h-4 w-4" />
                </button>
              </SignUpButton>
              <button className="flex items-center justify-center h-12 px-8 rounded-md bg-transparent border border-white/20 text-white font-semibold hover:bg-white/5 transition-colors">
                Watch Demo
              </button>
            </div>

            {/* Dashboard Mockup */}
            <div className="relative mt-16 w-full max-w-5xl">
              <div className="absolute inset-0 bg-gradient-to-b from-blue-500/20 to-purple-500/10 blur-[100px] -z-10 rounded-full"></div>
              
              <div className="relative rounded-2xl border border-white/10 bg-[#12101c]/80 p-2 shadow-2xl backdrop-blur-sm overflow-hidden">
                <div className="absolute top-1/2 -right-8 translate-x-1/2 -translate-y-1/2 z-20 hidden lg:flex">
                  <div className="flex items-center gap-2 bg-[#2a243b] border border-white/10 rounded-full px-4 py-2 shadow-xl backdrop-blur-md">
                    <Settings className="h-4 w-4 text-blue-400" />
                    <span className="text-xs font-medium text-slate-200">Configure your application</span>
                  </div>
                </div>
                
                <Image 
                  src="/dashboard_mockup.png" 
                  alt="Dashboard Mockup" 
                  width={1200} 
                  height={800} 
                  className="rounded-xl border border-white/5 opacity-90 object-cover w-full h-auto aspect-video"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0b0a10] via-[#100d18] to-[#121016] -z-10"></div>
          
          <div className="container mx-auto px-6 lg:px-10 max-w-7xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">Everything you need to close more deals</h2>
              <p className="text-slate-400 max-w-2xl mx-auto font-medium">Our AI engine handles the research, copywriting, and sequencing so you can focus on taking the meetings.</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: <Mail className="h-5 w-5 text-slate-300" />, title: 'Hyper-Personalized Emails', desc: 'AI writes unique emails based on the lead\'s website, role, and company.' },
                { icon: <Layers className="h-5 w-5 text-slate-300" />, title: 'Smart Sequences', desc: 'Multi-step follow-ups tailored to your product description and tone.' },
                { icon: <Zap className="h-5 w-5 text-slate-300" />, title: 'Lightning Fast', desc: 'Generate hundreds of customized emails in minutes, not hours.' },
                { icon: <ShieldCheck className="h-5 w-5 text-slate-300" />, title: 'Human in the Loop', desc: 'Review, edit, and approve every AI-generated email before it sends.' },
                { icon: <Bot className="h-5 w-5 text-slate-300" />, title: 'Deep Research', desc: 'Automatically scrapes and synthesizes lead data for better context.' },
                { icon: <BarChart3 className="h-5 w-5 text-slate-300" />, title: 'Track Performance', desc: 'Real-time open and reply tracking to see what sequences perform best.' },
              ].map((feature, i) => (
                <div key={i} className="p-8 rounded-2xl bg-[#1a1527]/50 border border-white/5 hover:border-white/10 hover:bg-[#1a1527]/80 transition-colors group">
                  <div className="mb-6 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 border border-white/10 shadow-sm">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3 tracking-tight">{feature.title}</h3>
                  <p className="text-slate-400 leading-relaxed text-sm">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 bg-[#121016] pt-16 pb-8">
        <div className="container mx-auto px-6 lg:px-10 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-1 flex flex-col gap-6">
              <div className="flex items-center gap-2">
                <ReachyLogo />
                <span className="text-xl font-bold tracking-tight text-white">Reachy.ai</span>
              </div>
              <p className="text-sm text-slate-400 max-w-xs">
                Empowering sales teams with the power of generative intelligence.
              </p>
              <div className="flex items-center gap-4 mt-2">
                <button className="text-slate-400 hover:text-white transition-colors">
                  <Share2 className="h-5 w-5" />
                </button>
                <button className="text-slate-400 hover:text-white transition-colors">
                  <Globe className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="md:col-span-1">
              <h4 className="font-semibold text-sm tracking-wider uppercase text-slate-300 mb-6">Product</h4>
              <ul className="space-y-4">
                <li><Link href="#" className="text-sm text-slate-500 hover:text-white transition-colors">Features</Link></li>
                <li><Link href="#" className="text-sm text-slate-500 hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="#" className="text-sm text-slate-500 hover:text-white transition-colors">Security</Link></li>
              </ul>
            </div>

            <div className="md:col-span-1">
              <h4 className="font-semibold text-sm tracking-wider uppercase text-slate-300 mb-6">Company</h4>
              <ul className="space-y-4">
                <li><Link href="#" className="text-sm text-slate-500 hover:text-white transition-colors">About</Link></li>
                <li><Link href="#" className="text-sm text-slate-500 hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="#" className="text-sm text-slate-500 hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>

            <div className="md:col-span-1">
              <h4 className="font-semibold text-sm tracking-wider uppercase text-slate-300 mb-6">Legal</h4>
              <ul className="space-y-4">
                <li><Link href="#" className="text-sm text-slate-500 hover:text-white transition-colors">Privacy</Link></li>
                <li><Link href="#" className="text-sm text-slate-500 hover:text-white transition-colors">Terms</Link></li>
                <li><Link href="#" className="text-sm text-slate-500 hover:text-white transition-colors">API</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-center items-center">
            <p className="text-xs text-slate-500 font-medium tracking-wide">
              © {new Date().getFullYear()} Reachy.ai. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
