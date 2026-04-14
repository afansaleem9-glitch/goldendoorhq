"use client";
import { useState, useMemo } from "react";
import { Calculator, DollarSign, Sun, Zap, TrendingUp, Info, RotateCcw } from "lucide-react";

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

    // Loan
    const monthlyRate = loanRate / 100 / 12;
    const payments = loanTerm * 12;
    const monthlyPayment = monthlyRate > 0
      ? (grossPrice * monthlyRate * Math.pow(1 + monthlyRate, payments)) / (Math.pow(1 + monthlyRate, payments) - 1)
      : grossPrice / payments;

    // Savings
    const monthlySavings = monthlyProd * utilityRate;
    const annualSavings = annualProd * utilityRate;
    const year1Savings = financeType === "ppa"
      ? (annualProd * utilityRate) - (annualProd * ppaRate)
      : annualSavings - (monthlyPayment * 12);
    const lifetimeSavings = annualSavings * 25;

    // Federal ITC
    const itc = grossPrice * 0.30;

    return {
      grossPrice, dealerCost, netPrice, annualProd, monthlyProd,
      monthlyPayment, monthlySavings, annualSavings, year1Savings,
      lifetimeSavings, itc
    };
  }, [systemSize, ppw, dealerFee, adders, financeType, loanRate, loanTerm, ppaRate, escalator, production, utilityRate]);

  const reset = () => {
    setSystemSize(13.77); setPpw(2.98); setDealerFee(0.60); setAdders(1400);
    setFinanceType("loan"); setLoanRate(1.49); setLoanTerm(25);
    setPpaRate(0.089); setEscalator(2.9); setProduction(1450); setUtilityRate(0.128);
  };

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0B1F3A] flex items-center gap-2"><Calculator className="w-6 h-6 text-[#F0A500]" /> Aura+ Payment Calculator</h1>
          <p className="text-sm text-gray-500">Calculate system pricing, monthly payments, and customer savings</p>
        </div>
        <button onClick={reset} className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50"><RotateCcw className="w-4 h-4" /> Reset</button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Inputs */}
        <div className="col-span-2 space-y-6">
          {/* System Config */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-[#0B1F3A] mb-4 flex items-center gap-2"><Sun className="w-4 h-4 text-amber-500" /> System Configuration</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500 font-medium">System Size (kW)</label>
                <input type="number" step="0.01" value={systemSize} onChange={e => setSystemSize(parseFloat(e.target.value) || 0)} className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#007A67]/20 focus:border-[#007A67]" />
              </div>
              <div>
                <label className="text-xs text-gray-500 font-medium">Price Per Watt ($)</label>
                <input type="number" step="0.01" value={ppw} onChange={e => setPpw(parseFloat(e.target.value) || 0)} className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#007A67]/20 focus:border-[#007A67]" />
              </div>
              <div>
                <label className="text-xs text-gray-500 font-medium">Dealer Fee ($/W)</label>
                <input type="number" step="0.01" value={dealerFee} onChange={e => setDealerFee(parseFloat(e.target.value) || 0)} className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#007A67]/20 focus:border-[#007A67]" />
              </div>
              <div>
                <label className="text-xs text-gray-500 font-medium">Adders ($)</label>
                <input type="number" step="1" value={adders} onChange={e => setAdders(parseFloat(e.target.value) || 0)} className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#007A67]/20 focus:border-[#007A67]" />
              </div>
              <div>
                <label className="text-xs text-gray-500 font-medium">Annual Production (kWh/kW)</label>
                <input type="number" step="1" value={production} onChange={e => setProduction(parseFloat(e.target.value) || 0)} className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#007A67]/20 focus:border-[#007A67]" />
              </div>
              <div>
                <label className="text-xs text-gray-500 font-medium">Utility Rate ($/kWh)</label>
                <input type="number" step="0.001" value={utilityRate} onChange={e => setUtilityRate(parseFloat(e.target.value) || 0)} className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#007A67]/20 focus:border-[#007A67]" />
              </div>
            </div>
          </div>

          {/* Finance Config */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-[#0B1F3A] mb-4 flex items-center gap-2"><DollarSign className="w-4 h-4 text-green-500" /> Financing</h3>
            <div className="flex gap-2 mb-4">
              {(["loan", "ppa", "cash"] as const).map(t => (
                <button key={t} onClick={() => setFinanceType(t)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${financeType === t ? "bg-[#0B1F3A] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                  {t === "loan" ? "Loan" : t === "ppa" ? "PPA/Lease" : "Cash"}
                </button>
              ))}
            </div>
            {financeType === "loan" && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 font-medium">APR (%)</label>
                  <input type="number" step="0.01" value={loanRate} onChange={e => setLoanRate(parseFloat(e.target.value) || 0)} className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#007A67]/20 focus:border-[#007A67]" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-medium">Term (years)</label>
                  <input type="number" step="1" value={loanTerm} onChange={e => setLoanTerm(parseFloat(e.target.value) || 0)} className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#007A67]/20 focus:border-[#007A67]" />
                </div>
              </div>
            )}
            {financeType === "ppa" && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 font-medium">PPA Rate ($/kWh)</label>
                  <input type="number" step="0.001" value={ppaRate} onChange={e => setPpaRate(parseFloat(e.target.value) || 0)} className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#007A67]/20 focus:border-[#007A67]" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-medium">Escalator (%/yr)</label>
                  <input type="number" step="0.1" value={escalator} onChange={e => setEscalator(parseFloat(e.target.value) || 0)} className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#007A67]/20 focus:border-[#007A67]" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results Sidebar */}
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-[#0B1F3A] to-[#1a3a5c] rounded-xl p-6 text-white">
            <h3 className="text-sm font-medium text-gray-300 mb-4">System Pricing</h3>
            <div className="space-y-3">
              <div className="flex justify-between"><span className="text-gray-300">Gross Price</span><span className="font-bold text-lg">${calcs.grossPrice.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span></div>
              <div className="flex justify-between"><span className="text-gray-300">Dealer Cost</span><span className="font-medium text-amber-400">-${calcs.dealerCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span></div>
              <hr className="border-white/20" />
              <div className="flex justify-between"><span className="text-gray-300">Net to Financier</span><span className="font-bold text-lg">${calcs.netPrice.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span></div>
              <div className="flex justify-between"><span className="text-gray-300">Federal ITC (30%)</span><span className="font-medium text-green-400">${calcs.itc.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span></div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-sm font-semibold text-[#0B1F3A] mb-4">Monthly Payment</h3>
            <p className="text-4xl font-bold text-[#007A67]">${calcs.monthlyPayment.toFixed(0)}<span className="text-sm font-normal text-gray-400">/mo</span></p>
            <p className="text-xs text-gray-400 mt-1">{financeType === "loan" ? `${loanTerm}yr @ ${loanRate}% APR` : financeType === "ppa" ? `PPA @ $${ppaRate}/kWh` : "Paid in full"}</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-sm font-semibold text-[#0B1F3A] mb-4 flex items-center gap-2"><Zap className="w-4 h-4 text-amber-500" /> Production</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Annual</span><span className="font-medium">{calcs.annualProd.toLocaleString(undefined, { maximumFractionDigits: 0 })} kWh</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Monthly</span><span className="font-medium">{calcs.monthlyProd.toLocaleString(undefined, { maximumFractionDigits: 0 })} kWh</span></div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-sm font-semibold text-[#0B1F3A] mb-4 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-green-500" /> Savings</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Monthly Savings</span><span className="font-medium text-green-600">${calcs.monthlySavings.toFixed(0)}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Year 1 Net</span><span className={`font-medium ${calcs.year1Savings >= 0 ? "text-green-600" : "text-red-500"}`}>${calcs.year1Savings.toFixed(0)}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">25-Year Value</span><span className="font-bold text-green-600">${(calcs.lifetimeSavings / 1000).toFixed(0)}K</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
