import React from "react";

function ExpensesBreakdownTable({ data }) {
  return (
    <div className="output-container">
      <h2>📊 Expenses Breakdown</h2>
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
            {data.map((row, i) => (
              <tr key={i}>
                <td className="label">{row.item}</td>
                <td>{row.monthly}</td>
                <td>{row.yearly}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ExpensesBreakdownTable;
