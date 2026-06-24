import React from "react";
import BlockFormula from "../utilComponents/blockFormula";
import InlineFormula from "../utilComponents/inlineFormula";

const Tooltip = ({ text }) => (
  <span className="tooltip-wrap">
    <span className="tooltip-icon">?</span>
    <span className="tooltip-box">{text}</span>
  </span>
);

function CashFlowROITable({ cashFlowROI }) {
  const years = Object.keys(cashFlowROI);
  return (
    <div className="output-container">
      <h2>
        📈 Cash-on-Cash Return
        <Tooltip text="Annual cash flow ÷ total cash invested (down payment + closing costs + repairs). Measures how efficiently your upfront cash generates income." />
      </h2>
      <div className="data-table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Holding Period</th>
              <th>Cash-on-Cash Return</th>
            </tr>
          </thead>
          <tbody>
            {years.map((year) => {
              const val = cashFlowROI[year];
              return (
                <tr key={year}>
                  <td>{year} Years</td>
                  <td className={val >= 0 ? "positive" : "negative"}>
                    {val.toFixed(2)}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="formula-section">
        <InlineFormula formula="Cashflow = EffectiveRent - (Mortgage + Tax + HOA + Maintenance + MgmtFee)" />
        <BlockFormula formula="CashOnCashReturn = \frac{100 \times Years \times Cashflow}{Downpayment + ClosingCosts + InitialRepairs}" />
      </div>
    </div>
  );
}

export default CashFlowROITable;
