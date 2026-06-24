import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { calculateEverything } from "../utils/calculations";
import ExpensesBreakdownTable from "./tables/expensesBreakdownTable";
import InputFields from "./inputComponents/inputFields";
import CashFlowSummaryTable from "./tables/cashFlowSummaryTable";
import CashFlowROITable from "./tables/cashFlowROITable";
import EquityROITable from "./tables/equityROITable";
import AmortizationTable from "./AmortizationTable";
import "./calculator.css";

const DEFAULT_INPUTS = {
  homePrice: 500000,
  downpaymentPercentage: 20,
  interestRate: 7,
  loanTerm: 30,
  estimatedRent: 3000,
  hoa: 0,
  annualMaintenance: 7500,
  propertyTaxPercentage: 1.25,
  annualPropertyTax: (1.25 / 100) * 500000,
  propertyManagementFeePercentage: 10,
  closingCosts: 15000,
  initialRepairs: 4000,
  vacancyRate: 5,
  customAppreciationRate: 3,
};

const fmt = (n) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format(n ?? 0);

function loadFromStorage() {
  try {
    const raw = localStorage.getItem("calc_inputs");
    if (raw) return { ...DEFAULT_INPUTS, ...JSON.parse(raw) };
  } catch (_) {}
  return DEFAULT_INPUTS;
}

function loadFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const overrides = {};
  Object.keys(DEFAULT_INPUTS).forEach((k) => {
    if (params.has(k)) overrides[k] = Number(params.get(k));
  });
  return Object.keys(overrides).length > 0 ? overrides : null;
}

function Calculator() {
  const navigate = useNavigate();

  const [inputs, setInputs] = useState(() => {
    const fromUrl = loadFromUrl();
    if (fromUrl) return { ...DEFAULT_INPUTS, ...fromUrl };
    return loadFromStorage();
  });

  const [results, setResults] = useState(null);
  const [errors, setErrors] = useState({});
  const [showAmortization, setShowAmortization] = useState(false);
  const [calculated, setCalculated] = useState(false);

  // Persist to localStorage on every input change
  useEffect(() => {
    try {
      localStorage.setItem("calc_inputs", JSON.stringify(inputs));
    } catch (_) {}
  }, [inputs]);

  const handleInputChange = useCallback((field, value) => {
    const newValue = Number(value);
    setInputs((prev) => {
      const next = { ...prev, [field]: newValue };
      if (field === "propertyTaxPercentage") {
        next.annualPropertyTax = prev.homePrice * (newValue / 100);
      } else if (field === "annualPropertyTax") {
        next.propertyTaxPercentage = prev.homePrice > 0 ? parseFloat(((newValue / prev.homePrice) * 100).toFixed(4)) : 0;
      } else if (field === "homePrice") {
        next.annualPropertyTax = newValue * (prev.propertyTaxPercentage / 100);
      }
      return next;
    });
    // clear field error
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  const validate = () => {
    const errs = {};
    if (!inputs.homePrice || inputs.homePrice <= 0) errs.homePrice = "Must be > 0";
    if (inputs.downpaymentPercentage < 0 || inputs.downpaymentPercentage > 100) errs.downpaymentPercentage = "Must be 0–100%";
    if (inputs.interestRate < 0 || inputs.interestRate > 30) errs.interestRate = "Must be 0–30%";
    if (!inputs.loanTerm || inputs.loanTerm <= 0 || inputs.loanTerm > 50) errs.loanTerm = "Must be 1–50 years";
    if (inputs.estimatedRent < 0) errs.estimatedRent = "Cannot be negative";
    if (inputs.hoa < 0) errs.hoa = "Cannot be negative";
    if (inputs.annualMaintenance < 0) errs.annualMaintenance = "Cannot be negative";
    if (inputs.propertyManagementFeePercentage < 0 || inputs.propertyManagementFeePercentage > 50) errs.propertyManagementFeePercentage = "Must be 0–50%";
    if (inputs.closingCosts < 0) errs.closingCosts = "Cannot be negative";
    if (inputs.initialRepairs < 0) errs.initialRepairs = "Cannot be negative";
    if (inputs.vacancyRate < 0 || inputs.vacancyRate > 100) errs.vacancyRate = "Must be 0–100%";
    if (inputs.customAppreciationRate < 0 || inputs.customAppreciationRate > 50) errs.customAppreciationRate = "Must be 0–50%";
    return errs;
  };

  const calculateData = () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    const everyDetail = calculateEverything(inputs);
    setResults(everyDetail);
    setCalculated(true);
  };

  const goToDataAnalysis = () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    const everyDetail = calculateEverything(inputs);
    navigate("/data-analysis", { state: { inputs, analytics: everyDetail } });
  };

  const copyShareLink = () => {
    const params = new URLSearchParams();
    Object.entries(inputs).forEach(([k, v]) => params.set(k, v));
    const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    navigator.clipboard.writeText(url).then(() => alert("Link copied to clipboard!"));
  };

  const resetInputs = () => {
    setInputs(DEFAULT_INPUTS);
    setResults(null);
    setCalculated(false);
    setErrors({});
    localStorage.removeItem("calc_inputs");
  };

  const loanAmount = inputs.homePrice * (1 - inputs.downpaymentPercentage / 100);
  const downpayment = inputs.homePrice - loanAmount;
  const initialCosts = inputs.closingCosts + inputs.initialRepairs + downpayment;

  const costsData = React.useMemo(() => {
    if (!results) return [];
    const { monthly, yearly } = results.operatingExpenses;
    return [
      { item: "Gross Rent", monthly: fmt(monthly.rent), yearly: fmt(yearly.rent) },
      { item: `Vacancy (${inputs.vacancyRate}%)`, monthly: `-${fmt(monthly.vacancyLoss)}`, yearly: `-${fmt(yearly.vacancyLoss)}` },
      { item: "Effective Rent", monthly: fmt(monthly.effectiveRent), yearly: fmt(yearly.effectiveRent) },
      { item: "Property Tax", monthly: fmt(monthly.propertyTax), yearly: fmt(yearly.propertyTax) },
      { item: "HOA", monthly: fmt(monthly.hoa), yearly: fmt(yearly.hoa) },
      { item: "Maintenance", monthly: fmt(monthly.maintenance), yearly: fmt(yearly.maintenance) },
      { item: "Prop. Mgmt Fee", monthly: fmt(monthly.propertyManagementFee), yearly: fmt(yearly.propertyManagementFee) },
      { item: "Mortgage (P+I)", monthly: fmt(monthly.mortgage), yearly: fmt(yearly.mortgage) },
    ];
  }, [results, inputs.vacancyRate]);

  const breakdownData = React.useMemo(() => {
    if (!results) return [];
    const { monthly } = results.operatingExpenses;
    const cf = results.cashFlow;
    return [
      { item: "Effective Rent", monthly: fmt(monthly.effectiveRent), yearly: fmt(monthly.effectiveRent * 12) },
      { item: "Total Expenses", monthly: fmt(monthly.monthlyCosts), yearly: fmt(monthly.monthlyCosts * 12) },
      { item: "Cash Flow", monthly: fmt(cf.monthlyCashFlow), yearly: fmt(cf.yearlyCashFlow), isHighlight: true, positive: cf.monthlyCashFlow >= 0 },
    ];
  }, [results]);

  return (
    <div className="calculator-container">
      <div className="calc-header">
        <div>
          <h1 className="calc-title">Real Estate Investment Calculator</h1>
          <p className="calc-subtitle">Analyze rental property returns, cash flow, and ROI</p>
        </div>
        <div className="calc-header-actions">
          <button className="btn btn-icon" onClick={copyShareLink} title="Copy shareable link">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
            Share
          </button>
          <button className="btn btn-icon" onClick={resetInputs} title="Reset to defaults">
            Reset
          </button>
        </div>
      </div>

      {/* Summary bar */}
      <div className="metric-grid">
        <div className="metric-card">
          <div className="metric-label">Home Price</div>
          <div className="metric-value">{fmt(inputs.homePrice)}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Down Payment</div>
          <div className="metric-value">{fmt(downpayment)}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Loan Amount</div>
          <div className="metric-value">{fmt(loanAmount)}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Total Initial Investment</div>
          <div className="metric-value">{fmt(initialCosts)}</div>
        </div>
        {results && (
          <div className="metric-card">
            <div className="metric-label">Monthly Cash Flow</div>
            <div className={`metric-value ${results.cashFlow.monthlyCashFlow >= 0 ? "positive" : "negative"}`}>
              {fmt(results.cashFlow.monthlyCashFlow)}
            </div>
          </div>
        )}
        {results && results.breakEvenMonths && (
          <div className="metric-card">
            <div className="metric-label">Break-Even</div>
            <div className="metric-value">
              {results.breakEvenMonths >= 12
                ? `${Math.floor(results.breakEvenMonths / 12)}y ${results.breakEvenMonths % 12}m`
                : `${results.breakEvenMonths} months`}
            </div>
          </div>
        )}
        {results && !results.breakEvenMonths && (
          <div className="metric-card">
            <div className="metric-label">Break-Even</div>
            <div className="metric-value negative">Never (negative CF)</div>
          </div>
        )}
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <InputFields inputs={inputs} handleInputChange={handleInputChange} errors={errors} />
      </div>

      <div className="calc-actions">
        <button className="btn btn-primary btn-lg" onClick={calculateData}>
          Calculate ROI &amp; Cash Flow
        </button>
        <button
          className="btn btn-outline btn-lg"
          onClick={goToDataAnalysis}
          title="View charts and visualizations"
        >
          View Data Analysis →
        </button>
      </div>

      {!calculated && (
        <div className="empty-state card" style={{ marginTop: 32 }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="2" y="3" width="20" height="14" rx="2" />
            <line x1="8" y1="21" x2="16" y2="21" />
            <line x1="12" y1="17" x2="12" y2="21" />
          </svg>
          <p>Enter your property details above and click <strong>Calculate ROI &amp; Cash Flow</strong> to see results.</p>
        </div>
      )}

      {calculated && results && (
        <>
          <div className="tables-container">
            <div className="table-row">
              <ExpensesBreakdownTable data={costsData} />
              <CashFlowSummaryTable breakdownData={breakdownData} />
            </div>
            <div className="table-row">
              <CashFlowROITable cashFlowROI={results.cashFlowROI} />
              <EquityROITable equityROI={results.equityROI} customAppreciationRate={inputs.customAppreciationRate} />
            </div>
          </div>

          <div className="card" style={{ marginTop: 24 }}>
            <div
              className="collapsible-header"
              onClick={() => setShowAmortization((s) => !s)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && setShowAmortization((s) => !s)}
            >
              <span className="section-title" style={{ margin: 0 }}>📋 Amortization Schedule</span>
              <svg
                className={`collapse-arrow ${showAmortization ? "open" : ""}`}
                width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
            {showAmortization && <AmortizationTable data={results.amortization} />}
          </div>
        </>
      )}
    </div>
  );
}

export default Calculator;
