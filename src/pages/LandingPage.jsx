import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();

  // FAQ State toggle
  const [openFaq, setOpenFaq] = useState(null);
  const toggleFaq = (index) => setOpenFaq(openFaq === index ? null : index);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased">
      
      {/* 1. HERO SECTION WITH POCKETBIZ BACKGROUND BRANDING */}
      <header className="relative bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 text-white py-28 px-6 text-center overflow-hidden">
        {/* Subtle pattern & PocketBiz logo background watermark */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none select-none">
          <span className="text-9xl font-black tracking-widest uppercase">POCKETBIZ</span>
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          <span className="bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-emerald-500/30 mb-6 inline-block">
            The Ultimate Small Business Operating System
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
            Run Your Entire Business From Your Pocket
          </h1>
          <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto font-light">
            Manage items, track staff, monitor live CCTV feeds, generate professional bills, and network with local vendors—all inside **PocketBiz**.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <button 
              onClick={() => navigate('/login')}
              className="w-full sm:w-auto bg-emerald-500 text-white px-8 py-3.5 rounded-xl font-bold shadow-lg shadow-emerald-900/20 hover:bg-emerald-400 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              Launch Dashboard
            </button>
            <button 
              onClick={() => navigate('/signup')}
              className="w-full sm:w-auto bg-white/10 border border-white/20 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-white/20 transition duration-200"
            >
              Create Free Account
            </button>
          </div>
        </div>
      </header>

      {/* 2. CORE FEATURES & SERVICES GRID */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Everything You Need To Grow</h2>
          <p className="mt-4 text-slate-600">Stop juggling multiple apps. PocketBiz brings all your retail, staff, management, and surveillance metrics under one roof.</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Smart Billing */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200/60 hover:shadow-md transition">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Instant Bill Generator</h3>
            <p className="text-slate-600 text-sm leading-relaxed">Generate digital or printable professional invoices in seconds. Track ledger dues and payments automatically.</p>
          </div>

          {/* In-App CCTV Monitoring */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200/60 hover:shadow-md transition">
            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">In-App CCTV Streaming</h3>
            <p className="text-slate-600 text-sm leading-relaxed">Keep an eye on your storefront directly inside the dashboard. Monitor real-time cameras from anywhere.</p>
          </div>

          {/* Staff & Attendance */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200/60 hover:shadow-md transition">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0-6a3.97 3.97 0 00-1.12-.014M21 21h-6v-1a6 6 0 0112 0v1zm-3-4a3.97 3.97 0 00-1.12-.014"/>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Staff & Task Management</h3>
            <p className="text-slate-600 text-sm leading-relaxed">Assign roles, monitor working shifts, track internal performance, and streamline communication paths.</p>
          </div>

          {/* Item & Stock Registry */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200/60 hover:shadow-md transition">
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l7.5 4"/>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Stock & Item Catalog</h3>
            <p className="text-slate-600 text-sm leading-relaxed">Organize products dynamically, track minimum supply warnings, and handle pricing details intuitively.</p>
          </div>

          {/* Analytics Dashboard */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200/60 hover:shadow-md transition">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h2a2 2 0 002-2zm0 0h5a2 2 0 002-2v-3a2 2 0 00-2-2h-5m5 5v-7a2 2 0 00-2-2h-3a2 2 0 00-2 2v7a2 2 0 002 2h3a2 2 0 002-2z"/>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Business Analytics</h3>
            <p className="text-slate-600 text-sm leading-relaxed">Visualize your sales charts, expense flows, and monthly profits to make confident, data-backed decisions.</p>
          </div>

          {/* Vendor Connectivity */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200/60 hover:shadow-md transition">
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">B2B Vendor Connectivity</h3>
            <p className="text-slate-600 text-sm leading-relaxed">Connect straight to raw material suppliers, alternative merchants, and neighboring B2B markets easily.</p>
          </div>
        </div>
      </section>

      {/* 3. BUSINESS PLANS / PRICING MODEL */}
      <section className="bg-slate-100 py-20 px-6 border-y border-slate-200/60">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Flexible Tiers Built For Scale</h2>
            <p className="mt-4 text-slate-600">Choose the tool volume that aligns with your active business setup today.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 items-stretch">
            {/* Basic Plan */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Basic Plan</h3>
                <p className="text-slate-500 text-xs mb-6">Ideal for standalone shops and early startups.</p>
                <div className="text-3xl font-extrabold text-slate-900 mb-6">Free <span className="text-sm font-normal text-slate-400">/ forever</span></div>
                <ul className="space-y-3 text-slate-600 text-sm border-t border-slate-100 pt-6">
                  <li className="flex items-center gap-2">✓ Item Catalog (up to 100 items)</li>
                  <li className="flex items-center gap-2">✓ Core Billing Generator</li>
                  <li className="flex items-center gap-2">✓ Single Staff Account</li>
                  <li className="text-slate-300 line-through">✗ CCTV Live Streaming Integration</li>
                  <li className="text-slate-300 line-through">✗ Vendor Marketplace Network</li>
                </ul>
              </div>
              <button onClick={() => navigate('/signup')} className="mt-8 w-full py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition">Get Basic</button>
            </div>

            {/* Gold Plan */}
            <div className="bg-white p-8 rounded-2xl border-2 border-indigo-600 shadow-md flex flex-col justify-between relative transform lg:-translate-y-2">
              <span className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">Most Popular</span>
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Gold Plan</h3>
                <p className="text-slate-500 text-xs mb-6">Perfect for growing stores needing multi-staff sync.</p>
                <div className="text-3xl font-extrabold text-slate-900 mb-6">$19 <span className="text-sm font-normal text-slate-400">/ month</span></div>
                <ul className="space-y-3 text-slate-600 text-sm border-t border-slate-100 pt-6">
                  <li className="flex items-center gap-2 text-indigo-950 font-medium">✓ Unlimited Catalog Items</li>
                  <li className="flex items-center gap-2">✓ Advanced Analytics & Ledgers</li>
                  <li className="flex items-center gap-2">✓ Up to 10 Staff Members</li>
                  <li className="flex items-center gap-2">✓ 2 Channel CCTV Camera Sync</li>
                  <li className="flex items-center gap-2">✓ Full Community Access</li>
                </ul>
              </div>
              <button onClick={() => navigate('/signup')} className="mt-8 w-full py-2.5 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 transition">Upgrade to Gold</button>
            </div>

            {/* Platinum Plan */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Platinum Plan</h3>
                <p className="text-slate-500 text-xs mb-6">For multi-location enterprises and elite vendors.</p>
                <div className="text-3xl font-extrabold text-slate-900 mb-6">$49 <span className="text-sm font-normal text-slate-400">/ month</span></div>
                <ul className="space-y-3 text-slate-600 text-sm border-t border-slate-100 pt-6">
                  <li className="flex items-center gap-2">✓ Everything in Gold Tier</li>
                  <li className="flex items-center gap-2">✓ Unlimited Staff Tracking</li>
                  <li className="flex items-center gap-2">✓ Unlimited High-Res CCTV Feeds</li>
                  <li className="flex items-center gap-2">✓ Premium Vendor Connectivity B2B</li>
                  <li className="flex items-center gap-2">✓ Priority Dedicated Support Desk</li>
                </ul>
              </div>
              <button onClick={() => navigate('/signup')} className="mt-8 w-full py-2.5 rounded-xl border border-slate-900 bg-slate-900 text-white font-semibold hover:bg-slate-800 transition">Go Platinum</button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. REVIEWS & FEEDBACK */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">Trusted by Local Business Owners</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { name: "Rajesh S.", role: "Supermarket Owner", text: "PocketBiz completely transformed my billing flow. The ledger module reduced checkout bottlenecks by half." },
            { name: "Kiran P.", role: "Hardware Store Operator", text: "Being able to pull open my CCTV feeds right inside my management tab while checking stock alerts is a game changer." },
            { name: "Anjali D.", role: "Boutique Manager", text: "The community features let me contact alternative design vendors nearby instantly when my mainline provider ran short." }
          ].map((review, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <p className="italic text-slate-600 mb-6 text-sm leading-relaxed">"{review.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">{review.name.charAt(0)}</div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{review.name}</h4>
                  <p className="text-xs text-slate-500">{review.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. USER FAQS */}
      <section className="bg-slate-50 py-20 px-6 border-t border-slate-200/60">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              { q: "How does the in-app CCTV stream hook up?", a: "PocketBiz integrates standard security camera stream links (RTSP/HLS protocol) securely into your private dashboard configuration." },
              { q: "Can my staff view billing and profit summaries?", a: "No. PocketBiz features secure role-based access control. Staff can only access panels assigned to them; sensitive logs remain locked to the owner." },
              { q: "Can I migrate my catalog data from Excel templates?", a: "Yes. You can import item registry tables directly via CSV file formatting directly inside the settings dashboard panel." }
            ].map((faq, idx) => (
              <div key={idx} className="bg-white rounded-xl border border-slate-200/50 shadow-sm overflow-hidden">
                <button 
                  onClick={() => toggleFaq(idx)}
                  className="w-full text-left p-6 font-semibold flex justify-between items-center text-slate-900 hover:bg-slate-50"
                >
                  <span>{faq.q}</span>
                  <span className={`transform transition-transform ${openFaq === idx ? 'rotate-180 text-indigo-600' : 'text-slate-400'}`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
                  </span>
                </button>
                {openFaq === idx && (
                  <div className="p-6 border-t border-slate-100 text-slate-600 text-sm bg-slate-50/50 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      
      {/* 6. FOOTER */}
      <footer className="bg-slate-900 text-slate-400 py-16 px-6 border-t border-slate-800">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-sm">
          <div>
            <h3 className="text-white font-bold text-xl mb-4">PocketBiz</h3>
            <p className="text-slate-400 leading-relaxed">
              Simplifying daily operations, metrics tracking, and business communication strategies for small merchants.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold uppercase tracking-wider text-xs mb-4">Quick Navigation</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition">Features Overview</a></li>
              <li><a href="#" className="hover:text-white transition">Pricing Plans</a></li>
              <li><a href="#" className="hover:text-white transition">Vendor Network Portal</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold uppercase tracking-wider text-xs mb-4">Contact & Support</h4>
            <p>Email: help@pocketbiz.app</p>
            <div className="mt-6 border-t border-slate-800 pt-4 text-xs space-y-1">
              <p className="text-slate-500 font-mono">© 2026 PocketBiz Inc. All rights reserved.</p>
              <p className="text-slate-400">
                Developed by <span className="text-indigo-400 font-medium hover:text-indigo-300 transition cursor-pointer">Jayesh Jadhav</span>
              </p>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}