"use client";
import { useState } from "react";
import { Monitor, Plus, Minus, ShoppingCart, Package, Shield, X } from "lucide-react";

const equipment = [
  { cat: "Panels", items: [{ name: "Qolsys IQ4 Hub", price: 349, monthly: 0 }, { name: "DSC PowerSeries Neo", price: 289, monthly: 0 }, { name: "2GIG Edge", price: 319, monthly: 0 }] },
  { cat: "Sensors", items: [{ name: "Door/Window Sensor", price: 35, monthly: 0 }, { name: "Motion Detector", price: 45, monthly: 0 }, { name: "Glass Break Sensor", price: 55, monthly: 0 }, { name: "Smoke Detector", price: 65, monthly: 0 }, { name: "CO Detector", price: 60, monthly: 0 }, { name: "Flood Sensor", price: 40, monthly: 0 }] },
  { cat: "Cameras", items: [{ name: "Doorbell Camera", price: 179, monthly: 5 }, { name: "Indoor Camera", price: 129, monthly: 3 }, { name: "Outdoor Camera", price: 199, monthly: 5 }, { name: "PTZ Camera", price: 349, monthly: 8 }] },
];
const packages = [
  { name: "Basic", monthly: 29.99, equipment: ["DSC PowerSeries Neo", "3x Door/Window Sensor", "1x Motion Detector"], color: "border-gray-300" },
  { name: "Standard", monthly: 39.99, equipment: ["Qolsys IQ4 Hub", "6x Door/Window Sensor", "2x Motion Detector", "1x Doorbell Camera"], color: "border-[#F0A500]" },
  { name: "Premium", monthly: 59.99, equipment: ["Qolsys IQ4 Hub", "10x Door/Window Sensor", "3x Motion Detector", "1x Glass Break Sensor", "1x Smoke Detector", "1x Doorbell Camera", "2x Outdoor Camera"], color: "border-[#007A67]" },
];

export default function SystemDesignerPage() {
  const [cart, setCart] = useState<{name:string;price:number;qty:number;monthly:number}[]>([]);
  const [showCart, setShowCart] = useState(false);
  const addItem = (name: string, price: number, monthly: number) => {
    setCart(prev => { const ex = prev.find(i => i.name === name); if (ex) return prev.map(i => i.name === name ? {...i, qty: i.qty+1} : i); return [...prev, {name, price, qty: 1, monthly}]; });
  };
  const removeItem = (name: string) => {
    setCart(prev => prev.map(i => i.name === name ? {...i, qty: i.qty-1} : i).filter(i => i.qty > 0));
  };
  const totalEquip = cart.reduce((a,i) => a + i.price * i.qty, 0);
  const totalMonthly = cart.reduce((a,i) => a + i.monthly * i.qty, 0) + 29.99;
  const installFee = cart.length > 0 ? 199 : 0;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div><h1 className="text-3xl font-bold text-[#0B1F3A]">System Designer</h1><p className="text-gray-500 mt-1">Build custom security packages with real-time pricing</p></div>
        <button onClick={() => setShowCart(!showCart)} className="relative bg-[#0B1F3A] text-white px-4 py-2 rounded-lg flex items-center gap-2"><ShoppingCart size={18} /> Quote {cart.length > 0 && <span className="absolute -top-2 -right-2 bg-[#F0A500] text-[#0B1F3A] text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">{cart.reduce((a,i)=>a+i.qty,0)}</span>}</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {packages.map((p,i) => (
          <div key={i} className={`bg-white rounded-xl border-2 ${p.color} p-6 ${i===1?'ring-2 ring-[#F0A500] ring-offset-2':''}`}>
            {i===1 && <span className="text-xs font-bold text-[#F0A500] uppercase">Most Popular</span>}
            <h3 className="text-xl font-bold text-[#0B1F3A] mt-1">{p.name}</h3>
            <div className="text-3xl font-bold text-[#0B1F3A] mt-2">${p.monthly}<span className="text-sm text-gray-400 font-normal">/mo</span></div>
            <ul className="mt-4 space-y-2">{p.equipment.map((e,j) => <li key={j} className="text-sm text-gray-600 flex items-center gap-2"><Shield size={12} className="text-green-500" />{e}</li>)}</ul>
            <button className="mt-4 w-full bg-[#F0A500] text-[#0B1F3A] font-semibold py-2 rounded-lg hover:bg-yellow-500 transition">Select Package</button>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {equipment.map((cat, ci) => (
            <div key={ci} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-[#0B1F3A] mb-4">{cat.cat}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {cat.items.map((item, ii) => {
                  const inCart = cart.find(c => c.name === item.name);
                  return (
                    <div key={ii} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-[#F0A500] transition">
                      <div><div className="font-medium text-sm text-[#0B1F3A]">{item.name}</div><div className="text-xs text-gray-400">${item.price} {item.monthly > 0 && `+ $${item.monthly}/mo`}</div></div>
                      <div className="flex items-center gap-2">
                        {inCart && <><button onClick={() => removeItem(item.name)} className="p-1 rounded bg-gray-100 hover:bg-gray-200"><Minus size={14} /></button><span className="text-sm font-bold w-6 text-center">{inCart.qty}</span></>}
                        <button onClick={() => addItem(item.name, item.price, item.monthly)} className="p-1 rounded bg-[#F0A500] text-white hover:bg-yellow-500"><Plus size={14} /></button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-fit sticky top-20">
          <h2 className="text-lg font-bold text-[#0B1F3A] mb-4">Quote Summary</h2>
          {cart.length === 0 ? <p className="text-sm text-gray-400">Add equipment to build your quote</p> : (
            <div className="space-y-2">
              {cart.map((item, i) => <div key={i} className="flex justify-between text-sm"><span className="text-gray-600">{item.qty}x {item.name}</span><span className="font-medium">${(item.price * item.qty).toLocaleString()}</span></div>)}
              <div className="border-t pt-3 mt-3 space-y-1">
                <div className="flex justify-between text-sm"><span>Equipment Total</span><span className="font-bold">${totalEquip.toLocaleString()}</span></div>
                <div className="flex justify-between text-sm"><span>Installation Fee</span><span className="font-bold">${installFee}</span></div>
                <div className="flex justify-between text-sm"><span>Monthly Monitoring</span><span className="font-bold">${totalMonthly.toFixed(2)}/mo</span></div>
              </div>
              <button className="mt-4 w-full bg-[#0B1F3A] text-white font-semibold py-3 rounded-lg hover:bg-[#0B1F3A]/90 transition">Generate Proposal</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
