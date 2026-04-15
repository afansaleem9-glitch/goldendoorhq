'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, User, Phone, Mail, MapPin, Building2, Calendar, Clock,
  FileText, DollarSign, Sun, Shield, Hammer, Camera, Star, PhoneCall,
  MessageSquare, Download, ChevronDown, ChevronRight, Loader, AlertCircle,
  CheckCircle2, XCircle, Tag, ExternalLink, Play, Zap, Send, Plus,
} from 'lucide-react';

/* ───────── types ───────── */
interface ContactDNA {
  contact: Record<string, unknown>;
  deals: Record<string, unknown>[];
  tickets: Record<string, unknown>[];
  tasks: Record<string, unknown>[];
  activities: Record<string, unknown>[];
  notes: Record<string, unknown>[];
  contracts: Record<string, unknown>[];
  solar_projects: Record<string, unknown>[];
  invoices: Record<string, unknown>[];
  payments: Record<string, unknown>[];
}

/* ───────── helpers ───────── */
const fmt = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
const fmtDate = (d: string | null | undefined) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';
const fmtDateTime = (d: string | null | undefined) => d ? new Date(d).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' }) : '—';
const str = (v: unknown): string => (v as string) || '';
const num = (v: unknown): number => Number(v) || 0;

const STAGE_COLORS: Record<string, string> = {
  lead: '#3B82F6', subscriber: '#6366F1', opportunity: '#8B5CF6', customer: '#10B981', evangelist: '#F59E0B', other: '#6B7280',
};

const LIFECYCLE_LABELS: Record<string, string> = {
  lead: 'Lead', subscriber: 'Subscriber', opportunity: 'Opportunity', customer: 'Customer', evangelist: 'Evangelist',
};

/* ═══════════ MAIN PAGE ═══════════ */
export default function CustomerDNAPage() {
  const { id } = useParams();
  const [data, setData] = useState<ContactDNA | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('timeline');

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/contacts/${id}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      setData(json.data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen"><Loader className="animate-spin text-[#F0A500]" size={40} /></div>
  );
  if (error || !data) return (
    <div className="flex flex-col items-center justify-center min-h-screen text-red-500 gap-2">
      <AlertCircle size={40} /><p>{error || 'Contact not found'}</p>
      <Link href="/contacts" className="text-sm text-[#007A67] hover:underline">Back to Contacts</Link>
    </div>
  );

  const c = data.contact;
  const company = c.companies as Record<string, unknown> | null;
  const lifecycle = str(c.lifecycle_stage) || 'lead';
  const lcColor = STAGE_COLORS[lifecycle] || STAGE_COLORS.other;

  // Revenue totals
  const totalDealValue = data.deals.reduce((s, d) => s + num(d.amount), 0);
  const wonDeals = data.deals.filter(d => d.is_won);
  const wonRevenue = wonDeals.reduce((s, d) => s + num(d.amount), 0);
  const totalPaid = data.payments.reduce((s, p) => s + num(p.amount), 0);

  // Build unified timeline
  const timeline = buildTimeline(data);

  const tabs = [
    { key: 'timeline', label: 'Timeline', icon: Clock, count: timeline.length },
    { key: 'deals', label: 'Deals', icon: DollarSign, count: data.deals.length },
    { key: 'contracts', label: 'Contracts', icon: FileText, count: data.contracts.length },
    { key: 'solar', label: 'Solar Projects', icon: Sun, count: data.solar_projects.length },
    { key: 'tickets', label: 'Tickets', icon: Shield, count: data.tickets.length },
    { key: 'payments', label: 'Payments', icon: DollarSign, count: data.invoices.length + data.payments.length },
    { key: 'comms', label: 'Communications', icon: PhoneCall, count: 0 },
    { key: 'photos', label: 'Photos', icon: Camera, count: 0 },
    { key: 'reviews', label: 'Reviews', icon: Star, count: 0 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── TOP BAR ── */}
      <div className="bg-[#0B1F3A] text-white">
        <div className="max-w-[1600px] mx-auto px-6 py-4">
          <Link href="/contacts" className="inline-flex items-center gap-1 text-sm text-gray-300 hover:text-white mb-3">
            <ArrowLeft size={14} /> Back to Contacts
          </Link>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#F0A500] to-[#007A67] flex items-center justify-center text-2xl font-bold">
                {str(c.first_name).charAt(0)}{str(c.last_name).charAt(0)}
              </div>
              <div>
                <h1 className="text-2xl font-bold">{str(c.first_name)} {str(c.last_name)}</h1>
                <div className="flex items-center gap-3 mt-1 text-sm text-gray-300">
                  {company && <span className="flex items-center gap-1"><Building2 size={12} /> {str(company.name)}</span>}
                  {str(c.job_title) && <span>· {str(c.job_title)}</span>}
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold" style={{ background: lcColor + '30', color: lcColor }}>
                    {LIFECYCLE_LABELS[lifecycle] || lifecycle}
                  </span>
                  {str(c.lead_source) && <span className="px-2 py-0.5 rounded-full text-xs bg-white/10">{str(c.lead_source)}</span>}
                  {(c.tags as string[])?.map(t => (
                    <span key={t} className="px-2 py-0.5 rounded-full text-xs bg-white/10 flex items-center gap-1"><Tag size={9} />{t}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 rounded-lg bg-[#F0A500] text-[#0B1F3A] text-sm font-bold hover:bg-[#F0A500]/90 flex items-center gap-1"><Phone size={14} /> Call</button>
              <button className="px-3 py-1.5 rounded-lg bg-white/10 text-sm hover:bg-white/20 flex items-center gap-1"><Mail size={14} /> Email</button>
              <button className="px-3 py-1.5 rounded-lg bg-white/10 text-sm hover:bg-white/20 flex items-center gap-1"><MessageSquare size={14} /> SMS</button>
              <button className="px-3 py-1.5 rounded-lg bg-white/10 text-sm hover:bg-white/20 flex items-center gap-1"><Download size={14} /> Export</button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 py-6">
        {/* ── KPI STRIP ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
          <KPI label="Lifetime Value" value={fmt(wonRevenue)} color="text-[#F0A500]" />
          <KPI label="Pipeline" value={fmt(totalDealValue - wonRevenue)} color="text-[#7C5CBF]" />
          <KPI label="Paid" value={fmt(totalPaid)} color="text-emerald-500" />
          <KPI label="Deals" value={String(data.deals.length)} color="text-[#0B1F3A]" />
          <KPI label="Solar Projects" value={String(data.solar_projects.length)} color="text-amber-500" />
          <KPI label="Contracts" value={String(data.contracts.length)} color="text-blue-500" />
          <KPI label="Tickets" value={String(data.tickets.length)} color="text-red-400" />
        </div>

        <div className="flex gap-6">
          {/* ── LEFT SIDEBAR ── */}
          <div className="w-80 flex-shrink-0 space-y-4">
            {/* Contact Info */}
            <div className="card">
              <h3 className="text-sm font-bold text-[#0B1F3A] mb-3">Contact Info</h3>
              <div className="space-y-2 text-sm">
                {str(c.email) && <div className="flex items-center gap-2 text-gray-600"><Mail size={13} className="text-gray-500" /><a href={`mailto:${str(c.email)}`} className="text-[#007A67] hover:underline">{str(c.email)}</a></div>}
                {str(c.phone) && <div className="flex items-center gap-2 text-gray-600"><Phone size={13} className="text-gray-500" />{str(c.phone)}</div>}
                {str(c.mobile) && <div className="flex items-center gap-2 text-gray-600"><Phone size={13} className="text-gray-500" />{str(c.mobile)} <span className="text-xs text-gray-500">(mobile)</span></div>}
                {str(c.address) && (
                  <div className="flex items-start gap-2 text-gray-600">
                    <MapPin size={13} className="text-gray-500 mt-0.5" />
                    <div>{str(c.address)}<br />{[str(c.city), str(c.state)].filter(Boolean).join(', ')} {str(c.zip)}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Key Dates */}
            <div className="card">
              <h3 className="text-sm font-bold text-[#0B1F3A] mb-3">Key Dates</h3>
              <div className="space-y-2 text-sm">
                <DateRow label="Created" date={str(c.created_at)} />
                <DateRow label="Last Activity" date={str(c.last_activity_at)} />
                <DateRow label="Last Contacted" date={str(c.last_contacted_at)} />
                {str(c.date_of_birth) && <DateRow label="DOB" date={str(c.date_of_birth)} />}
              </div>
            </div>

            {/* Credit / Prequal Section */}
            <div className="card border-l-4 border-[#7C5CBF]">
              <h3 className="text-sm font-bold text-[#0B1F3A] mb-2 flex items-center gap-2"><Shield size={14} className="text-[#7C5CBF]" /> Credit / PreQual</h3>
              <p className="text-xs text-gray-500 mb-3">ENFN & TransUnion profile data from HubSpot</p>
              {renderCreditSection(c)}
            </div>

            {/* HubSpot Sync */}
            {str(c.hubspot_id) && (
              <div className="card">
                <h3 className="text-sm font-bold text-[#0B1F3A] mb-2">HubSpot</h3>
                <div className="text-xs text-gray-500 space-y-1">
                  <p>ID: {str(c.hubspot_id)}</p>
                  <p>Last synced: {fmtDateTime(str(c.hubspot_synced_at))}</p>
                </div>
              </div>
            )}

            {/* Notes */}
            <div className="card">
              <h3 className="text-sm font-bold text-[#0B1F3A] mb-3 flex items-center justify-between">
                Notes <span className="text-xs text-gray-500">{data.notes.length}</span>
              </h3>
              {data.notes.length === 0 ? (
                <p className="text-xs text-gray-500">No notes yet</p>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {data.notes.map(n => (
                    <div key={str(n.id)} className="text-xs p-2 bg-gray-50 rounded">
                      <p className="text-gray-700">{str(n.body)}</p>
                      <p className="text-gray-500 mt-1">{fmtDateTime(str(n.created_at))}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── MAIN CONTENT ── */}
          <div className="flex-1 min-w-0">
            {/* Tab Navigation */}
            <div className="flex gap-1 mb-4 overflow-x-auto pb-1">
              {tabs.map(t => (
                <button key={t.key} onClick={() => setActiveTab(t.key)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                    activeTab === t.key ? 'bg-[#0B1F3A] text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}>
                  <t.icon size={13} />
                  {t.label}
                  {t.count > 0 && <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[11px] ${activeTab === t.key ? 'bg-white/20' : 'bg-gray-100'}`}>{t.count}</span>}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'timeline' && <TimelineTab timeline={timeline} />}
            {activeTab === 'deals' && <DealsTab deals={data.deals} />}
            {activeTab === 'contracts' && <ContractsTab contracts={data.contracts} />}
            {activeTab === 'solar' && <SolarTab projects={data.solar_projects} />}
            {activeTab === 'tickets' && <TicketsTab tickets={data.tickets} />}
            {activeTab === 'payments' && <PaymentsTab invoices={data.invoices} payments={data.payments} />}
            {activeTab === 'comms' && <CommsTab contactId={str(c.id)} />}
            {activeTab === 'photos' && <PhotosTab contactId={str(c.id)} />}
            {activeTab === 'reviews' && <ReviewsTab contactName={`${str(c.first_name)} ${str(c.last_name)}`} />}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════ COMPONENTS ═══════════ */

function KPI({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="card text-center py-3">
      <p className="text-[11px] text-gray-500 uppercase tracking-wide">{label}</p>
      <p className={`text-lg font-bold ${color}`}>{value}</p>
    </div>
  );
}

function DateRow({ label, date }: { label: string; date: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-500">{label}</span>
      <span className="text-gray-700 font-medium">{fmtDate(date)}</span>
    </div>
  );
}

function renderCreditSection(c: Record<string, unknown>) {
  const props = (c.custom_properties || {}) as Record<string, unknown>;
  const prequal_date = str(props.prequal_date);
  const prequal_status = str(props.prequal_status);
  const credit_score = num(props.credit_score);
  const enfn_status = str(props.enfn_status);

  if (!prequal_date && !credit_score && !prequal_status) {
    return (
      <div className="text-center py-4">
        <p className="text-xs text-gray-500">No prequal data yet</p>
        <button className="mt-2 text-xs text-[#7C5CBF] font-medium hover:underline">Run PreQual Check</button>
      </div>
    );
  }

  return (
    <div className="space-y-2 text-sm">
      {prequal_status && (
        <div className="flex justify-between items-center">
          <span className="text-gray-500">Status</span>
          <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${prequal_status === 'passed' ? 'bg-emerald-50 text-emerald-600' : prequal_status === 'failed' ? 'bg-red-50 text-red-500' : 'bg-yellow-50 text-yellow-600'}`}>
            {prequal_status.toUpperCase()}
          </span>
        </div>
      )}
      {prequal_date && <div className="flex justify-between"><span className="text-gray-500">Date</span><span className="font-medium">{fmtDateTime(prequal_date)}</span></div>}
      {credit_score > 0 && <div className="flex justify-between"><span className="text-gray-500">Score</span><span className="font-bold text-[#0B1F3A]">{credit_score}</span></div>}
      {enfn_status && <div className="flex justify-between"><span className="text-gray-500">ENFN</span><span className="font-medium">{enfn_status}</span></div>}
    </div>
  );
}

/* ── TIMELINE ── */
interface TimelineEvent { type: string; title: string; description: string; date: string; icon: string; color: string; }

function buildTimeline(data: ContactDNA): TimelineEvent[] {
  const events: TimelineEvent[] = [];

  // Activities
  data.activities.forEach(a => {
    events.push({ type: str(a.activity_type), title: str(a.subject) || str(a.activity_type), description: str(a.body), date: str(a.created_at), icon: 'activity', color: '#3B82F6' });
  });

  // Deals
  data.deals.forEach(d => {
    events.push({ type: 'deal', title: `Deal: ${str(d.name)}`, description: `${str(d.stage_name)} · ${fmt(num(d.amount))}`, date: str(d.created_at), icon: 'deal', color: '#F0A500' });
  });

  // Contracts
  data.contracts.forEach(c => {
    events.push({ type: 'contract', title: `Contract: ${str(c.title) || str(c.contract_type)}`, description: `${str(c.status)} · ${fmt(num(c.contract_amount))}`, date: str(c.created_at), icon: 'contract', color: '#7C5CBF' });
    if (str(c.customer_signed_at)) {
      events.push({ type: 'signature', title: `Contract Signed: ${str(c.title) || str(c.contract_type)}`, description: 'Customer signature captured', date: str(c.customer_signed_at), icon: 'signature', color: '#10B981' });
    }
  });

  // Solar
  data.solar_projects.forEach(p => {
    events.push({ type: 'solar', title: `Solar Project Created`, description: `${str(p.system_size_kw)} kW · ${str(p.panel_count)} panels`, date: str(p.created_at), icon: 'solar', color: '#F59E0B' });
    // Add timeline events from solar_project_timeline
    const tl = (p.solar_project_timeline || []) as Record<string, unknown>[];
    tl.forEach(t => {
      events.push({ type: 'solar_stage', title: `Solar: ${str(t.stage_name)}`, description: str(t.notes) || '', date: str(t.transitioned_at) || str(t.created_at), icon: 'solar', color: '#F59E0B' });
    });
  });

  // Tickets
  data.tickets.forEach(t => {
    events.push({ type: 'ticket', title: `Ticket: ${str(t.subject)}`, description: `${str(t.priority)} · ${str(t.status)}`, date: str(t.created_at), icon: 'ticket', color: '#EF4444' });
  });

  // Payments
  data.payments.forEach(p => {
    events.push({ type: 'payment', title: `Payment: ${fmt(num(p.amount))}`, description: `${str(p.payment_method)} · ${str(p.status)}`, date: str(p.created_at), icon: 'payment', color: '#10B981' });
  });

  // Notes
  data.notes.forEach(n => {
    events.push({ type: 'note', title: 'Note added', description: str(n.body).substring(0, 120), date: str(n.created_at), icon: 'note', color: '#6B7280' });
  });

  return events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

function TimelineTab({ timeline }: { timeline: TimelineEvent[] }) {
  const iconMap: Record<string, typeof Clock> = {
    activity: Zap, deal: DollarSign, contract: FileText, signature: CheckCircle2,
    solar: Sun, solar_stage: Sun, ticket: Shield, payment: DollarSign, note: MessageSquare,
  };

  if (timeline.length === 0) return <EmptyState icon={Clock} title="No activity yet" subtitle="Interactions will appear here as they happen" />;

  return (
    <div className="space-y-1">
      {timeline.map((ev, i) => {
        const Icon = iconMap[ev.icon] || Clock;
        return (
          <div key={i} className="flex gap-3 group">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: ev.color + '15' }}>
                <Icon size={14} style={{ color: ev.color }} />
              </div>
              {i < timeline.length - 1 && <div className="w-px flex-1 bg-gray-200 my-1" />}
            </div>
            <div className="pb-4 flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-[#0B1F3A]">{ev.title}</p>
                <span className="text-[11px] text-gray-500 whitespace-nowrap ml-2">{fmtDateTime(ev.date)}</span>
              </div>
              {ev.description && <p className="text-xs text-gray-500 mt-0.5">{ev.description}</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── DEALS TAB ── */
function DealsTab({ deals }: { deals: Record<string, unknown>[] }) {
  if (deals.length === 0) return <EmptyState icon={DollarSign} title="No deals" subtitle="Create a deal to start tracking revenue" />;
  return (
    <div className="space-y-3">
      {deals.map(d => (
        <div key={str(d.id)} className="card hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-[#0B1F3A]">{str(d.name)}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 font-medium">{str(d.stage_name)}</span>
                <span className="text-xs text-gray-500">{str(d.deal_type)}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-[#F0A500]">{fmt(num(d.amount))}</p>
              <div className="flex items-center gap-1 justify-end">
                {d.is_won ? <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 font-bold">WON</span> : null}
                {d.is_lost ? <span className="text-xs px-2 py-0.5 rounded-full bg-red-50 text-red-500 font-bold">LOST</span> : null}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
            <span>Created: {fmtDate(str(d.created_at))}</span>
            {str(d.close_date) && <span>Close: {fmtDate(str(d.close_date))}</span>}
            {str(d.expected_close_date) && <span>Expected: {fmtDate(str(d.expected_close_date))}</span>}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── CONTRACTS TAB ── */
function ContractsTab({ contracts }: { contracts: Record<string, unknown>[] }) {
  if (contracts.length === 0) return <EmptyState icon={FileText} title="No contracts" subtitle="Contracts will appear here when created" />;
  return (
    <div className="space-y-3">
      {contracts.map(ct => (
        <div key={str(ct.id)} className="card hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-[#0B1F3A]">{str(ct.title) || str(ct.contract_type)}</p>
              <p className="text-xs text-gray-500 mt-0.5">#{str(ct.contract_number)}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-[#7C5CBF]">{fmt(num(ct.contract_amount))}</p>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                str(ct.status) === 'signed' ? 'bg-emerald-50 text-emerald-600' :
                str(ct.status) === 'cancelled' ? 'bg-red-50 text-red-500' :
                'bg-blue-50 text-blue-600'
              }`}>{str(ct.status)}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-xs">
            <div><p className="text-gray-500">Type</p><p className="font-medium text-gray-700">{str(ct.contract_type)}</p></div>
            <div><p className="text-gray-500">Term</p><p className="font-medium text-gray-700">{num(ct.term_months)} months</p></div>
            <div><p className="text-gray-500">Monthly</p><p className="font-medium text-gray-700">{fmt(num(ct.monthly_amount))}</p></div>
            <div><p className="text-gray-500">Signed</p><p className="font-medium text-gray-700">{fmtDateTime(str(ct.customer_signed_at))}</p></div>
          </div>
          <div className="flex items-center gap-2 mt-3">
            {str(ct.pdf_url) && <a href={str(ct.pdf_url)} target="_blank" rel="noopener noreferrer" className="text-xs text-[#007A67] hover:underline flex items-center gap-1"><FileText size={11} /> View PDF</a>}
            {str(ct.signed_pdf_url) && <a href={str(ct.signed_pdf_url)} target="_blank" rel="noopener noreferrer" className="text-xs text-[#007A67] hover:underline flex items-center gap-1"><CheckCircle2 size={11} /> Signed Copy</a>}
            <button className="text-xs text-gray-500 hover:text-gray-600 flex items-center gap-1 ml-auto"><Download size={11} /> Export</button>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── SOLAR TAB ── */
function SolarTab({ projects }: { projects: Record<string, unknown>[] }) {
  if (projects.length === 0) return <EmptyState icon={Sun} title="No solar projects" subtitle="Solar projects will appear here" />;

  const STAGES = [
    { key: 'ntp', label: 'NTP' }, { key: 'welcome_call_done', label: 'Welcome Call' },
    { key: 'site_survey', label: 'Site Survey' }, { key: 'cad', label: 'CAD' },
    { key: 'permit_sub', label: 'Permit Sub' }, { key: 'permit_approval', label: 'Permit' },
    { key: 'install_schedule', label: 'Install' }, { key: 'inspection', label: 'Inspection' },
    { key: 'interconnection_pto_complete', label: 'PTO' }, { key: 'final_complete', label: 'Complete' },
  ];

  return (
    <div className="space-y-4">
      {projects.map(p => {
        const currentStage = str(p.current_stage);
        const stageIdx = STAGES.findIndex(s => s.key === currentStage);
        const docs = (p.solar_documents || []) as Record<string, unknown>[];
        return (
          <div key={str(p.id)} className="card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-bold text-[#0B1F3A]">{str(p.address) || 'Solar Project'}</p>
                <p className="text-xs text-gray-500">{[str(p.city), str(p.state)].filter(Boolean).join(', ')}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-[#F0A500]">{num(p.system_size_kw)} kW · {num(p.panel_count)} panels</p>
                <p className="text-xs text-gray-500">{fmt(num(p.contract_amount))}</p>
              </div>
            </div>
            {/* Stage Progress */}
            <div className="flex gap-0.5 mb-4">
              {STAGES.map((s, i) => (
                <div key={s.key} className="flex-1 text-center">
                  <div className={`h-2 rounded-full ${i <= stageIdx ? 'bg-[#F0A500]' : 'bg-gray-200'}`} />
                  <p className="text-[9px] text-gray-500 mt-1 truncate">{s.label}</p>
                </div>
              ))}
            </div>
            {/* Documents */}
            {docs.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-200/60">
                <p className="text-xs font-bold text-gray-500 mb-2">Documents ({docs.length})</p>
                <div className="space-y-1">
                  {docs.map(d => (
                    <div key={str(d.id)} className="flex items-center justify-between text-xs py-1">
                      <span className="flex items-center gap-1 text-gray-700"><FileText size={11} className="text-gray-500" />{str(d.file_name)}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">{str(d.document_type)}</span>
                        {str(d.file_url) && <a href={str(d.file_url)} target="_blank" rel="noopener noreferrer" className="text-[#007A67] hover:underline"><Download size={11} /></a>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ── TICKETS TAB ── */
function TicketsTab({ tickets }: { tickets: Record<string, unknown>[] }) {
  if (tickets.length === 0) return <EmptyState icon={Shield} title="No tickets" subtitle="Support tickets will appear here" />;
  const priorityColors: Record<string, string> = { critical: 'bg-red-100 text-red-700', high: 'bg-orange-100 text-orange-700', medium: 'bg-yellow-100 text-yellow-700', low: 'bg-blue-100 text-blue-700' };
  return (
    <div className="space-y-2">
      {tickets.map(t => (
        <div key={str(t.id)} className="card hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-[#0B1F3A]">{str(t.subject)}</p>
              <p className="text-xs text-gray-500 mt-0.5">#{str(t.ticket_number)} · {fmtDate(str(t.created_at))}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${priorityColors[str(t.priority)] || 'bg-gray-100 text-gray-600'}`}>{str(t.priority)}</span>
              <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${str(t.status) === 'open' ? 'bg-red-50 text-red-500' : str(t.status) === 'resolved' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-600'}`}>{str(t.status)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── PAYMENTS TAB ── */
function PaymentsTab({ invoices, payments }: { invoices: Record<string, unknown>[]; payments: Record<string, unknown>[] }) {
  if (invoices.length === 0 && payments.length === 0) return <EmptyState icon={DollarSign} title="No financial records" subtitle="Invoices and payments will appear here" />;
  return (
    <div className="space-y-4">
      {invoices.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-[#0B1F3A] mb-2">Invoices</h3>
          <div className="space-y-2">
            {invoices.map(inv => (
              <div key={str(inv.id)} className="card">
                <div className="flex items-center justify-between">
                  <div><p className="text-sm font-medium">#{str(inv.invoice_number)}</p><p className="text-xs text-gray-500">{fmtDate(str(inv.created_at))}</p></div>
                  <div className="text-right">
                    <p className="font-bold text-[#0B1F3A]">{fmt(num(inv.total_amount))}</p>
                    <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${str(inv.status) === 'paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>{str(inv.status)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {payments.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-[#0B1F3A] mb-2">Payments</h3>
          <div className="space-y-2">
            {payments.map(p => (
              <div key={str(p.id)} className="card flex items-center justify-between">
                <div><p className="text-sm font-medium">{str(p.payment_method)}</p><p className="text-xs text-gray-500">{fmtDateTime(str(p.created_at))}</p></div>
                <p className="font-bold text-emerald-600">{fmt(num(p.amount))}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── COMMUNICATIONS TAB (RingCentral + Email) ── */
function CommsTab({ contactId }: { contactId: string }) {
  return (
    <div className="space-y-4">
      {/* Call Recordings section - connects to RingCentral */}
      <div className="card border-l-4 border-blue-500">
        <h3 className="text-sm font-bold text-[#0B1F3A] flex items-center gap-2 mb-3"><PhoneCall size={14} className="text-blue-500" /> Call Recordings</h3>
        <p className="text-xs text-gray-500 mb-3">RingCentral call recordings, Call Pilot pre-install calls</p>
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <PhoneCall size={32} className="mx-auto text-blue-400 mb-2" />
          <p className="text-sm font-medium text-blue-700">RingCentral Integration Ready</p>
          <p className="text-xs text-blue-500 mt-1">Call recordings and texts will appear here once synced</p>
          <button className="mt-3 px-4 py-1.5 bg-blue-500 text-white text-xs rounded-lg hover:bg-blue-600">Sync Calls</button>
        </div>
      </div>

      {/* SMS / Text section */}
      <div className="card border-l-4 border-emerald-500">
        <h3 className="text-sm font-bold text-[#0B1F3A] flex items-center gap-2 mb-3"><MessageSquare size={14} className="text-emerald-500" /> Text Messages</h3>
        <p className="text-xs text-gray-500 mb-3">RingCentral SMS history</p>
        <div className="bg-emerald-50 rounded-lg p-4 text-center">
          <MessageSquare size={32} className="mx-auto text-emerald-400 mb-2" />
          <p className="text-sm font-medium text-emerald-700">SMS Sync Ready</p>
          <p className="text-xs text-emerald-500 mt-1">Text message history will appear here</p>
          <button className="mt-3 px-4 py-1.5 bg-emerald-500 text-white text-xs rounded-lg hover:bg-emerald-600">Sync Texts</button>
        </div>
      </div>

      {/* Email section */}
      <div className="card border-l-4 border-violet-500">
        <h3 className="text-sm font-bold text-[#0B1F3A] flex items-center gap-2 mb-3"><Mail size={14} className="text-violet-500" /> Email Exchanges</h3>
        <p className="text-xs text-gray-500 mb-3">All email correspondence with this contact</p>
        <div className="bg-violet-50 rounded-lg p-4 text-center">
          <Mail size={32} className="mx-auto text-violet-400 mb-2" />
          <p className="text-sm font-medium text-violet-700">Email History Ready</p>
          <p className="text-xs text-violet-500 mt-1">Emails synced from HubSpot and direct integrations</p>
          <button className="mt-3 px-4 py-1.5 bg-violet-500 text-white text-xs rounded-lg hover:bg-violet-600">Sync Emails</button>
        </div>
      </div>

      <div className="flex gap-2">
        <button className="flex-1 py-2 bg-gray-100 rounded-lg text-xs text-gray-500 hover:bg-gray-200 flex items-center justify-center gap-1"><Download size={12} /> Export All Communications</button>
      </div>
    </div>
  );
}

/* ── PHOTOS TAB (CompanyCam) ── */
function PhotosTab({ contactId }: { contactId: string }) {
  return (
    <div className="card border-l-4 border-amber-500">
      <h3 className="text-sm font-bold text-[#0B1F3A] flex items-center gap-2 mb-3"><Camera size={14} className="text-amber-500" /> Install Photos</h3>
      <p className="text-xs text-gray-500 mb-3">Photos from CompanyCam — Solar, Roofing, Alarm installs with timestamps</p>
      <div className="bg-amber-50 rounded-lg p-6 text-center">
        <Camera size={40} className="mx-auto text-amber-400 mb-3" />
        <p className="text-sm font-medium text-amber-700">CompanyCam Integration Ready</p>
        <p className="text-xs text-amber-500 mt-1">Install photos with timestamps will appear here once the project is linked</p>
        <button className="mt-3 px-4 py-1.5 bg-amber-500 text-white text-xs rounded-lg hover:bg-amber-600">Link CompanyCam Project</button>
      </div>
      <div className="flex gap-2 mt-3">
        <button className="flex-1 py-2 bg-gray-100 rounded-lg text-xs text-gray-500 hover:bg-gray-200 flex items-center justify-center gap-1"><Download size={12} /> Export All Photos</button>
      </div>
    </div>
  );
}

/* ── REVIEWS TAB (GoldenReviews) ── */
function ReviewsTab({ contactName }: { contactName: string }) {
  return (
    <div className="card border-l-4 border-[#F0A500]">
      <h3 className="text-sm font-bold text-[#0B1F3A] flex items-center gap-2 mb-3"><Star size={14} className="text-[#F0A500]" /> GoldenReviews</h3>
      <p className="text-xs text-gray-500 mb-3">Customer review status and request management</p>
      <div className="bg-[#F0A500]/5 rounded-lg p-6 text-center">
        <Star size={40} className="mx-auto text-[#F0A500] mb-3" />
        <p className="text-sm font-medium text-[#0B1F3A]">No reviews from {contactName} yet</p>
        <p className="text-xs text-gray-500 mt-1">Send a review request to collect feedback</p>
        <button className="mt-3 px-4 py-1.5 bg-[#F0A500] text-[#0B1F3A] text-xs font-bold rounded-lg hover:bg-[#F0A500]/90 flex items-center gap-1 mx-auto">
          <Send size={12} /> Request Review
        </button>
      </div>
    </div>
  );
}

/* ── EMPTY STATE ── */
function EmptyState({ icon: Icon, title, subtitle }: { icon: typeof Clock; title: string; subtitle: string }) {
  return (
    <div className="card text-center py-12 text-gray-500">
      <Icon size={40} className="mx-auto mb-3 opacity-40" />
      <p className="font-medium">{title}</p>
      <p className="text-sm mt-1">{subtitle}</p>
    </div>
  );
}
