"use client";
import { useState } from "react";
import { Settings, Plus, Search, Edit, Trash2, GripVertical, X, Hash, Type, Calendar, ToggleLeft, ChevronDown, List, Users, Handshake, FileSignature, Tag } from "lucide-react";

type PropType = "text"|"number"|"date"|"dropdown"|"checkbox"|"currency"|"phone"|"email"|"url"|"textarea";
interface Property { id:number; name:string; internalName:string; type:PropType; group:string; object:string; required:boolean; showInTable:boolean; description:string; options?:string[]; }

const propertyGroups = ["Contact Info","Deal Info","Solar Details","Smart Home","Roofing","AT&T / Telecom","Homeowner Profile","Custom"];
const objectTypes = ["Contacts","Deals","Companies","Tickets"];

const initialProperties: Property[] = [
  {id:1,name:"First Name",internalName:"first_name",type:"text",group:"Contact Info",object:"Contacts",required:true,showInTable:true,description:"Contact's first name"},
  {id:2,name:"Last Name",internalName:"last_name",type:"text",group:"Contact Info",object:"Contacts",required:true,showInTable:true,description:"Contact's last name"},
  {id:3,name:"Email",internalName:"email",type:"email",group:"Contact Info",object:"Contacts",required:true,showInTable:true,description:"Primary email address"},
  {id:4,name:"Phone",internalName:"phone",type:"phone",group:"Contact Info",object:"Contacts",required:false,showInTable:true,description:"Primary phone number"},
  {id:5,name:"Deal Amount",internalName:"deal_amount",type:"currency",group:"Deal Info",object:"Deals",required:true,showInTable:true,description:"Total deal value"},
  {id:6,name:"Close Date",internalName:"close_date",type:"date",group:"Deal Info",object:"Deals",required:true,showInTable:true,description:"Expected close date"},
  {id:7,name:"Pipeline Stage",internalName:"pipeline_stage",type:"dropdown",group:"Deal Info",object:"Deals",required:true,showInTable:true,description:"Current pipeline stage",options:["New Lead","Qualified","Site Survey","Design","Proposal","Contract Sent","Closed Won","Closed Lost"]},
  {id:8,name:"System Size (kW)",internalName:"system_size_kw",type:"number",group:"Solar Details",object:"Deals",required:false,showInTable:true,description:"Solar system size in kilowatts"},
  {id:9,name:"Panel Count",internalName:"panel_count",type:"number",group:"Solar Details",object:"Deals",required:false,showInTable:false,description:"Number of solar panels"},
  {id:10,name:"Panel Manufacturer",internalName:"panel_manufacturer",type:"dropdown",group:"Solar Details",object:"Deals",required:false,showInTable:false,description:"Solar panel brand",options:["Qcell","REC","Canadian Solar","Silfab","Jinko"]},
  {id:11,name:"Inverter Type",internalName:"inverter_type",type:"dropdown",group:"Solar Details",object:"Deals",required:false,showInTable:false,description:"Inverter brand/model",options:["Enphase IQ8+","SolarEdge","Tesla","Generac"]},
  {id:12,name:"Financing Type",internalName:"financing_type",type:"dropdown",group:"Solar Details",object:"Deals",required:false,showInTable:true,description:"Loan or cash purchase",options:["GoodLeap","Mosaic","Sunlight","Dividend","Cash","PPA"]},
  {id:13,name:"Monitoring Provider",internalName:"monitoring_provider",type:"dropdown",group:"Smart Home",object:"Deals",required:false,showInTable:false,description:"Security monitoring provider",options:["ADC","Brinks","Delta Monitoring"]},
  {id:14,name:"Camera Count",internalName:"camera_count",type:"number",group:"Smart Home",object:"Deals",required:false,showInTable:false,description:"Number of cameras installed"},
  {id:15,name:"Monthly Monitoring",internalName:"monthly_monitoring",type:"currency",group:"Smart Home",object:"Deals",required:false,showInTable:false,description:"Monthly monitoring cost"},
  {id:16,name:"Roof Material",internalName:"roof_material",type:"dropdown",group:"Roofing",object:"Deals",required:false,showInTable:false,description:"Roofing material type",options:["Asphalt Shingle","Metal","Tile","Flat/TPO","Slate"]},
  {id:17,name:"AT&T Plan",internalName:"att_plan",type:"dropdown",group:"AT&T / Telecom",object:"Deals",required:false,showInTable:false,description:"AT&T service plan",options:["Internet 300","Internet 500","Fiber 1 Gig","Fiber 2 Gig","Fiber 5 Gig"]},
  {id:18,name:"Credit Score",internalName:"credit_score",type:"number",group:"Homeowner Profile",object:"Contacts",required:false,showInTable:false,description:"Customer credit score"},
  {id:19,name:"Utility Company",internalName:"utility_company",type:"text",group:"Homeowner Profile",object:"Contacts",required:false,showInTable:false,description:"Electric utility provider"},
  {id:20,name:"Avg Electric Bill",internalName:"avg_electric_bill",type:"currency",group:"Homeowner Profile",object:"Contacts",required:false,showInTable:false,description:"Average monthly electric bill"},
];

const typeIcons: Record<PropType,typeof Type> = {text:Type,number:Hash,date:Calendar,dropdown:ChevronDown,checkbox:ToggleLeft,currency:Hash,phone:Type,email:Type,url:Type,textarea:Type};

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>(initialProperties);
  const [search, setSearch] = useState("");
  const [filterGroup, setFilterGroup] = useState<string>("all");
  const [filterObject, setFilterObject] = useState<string>("all");
  const [editor, setEditor] = useState<Property|null>(null);

  const filtered = properties.filter(p => {
    if (filterGroup !== "all" && p.group !== filterGroup) return false;
    if (filterObject !== "all" && p.object !== filterObject) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.internalName.includes(search.toLowerCase())) return false;
    return true;
  });

  const grouped = filtered.reduce<Record<string,Property[]>>((acc,p)=>{(acc[p.group]=acc[p.group]||[]).push(p);return acc},{});

  const saveProperty = () => {
    if (!editor) return;
    setProperties(prev => {
      const exists = prev.find(p=>p.id===editor.id);
      return exists ? prev.map(p=>p.id===editor.id?editor:p) : [...prev, editor];
    });
    setEditor(null);
  };

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-black">Properties Manager</h1>
          <p className="text-sm text-gray-500 mt-1">Custom fields across Contacts, Deals, Companies, and Tickets</p>
        </div>
        <button onClick={()=>setEditor({id:Date.now(),name:"",internalName:"",type:"text",group:"Custom",object:"Contacts",required:false,showInTable:false,description:""})}
          className="flex items-center gap-2 px-4 py-2 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800">
          <Plus size={16}/>Create Property
        </button>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[{l:"Total Properties",v:properties.length},{l:"Contact Properties",v:properties.filter(p=>p.object==="Contacts").length},{l:"Deal Properties",v:properties.filter(p=>p.object==="Deals").length},{l:"Custom Properties",v:properties.filter(p=>p.group==="Custom").length}].map(k=>(
          <div key={k.l} className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wide">{k.l}</p>
            <p className="text-2xl font-bold text-black mt-1">{k.v}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search properties..." className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/20"/>
        </div>
        <select value={filterObject} onChange={e=>setFilterObject(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
          <option value="all">All Objects</option>{objectTypes.map(o=><option key={o} value={o}>{o}</option>)}
        </select>
        <select value={filterGroup} onChange={e=>setFilterGroup(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
          <option value="all">All Groups</option>{propertyGroups.map(g=><option key={g} value={g}>{g}</option>)}
        </select>
      </div>

      {/* Properties by Group */}
      <div className="space-y-4">
        {Object.entries(grouped).map(([group, props])=>(
          <div key={group} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-black">{group}</h2>
              <span className="text-xs text-gray-500">{props.length} properties</span>
            </div>
            <div className="divide-y divide-gray-100">
              {props.map(p=>{
                const TIcon = typeIcons[p.type] || Type;
                return (
                  <div key={p.id} className="flex items-center px-5 py-3 hover:bg-gray-50 group">
                    <GripVertical size={14} className="text-gray-200 mr-3 cursor-grab"/>
                    <TIcon size={14} className="text-gray-500 mr-3"/>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-black">{p.name}</p>
                        {p.required && <span className="text-[9px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-bold">REQUIRED</span>}
                        {p.showInTable && <span className="text-[9px] bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded font-bold">TABLE</span>}
                      </div>
                      <p className="text-[11px] text-gray-500">{p.internalName} · {p.type} · {p.object}</p>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1">
                      <button onClick={()=>setEditor(p)} className="p-1.5 hover:bg-gray-100 rounded text-gray-500 hover:text-black"><Edit size={13}/></button>
                      <button onClick={()=>setProperties(prev=>prev.filter(x=>x.id!==p.id))} className="p-1.5 hover:bg-red-50 rounded text-gray-500 hover:text-red-500"><Trash2 size={13}/></button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Property Editor Modal */}
      {editor && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-black">{editor.name?"Edit Property":"New Property"}</h2>
              <button onClick={()=>setEditor(null)} className="p-1 hover:bg-gray-100 rounded"><X size={18}/></button>
            </div>
            <div className="space-y-4">
              <div><label className="text-xs font-medium text-gray-500">Property Name</label><input value={editor.name} onChange={e=>setEditor({...editor,name:e.target.value,internalName:e.target.value.toLowerCase().replace(/[^a-z0-9]+/g,"_")})} className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"/></div>
              <div><label className="text-xs font-medium text-gray-500">Internal Name</label><input value={editor.internalName} readOnly className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-500"/></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs font-medium text-gray-500">Type</label><select value={editor.type} onChange={e=>setEditor({...editor,type:e.target.value as PropType})} className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                  {(["text","number","date","dropdown","checkbox","currency","phone","email","url","textarea"] as PropType[]).map(t=><option key={t} value={t}>{t}</option>)}
                </select></div>
                <div><label className="text-xs font-medium text-gray-500">Object</label><select value={editor.object} onChange={e=>setEditor({...editor,object:e.target.value})} className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                  {objectTypes.map(o=><option key={o} value={o}>{o}</option>)}
                </select></div>
              </div>
              <div><label className="text-xs font-medium text-gray-500">Group</label><select value={editor.group} onChange={e=>setEditor({...editor,group:e.target.value})} className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                {propertyGroups.map(g=><option key={g} value={g}>{g}</option>)}
              </select></div>
              <div><label className="text-xs font-medium text-gray-500">Description</label><input value={editor.description} onChange={e=>setEditor({...editor,description:e.target.value})} className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"/></div>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={editor.required} onChange={e=>setEditor({...editor,required:e.target.checked})} className="accent-black"/>Required</label>
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={editor.showInTable} onChange={e=>setEditor({...editor,showInTable:e.target.checked})} className="accent-black"/>Show in Table</label>
              </div>
              {editor.type==="dropdown" && (
                <div><label className="text-xs font-medium text-gray-500">Options (comma separated)</label><input value={editor.options?.join(", ")||""} onChange={e=>setEditor({...editor,options:e.target.value.split(",").map(s=>s.trim()).filter(Boolean)})} className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"/></div>
              )}
            </div>
            <div className="flex items-center justify-end gap-2 mt-6">
              <button onClick={()=>setEditor(null)} className="px-4 py-2 text-sm text-gray-500 hover:text-black">Cancel</button>
              <button onClick={saveProperty} className="px-6 py-2 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800">Save Property</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
