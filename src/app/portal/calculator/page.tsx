"use client";
import { useState, useMemo } from "react";
import { Calculator, DollarSign, Sun, Zap, TrendingUp, RotateCcw } from "lucide-react";

export default function AuraCalculator() {
  const [systemSize, setSystemSize] = useState(13.77);
  const [ppw, setPpw] = useState(2.98);
  const [dealerFee, setDealerFee] = useState(0.60);
  const [adders, setAdders] = useState(1400);
  const [financeType, setFinanceType] = useState<"loan" | "ppa" | "cash">("loan");
  const [loanRate, setLoanRate] = useState(1.49);
  const [loanTerm, setLoanTerm] = useState(25);
  const [ppaRate, setPpaRate] = useState(0.089);
  const [escalator, setEscalator] = useState(2.9);
  const [production, setProduction] = useState(1450);
  const [utilityRate, setUtilityRate] = useState(0.128);

  const calcs = useMemo(() => {
    const grossPrice = systemSize * 1000 * ppw + adders;
    const dealerCost = systemSize * 1000 * dealerFee;
    const netPrice = grossPrice - dealerCost;
    const annualProd = systemSize * production;
    const monthlyProd = annualProd / 12;
    const monthlyRate = loanRate / 100 / 12;
    const payments = loanTerm * 12;
    const monthlyPayment = monthlyRate > 0
      ? (grossPrice * monthlyRate * Math.pow(1 + monthlyRate, payments)) / (Math.pow(1 + monthlyRate, payments) - 1)
      : grossPrice / payments;
    const monthlySavings = monthlyProd * utilityRate;
    const annualSavings = annualProd * utilityRate;
    const year1Savings = financeType === "ppa"
      ? (annualProd * utilityRate) - (annualProd * ppaRate)
      : annualSavings - (monthlyPayment * 12);
    const lifetimeSavings = annualSavings * 25;
    const itc = grossPrice * 0.30;
    return { grossPrice, dealerCost, netPrice, annualProd, monthlyProd, monthlyPayment, monthlySavings, annualSavings, year1Savings, lifetimeSavings, itc };
  }, [systemSize, ppw, dealerFee, adders, financeType, loanRate, loanTerm, ppaRate, escalator, production, utilityRate]);

  const reset = () => {
    setSystemSize(13.77); setPpw(2.98); setDealerFee(0.60); setAdders(1400);
    setFinanceType("loan"); setLoanRate(1.49); setLoanTerm(25);
    setPpaRate(0.089); setEscalator(2.9); setProduction(1450); setUtilityRate(0.128);
  };

  const inputClass = "w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition-colors";

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-black flex items-center gap-2">
            <Calculator className="w-6 h-6" /> Aura+ Payment Calculator
          </h1>
          <p className="text-sm text-gray-500">Calculate system pricing, monthly payments, and customer savings</p>
        </div>
        <button onClick={reset} className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
          <RotateCcw className="w-4 h-4" /> Reset
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          {/* System Config */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-bold text-black mb-4 flex items-center gap-2">
              <Sun className="w-4 h-4 text-gray-500" /> System Configuration
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "System Size (kW)", value: systemSize, step: "0.01", set: setSystemSize },
                { label: "Price Per Watt ($)", value: ppw, step: "0.01", set: setPpw },
                { label: "Dealer Fee ($/W)", value: dealerFee, step: "0.01", set: setDealerFee },
                { label: "Adders ($)", value: adders, step: "1", set: setAdders },
                { label: "Annual Production (kWh/kW)", value: production, step: "1", set: setProduction },
                { label: "Utility Rate ($/kWh)", value: utilityRate, step: "0.001", set: setUtilityRate },
              ].map((f, i) => (
                <div key={i}>
                  <label className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider">{f.label}</label>
                  <input type="number" step={f.step} value={f.value} onChange={e => f.set(parseFloat(e.target.value) || 0)} className={inputClass} />
                </div>
              ))}
            </div>
          </div>

          {/* Finance Config */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-bold text-black mb-4 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-gray-500" /> Financing
            </h3>
            <div className="flex gap-2 mb-4">
              {(["loan", "ppa", "cash"] as const).map(t => (
                <button key={t} onClick={() => setFinanceType(t)} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${financeType === t ? "bg-black text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                  {t === "loan" ? "Loan" : t === "ppa" ? "PPA/Lease" : "Cash"}
                </button>
              ))}
            </div>
            {financeType === "loan" && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider">APR (%)</label>
                  <input type="number" step="0.01" value={loanRate} onChange={e => setLoanRate(parseFloat(e.target.value) || 0)} className={inputClass} />
                </div>
                <div>
                  <label className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider">Term (years)</label>
                  <input type="number" step="1" value={loanTerm} onChange={e => setLoanTerm(parseFloat(e.target.value) || 0)} className={inputClass} />
                </div>
              </div>
            )}
            {financeType === "ppa" && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider">PPA Rate ($/kWh)</label>
                  <input type="number" step="0.001" value={ppaRate} onChange={e => setPpaRate(parseFloat(e.target.value) || 0)} className={inputClass} />
                </div>
                <div>
                  <label className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider">Escalator (%/yr)</label>
                  <input type="number" step="0.1" value={escalator} onChange={e => setEscalator(parseFloat(e.target.value) || 0)} className={inputClass} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results Sidebar */}
        <div className="space-y-4">
          <div className="bg-black rounded-xl p-6 text-white">
            <h3 className="text-[11px] font-semibold text-white/50 uppercase tracking-wider mb-4">System Pricing</h3>
            <div className="space-y-3">
              <div className="flex justify-between"><span className="text-white/60">Gross Price</span><span className="font-bold text-lg">${calcs.grossPrice.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span></div>
              <div className="flex justify-between"><span className="text-white/60">Dealer Cost</span><span className="font-medium text-gray-500">-${calcs.dealerCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span></div>
              <hr className="border-white/10" />
              <div className="flex justify-between"><span className="text-white/60">Net to Financier</span><span className="font-bold text-lg">${calcs.netPrice.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span></div>
              <div className="flex justify-between"><span className="text-white/60">Federal ITC (30%)</span><span className="font-medium text-green-400">${calcs.itc.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span></div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-3">Monthly Payment</h3>
            <p className="text-4xl font-extrabold text-black">${calcs.monthlyPayment.toFixed(0)}<span className="text-sm font-normal text-gray-500">/mo</span></p>
            <p className="text-xs text-gray-500 mt-1">{financeType === "loan" ? `${loanTerm}yr @ ${loanRate}% APR` : financeType === "ppa" ? `PPA @ $${ppaRate}/kWh` : "Paid in full"}</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2"><Zap className="w-3.5 h-3.5" /> Production</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Annual</span><span className="font-semibold text-black">{calcs.annualProd.toLocaleString(undefined, { maximumFractionDigits: 0 })} kWh</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Monthly</span><span className="font-semibold text-black">{calcs.monthlyProd.toLocaleString(undefined, { maximumFractionDigits: 0 })} kWh</span></div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2"><TrendingUp className="w-3.5 h-3.5" /> Savings</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Monthly Savings</span><span className="font-semibold text-black">${calcs.monthlySavings.toFixed(0)}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Year 1 Net</span><span className={`font-semibold ${calcs.year1Savings >= 0 ? "text-black" : "text-red-600"}`}>${calcs.year1Savings.toFixed(0)}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">25-Year Value</span><span className="font-bold text-black">${(calcs.lifetimeSavings / 1000).toFixed(0)}K</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
