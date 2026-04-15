"use client";
import { useState, useEffect } from "react";
import { supabase, ORG_ID } from "@/lib/supabase";
import Link from "next/link";
import { DollarSign, FileText, LinkIcon, RefreshCw, Calculator, ArrowRight, TrendingUp, CheckCircle, Clock } from "lucide-react";

export default function CommerceHubPage() {
  const [stats, setStats] = useState({ revenue: 284500, invoices: 156, paid: 132, subscriptions: 48 });

  useEffect(() => {
    (async () => {
      const { data: inv } = await supabase.from("invoices").select("id, status, amount").eq("org_id", ORG_ID);
      if (inv && inv.length > 0) {
        setStats({
          revenue: inv.filter((i: any) => i.status === "paid").reduce((a: number, i: any) => a + (i.amount || 0), 0),
          invoices: inv.length,
          paid: inv.filter((i: any) => i.status === "paid").length,
          subscriptions: 48,
        });
      }
    })();
  }, []);

  const hubs = [
    { title: "Invoices", desc: "Create, send, and track invoices. Automated payment reminders and receipt generation.", icon: FileText, href: "/commerce-hub/invoices", stat: `${stats.invoices} total`, color: "from-green-600 to-green-800" },
    { title: "Payment Links", desc: "Generate shareable payment links for one-time or recurring payments.", icon: LinkIcon, href: "/commerce-hub/payment-links", stat: "34 active links", color: "from-blue-600 to-blue-800" },
    { title: "Subscriptions", desc: "Manage recurring billing, plan tiers, and subscription lifecycle.", icon: RefreshCw, href: "/commerce-hub/subscriptions", stat: `${stats.subscriptions} active`, color: "from-purple-600 to-purple-800" },
    { title: "Quotes / CPQ", desc: "Build quotes with line items, discounts, and e-signature. Configure-Price-Quote engine.", icon: Calculator, href: "/commerce-hub/quotes", stat: "28 pending", color: "from-orange-600 to-orange-800" },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="bg-gradient-to-r from-green-700 to-emerald-900 rounded-2xl p-8 mb-8 text-white">
        <div className="flex items-center gap-3 mb-2"><DollarSign className="w-8 h-8" /><h1 className="text-3xl font-bold">Commerce Hub</h1></div>
        <p className="text-green-200 text-lg">Invoices, payments, subscriptions, and quotes — all in one place.</p>
        <div className="grid grid-cols-4 gap-4 mt-6">
          {[
            { label: "Total Revenue", val: `$${(stats.revenue / 1000).toFixed(0)}K`, icon: TrendingUp },
            { label: "Invoices", val: stats.invoices, icon: FileText },
            { label: "Paid", val: stats.paid, icon: CheckCircle },
            { label: "Active Subs", val: stats.subscriptions, icon: RefreshCw },
          ].map((s) => (
            <div key={s.label} className="bg-white/10 rounded-xl p-4">
              <s.icon className="w-5 h-5 mb-1 text-green-200" />
              <div className="text-2xl font-bold">{s.val}</div>
              <div className="text-green-200 text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {hubs.map((h) => (
          <Link key={h.title} href={h.href} className="group bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all overflow-hidden">
            <div className={`bg-gradient-to-r ${h.color} p-6 text-white`}>
              <h.icon className="w-8 h-8 mb-3" />
              <h2 className="text-xl font-bold">{h.title}</h2>
              <p className="text-white/80 text-sm mt-1">{h.stat}</p>
            </div>
            <div className="p-5">
              <p className="text-gray-600 text-sm">{h.desc}</p>
              <div className="flex items-center gap-1 mt-3 text-green-600 text-sm font-medium group-hover:gap-2 transition-all">Open <ArrowRight className="w-4 h-4" /></div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
