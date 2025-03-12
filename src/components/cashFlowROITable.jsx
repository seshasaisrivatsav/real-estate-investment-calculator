import React from 'react';

function CashFlowROITable({ cashFlowROI }) {
  const cashFlowYears = Object.keys(cashFlowROI); // Get the years (keys)
  
  return (
    <div className="output-container">
      <h2>Cash Flow ROI</h2>
      <table className="output-table">
        <thead>
          <tr>
            <th>Years</th>
            <th>ROI (%)</th>
          </tr>
        </thead>
        <tbody>
          {cashFlowYears.map(year => (
            <tr key={year}>
              <td>{year} Years</td>
              <td>{cashFlowROI[year].toFixed(2)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CashFlowROITable;
