'use client';

import React, { useState, useMemo } from 'react';
import {
  ChevronRight,
  ChevronLeft,
  Check,
  AlertCircle,
  Upload,
  Eye,
  Plus,
  X,
  FileText,
  Home,
  MapPin,
  DollarSign,
  Zap,
  Loader2,
} from 'lucide-react';
import { supabase, ORG_ID } from '@/lib/supabase';

// Types
type PaymentMethod =
  | 'goodleap'
  | 'mosaic'
  | 'sunrun_lease'
  | 'sunrun_prepaid'
  | 'everbright'
  | 'cash'
  | 'credit_human'
  | 'enfin';

type State = 'TX' | 'OH' | 'MI';
type PanelType = 'rec_alpha' | 'qcells_duo' | 'canadian_solar';
type InverterType = 'enphase' | 'solaredge' | 'tesla';
type BatteryType = 'none' | 'tesla_powerwall' | 'enphase_iq5p';

interface FormData {
  // Step 1
  paymentMethod: PaymentMethod | '';

  // Step 2
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  coBorrowerFirstName: string;
  coBorrowerLastName: string;
  address: string;
  city: string;
  state: State | '';
  zip: string;
  utilityCompany: string;

  // Step 3
  systemSize: string;
  numPanels: string;
  panelType: PanelType | '';
  inverterType: InverterType | '';
  battery: BatteryType | '';
  roofType: string;
  roofPitch: string;
  panelOrientation: string;
  estimatedAnnualProduction: string;

  // Step 4
  equipmentCost: string;
  laborCost: string;
  permitFees: string;
  adders: string[];
  totalContractPrice: string;
  pricePerWatt: string;
  dealerFeePercent: string;
  netToDealer: string;

  // Step 5
  loanTerm: string;
  apr: string;
  monthlyPayment: string;
  loanAmount: string;
  leaseEscalator: string;
  leaseMonthlyPayment: string;
  leaseTerm: string;
  ppaRate: string;
  ppaEscalator: string;
  cashDiscount: string;
  cashFinalPrice: string;

  // Step 6
  documents: {
    contract: boolean;
    utilityBill: boolean;
    id: boolean;
    hoaApproval: boolean;
    roofWarranty: boolean;
  };
  uploads: {
    [key: string]: File | null;
  };
  esignatureRequested: boolean;

  // Step 7
  // (summary only, no new fields)
}

const PAYMENT_METHODS = [
  {
    id: 'goodleap' as const,
    name: 'GoodLeap Loan',
    description: 'Financing with competitive rates and flexible terms',
  },
  {
    id: 'mosaic' as const,
    name: 'Mosaic Loan',
    description: 'Home improvement financing option',
  },
  {
    id: 'sunrun_lease' as const,
    name: 'Sunrun Lease',
    description: 'Zero down leasing option',
  },
  {
    id: 'sunrun_prepaid' as const,
    name: 'Sunrun Prepaid',
    description: 'Prepaid solar power agreement',
  },
  {
    id: 'everbright' as const,
    name: 'Everbright Lease',
    description: 'Alternative lease option',
  },
  {
    id: 'cash' as const,
    name: 'Cash',
    description: 'Direct payment',
  },
  {
    id: 'credit_human' as const,
    name: 'Credit Human Solar Plan Loan',
    description: 'Specialized solar financing',
  },
  {
    id: 'enfin' as const,
    name: 'Enfin Loan',
    description: 'Flexible loan option',
  },
];

const PANEL_TYPES = [
  { id: 'rec_alpha' as const, name: 'REC Alpha 425W' },
  { id: 'qcells_duo' as const, name: 'Qcells DUO' },
  { id: 'canadian_solar' as const, name: 'Canadian Solar HiKu7' },
];

const INVERTER_TYPES = [
  { id: 'enphase' as const, name: 'Enphase IQ8+' },
  { id: 'solaredge' as const, name: 'SolarEdge' },
  { id: 'tesla' as const, name: 'Tesla' },
];

const BATTERY_OPTIONS = [
  { id: 'none' as const, name: 'None' },
  { id: 'tesla_powerwall' as const, name: 'Tesla Powerwall' },
  { id: 'enphase_iq5p' as const, name: 'Enphase IQ 5P' },
];

const ADDER_OPTIONS = [
  'Ground Mount',
  'EV Charger',
  'Panel Upgrade',
  'Trenching',
  'Tree Removal',
  'Derate',
];

const UTILITY_BY_STATE: Record<State, string[]> = {
  TX: ['Centerpoint', 'Oncor', 'AEP'],
  OH: ['AEP Ohio', 'Duke Energy', 'FirstEnergy'],
  MI: ['DTE', 'Consumers Energy'],
};

const STEPS = [
  'Payment Method',
  'Customer Info',
  'System Design',
  'Pricing',
  'Financing',
  'Documents',
  'Review',
  'Submit',
];

export default function ContractGenerationWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    paymentMethod: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    coBorrowerFirstName: '',
    coBorrowerLastName: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    utilityCompany: '',
    systemSize: '',
    numPanels: '',
    panelType: '',
    inverterType: '',
    battery: 'none',
    roofType: '',
    roofPitch: '',
    panelOrientation: '',
    estimatedAnnualProduction: '',
    equipmentCost: '',
    laborCost: '',
    permitFees: '',
    adders: [],
    totalContractPrice: '',
    pricePerWatt: '',
    dealerFeePercent: '',
    netToDealer: '',
    loanTerm: '',
    apr: '',
    monthlyPayment: '',
    loanAmount: '',
    leaseEscalator: '',
    leaseMonthlyPayment: '',
    leaseTerm: '',
    ppaRate: '',
    ppaEscalator: '',
    cashDiscount: '',
    cashFinalPrice: '',
    documents: {
      contract: false,
      utilityBill: false,
      id: false,
      hoaApproval: false,
      roofWarranty: false,
    },
    uploads: {},
    esignatureRequested: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [projectId, setProjectId] = useState('');

  // Auto-calculate Step 4 totals
  const calculatedPricing = useMemo(() => {
    const equipment = parseFloat(formData.equipmentCost) || 0;
    const labor = parseFloat(formData.laborCost) || 0;
    const permits = parseFloat(formData.permitFees) || 0;
    const total = equipment + labor + permits;

    const systemSize = parseFloat(formData.systemSize) || 1;
    const ppw = systemSize > 0 ? total / systemSize : 0;

    const dealerFeePercent = parseFloat(formData.dealerFeePercent) || 0;
    const netDealer = total - total * (dealerFeePercent / 100);

    return {
      total: total.toFixed(2),
      ppw: ppw.toFixed(2),
      netDealer: netDealer.toFixed(2),
    };
  }, [
    formData.equipmentCost,
    formData.laborCost,
    formData.permitFees,
    formData.systemSize,
    formData.dealerFeePercent,
  ]);

  // Auto-calculate Step 5 monthly payment for loans
  const calculatedMonthlyPayment = useMemo(() => {
    const loanAmount = parseFloat(formData.loanAmount) || 0;
    const apr = parseFloat(formData.apr) || 0;
    const years = parseInt(formData.loanTerm) || 0;

    if (loanAmount === 0 || apr === 0 || years === 0) return '0.00';

    const monthlyRate = apr / 100 / 12;
    const numPayments = years * 12;
    const monthlyPayment =
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
      (Math.pow(1 + monthlyRate, numPayments) - 1);

    return isFinite(monthlyPayment) ? monthlyPayment.toFixed(2) : '0.00';
  }, [formData.loanAmount, formData.apr, formData.loanTerm]);

  const handleInputChange = (
    field: keyof FormData,
    value: string | string[] | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleStateChange = (newState: State) => {
    handleInputChange('state', newState);
    handleInputChange('utilityCompany', '');
  };

  const handleAdderToggle = (adder: string) => {
    const current = formData.adders;
    const updated = current.includes(adder)
      ? current.filter((a) => a !== adder)
      : [...current, adder];
    handleInputChange('adders', updated);
  };

  const handleDocumentToggle = (doc: keyof typeof formData.documents) => {
    setFormData((prev) => ({
      ...prev,
      documents: {
        ...prev.documents,
        [doc]: !prev.documents[doc],
      },
    }));
  };

  const handleFileUpload = (key: string, file: File | null) => {
    setFormData((prev) => ({
      ...prev,
      uploads: {
        ...prev.uploads,
        [key]: file,
      },
    }));
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.paymentMethod) newErrors.paymentMethod = 'Required';
    }

    if (step === 2) {
      if (!formData.firstName) newErrors.firstName = 'Required';
      if (!formData.lastName) newErrors.lastName = 'Required';
      if (!formData.email) newErrors.email = 'Required';
      if (!formData.phone) newErrors.phone = 'Required';
      if (!formData.address) newErrors.address = 'Required';
      if (!formData.city) newErrors.city = 'Required';
      if (!formData.state) newErrors.state = 'Required';
      if (!formData.zip) newErrors.zip = 'Required';
      if (!formData.utilityCompany) newErrors.utilityCompany = 'Required';
    }

    if (step === 3) {
      if (!formData.systemSize) newErrors.systemSize = 'Required';
      if (!formData.numPanels) newErrors.numPanels = 'Required';
      if (!formData.panelType) newErrors.panelType = 'Required';
      if (!formData.inverterType) newErrors.inverterType = 'Required';
      if (!formData.roofType) newErrors.roofType = 'Required';
      if (!formData.roofPitch) newErrors.roofPitch = 'Required';
      if (!formData.panelOrientation) newErrors.panelOrientation = 'Required';
    }

    if (step === 4) {
      if (!formData.equipmentCost) newErrors.equipmentCost = 'Required';
      if (!formData.laborCost) newErrors.laborCost = 'Required';
      if (!formData.permitFees) newErrors.permitFees = 'Required';
      if (!formData.dealerFeePercent) newErrors.dealerFeePercent = 'Required';
    }

    if (step === 5) {
      if (formData.paymentMethod === 'cash' && !formData.cashDiscount) {
        newErrors.cashDiscount = 'Required';
      } else if (
        ['goodleap', 'mosaic', 'credit_human', 'enfin'].includes(
          formData.paymentMethod || ''
        )
      ) {
        if (!formData.loanTerm) newErrors.loanTerm = 'Required';
        if (!formData.apr) newErrors.apr = 'Required';
        if (!formData.loanAmount) newErrors.loanAmount = 'Required';
      } else if (['sunrun_lease', 'everbright'].includes(formData.paymentMethod || '')) {
        if (!formData.leaseMonthlyPayment) newErrors.leaseMonthlyPayment = 'Required';
        if (!formData.leaseTerm) newErrors.leaseTerm = 'Required';
      } else if (formData.paymentMethod === 'sunrun_prepaid') {
        if (!formData.ppaRate) newErrors.ppaRate = 'Required';
      }
    }

    if (step === 6) {
      if (
        !formData.documents.contract &&
        !formData.documents.utilityBill &&
        !formData.documents.id
      ) {
        newErrors.documents = 'Select at least one document';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
  };

  const handleSubmit = async () => {
    if (!validateStep(8)) {
      return;
    }

    setSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('solar_projects')
        .insert([
          {
            org_id: ORG_ID,
            payment_method: formData.paymentMethod,
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            co_borrower_first_name: formData.coBorrowerFirstName || null,
            co_borrower_last_name: formData.coBorrowerLastName || null,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            zip: formData.zip,
            utility_company: formData.utilityCompany,
            system_size_kw: parseFloat(formData.systemSize),
            num_panels: parseInt(formData.numPanels),
            panel_type: formData.panelType,
            inverter_type: formData.inverterType,
            battery_type: formData.battery,
            roof_type: formData.roofType,
            roof_pitch: formData.roofPitch,
            panel_orientation: formData.panelOrientation,
            estimated_annual_production: parseFloat(formData.estimatedAnnualProduction) || 0,
            equipment_cost: parseFloat(formData.equipmentCost),
            labor_cost: parseFloat(formData.laborCost),
            permit_fees: parseFloat(formData.permitFees),
            adders: formData.adders,
            total_contract_price: parseFloat(calculatedPricing.total),
            price_per_watt: parseFloat(calculatedPricing.ppw),
            dealer_fee_percent: parseFloat(formData.dealerFeePercent),
            net_to_dealer: parseFloat(calculatedPricing.netDealer),
            financing_type:
              ['goodleap', 'mosaic', 'credit_human', 'enfin'].includes(
                formData.paymentMethod || ''
              )
                ? 'loan'
                : ['sunrun_lease', 'everbright'].includes(formData.paymentMethod || '')
                  ? 'lease'
                  : formData.paymentMethod === 'sunrun_prepaid'
                    ? 'ppa'
                    : 'cash',
            loan_term: formData.loanTerm ? parseInt(formData.loanTerm) : null,
            apr: formData.apr ? parseFloat(formData.apr) : null,
            monthly_payment:
              formData.monthlyPayment || calculatedMonthlyPayment
                ? parseFloat(formData.monthlyPayment || calculatedMonthlyPayment)
                : null,
            loan_amount: formData.loanAmount ? parseFloat(formData.loanAmount) : null,
            lease_escalator: formData.leaseEscalator ? parseFloat(formData.leaseEscalator) : null,
            lease_monthly_payment: formData.leaseMonthlyPayment
              ? parseFloat(formData.leaseMonthlyPayment)
              : null,
            lease_term: formData.leaseTerm ? parseInt(formData.leaseTerm) : null,
            ppa_rate: formData.ppaRate ? parseFloat(formData.ppaRate) : null,
            ppa_escalator: formData.ppaEscalator ? parseFloat(formData.ppaEscalator) : null,
            cash_discount: formData.cashDiscount ? parseFloat(formData.cashDiscount) : null,
            esignature_requested: formData.esignatureRequested,
            created_at: new Date().toISOString(),
          },
        ])
        .select();

      if (error) {
        setErrors({ submit: error.message });
        setSubmitting(false);
        return;
      }

      setSubmitSuccess(true);
      setProjectId(data?.[0]?.id || '');
    } catch (err) {
      setErrors({
        submit: err instanceof Error ? err.message : 'An error occurred',
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Success Screen
  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-6">
              <Check className="w-8 h-8 text-emerald-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Contract Created Successfully</h1>
            <p className="text-slate-600 mb-6">Your solar contract has been generated and saved.</p>

            <div className="bg-slate-50 rounded-lg p-4 mb-8">
              <p className="text-sm text-slate-600 mb-1">Project ID</p>
              <p className="text-2xl font-mono font-bold text-blue-600">{projectId}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => {
                  setCurrentStep(1);
                  setFormData({
                    paymentMethod: '',
                    firstName: '',
                    lastName: '',
                    email: '',
                    phone: '',
                    coBorrowerFirstName: '',
                    coBorrowerLastName: '',
                    address: '',
                    city: '',
                    state: '',
                    zip: '',
                    utilityCompany: '',
                    systemSize: '',
                    numPanels: '',
                    panelType: '',
                    inverterType: '',
                    battery: 'none',
                    roofType: '',
                    roofPitch: '',
                    panelOrientation: '',
                    estimatedAnnualProduction: '',
                    equipmentCost: '',
                    laborCost: '',
                    permitFees: '',
                    adders: [],
                    totalContractPrice: '',
                    pricePerWatt: '',
                    dealerFeePercent: '',
                    netToDealer: '',
                    loanTerm: '',
                    apr: '',
                    monthlyPayment: '',
                    loanAmount: '',
                    leaseEscalator: '',
                    leaseMonthlyPayment: '',
                    leaseTerm: '',
                    ppaRate: '',
                    ppaEscalator: '',
                    cashDiscount: '',
                    cashFinalPrice: '',
                    documents: {
                      contract: false,
                      utilityBill: false,
                      id: false,
                      hoaApproval: false,
                      roofWarranty: false,
                    },
                    uploads: {},
                    esignatureRequested: false,
                  });
                  setSubmitSuccess(false);
                  setErrors({});
                }}
                className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg transition"
              >
                Generate Another
              </button>
              <button
                onClick={() => {
                  window.location.href = `/solar/projects/${projectId}`;
                }}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
              >
                View Project
              </button>
              <button
                onClick={() => {
                  window.print();
                }}
                className="px-6 py-3 border-2 border-slate-300 hover:border-slate-400 text-slate-700 font-semibold rounded-lg transition"
              >
                Print Summary
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white p-6 shadow-lg">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Solar Contract Generator</h1>
          <p className="text-blue-100">Freedom Forever Style Multi-Step Wizard</p>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          {STEPS.map((step, index) => (
            <React.Fragment key={index}>
              <div
                onClick={() => index < currentStep && goToStep(index + 1)}
                className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold cursor-pointer transition ${
                  index + 1 === currentStep
                    ? 'bg-amber-500 text-white'
                    : index + 1 < currentStep
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-300 text-slate-600'
                }`}
              >
                {index + 1 < currentStep ? (
                  <Check className="w-5 h-5" />
                ) : (
                  index + 1
                )}
              </div>
              {index < STEPS.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-2 rounded transition ${
                    index + 1 < currentStep ? 'bg-emerald-500' : 'bg-slate-300'
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="grid grid-cols-4 gap-2 md:gap-4 text-xs md:text-sm text-slate-700 font-medium text-center">
          {STEPS.map((step, index) => (
            <div key={index}>{step}</div>
          ))}
        </div>
      </div>

      {/* Form Container */}
      <div className="max-w-4xl mx-auto px-6 pb-12">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-8">
            {/* Step 1: Payment Method */}
            {currentStep === 1 && (
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Select Payment Method</h2>
                <p className="text-slate-600 mb-8">Choose how the customer will finance their solar installation</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {PAYMENT_METHODS.map((method) => (
                    <div
                      key={method.id}
                      onClick={() => handleInputChange('paymentMethod', method.id)}
                      className={`p-5 border-2 rounded-lg cursor-pointer transition ${
                        formData.paymentMethod === method.id
                          ? 'border-amber-500 bg-amber-50'
                          : 'border-slate-300 bg-slate-50 hover:border-slate-400'
                      }`}
                    >
                      <div className="flex items-start">
                        <div
                          className={`w-5 h-5 rounded-full border-2 mt-1 mr-4 flex items-center justify-center transition ${
                            formData.paymentMethod === method.id
                              ? 'border-amber-500 bg-amber-500'
                              : 'border-slate-400'
                          }`}
                        >
                          {formData.paymentMethod === method.id && (
                            <Check className="w-3 h-3 text-white" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900">{method.name}</h3>
                          <p className="text-sm text-slate-600">{method.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {errors.paymentMethod && (
                  <div className="mt-4 flex items-center gap-2 text-red-600">
                    <AlertCircle className="w-5 h-5" />
                    <span>{errors.paymentMethod}</span>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Customer Information */}
            {currentStep === 2 && (
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Customer Information</h2>
                <p className="text-slate-600 mb-8">Enter the customer details</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                        errors.firstName ? 'border-red-500' : 'border-slate-300'
                      }`}
                      placeholder="John"
                    />
                    {errors.firstName && <p className="text-red-600 text-sm mt-1">{errors.firstName}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                        errors.lastName ? 'border-red-500' : 'border-slate-300'
                      }`}
                      placeholder="Smith"
                    />
                    {errors.lastName && <p className="text-red-600 text-sm mt-1">{errors.lastName}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                        errors.email ? 'border-red-500' : 'border-slate-300'
                      }`}
                      placeholder="john@example.com"
                    />
                    {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                        errors.phone ? 'border-red-500' : 'border-slate-300'
                      }`}
                      placeholder="(555) 123-4567"
                    />
                    {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Co-Borrower First Name
                    </label>
                    <input
                      type="text"
                      value={formData.coBorrowerFirstName}
                      onChange={(e) => handleInputChange('coBorrowerFirstName', e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="Jane"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Co-Borrower Last Name
                    </label>
                    <input
                      type="text"
                      value={formData.coBorrowerLastName}
                      onChange={(e) => handleInputChange('coBorrowerLastName', e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="Smith"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Address *
                    </label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                        errors.address ? 'border-red-500' : 'border-slate-300'
                      }`}
                      placeholder="123 Main Street"
                    />
                    {errors.address && <p className="text-red-600 text-sm mt-1">{errors.address}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                        errors.city ? 'border-red-500' : 'border-slate-300'
                      }`}
                      placeholder="Dallas"
                    />
                    {errors.city && <p className="text-red-600 text-sm mt-1">{errors.city}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      State *
                    </label>
                    <select
                      value={formData.state}
                      onChange={(e) => handleStateChange(e.target.value as State)}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                        errors.state ? 'border-red-500' : 'border-slate-300'
                      }`}
                    >
                      <option value="">Select a state</option>
                      <option value="TX">Texas (TX)</option>
                      <option value="OH">Ohio (OH)</option>
                      <option value="MI">Michigan (MI)</option>
                    </select>
                    {errors.state && <p className="text-red-600 text-sm mt-1">{errors.state}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Zip Code *
                    </label>
                    <input
                      type="text"
                      value={formData.zip}
                      onChange={(e) => handleInputChange('zip', e.target.value)}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                        errors.zip ? 'border-red-500' : 'border-slate-300'
                      }`}
                      placeholder="75001"
                    />
                    {errors.zip && <p className="text-red-600 text-sm mt-1">{errors.zip}</p>}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Utility Company *
                    </label>
                    <select
                      value={formData.utilityCompany}
                      onChange={(e) => handleInputChange('utilityCompany', e.target.value)}
                      disabled={!formData.state}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:bg-slate-100 ${
                        errors.utilityCompany ? 'border-red-500' : 'border-slate-300'
                      }`}
                    >
                      <option value="">Select a utility company</option>
                      {formData.state && UTILITY_BY_STATE[formData.state].map((utility) => (
                        <option key={utility} value={utility}>
                          {utility}
                        </option>
                      ))}
                    </select>
                    {errors.utilityCompany && (
                      <p className="text-red-600 text-sm mt-1">{errors.utilityCompany}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: System Design */}
            {currentStep === 3 && (
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">System Design</h2>
                <p className="text-slate-600 mb-8">Configure the solar system specifications</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      System Size (kW) *
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.systemSize}
                      onChange={(e) => handleInputChange('systemSize', e.target.value)}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                        errors.systemSize ? 'border-red-500' : 'border-slate-300'
                      }`}
                      placeholder="8.5"
                    />
                    {errors.systemSize && <p className="text-red-600 text-sm mt-1">{errors.systemSize}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Number of Panels *
                    </label>
                    <input
                      type="number"
                      value={formData.numPanels}
                      onChange={(e) => handleInputChange('numPanels', e.target.value)}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                        errors.numPanels ? 'border-red-500' : 'border-slate-300'
                      }`}
                      placeholder="25"
                    />
                    {errors.numPanels && <p className="text-red-600 text-sm mt-1">{errors.numPanels}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Panel Type *
                    </label>
                    <select
                      value={formData.panelType}
                      onChange={(e) => handleInputChange('panelType', e.target.value)}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                        errors.panelType ? 'border-red-500' : 'border-slate-300'
                      }`}
                    >
                      <option value="">Select panel type</option>
                      {PANEL_TYPES.map((panel) => (
                        <option key={panel.id} value={panel.id}>
                          {panel.name}
                        </option>
                      ))}
                    </select>
                    {errors.panelType && <p className="text-red-600 text-sm mt-1">{errors.panelType}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Inverter Type *
                    </label>
                    <select
                      value={formData.inverterType}
                      onChange={(e) => handleInputChange('inverterType', e.target.value)}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                        errors.inverterType ? 'border-red-500' : 'border-slate-300'
                      }`}
                    >
                      <option value="">Select inverter type</option>
                      {INVERTER_TYPES.map((inverter) => (
                        <option key={inverter.id} value={inverter.id}>
                          {inverter.name}
                        </option>
                      ))}
                    </select>
                    {errors.inverterType && <p className="text-red-600 text-sm mt-1">{errors.inverterType}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Battery Storage
                    </label>
                    <select
                      value={formData.battery}
                      onChange={(e) => handleInputChange('battery', e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      {BATTERY_OPTIONS.map((battery) => (
                        <option key={battery.id} value={battery.id}>
                          {battery.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Roof Type *
                    </label>
                    <select
                      value={formData.roofType}
                      onChange={(e) => handleInputChange('roofType', e.target.value)}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                        errors.roofType ? 'border-red-500' : 'border-slate-300'
                      }`}
                    >
                      <option value="">Select roof type</option>
                      <option value="shingle">Asphalt Shingle</option>
                      <option value="metal">Metal</option>
                      <option value="tile">Tile</option>
                      <option value="flat">Flat Roof</option>
                      <option value="wood">Wood Shake</option>
                    </select>
                    {errors.roofType && <p className="text-red-600 text-sm mt-1">{errors.roofType}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Roof Pitch *
                    </label>
                    <input
                      type="text"
                      value={formData.roofPitch}
                      onChange={(e) => handleInputChange('roofPitch', e.target.value)}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                        errors.roofPitch ? 'border-red-500' : 'border-slate-300'
                      }`}
                      placeholder="5:12"
                    />
                    {errors.roofPitch && <p className="text-red-600 text-sm mt-1">{errors.roofPitch}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Panel Orientation *
                    </label>
                    <select
                      value={formData.panelOrientation}
                      onChange={(e) => handleInputChange('panelOrientation', e.target.value)}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                        errors.panelOrientation ? 'border-red-500' : 'border-slate-300'
                      }`}
                    >
                      <option value="">Select orientation</option>
                      <option value="south">South</option>
                      <option value="southeast">Southeast</option>
                      <option value="southwest">Southwest</option>
                      <option value="east">East</option>
                      <option value="west">West</option>
                      <option value="north">North</option>
                    </select>
                    {errors.panelOrientation && (
                      <p className="text-red-600 text-sm mt-1">{errors.panelOrientation}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Estimated Annual Production (kWh)
                    </label>
                    <input
                      type="number"
                      step="100"
                      value={formData.estimatedAnnualProduction}
                      onChange={(e) => handleInputChange('estimatedAnnualProduction', e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="12000"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Pricing */}
            {currentStep === 4 && (
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Pricing</h2>
                <p className="text-slate-600 mb-8">Configure costs and pricing structure</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Equipment Cost ($) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.equipmentCost}
                      onChange={(e) => handleInputChange('equipmentCost', e.target.value)}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                        errors.equipmentCost ? 'border-red-500' : 'border-slate-300'
                      }`}
                      placeholder="25000"
                    />
                    {errors.equipmentCost && <p className="text-red-600 text-sm mt-1">{errors.equipmentCost}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Labor Cost ($) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.laborCost}
                      onChange={(e) => handleInputChange('laborCost', e.target.value)}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                        errors.laborCost ? 'border-red-500' : 'border-slate-300'
                      }`}
                      placeholder="3000"
                    />
                    {errors.laborCost && <p className="text-red-600 text-sm mt-1">{errors.laborCost}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Permit Fees ($) *
                    </label>
                    <input type="number" step="0.01" value={formData.permitFees}
                      onChange={(e) => handleInputChange('permitFees', e.target.value)}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${errors.permitFees ? 'border-red-500' : 'border-slate-300'}`}
                      placeholder="1500" />
                    {errors.permitFees && <p className="text-red-600 text-sm mt-1">{errors.permitFees}</p>}
                  </div>
                </div>

                <div className="mt-6 p-4 bg-[#0B1F3A]/5 rounded-xl">
                  <h4 className="text-sm font-bold text-[#0B1F3A] mb-3">Calculated Totals</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div><p className="text-xs text-gray-500">Total Contract</p><p className="text-lg font-bold text-[#0B1F3A]">${((Number(formData.equipmentCost)||0)+(Number(formData.laborCost)||0)+(Number(formData.permitFees)||0)).toLocaleString()}</p></div>
                    <div><p className="text-xs text-gray-500">Price/Watt</p><p className="text-lg font-bold text-[#007A67]">${formData.systemSize ? (((Number(formData.equipmentCost)||0)+(Number(formData.laborCost)||0)+(Number(formData.permitFees)||0))/(Number(formData.systemSize)*1000)).toFixed(2) : '0.00'}</p></div>
                    <div><p className="text-xs text-gray-500">Dealer Fee (18%)</p><p className="text-lg font-bold text-[#F0A500]">${(((Number(formData.equipmentCost)||0)+(Number(formData.laborCost)||0)+(Number(formData.permitFees)||0))*0.18).toLocaleString(undefined,{maximumFractionDigits:0})}</p></div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Financing Details */}
            {currentStep === 5 && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-[#0B1F3A] mb-4">Financing Details</h3>
                <p className="text-sm text-gray-600 mb-4">Based on your selection: <span className="font-semibold text-[#0B1F3A]">{formData.paymentMethod?.replace(/_/g, ' ').toUpperCase()}</span></p>

                {(formData.paymentMethod === 'goodleap' || formData.paymentMethod === 'mosaic' || formData.paymentMethod === 'credit_human' || formData.paymentMethod === 'enfin') && (
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-sm font-semibold text-slate-700 mb-2">Loan Term (years)</label>
                      <select value={formData.loanTerm || '25'} onChange={e => handleInputChange('loanTerm', e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-lg">
                        {[10,15,20,25].map(y => <option key={y} value={y}>{y} years</option>)}
                      </select></div>
                    <div><label className="block text-sm font-semibold text-slate-700 mb-2">APR (%)</label>
                      <input type="number" step="0.01" value={formData.apr || ''} onChange={e => handleInputChange('apr', e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-lg" placeholder="4.99" /></div>
                    <div className="col-span-2 p-4 bg-green-50 rounded-xl">
                      <p className="text-xs text-green-600 font-semibold">Estimated Monthly Payment</p>
                      <p className="text-2xl font-bold text-green-700">${formData.apr && formData.loanTerm ? (() => { const r = (Number(formData.apr)/100)/12; const n = Number(formData.loanTerm)*12; const p = (Number(formData.equipmentCost)||0)+(Number(formData.laborCost)||0)+(Number(formData.permitFees)||0); return (p*(r*Math.pow(1+r,n))/(Math.pow(1+r,n)-1)).toFixed(2); })() : '—'}/mo</p>
                    </div>
                  </div>
                )}

                {(formData.paymentMethod === 'sunrun_lease' || formData.paymentMethod === 'everbright') && (
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-sm font-semibold text-slate-700 mb-2">Monthly Lease Payment</label>
                      <input type="number" value={formData.leaseMonthlyPayment || ''} onChange={e => handleInputChange('leaseMonthlyPayment', e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-lg" placeholder="150" /></div>
                    <div><label className="block text-sm font-semibold text-slate-700 mb-2">Escalator (%/yr)</label>
                      <input type="number" step="0.1" value={formData.leaseEscalator || ''} onChange={e => handleInputChange('leaseEscalator', e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-lg" placeholder="2.9" /></div>
                    <div><label className="block text-sm font-semibold text-slate-700 mb-2">Lease Term (years)</label>
                      <select value={formData.leaseTerm || '25'} onChange={e => handleInputChange('leaseTerm', e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-lg">
                        {[20,25].map(y => <option key={y} value={y}>{y} years</option>)}
                      </select></div>
                  </div>
                )}

                {formData.paymentMethod === 'sunrun_prepaid' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-sm font-semibold text-slate-700 mb-2">PPA Rate ($/kWh)</label>
                      <input type="number" step="0.01" value={formData.ppaRate || ''} onChange={e => handleInputChange('ppaRate', e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-lg" placeholder="0.12" /></div>
                    <div><label className="block text-sm font-semibold text-slate-700 mb-2">Escalator (%/yr)</label>
                      <input type="number" step="0.1" value={formData.leaseEscalator || ''} onChange={e => handleInputChange('leaseEscalator', e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-lg" placeholder="2.9" /></div>
                  </div>
                )}

                {formData.paymentMethod === 'cash' && (
                  <div className="p-6 bg-[#F0A500]/10 rounded-xl text-center">
                    <p className="text-sm text-gray-600 mb-2">Cash Purchase — No Financing</p>
                    <p className="text-3xl font-bold text-[#0B1F3A]">${((Number(formData.equipmentCost)||0)+(Number(formData.laborCost)||0)+(Number(formData.permitFees)||0)).toLocaleString()}</p>
                    <p className="text-xs text-[#007A67] mt-1">5% cash discount applied at closing</p>
                  </div>
                )}
              </div>
            )}

            {/* Step 6: Documents */}
            {currentStep === 6 && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-[#0B1F3A] mb-4">Required Documents</h3>
                {['Contract Agreement', 'Utility Bill', 'Government ID', 'HOA Approval', 'Roof Warranty'].map(doc => (
                  <div key={doc} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText size={18} className="text-gray-400" />
                      <span className="text-sm font-medium text-gray-700">{doc}</span>
                    </div>
                    <button className="px-3 py-1.5 text-xs font-semibold bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-600 flex items-center gap-1">
                      <Plus size={12} /> Upload
                    </button>
                  </div>
                ))}
                <button className="w-full mt-4 py-3 bg-[#7C5CBF] hover:bg-[#6a4daa] text-white font-semibold rounded-lg flex items-center justify-center gap-2">
                  <FileText size={16} /> Request E-Signature
                </button>
              </div>
            )}

            {/* Step 7: Review */}
            {currentStep === 7 && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-[#0B1F3A] mb-4">Review Your Contract</h3>
                {[
                  { title: 'Payment Method', value: formData.paymentMethod?.replace(/_/g, ' ').toUpperCase() || 'Not selected', step: 1 },
                  { title: 'Customer', value: `${formData.firstName} ${formData.lastName}`, step: 2 },
                  { title: 'Address', value: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zip}`, step: 2 },
                  { title: 'System', value: `${formData.systemSize} kW — ${formData.numPanels} panels`, step: 3 },
                  { title: 'Total Contract', value: `$${((Number(formData.equipmentCost)||0)+(Number(formData.laborCost)||0)+(Number(formData.permitFees)||0)).toLocaleString()}`, step: 4 },
                ].map(item => (
                  <div key={item.title} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
                    <div><p className="text-xs text-gray-500">{item.title}</p><p className="text-sm font-semibold text-[#0B1F3A]">{item.value}</p></div>
                    <button onClick={() => setCurrentStep(item.step)} className="text-xs text-[#F0A500] hover:underline font-semibold">Edit</button>
                  </div>
                ))}
              </div>
            )}

            {/* Step 8: Submit */}
            {currentStep === 8 && (
              <div className="text-center py-8">
                {!submitSuccess ? (
                  <>
                    <h3 className="text-xl font-bold text-[#0B1F3A] mb-4">Ready to Submit</h3>
                    <p className="text-sm text-gray-600 mb-8">Review all details above before submitting. This will create a new solar project in the system.</p>
                    <button onClick={async () => {
                      setSubmitting(true);
                      try {
                        const total = (Number(formData.equipmentCost)||0)+(Number(formData.laborCost)||0)+(Number(formData.permitFees)||0);
                        const { data, error } = await supabase.from('solar_projects').insert({
                          organization_id: ORG_ID, current_stage: 'ntp',
                          system_size_kw: Number(formData.systemSize)||0, panel_count: Number(formData.numPanels)||0,
                          panel_type: formData.panelType, inverter_type: formData.inverterType,
                          battery_type: formData.battery || 'none', battery_count: 0,
                          financing_type: formData.paymentMethod, contract_amount: total,
                          lender_name: formData.paymentMethod === 'cash' ? 'Cash' : formData.paymentMethod?.replace(/_/g,' '),
                          address: formData.address, city: formData.city, state: formData.state, zip: formData.zip,
                          utility_company: formData.utilityCompany, notes: '', tags: [],
                        }).select().single();
                        if (error) throw error;
                        setSubmitSuccess(true); setProjectId(data?.id || '');
                      } catch (e) { console.error(e); alert('Error creating project. Please try again.'); }
                      setSubmitting(false);
                    }} disabled={submitting}
                      className="px-8 py-3 bg-[#F0A500] hover:bg-[#d4920a] text-[#0B1F3A] font-bold rounded-xl text-lg disabled:opacity-50 flex items-center gap-2 mx-auto">
                      {submitting ? <Loader2 size={20} className="animate-spin" /> : <Check size={20} />} Submit Contract
                    </button>
                  </>
                ) : (
                  <div className="py-8">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"><Check size={32} className="text-green-600" /></div>
                    <h3 className="text-2xl font-bold text-[#0B1F3A] mb-2">Contract Created!</h3>
                    <p className="text-gray-600 mb-6">Project ID: <span className="font-mono font-semibold">{projectId.slice(0,8)}</span></p>
                    <div className="flex gap-3 justify-center">
                      <a href="/solar" className="px-5 py-2 bg-[#0B1F3A] text-white font-semibold rounded-lg">View Projects</a>
                      <button onClick={() => { setCurrentStep(1); setSubmitSuccess(false); setFormData({} as any); }} className="px-5 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg">Generate Another</button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <button onClick={() => setCurrentStep(s => Math.max(1, s - 1))} disabled={currentStep === 1}
              className="px-5 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-lg disabled:opacity-30 hover:bg-gray-50">
              <ChevronLeft size={16} className="inline mr-1" /> Back
            </button>
            {currentStep < 8 ? (
              <button onClick={() => setCurrentStep(s => Math.min(8, s + 1))}
                className="px-5 py-2.5 bg-[#F0A500] hover:bg-[#d4920a] text-[#0B1F3A] font-semibold rounded-lg flex items-center gap-1">
                Next <ChevronRight size={16} />
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
