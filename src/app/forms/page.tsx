"use client";
import { useState } from "react";
import { FileText, Plus, Eye, Copy, Trash2, BarChart3, ExternalLink, GripVertical, X, Type, Mail, Phone, Hash, AlignLeft, CheckSquare, ChevronDown, Calendar, Upload, ToggleLeft } from "lucide-react";

const fieldTypes = [
  { id: "text", label: "Single-line text", icon: Type },
  { id: "email", label: "Email", icon: Mail },
  { id: "phone", label: "Phone", icon: Phone },
  { id: "number", label: "Number", icon: Hash },
  { id: "textarea", label: "Multi-line text", icon: AlignLeft },
  { id: "checkbox", label: "Checkbox", icon: CheckSquare },
  { id: "dropdown", label: "Dropdown", icon: ChevronDown },
  { id: "date", label: "Date picker", icon: Calendar },
  { id: "file", label: "File upload", icon: Upload },
  { id: "toggle", label: "Toggle", icon: ToggleLeft },
];

interface FormField { id: string; type: string; label: string; required: boolean; placeholder: string; }
interface FormDef {
  id: number; name: string; status: "active"|"draft"|"archived"; submissions: number; conversionRate: number;
  views: number; lastSubmission: string; vertical: string; fields: FormField[];
}

const initialForms: FormDef[] = [
  { id:1, name:"Solar Quote Request", status:"active", submissions:342, conversionRate:24.8, views:1380, lastSubmission:"2 hours ago", vertical:"Solar",
    fields:[{id:"f1",type:"text",label:"Full Name",required:true,placeholder:"John Doe"},{id:"f2",type:"email",label:"Email",required:true,placeholder:"john@example.com"},{id:"f3",type:"phone",label:"Phone",required:true,placeholder:"(555) 123-4567"},{id:"f4",type:"text",label:"Address",required:true,placeholder:"123 Main St"},{id:"f5",type:"dropdown",label:"Monthly Electric Bill",required:true,placeholder:"Select range"},{id:"f6",type:"dropdown",label:"Roof Type",required:false,placeholder:"Select type"},{id:"f7",type:"toggle",label:"Homeowner?",required:true,placeholder:""}] },
  { id:2, name:"Smart Home Assessment", status:"active", submissions:187, conversionRate:31.2, views:600, lastSubmission:"5 hours ago", vertical:"Smart Home",
    fields:[{id:"f1",type:"text",label:"Full Name",required:true,placeholder:""},{id:"f2",type:"email",label:"Email",required:true,placeholder:""},{id:"f3",type:"phone",label:"Phone",required:true,placeholder:""},{id:"f4",type:"number",label:"Home Square Footage",required:false,placeholder:"2000"},{id:"f5",type:"checkbox",label:"Interested in Cameras",required:false,placeholder:""}] },
  { id:3, name:"Roofing Inspection Request", status:"active", submissions:94, conversionRate:41.5, views:227, lastSubmission:"1 day ago", vertical:"Roofing",
    fields:[{id:"f1",type:"text",label:"Full Name",required:true,placeholder:""},{id:"f2",type:"email",label:"Email",required:true,placeholder:""},{id:"f3",type:"text",label:"Address",required:true,placeholder:""},{id:"f4",type:"textarea",label:"Describe Issue",required:false,placeholder:""}] },
  { id:4, name:"AT&T Bundle Interest", status:"draft", submissions:0, conversionRate:0, views:0, lastSubmission:"—", vertical:"AT&T",
    fields:[{id:"f1",type:"text",label:"Full Name",required:true,placeholder:""},{id:"f2",type:"email",label:"Email",required:true,placeholder:""},{id:"f3",type:"phone",label:"Phone",required:true,placeholder:""}] },
  { id:5, name:"Customer Referral Form", status:"active", submissions:156, conversionRate:62.1, views:251, lastSubmission:"3 hours ago", vertical:"All",
    fields:[{id:"f1",type:"text",label:"Your Name",required:true,placeholder:""},{id:"f2",type:"text",label:"Referral Name",required:true,placeholder:""},{id:"f3",type:"phone",label:"Referral Phone",required:true,placeholder:""},{id:"f4",type:"dropdown",label:"Service Interested In",required:true,placeholder:""}] },
  { id:6, name:"Warranty Claim", status:"archived", submissions:43, conversionRate:88.4, views:49, lastSubmission:"2 weeks ago", vertical:"Solar",
    fields:[{id:"f1",type:"text",label:"Customer Name",required:true,placeholder:""},{id:"f2",type:"text",label:"System ID",required:true,placeholder:""},{id:"f3",type:"textarea",label:"Issue Description",required:true,placeholder:""}] },
];

export default function FormsPage() {
  const [forms, setForms] = useState<FormDef[]>(initialForms);
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [builder, setBuilder] = useState<FormDef|null>(null);
  const [preview, setPreview] = useState<FormDef|null>(null);

  const filtered = forms.filter(f => {
    if (filter !== "all" && f.status !== filter) return false;
    if (search && !f.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totalSubs = forms.reduce((a,b)=>a+b.submissions,0);
  const totalViews = forms.reduce((a,b)=>a+b.views,0);
  const avgConversion = forms.filter(f=>f.submissions>0).reduce((a,b)=>a+b.conversionRate,0) / Math.max(forms.filter(f=>f.submissions>0).length,1);

  const addField = () => {
    if (!builder) return;
    const newField: FormField = { id: `f${Date.now()}`, type: "text", label: "New Field", required: false, placeholder: "" };
    setBuilder({...builder, fields: [...builder.fields, newField]});
  };
  const removeField = (fid: string) => {
    if (!builder) return;
    setBuilder({...builder, fields: builder.fields.filter(f=>f.id!==fid)});
  };
  const updateField = (fid: string, key: keyof FormField, val: string|boolean) => {
    if (!builder) return;
    setBuilder({...builder, fields: builder.fields.map(f => f.id===fid ? {...f,[key]:val} : f)});
  };

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-black">Forms & Lead Capture</h1>
          <p className="text-sm text-gray-500 mt-1">Build forms, capture leads, track conversions</p>
        </div>
        <button onClick={()=>setBuilder({id:Date.now(),name:"New Form",status:"draft",submissions:0,conversionRate:0,views:0,lastSubmission:"—",vertical:"Solar",fields:[]})}
          className="flex items-center gap-2 px-4 py-2 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800">
          <Plus size={16}/>Create Form
        </button>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[{l:"Total Forms",v:forms.length},{l:"Total Submissions",v:totalSubs.toLocaleString()},{l:"Total Views",v:totalViews.toLocaleString()},{l:"Avg Conversion",v:`${avgConversion.toFixed(1)}%`}].map(k=>(
          <div key={k.l} className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wide">{k.l}</p>
            <p className="text-2xl font-bold text-black mt-1">{k.v}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-4">
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search forms..." className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-black/20"/>
        {["all","active","draft","archived"].map(s=>(
          <button key={s} onClick={()=>setFilter(s)} className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize ${filter===s?"bg-black text-white":"bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>{s}</button>
        ))}
      </div>

      {/* Forms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(form=>(
          <div key={form.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <FileText size={18} className="text-gray-500"/>
                <h3 className="font-semibold text-sm text-black">{form.name}</h3>
              </div>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full uppercase ${form.status==="active"?"bg-green-100 text-green-700":form.status==="draft"?"bg-amber-100 text-amber-700":"bg-gray-100 text-gray-500"}`}>{form.status}</span>
            </div>
            <p className="text-xs text-gray-500 mb-3">{form.vertical} · {form.fields.length} fields</p>
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div><p className="text-lg font-bold text-black">{form.submissions}</p><p className="text-[11px] text-gray-500">Submissions</p></div>
              <div><p className="text-lg font-bold text-black">{form.views}</p><p className="text-[11px] text-gray-500">Views</p></div>
              <div><p className="text-lg font-bold text-black">{form.conversionRate}%</p><p className="text-[11px] text-gray-500">Conversion</p></div>
            </div>
            <p className="text-[11px] text-gray-500 mb-3">Last submission: {form.lastSubmission}</p>
            <div className="flex items-center gap-2 border-t border-gray-200/60 pt-3">
              <button onClick={()=>setBuilder(form)} className="flex items-center gap-1 text-xs text-gray-500 hover:text-black"><FileText size={12}/>Edit</button>
              <button onClick={()=>setPreview(form)} className="flex items-center gap-1 text-xs text-gray-500 hover:text-black"><Eye size={12}/>Preview</button>
              <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-black"><Copy size={12}/>Clone</button>
              <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-black"><ExternalLink size={12}/>Share</button>
              <button className="flex items-center gap-1 text-xs text-red-400 hover:text-red-600 ml-auto"><Trash2 size={12}/></button>
            </div>
          </div>
        ))}
      </div>

      {/* Form Builder Modal */}
      {builder && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-gray-200">
              <input value={builder.name} onChange={e=>setBuilder({...builder,name:e.target.value})} className="text-lg font-bold text-black bg-transparent outline-none border-b border-transparent focus:border-gray-300 w-64"/>
              <div className="flex items-center gap-2">
                <select value={builder.vertical} onChange={e=>setBuilder({...builder,vertical:e.target.value})} className="text-xs border border-gray-200 rounded px-2 py-1">
                  <option>Solar</option><option>Smart Home</option><option>Roofing</option><option>AT&T</option><option>All</option>
                </select>
                <button onClick={()=>{setForms(prev=>{const exists=prev.find(f=>f.id===builder.id);return exists?prev.map(f=>f.id===builder.id?builder:f):[...prev,builder]});setBuilder(null)}} className="px-4 py-1.5 bg-black text-white text-xs font-semibold rounded-lg">Save</button>
                <button onClick={()=>setBuilder(null)} className="p-1.5 hover:bg-gray-100 rounded"><X size={18}/></button>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-5">
              <div className="grid grid-cols-[1fr_280px] gap-6">
                {/* Fields list */}
                <div className="space-y-3">
                  {builder.fields.map(field => {
                    const FIcon = fieldTypes.find(t=>t.id===field.type)?.icon || Type;
                    return (
                      <div key={field.id} className="flex items-start gap-3 bg-gray-50 rounded-lg p-3 border border-gray-200 group">
                        <GripVertical size={16} className="text-gray-300 mt-1 cursor-grab"/>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <FIcon size={14} className="text-gray-500"/>
                            <input value={field.label} onChange={e=>updateField(field.id,"label",e.target.value)} className="text-sm font-medium text-black bg-transparent outline-none flex-1"/>
                            <label className="flex items-center gap-1 text-[11px] text-gray-500">
                              <input type="checkbox" checked={field.required} onChange={e=>updateField(field.id,"required",e.target.checked)} className="accent-black w-3 h-3"/>Required
                            </label>
                          </div>
                          <div className="flex items-center gap-2">
                            <select value={field.type} onChange={e=>updateField(field.id,"type",e.target.value)} className="text-[11px] border border-gray-200 rounded px-2 py-1 bg-white">
                              {fieldTypes.map(t=><option key={t.id} value={t.id}>{t.label}</option>)}
                            </select>
                            <input value={field.placeholder} onChange={e=>updateField(field.id,"placeholder",e.target.value)} placeholder="Placeholder text" className="text-[11px] border border-gray-200 rounded px-2 py-1 flex-1 bg-white"/>
                          </div>
                        </div>
                        <button onClick={()=>removeField(field.id)} className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 rounded text-red-400"><Trash2 size={14}/></button>
                      </div>
                    );
                  })}
                  <button onClick={addField} className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:text-black hover:border-black transition-colors flex items-center justify-center gap-2">
                    <Plus size={16}/>Add Field
                  </button>
                </div>
                {/* Field Types Palette */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 h-fit sticky top-0">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-3">Field Types</p>
                  <div className="space-y-1">
                    {fieldTypes.map(t=>{
                      const I=t.icon;
                      return <button key={t.id} onClick={()=>{const nf:FormField={id:`f${Date.now()}${Math.random()}`,type:t.id,label:t.label,required:false,placeholder:""};setBuilder({...builder,fields:[...builder.fields,nf]})}}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-gray-600 hover:bg-white hover:shadow-sm transition-all">
                        <I size={14}/>{t.label}
                      </button>;
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {preview && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[80vh] overflow-auto p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-black">{preview.name}</h2>
              <button onClick={()=>setPreview(null)} className="p-1 hover:bg-gray-100 rounded"><X size={18}/></button>
            </div>
            <div className="space-y-4">
              {preview.fields.map(field=>(
                <div key={field.id}>
                  <label className="text-sm font-medium text-gray-700">{field.label}{field.required && <span className="text-red-500 ml-1">*</span>}</label>
                  {field.type==="textarea" ? <textarea className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder={field.placeholder} rows={3}/>
                   : field.type==="checkbox" ? <div className="mt-1 flex items-center gap-2"><input type="checkbox" className="accent-black"/><span className="text-sm text-gray-500">{field.placeholder||field.label}</span></div>
                   : field.type==="toggle" ? <div className="mt-1"><div className="w-10 h-5 bg-gray-300 rounded-full relative cursor-pointer"><div className="w-4 h-4 bg-white rounded-full absolute top-0.5 left-0.5 shadow"/></div></div>
                   : field.type==="dropdown" ? <select className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"><option>{field.placeholder||"Select..."}</option></select>
                   : field.type==="file" ? <div className="mt-1 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center text-sm text-gray-500">Click or drag to upload</div>
                   : <input type={field.type==="email"?"email":field.type==="phone"?"tel":field.type==="number"?"number":field.type==="date"?"date":"text"} className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder={field.placeholder}/>}
                </div>
              ))}
              <button className="w-full py-3 bg-black text-white font-semibold rounded-lg mt-4">Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
