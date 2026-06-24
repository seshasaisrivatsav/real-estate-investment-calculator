import React from "react";
import BlockFormula from "../utilComponents/blockFormula";

const Tooltip = ({ text }) => (
  <span className="tooltip-wrap">
    <span className="tooltip-icon">?</span>
    <span className="tooltip-box">{text}</span>
  </span>
);

function EquityROITable({ equityROI, customAppreciationRate = 3 }) {
  return (
    <div className="output-container">
      <h2>
        🏠 Equity ROI
        <Tooltip text="Total ROI including capital gain (after ~6% selling costs) plus cumulative cash flow, relative to your initial cash investment." />
      </h2>
      <div className="data-table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Years</th>
              <th>2% Appr.</th>
              <th>3% Appr.</th>
              <th>4% Appr.</th>
              <th>{customAppreciationRate}% Custom</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(equityROI).map((year) => {
              const row = equityROI[year];
              return (
                <tr key={year}>
                  <td>{year} yrs</td>
                  {["2Percent", "3Percent", "4Percent", "customPercent"].map((k) => {
                    const v = parseFloat(row[k]);
                    return (
                      <td key={k} className={v >= 0 ? "positive" : "negative"}>
                        {v.toFixed(1)}%
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="formula-section">
        <p style={{ fontSize: 12, color: "var(--text-muted)", margin: "0 0 8px" }}>
          Selling costs (~6% realtor + fees) are deducted from the projected sale price.
        </p>
        <BlockFormula formula="\text{SalePrice} = V_0 \times (1+r)^t \quad;\quad \text{SellingCosts} = 6\%" />
        <BlockFormula formula="\text{EquityROI} = \frac{(CashFlow_{total} + CapitalGain) \times 100}{InitialInvestment}" />
      </div>
    </div>
  );
}

export default EquityROITable;
