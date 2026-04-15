"use client";
import { useState, useEffect } from "react";
import { supabase, ORG_ID } from "@/lib/supabase";
import { MessageSquare, Plus, Search, Send, Phone, Clock, CheckCheck, User, Settings, Zap, Filter } from "lucide-react";

interface Conversation {
  id: string; customer: string; phone: string; job: string; last_message: string; last_time: string;
  unread: number; status: string; messages: { from: string; text: string; time: string; status: string }[];
}

const TEMPLATES = [
  { name: "Appointment Confirmation", text: "Hi {name}, this is Delta Power Group confirming your appointment on {date} at {time}. Reply YES to confirm or call us at (214) 555-0100." },
  { name: "Material Delivery", text: "Hi {name}, your roofing materials are scheduled for delivery on {date}. Please ensure the driveway is clear. Questions? Reply here." },
  { name: "Install Start", text: "Hi {name}, your roof installation begins tomorrow at 7AM. Our crew will arrive in branded trucks. Please move vehicles from the driveway." },
  { name: "Job Complete", text: "Hi {name}, your new roof is complete! Our QA team will inspect tomorrow. Please review your customer portal: {portal_link}" },
  { name: "Payment Reminder", text: "Hi {name}, a friendly reminder that your balance of ${amount} is due on {date}. Pay online at {payment_link} or reply to arrange payment." },
  { name: "Review Request", text: "Hi {name}, we hope you love your new roof! Would you mind leaving us a review? It takes 30 seconds: {review_link}" },
  { name: "Weather Alert", text: "⚠️ Hi {name}, severe weather is forecast for your area. Your new GAF roof is covered under warranty. If you notice any issues, contact us immediately." },
  { name: "Supplement Update", text: "Hi {name}, great news! Your insurance supplement for ${amount} has been {status}. We'll update your project portal shortly." }
];

const MOCK: Conversation[] = [
  { id:"1",customer:"Williams Home",phone:"(313) 555-0147",job:"RJ-2024-089",last_message:"Perfect, we'll be there at 7AM sharp.",last_time:"2 min ago",unread:0,status:"active",
    messages:[{from:"customer",text:"When does the install start?",time:"10:15 AM",status:"read"},{from:"agent",text:"Hi! Your roof installation is scheduled for this Monday, April 15th. The crew will arrive at 7AM.",time:"10:18 AM",status:"delivered"},{from:"customer",text:"Great! Do I need to move my car?",time:"10:20 AM",status:"read"},{from:"agent",text:"Yes, please clear the driveway by 6:45 AM. We'll need space for the dumpster and boom truck delivery.",time:"10:22 AM",status:"delivered"},{from:"customer",text:"Will do. Thanks!",time:"10:24 AM",status:"read"},{from:"agent",text:"Perfect, we'll be there at 7AM sharp.",time:"10:25 AM",status:"delivered"}]},
  { id:"2",customer:"Johnson Family",phone:"(214) 555-0293",job:"RJ-2024-090",last_message:"Your materials are scheduled for delivery Thursday morning.",last_time:"1 hr ago",unread:2,status:"active",
    messages:[{from:"agent",text:"Hi! Just wanted to confirm — your GAF Timberline UHDZ shingles have been ordered from SRS Distribution.",time:"9:00 AM",status:"delivered"},{from:"customer",text:"When will they be delivered?",time:"9:45 AM",status:"read"},{from:"agent",text:"Your materials are scheduled for delivery Thursday morning.",time:"9:48 AM",status:"delivered"},{from:"customer",text:"Can they deliver before 7am? We have an HOA noise restriction.",time:"11:00 AM",status:"unread"},{from:"customer",text:"Also, can you send the color sample pic again?",time:"11:02 AM",status:"unread"}]},
  { id:"3",customer:"Garcia Residence",phone:"(214) 555-0381",job:"RJ-2024-085",last_message:"Your final inspection passed! 🎉",last_time:"Yesterday",unread:0,status:"active",
    messages:[{from:"agent",text:"Hi! Your roof installation is complete. Our QA team will inspect tomorrow at 10AM.",time:"Yesterday 3:00 PM",status:"delivered"},{from:"customer",text:"Looks amazing! Thank you!",time:"Yesterday 3:15 PM",status:"read"},{from:"agent",text:"Your final inspection passed! 🎉 Your GAF Golden Pledge warranty has been registered.",time:"Yesterday 4:30 PM",status:"delivered"}]},
  { id:"4",customer:"Davis Home",phone:"(614) 555-0442",job:"RJ-2024-082",last_message:"We can schedule the repair for Thursday. Does 1PM work?",last_time:"3 hrs ago",unread:1,status:"active",
    messages:[{from:"customer",text:"I noticed a small leak near the chimney after last night's rain",time:"8:00 AM",status:"read"},{from:"agent",text:"Sorry to hear that. This is covered under your workmanship warranty. Let me schedule a repair crew ASAP.",time:"8:15 AM",status:"delivered"},{from:"agent",text:"We can schedule the repair for Thursday. Does 1PM work?",time:"8:18 AM",status:"delivered"},{from:"customer",text:"Thursday works. Thank you for the quick response!",time:"9:30 AM",status:"unread"}]},
  { id:"5",customer:"Brown Corp",phone:"(214) 555-0518",job:"RJ-2024-091",last_message:"Supplement meeting confirmed for Tuesday 9AM.",last_time:"2 days ago",unread:0,status:"active",
    messages:[{from:"agent",text:"Hi, the insurance adjuster has reviewed our supplement request for the additional decking replacement. Meeting set for Tuesday.",time:"2 days ago",status:"delivered"},{from:"customer",text:"What's the supplement amount?",time:"2 days ago",status:"read"},{from:"agent",text:"$12,400 for full decking replacement on the south slope. We have the Xactimate documentation ready.",time:"2 days ago",status:"delivered"},{from:"agent",text:"Supplement meeting confirmed for Tuesday 9AM.",time:"2 days ago",status:"delivered"}]}
];

export default function TextMessagingPage() {
  const [convos, setConvos] = useState(MOCK);
  const [selected, setSelected] = useState<string>("1");
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [showTemplates, setShowTemplates] = useState(false);

  useEffect(() => { supabase.from("roofing_messages").select("*").eq("org_id", ORG_ID).then(({ data }) => { if (data?.length) setConvos(data as any); }); }, []);

  const active = convos.find(c => c.id === selected);
  const filtered = convos.filter(c => c.customer.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search));
  const totalUnread = convos.reduce((s, c) => s + c.unread, 0);

  const sendMessage = () => {
    if (!message.trim() || !active) return;
    const updated = convos.map(c => c.id === selected ? { ...c, messages: [...c.messages, { from: "agent", text: message, time: "Just now", status: "sent" }], last_message: message, last_time: "Just now" } : c);
    setConvos(updated);
    setMessage("");
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-[#0B1F3A] flex items-center gap-2"><MessageSquare className="text-[#F0A500]" size={28}/>Text Messaging</h1><p className="text-gray-500 mt-1">Two-way SMS, automated templates & customer communication</p></div>
        <div className="flex gap-2">
          <button onClick={()=>setShowTemplates(!showTemplates)} className="border px-4 py-2 rounded-lg text-sm flex items-center gap-2 hover:bg-gray-50"><Zap size={16}/>Templates</button>
          <button className="bg-[#F0A500] text-[#0B1F3A] px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-yellow-500"><Plus size={18}/>New Message</button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[{l:"Active Conversations",v:convos.length,c:"text-blue-600"},{l:"Unread Messages",v:totalUnread,c:"text-red-600"},{l:"Sent Today",v:12,c:"text-green-600"},{l:"Response Rate",v:"94%",c:"text-purple-600"}].map((s,i)=>(
          <div key={i} className="bg-white rounded-xl border p-3 text-center"><p className={`text-xl font-bold ${s.c}`}>{s.v}</p><p className="text-[10px] text-gray-500">{s.l}</p></div>
        ))}
      </div>

      {/* Chat Interface */}
      <div className="grid grid-cols-3 gap-4 h-[520px]">
        {/* Conversation List */}
        <div className="bg-white rounded-xl border overflow-hidden flex flex-col">
          <div className="p-3 border-b"><div className="relative"><Search className="absolute left-3 top-2 text-gray-400" size={14}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search..." className="pl-8 pr-3 py-1.5 border rounded-lg w-full text-xs"/></div></div>
          <div className="flex-1 overflow-y-auto">
            {filtered.map(c=>(
              <div key={c.id} onClick={()=>setSelected(c.id)} className={`p-3 border-b cursor-pointer hover:bg-gray-50 ${selected===c.id?"bg-blue-50 border-l-2 border-l-blue-600":""}`}>
                <div className="flex items-center justify-between"><h3 className="font-semibold text-sm text-[#0B1F3A]">{c.customer}</h3>{c.unread>0&&<span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{c.unread}</span>}</div>
                <p className="text-[10px] text-gray-400">{c.phone} · {c.job}</p>
                <p className="text-xs text-gray-500 mt-1 truncate">{c.last_message}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{c.last_time}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Message View */}
        <div className="col-span-2 bg-white rounded-xl border overflow-hidden flex flex-col">
          {active ? (<>
            <div className="p-3 border-b flex items-center justify-between bg-gray-50">
              <div className="flex items-center gap-3"><div className="w-8 h-8 bg-[#0B1F3A] rounded-full flex items-center justify-center text-white text-xs font-bold">{active.customer[0]}</div><div><h3 className="font-semibold text-sm text-[#0B1F3A]">{active.customer}</h3><p className="text-[10px] text-gray-500">{active.phone} · {active.job}</p></div></div>
              <div className="flex gap-2"><button className="p-1.5 rounded hover:bg-gray-200"><Phone size={14}/></button><button className="p-1.5 rounded hover:bg-gray-200"><User size={14}/></button></div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
              {active.messages.map((m,i) => (
                <div key={i} className={`flex ${m.from==="agent"?"justify-end":"justify-start"}`}>
                  <div className={`max-w-[70%] rounded-2xl px-4 py-2 ${m.from==="agent"?"bg-[#0B1F3A] text-white":"bg-white border"}`}>
                    <p className="text-sm">{m.text}</p>
                    <p className={`text-[10px] mt-1 flex items-center gap-1 ${m.from==="agent"?"text-gray-300":"text-gray-400"}`}>{m.time}{m.from==="agent"&&<CheckCheck size={10}/>}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-3 border-t flex gap-2">
              <button onClick={()=>setShowTemplates(!showTemplates)} className="p-2 rounded-lg hover:bg-gray-100 border" title="Templates"><Zap size={16}/></button>
              <input value={message} onChange={e=>setMessage(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")sendMessage()}} placeholder="Type a message..." className="flex-1 border rounded-lg px-3 py-2 text-sm"/>
              <button onClick={sendMessage} className="bg-[#F0A500] text-[#0B1F3A] px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-yellow-500"><Send size={16}/></button>
            </div>
          </>) : <div className="flex-1 flex items-center justify-center text-gray-400">Select a conversation</div>}
        </div>
      </div>

      {/* Templates Panel */}
      {showTemplates && (
        <div className="bg-white rounded-xl border p-4">
          <h3 className="font-bold text-[#0B1F3A] mb-3 flex items-center gap-2"><Zap size={16} className="text-[#F0A500]"/>Message Templates</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {TEMPLATES.map(t=>(
              <div key={t.name} className="border rounded-lg p-3 hover:bg-gray-50 cursor-pointer" onClick={()=>{setMessage(t.text);setShowTemplates(false)}}>
                <h4 className="font-medium text-xs text-[#0B1F3A]">{t.name}</h4>
                <p className="text-[10px] text-gray-500 mt-1 line-clamp-2">{t.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
