import React, { useMemo, useState } from "react";
import BlockFormula from "../utilComponents/blockFormula";
import InlineFormula from "../utilComponents/inlineFormula";
import "katex/dist/katex.min.css";
import "./RoiCalculator.scss";

// ---------- helpers ----------
const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

const rupee = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number.isFinite(n) ? n : 0);

const usd = (n) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number.isFinite(n) ? n : 0);

const pct = (n, digits = 2) => `${(n * 100).toFixed(digits)}%`;

const compoundFV = (P, r, n) => P * Math.pow(1 + r, n);

const cagr = (initial, finalV, years) =>
  initial > 0 && finalV > 0 ? Math.pow(finalV / initial, 1 / years) - 1 : 0;

// ---------- small UI bits (wired to .rc-* classes) ----------
const Row = ({ label, children }) => (
  <div className="rc-row">
    <div className="rc-label">{label}</div>
    <div className="rc-control">{children}</div>
  </div>
);

const Slider = ({ value, onChange, min, max, step }) => (
  <input
    type="range"
    className="rc-slider"
    value={value}
    min={min}
    max={max}
    step={step}
    onChange={(e) => onChange(Number(e.target.value))}
  />
);

const NumberInput = (props) => <input type="number" className="rc-input" {...props} />;

const SectionCard = ({ title, children, right }) => (
  <div className="rc-card">
    <div className="rc-card-head">
      <h3>{title}</h3>
      {right}
    </div>
    <div className="rc-card-body">{children}</div>
  </div>
);

const Table = ({ columns, rows, footer }) => (
  <div className="rc-table-wrap">
    <table className="rc-table">
      <thead>
        <tr>{columns.map((c) => <th key={c}>{c}</th>)}</tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i}>{r.map((cell, j) => <td key={j}>{cell}</td>)}</tr>
        ))}
      </tbody>
      {footer && (
        <tfoot>
          <tr>{footer.map((cell, i) => <td key={i}>{cell}</td>)}</tr>
        </tfoot>
      )}
    </table>
  </div>
);

// ---------- main ----------
const RoiCalculator = () => {
  // inputs (all rupees & annual %)
  const [propertyValue, setPropertyValue] = useState(1.4 * 1e7); // 1.4 crore default
  const [monthlyRent, setMonthlyRent] = useState(40000);
  const [appRatePct, setAppRatePct] = useState(8);
  const [stockRatePct, setStockRatePct] = useState(10);
  const [loanAmount, setLoanAmount] = useState(0);
  const [interestRatePct, setInterestRatePct] = useState(0);
  const [usdInr, setUsdInr] = useState(88);

  const yearsToShow = [5, 10, 15];

  const appRate = appRatePct / 100;
  const stockRate = stockRatePct / 100;
  const loanRate = interestRatePct / 100;

  const results = useMemo(() => {
    return yearsToShow.map((yrs) => {
      const salePrice = compoundFV(propertyValue, appRate, yrs);
      const rentTotal = monthlyRent * 12 * yrs;

      // simple interest-only loan cost (transparent; swap with EMI later)
      const interestCost = loanAmount * loanRate * yrs;

      const totalProceeds = salePrice + rentTotal;
      const netProfit = totalProceeds - propertyValue - interestCost;
      const roi = netProfit / propertyValue;
      const cagrValue = cagr(propertyValue, totalProceeds, yrs);

      // stock comparison
      const stockFinal = compoundFV(propertyValue, stockRate, yrs);
      const stockProfit = stockFinal - propertyValue;
      const stockROI = stockProfit / propertyValue;
      const stockCAGR = stockRate;

      return {
        yrs,
        salePrice,
        rentTotal,
        interestCost,
        totalProceeds,
        netProfit,
        roi,
        cagrValue,
        stockFinal,
        stockProfit,
        stockROI,
        stockCAGR,
      };
    });
  }, [propertyValue, monthlyRent, appRate, stockRate, loanAmount, loanRate]);

  const end10Property = compoundFV(propertyValue, appRate, 10);

  const onQuickAdjust = (deltaPct) => setAppRatePct(clamp(appRatePct + deltaPct, 0, 30));

  return (
    <div className="rc-container">
      <h1>ROI Calculator</h1>

      {/* inputs */}
      <SectionCard
        title="Inputs"
        right={<div className="rc-muted">Tip: drag sliders or type exact numbers</div>}
      >
        <div className="rc-grid">
          <div>
            <Row label={`Property Value (${rupee(propertyValue)})`}>
              <Slider min={1e6} max={10e7} step={1e5} value={propertyValue} onChange={setPropertyValue} />
              <NumberInput value={propertyValue} onChange={setPropertyValue} step={50000} />
            </Row>

            <Row label={`Monthly Rent (${rupee(monthlyRent)})`}>
              <Slider min={0} max={300000} step={1000} value={monthlyRent} onChange={setMonthlyRent} />
              <NumberInput value={monthlyRent} onChange={setMonthlyRent} step={1000} />
            </Row>

            <Row label={`Appreciation Rate (${appRatePct}%)`}>
              <Slider min={0} max={30} step={0.1} value={appRatePct} onChange={setAppRatePct} />
              <NumberInput value={appRatePct} onChange={setAppRatePct} step={0.1} />
              <div className="rc-pill">
                <button className="rc-badge" onClick={() => onQuickAdjust(-0.5)}>-0.5%</button>
                <button className="rc-badge" onClick={() => onQuickAdjust(+0.5)}>+0.5%</button>
              </div>
            </Row>
          </div>

          <div>
            <Row label={`Stock Rate (${stockRatePct}%)`}>
              <Slider min={0} max={25} step={0.1} value={stockRatePct} onChange={setStockRatePct} />
              <NumberInput value={stockRatePct} onChange={setStockRatePct} step={0.1} />
            </Row>

            <Row label={`Loan Amount (${rupee(loanAmount)})`}>
              <Slider min={0} max={10e7} step={1e5} value={loanAmount} onChange={setLoanAmount} />
              <NumberInput value={loanAmount} onChange={setLoanAmount} step={50000} />
            </Row>

            <Row label={`Interest Rate (${interestRatePct}%)`}>
              <Slider min={0} max={20} step={0.1} value={interestRatePct} onChange={setInterestRatePct} />
              <NumberInput value={interestRatePct} onChange={setInterestRatePct} step={0.1} />
            </Row>

            <Row label={`USD/INR (${usdInr})`}>
              <Slider min={60} max={120} step={0.25} value={usdInr} onChange={setUsdInr} />
              <NumberInput value={usdInr} onChange={setUsdInr} step={0.25} />
            </Row>
          </div>
        </div>
      </SectionCard>

      {/* forecast */}
      <SectionCard title="Forecast: Property Value in 10 Years">
        <div className="rc-muted">
          With an appreciation rate of <strong>{appRatePct}%</strong>, the estimated value after 10 years is
          <strong> {rupee(end10Property)}</strong>.
        </div>
        <div style={{ maxWidth: 560, margin: "12px auto" }}>
          <BlockFormula formula={"V_{t} = V_{0}\\,(1+r)^{t}"} />
        </div>
      </SectionCard>

      {/* results */}
      <SectionCard title="ROI Tables (Sale at 5 / 10 / 15 years)">
        <div className="rc-grid">
          <div>
            <h4 style={{ fontWeight: 700, marginBottom: 8 }}>Property</h4>
            <Table
              columns={["Years", "Sale Price", "Rent Total", "Interest Cost", "Net Profit", "ROI", "CAGR", "Net Profit ($)"]}
              rows={results.map((r) => [
                r.yrs,
                rupee(r.salePrice),
                rupee(r.rentTotal),
                rupee(r.interestCost),
                rupee(r.netProfit),
                pct(r.roi),
                pct(r.cagrValue),
                usd(r.netProfit / usdInr),
              ])}
            />
          </div>

          <div>
            <h4 style={{ fontWeight: 700, marginBottom: 8 }}>Stock (same principal at {stockRatePct}%)</h4>
            <Table
              columns={["Years", "Final Value", "Profit", "ROI", "CAGR", "Profit ($)"]}
              rows={results.map((r) => [
                r.yrs,
                rupee(r.stockFinal),
                rupee(r.stockProfit),
                pct(r.stockROI),
                pct(r.stockCAGR),
                usd(r.stockProfit / usdInr),
              ])}
            />
          </div>
        </div>
      </SectionCard>

      {/* formulas */}
      <SectionCard title="Methodology & Formulae">
        <div className="rc-muted">
          <p>
            <InlineFormula formula={"V_t = V_0 (1+r)^t"} /> gives sale price after <InlineFormula formula={"t"} /> years with
            annual appreciation rate <InlineFormula formula={"r"} />.
          </p>
          <BlockFormula formula={"\\text{Sale Price} = V_0 \\,(1+r)^t"} />
          <p>Total rent over the holding period (flat monthly rent \\(m\\)):</p>
          <BlockFormula formula={"\\text{Rent Total} = m \\times 12 \\times t"} />
          <p>Loan cost (simple interest; swap with EMI later if needed):</p>
          <BlockFormula formula={"\\text{Interest Cost} = L \\times i \\times t"} />
          <p>Net proceeds & ROI:</p>
          <BlockFormula formula={"\\text{Total Proceeds} = \\text{Sale Price} + \\text{Rent Total}"} />
          <BlockFormula formula={"\\text{Net Profit} = \\text{Total Proceeds} - V_0 - \\text{Interest Cost}"} />
          <BlockFormula formula={"\\text{ROI} = \\dfrac{\\text{Net Profit}}{V_0}"} />
          <p>CAGR based on total proceeds:</p>
          <BlockFormula formula={"\\text{CAGR} = \\left(\\dfrac{\\text{Total Proceeds}}{V_0}\\right)^{1/t} - 1"} />
          <p>Stock comparison:</p>
          <BlockFormula formula={"\\text{Stock Final} = V_0 \\,(1+s)^t"} />
        </div>
      </SectionCard>

      <div className="rc-muted" style={{ fontSize: 12 }}>
        Notes: All inputs are in INR. Dollar figures use the USD/INR slider. This tool assumes flat rent and interest-only
        loan cost for simplicity; property taxes, maintenance, vacancies, transaction costs, and EMI amortization are not yet
        included.
      </div>
    </div>
  );
};

export default RoiCalculator;
