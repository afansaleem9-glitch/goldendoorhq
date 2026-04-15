"use client";
import { useState, useEffect, useRef } from "react";
import {
  Settings, Users, Layers, Bell, Palette, Shield, Database,
  Plug, ChevronRight, Plus, Trash2, Save,
  Check, X, Mail, Globe, Key, Building, Phone, Clock, Upload,
  Loader2, Image as ImageIcon, AlertCircle
} from "lucide-react";
import { supabase, ORG_ID } from "@/lib/supabase";

const SECTIONS = [
  { key: "general", label: "General", icon: Building },
  { key: "pipelines", label: "Pipelines & Stages", icon: Layers },
  { key: "team", label: "Team & Roles", icon: Users },
  { key: "notifications", label: "Notifications", icon: Bell },
  { key: "appearance", label: "Appearance", icon: Palette },
  { key: "security", label: "Security", icon: Shield },
  { key: "data", label: "Data Management", icon: Database },
  { key: "api", label: "API & Webhooks", icon: Key },
];

const defaultPipelines = [
  { id: "sales", name: "Sales Pipeline", stages: [
    { id: "s1", name: "New Lead", probability: 10, color: "#000000" },
    { id: "s2", name: "Qualified", probability: 25, color: "#1a1a1a" },
    { id: "s3", name: "Proposal Sent", probability: 50, color: "#333333" },
    { id: "s4", name: "Negotiation", probability: 70, color: "#555555" },
    { id: "s5", name: "Contract Signed", probability: 90, color: "#777777" },
    { id: "s6", name: "Closed Won", probability: 100, color: "#10B981" },
    { id: "s7", name: "Closed Lost", probability: 0, color: "#EF4444" },
  ]},
  { id: "solar", name: "Solar Pipeline", stages: [
    { id: "sol1", name: "NTP", probability: 10, color: "#000000" },
    { id: "sol2", name: "Welcome Call", probability: 15, color: "#1a1a1a" },
    { id: "sol3", name: "Site Survey", probability: 30, color: "#333333" },
    { id: "sol4", name: "Design/CAD", probability: 45, color: "#474747" },
    { id: "sol5", name: "Permitting", probability: 60, color: "#5c5c5c" },
    { id: "sol6", name: "Install", probability: 80, color: "#777777" },
    { id: "sol7", name: "Inspection", probability: 90, color: "#999999" },
    { id: "sol8", name: "PTO Complete", probability: 100, color: "#10B981" },
  ]},
];

const defaultTeam = [
  { id: "u1", name: "Afan Saleem", email: "afan@deltapowergroup.com", role: "Admin", status: "active", avatar: "AS" },
  { id: "u2", name: "Marcus Johnson", email: "marcus@deltapowergroup.com", role: "Sales Manager", status: "active", avatar: "MJ" },
  { id: "u3", name: "Sarah Chen", email: "sarah@deltapowergroup.com", role: "Solar Ops", status: "active", avatar: "SC" },
  { id: "u4", name: "David Park", email: "david@deltapowergroup.com", role: "Rep", status: "active", avatar: "DP" },
  { id: "u5", name: "Lisa Rodriguez", email: "lisa@deltapowergroup.com", role: "Rep", status: "active", avatar: "LR" },
];

const API_KEYS = [
  { name: "Production Key", key: "gd_live_****", created: "Mar 1, 2026", lastUsed: "2 min ago" },
  { name: "Staging Key", key: "gd_test_****", created: "Feb 15, 2026", lastUsed: "3 days ago" },
  { name: "Webhook Secret", key: "whsec_****", created: "Jan 20, 2026", lastUsed: "1 hour ago" },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("general");
  const [pipelines, setPipelines] = useState(defaultPipelines);
  const [team] = useState(defaultTeam);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [settingsId, setSettingsId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const [general, setGeneral] = useState({
    companyName: "Delta Power Group",
    brandName: "GoldenDoor",
    domain: "goldendoorhq.com",
    phone: "(888) 555-0100",
    email: "admin@deltapowergroup.com",
    timezone: "America/Chicago",
    dateFormat: "MM/DD/YYYY",
    currency: "USD",
    address: "1910 Pacific Ave, Dallas, TX 75201",
  });

  const [notifications, setNotifications] = useState({
    emailNewDeal: true, emailStageChange: true, emailTaskDue: true, emailWeeklyReport: false,
    pushNewLead: true, pushMentions: true, pushReminders: true, smsUrgent: false,
  });

  const [appearance, setAppearance] = useState({
    theme: "dark", accentColor: "#000000", sidebarCollapsed: false,
    compactMode: false, showAvatars: true, animationsEnabled: true,
  });

  /* ─── LOAD settings from Supabase on mount ─── */
  useEffect(() => {
    async function loadSettings() {
      try {
        const { data, error } = await supabase
          .from("org_settings")
          .select("*")
          .eq("organization_id", ORG_ID)
          .limit(1)
          .single();

        if (data && !error) {
          setSettingsId(data.id);
          setGeneral(prev => ({
            ...prev,
            companyName: data.company_name || prev.companyName,
            phone: data.phone || prev.phone,
            email: data.email || prev.email,
            address: data.address || prev.address,
            timezone: data.timezone || prev.timezone,
            dateFormat: data.date_format || prev.dateFormat,
            currency: data.currency || prev.currency,
            domain: data.website || prev.domain,
          }));
          if (data.logo_url) setLogoUrl(data.logo_url);
        }
      } catch (e) {
        console.log("Settings load fallback to defaults");
      }
      setLoading(false);
    }
    loadSettings();
  }, []);

  /* ─── SAVE settings to Supabase ─── */
  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        organization_id: ORG_ID,
        company_name: general.companyName,
        phone: general.phone,
        email: general.email,
        address: general.address,
        website: general.domain,
        timezone: general.timezone,
        date_format: general.dateFormat,
        currency: general.currency,
        logo_url: logoUrl,
        updated_at: new Date().toISOString(),
      };

      if (settingsId) {
        await supabase.from("org_settings").update(payload).eq("id", settingsId);
      } else {
        const { data } = await supabase.from("org_settings").insert(payload).select("id").single();
        if (data) setSettingsId(data.id);
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      console.error("Save failed:", e);
    }
    setSaving(false);
  };

  /* ─── LOGO UPLOAD to Supabase Storage ─── */
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${ORG_ID}/logo-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("logos")
        .upload(fileName, file, { upsert: true });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        // Fallback: use data URL if storage upload fails
        const reader = new FileReader();
        reader.onload = (ev) => {
          const dataUrl = ev.target?.result as string;
          setLogoUrl(dataUrl);
        };
        reader.readAsDataURL(file);
      } else {
        const { data: urlData } = supabase.storage.from("logos").getPublicUrl(fileName);
        setLogoUrl(urlData.publicUrl);
      }
    } catch (err) {
      // Fallback to data URL
      const reader = new FileReader();
      reader.onload = (ev) => setLogoUrl(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
    setUploading(false);
  };

  const addStage = (pipelineId: string) => {
    setPipelines(prev => prev.map(p => p.id === pipelineId ? { ...p, stages: [...p.stages, { id: `new-${Date.now()}`, name: "New Stage", probability: 50, color: "#666666" }] } : p));
  };

  const removeStage = (pipelineId: string, stageId: string) => {
    setPipelines(prev => prev.map(p => p.id === pipelineId ? { ...p, stages: p.stages.filter(s => s.id !== stageId) } : p));
  };

  const updateStage = (pipelineId: string, stageId: string, field: string, value: string | number) => {
    setPipelines(prev => prev.map(p => p.id === pipelineId ? { ...p, stages: p.stages.map(s => s.id === stageId ? { ...s, [field]: value } : s) } : p));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1400px] mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-black flex items-center gap-2"><Settings size={24} /> Settings</h1>
            <p className="text-sm text-gray-500 mt-1">Configure your GoldenDoor platform</p>
          </div>
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-lg text-sm font-semibold hover:bg-gray-800 disabled:opacity-50">
            {saving ? <Loader2 size={16} className="animate-spin" /> : saved ? <Check size={16} /> : <Save size={16} />}
            {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
          </button>
        </div>

        <div className="flex gap-6">
          <nav className="w-56 shrink-0">
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              {SECTIONS.map(section => {
                const Icon = section.icon;
                const active = activeSection === section.key;
                return (
                  <button key={section.key} onClick={() => setActiveSection(section.key)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all text-left ${active ? "bg-black text-white" : "text-gray-600 hover:bg-gray-50 hover:text-black"}`}>
                    <Icon size={16} />{section.label}{active && <ChevronRight size={14} className="ml-auto" />}
                  </button>
                );
              })}
            </div>
          </nav>

          <main className="flex-1 min-w-0">
            {/* ═══ GENERAL ═══ */}
            {activeSection === "general" && (
              <div className="space-y-6">
                {loading ? (
                  <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                    <Loader2 size={24} className="animate-spin mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">Loading settings...</p>
                  </div>
                ) : (
                  <>
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                      <h2 className="text-lg font-bold text-black mb-1">Company Information</h2>
                      <p className="text-sm text-gray-500 mb-6">Basic details — saved to database automatically</p>
                      <div className="grid grid-cols-2 gap-5">
                        {[
                          { label: "Company Name", key: "companyName", icon: Building },
                          { label: "Brand Name", key: "brandName", icon: Globe },
                          { label: "Domain", key: "domain", icon: Globe },
                          { label: "Phone", key: "phone", icon: Phone },
                          { label: "Email", key: "email", icon: Mail },
                          { label: "Timezone", key: "timezone", icon: Clock },
                        ].map(field => {
                          const FIcon = field.icon;
                          return (
                            <div key={field.key}>
                              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">{field.label}</label>
                              <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2.5 focus-within:border-black transition-all">
                                <FIcon size={14} className="text-gray-400 mr-2 shrink-0" />
                                <input type="text" value={general[field.key as keyof typeof general]} onChange={e => setGeneral({ ...general, [field.key]: e.target.value })} className="flex-1 text-sm text-black outline-none bg-transparent" />
                              </div>
                            </div>
                          );
                        })}
                        <div className="col-span-2">
                          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Address</label>
                          <input type="text" value={general.address} onChange={e => setGeneral({ ...general, address: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-black outline-none focus:border-black" />
                        </div>
                      </div>
                    </div>

                    {/* BRANDING with REAL logo upload */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                      <h2 className="text-lg font-bold text-black mb-1">Branding</h2>
                      <p className="text-sm text-gray-500 mb-6">Logo and visual identity</p>
                      <div className="flex items-center gap-6">
                        <div className="w-20 h-20 bg-black rounded-xl flex items-center justify-center overflow-hidden shrink-0">
                          {logoUrl ? (
                            <img src={logoUrl} alt="Company Logo" className="w-full h-full object-contain p-1" />
                          ) : (
                            <svg viewBox="0 0 100 100" className="w-12 h-12" fill="none">
                              <path d="M15 5 L46 50 L40 55 Z" fill="white"/>
                              <path d="M85 5 L54 50 L60 55 Z" fill="white"/>
                              <path d="M50 0 L46 42 L54 42 Z" fill="white"/>
                              <path d="M12 95 L50 22 L88 95 Z" fill="white"/>
                              <path d="M30 90 L50 48 L70 90 Z" fill="black"/>
                            </svg>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-black">Company Logo</p>
                          <p className="text-xs text-gray-500 mt-0.5">{logoUrl ? "Custom logo uploaded" : "Delta X mark — used in navbar and documents"}</p>
                          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                          <button onClick={() => fileInputRef.current?.click()} disabled={uploading}
                            className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-black hover:underline disabled:opacity-50">
                            {uploading ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
                            {uploading ? "Uploading..." : "Upload new logo"}
                          </button>
                          {logoUrl && (
                            <button onClick={() => setLogoUrl(null)} className="mt-1 flex items-center gap-1 text-xs text-red-600 hover:underline">
                              <X size={10} /> Remove logo
                            </button>
                          )}
                        </div>
                      </div>
                      {logoUrl && (
                        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                          <Check size={14} className="text-green-600" />
                          <span className="text-xs text-green-700 font-semibold">Logo uploaded — click Save Changes to persist</span>
                        </div>
                      )}
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                      <h2 className="text-lg font-bold text-black mb-1">Locale & Formatting</h2>
                      <p className="text-sm text-gray-500 mb-6">Date, currency, and number formatting</p>
                      <div className="grid grid-cols-3 gap-5">
                        <div><label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Date Format</label>
                          <select value={general.dateFormat} onChange={e => setGeneral({ ...general, dateFormat: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-black outline-none bg-white"><option>MM/DD/YYYY</option><option>DD/MM/YYYY</option><option>YYYY-MM-DD</option></select></div>
                        <div><label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Currency</label>
                          <select value={general.currency} onChange={e => setGeneral({ ...general, currency: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-black outline-none bg-white"><option>USD</option><option>CAD</option><option>EUR</option></select></div>
                        <div><label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Timezone</label>
                          <select value={general.timezone} onChange={e => setGeneral({ ...general, timezone: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-black outline-none bg-white"><option>America/Chicago</option><option>America/New_York</option><option>America/Los_Angeles</option><option>America/Denver</option></select></div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* ═══ PIPELINES ═══ */}
            {activeSection === "pipelines" && (
              <div className="space-y-6">
                {pipelines.map(pipeline => (
                  <div key={pipeline.id} className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div><h2 className="text-lg font-bold text-black">{pipeline.name}</h2><p className="text-sm text-gray-500">{pipeline.stages.length} stages</p></div>
                      <button onClick={() => addStage(pipeline.id)} className="flex items-center gap-1.5 px-3 py-1.5 bg-black text-white rounded-lg text-xs font-semibold"><Plus size={13} /> Add Stage</button>
                    </div>
                    <div className="space-y-1">
                      <div className="grid grid-cols-[1fr_100px_80px_40px] gap-3 px-3 py-2 text-xs font-semibold text-gray-500 uppercase">
                        <span>Stage Name</span><span>Probability</span><span>Color</span><span></span>
                      </div>
                      {pipeline.stages.map(stage => (
                        <div key={stage.id} className="grid grid-cols-[1fr_100px_80px_40px] gap-3 items-center px-3 py-2.5 rounded-lg hover:bg-gray-50 group">
                          <input type="text" value={stage.name} onChange={e => updateStage(pipeline.id, stage.id, "name", e.target.value)} className="text-sm text-black outline-none bg-transparent font-medium" />
                          <div className="flex items-center gap-1">
                            <input type="number" value={stage.probability} onChange={e => updateStage(pipeline.id, stage.id, "probability", parseInt(e.target.value) || 0)} className="w-12 text-sm text-black outline-none bg-transparent text-center" min={0} max={100} />
                            <span className="text-xs text-gray-500">%</span>
                          </div>
                          <input type="color" value={stage.color} onChange={e => updateStage(pipeline.id, stage.id, "color", e.target.value)} className="w-8 h-8 rounded cursor-pointer border-0" />
                          <button onClick={() => removeStage(pipeline.id, stage.id)} className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ═══ TEAM ═══ */}
            {activeSection === "team" && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div><h2 className="text-lg font-bold text-black">Team Members</h2><p className="text-sm text-gray-500">{team.length} members</p></div>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 bg-black text-white rounded-lg text-xs font-semibold"><Plus size={13} /> Invite Member</button>
                </div>
                <div className="space-y-2">
                  {team.map(u => (
                    <div key={u.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50">
                      <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold">{u.avatar}</div>
                      <div className="flex-1"><p className="text-sm font-semibold text-black">{u.name}</p><p className="text-xs text-gray-500">{u.email}</p></div>
                      <span className="text-xs font-semibold text-black bg-gray-100 px-2 py-1 rounded">{u.role}</span>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${u.status === "active" ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>{u.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ═══ NOTIFICATIONS ═══ */}
            {activeSection === "notifications" && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-black mb-1">Notification Preferences</h2>
                <p className="text-sm text-gray-500 mb-6">Control what alerts you receive</p>
                {[
                  { section: "Email Notifications", items: [
                    { key: "emailNewDeal", label: "New deal created" },
                    { key: "emailStageChange", label: "Deal stage changes" },
                    { key: "emailTaskDue", label: "Task due reminders" },
                    { key: "emailWeeklyReport", label: "Weekly performance report" },
                  ]},
                  { section: "Push Notifications", items: [
                    { key: "pushNewLead", label: "New lead assigned" },
                    { key: "pushMentions", label: "Mentions & comments" },
                    { key: "pushReminders", label: "Calendar reminders" },
                  ]},
                  { section: "SMS", items: [
                    { key: "smsUrgent", label: "Urgent alerts only" },
                  ]},
                ].map(group => (
                  <div key={group.section} className="mb-6">
                    <h3 className="text-sm font-bold text-black mb-3">{group.section}</h3>
                    <div className="space-y-2">
                      {group.items.map(item => (
                        <div key={item.key} className="flex items-center justify-between py-2 border-b border-gray-50">
                          <span className="text-sm text-gray-700">{item.label}</span>
                          <button onClick={() => setNotifications(prev => ({ ...prev, [item.key]: !prev[item.key as keyof typeof prev] }))}
                            className={`w-10 h-5 rounded-full transition-colors ${notifications[item.key as keyof typeof notifications] ? "bg-black" : "bg-gray-300"}`}>
                            <div className={`w-4 h-4 bg-white rounded-full transition-transform mx-0.5 ${notifications[item.key as keyof typeof notifications] ? "translate-x-5" : "translate-x-0"}`} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ═══ APPEARANCE ═══ */}
            {activeSection === "appearance" && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-black mb-1">Appearance</h2>
                <p className="text-sm text-gray-500 mb-6">Customize the look and feel</p>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-2 border-b border-gray-50">
                    <div><p className="text-sm text-black font-medium">Theme</p><p className="text-xs text-gray-500">Dark header with light content</p></div>
                    <select value={appearance.theme} onChange={e => setAppearance({ ...appearance, theme: e.target.value })} className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-black"><option value="dark">Dark</option><option value="light">Light</option></select>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-50">
                    <div><p className="text-sm text-black font-medium">Accent Color</p><p className="text-xs text-gray-500">Primary brand color for buttons and highlights</p></div>
                    <input type="color" value={appearance.accentColor} onChange={e => setAppearance({ ...appearance, accentColor: e.target.value })} className="w-8 h-8 rounded cursor-pointer" />
                  </div>
                  {[
                    { key: "compactMode", label: "Compact Mode", desc: "Reduce spacing for denser layouts" },
                    { key: "showAvatars", label: "Show Avatars", desc: "Display user avatars in lists" },
                    { key: "animationsEnabled", label: "Animations", desc: "Enable transition animations" },
                  ].map(toggle => (
                    <div key={toggle.key} className="flex items-center justify-between py-2 border-b border-gray-50">
                      <div><p className="text-sm text-black font-medium">{toggle.label}</p><p className="text-xs text-gray-500">{toggle.desc}</p></div>
                      <button onClick={() => setAppearance(prev => ({ ...prev, [toggle.key]: !prev[toggle.key as keyof typeof prev] }))}
                        className={`w-10 h-5 rounded-full transition-colors ${appearance[toggle.key as keyof typeof appearance] ? "bg-black" : "bg-gray-300"}`}>
                        <div className={`w-4 h-4 bg-white rounded-full transition-transform mx-0.5 ${appearance[toggle.key as keyof typeof appearance] ? "translate-x-5" : "translate-x-0"}`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ═══ SECURITY ═══ */}
            {activeSection === "security" && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-black mb-1">Security Settings</h2>
                <p className="text-sm text-gray-500 mb-6">Authentication and access control</p>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div><p className="text-sm font-medium text-black">Two-Factor Authentication</p><p className="text-xs text-gray-500">Require 2FA for all admin users</p></div>
                    <span className="text-xs font-bold text-green-700 bg-green-50 px-2 py-1 rounded-full">Enabled</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div><p className="text-sm font-medium text-black">Session Timeout</p><p className="text-xs text-gray-500">Automatically log out after inactivity</p></div>
                    <select className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-black"><option>30 minutes</option><option>1 hour</option><option>4 hours</option><option>Never</option></select>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div><p className="text-sm font-medium text-black">IP Allowlist</p><p className="text-xs text-gray-500">Restrict access to specific IPs</p></div>
                    <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Not configured</span>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <div><p className="text-sm font-medium text-black">Audit Logging</p><p className="text-xs text-gray-500">Track all user actions</p></div>
                    <span className="text-xs font-bold text-green-700 bg-green-50 px-2 py-1 rounded-full">Active</span>
                  </div>
                </div>
              </div>
            )}

            {/* ═══ DATA MANAGEMENT ═══ */}
            {activeSection === "data" && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h2 className="text-lg font-bold text-black mb-1">Data Management</h2>
                  <p className="text-sm text-gray-500 mb-6">Import, export, and manage your data</p>
                  <div className="grid grid-cols-3 gap-4">
                    <button className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-black transition-colors">
                      <Upload size={24} className="mx-auto text-gray-400 mb-2" />
                      <p className="text-sm font-semibold text-black">Import Data</p>
                      <p className="text-xs text-gray-500 mt-1">CSV, Excel, or JSON</p>
                    </button>
                    <button className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-black transition-colors">
                      <Save size={24} className="mx-auto text-gray-400 mb-2" />
                      <p className="text-sm font-semibold text-black">Export Data</p>
                      <p className="text-xs text-gray-500 mt-1">Download all records</p>
                    </button>
                    <button className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-red-300 transition-colors">
                      <Trash2 size={24} className="mx-auto text-gray-400 mb-2" />
                      <p className="text-sm font-semibold text-black">Delete Records</p>
                      <p className="text-xs text-gray-500 mt-1">Bulk delete with filters</p>
                    </button>
                  </div>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h2 className="text-sm font-bold text-black mb-3">Database Stats</h2>
                  <div className="grid grid-cols-4 gap-4">
                    {[
                      { label: "Contacts", count: "Loading..." },
                      { label: "Deals", count: "Loading..." },
                      { label: "Solar Projects", count: "Loading..." },
                      { label: "Documents", count: "Loading..." },
                    ].map(s => (
                      <div key={s.label} className="bg-gray-50 rounded-lg p-3 text-center">
                        <p className="text-lg font-bold text-black">{s.count}</p>
                        <p className="text-[11px] text-gray-500">{s.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ═══ API & WEBHOOKS ═══ */}
            {activeSection === "api" && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h2 className="text-lg font-bold text-black mb-1">API Keys</h2>
                  <p className="text-sm text-gray-500 mb-6">Manage API access tokens</p>
                  <div className="space-y-4">
                    {API_KEYS.map(k => (
                      <div key={k.name} className="flex items-center justify-between py-3 border-b border-gray-100">
                        <div><p className="text-sm font-semibold text-black">{k.name}</p><p className="text-xs text-gray-500 font-mono">{k.key}</p></div>
                        <div className="text-right"><p className="text-xs text-gray-500">Created {k.created}</p><p className="text-xs text-gray-500">Last used {k.lastUsed}</p></div>
                      </div>
                    ))}
                  </div>
                  <button className="mt-4 flex items-center gap-1.5 px-4 py-2 bg-black text-white rounded-lg text-sm font-semibold"><Plus size={14} /> Generate New Key</button>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h2 className="text-lg font-bold text-black mb-1">Webhooks</h2>
                  <p className="text-sm text-gray-500 mb-4">Send real-time events to external services</p>
                  <button className="flex items-center gap-1.5 px-4 py-2 bg-black text-white rounded-lg text-sm font-semibold"><Plus size={14} /> Add Webhook Endpoint</button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
