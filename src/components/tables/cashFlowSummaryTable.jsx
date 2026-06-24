import React from "react";

function CashFlowSummaryTable({ breakdownData }) {
  return (
    <div className="output-container">
      <h2>💵 Cash Flow Summary</h2>
      <div className="data-table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ textAlign: "left" }}>Item</th>
              <th>Monthly</th>
              <th>Yearly</th>
            </tr>
          </thead>
          <tbody>
            {breakdownData.map((row, i) => (
              <tr key={i}>
                <td className="label">{row.item}</td>
                <td className={row.isHighlight ? (row.positive ? "positive" : "negative") : ""}>
                  {row.monthly}
                </td>
                <td className={row.isHighlight ? (row.positive ? "positive" : "negative") : ""}>
                  {row.yearly}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CashFlowSummaryTable;
