import React from 'react';
import BlockFormula from '../utilComponents/blockFormula';
import InlineFormula from '../utilComponents/inlineFormula';

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
      <div> {/* Replace <p> with <div> */}
        <p>This table gives the ROI just for cash</p>
        <p>
          <strong>Cash Flow ROI:</strong>
        </p>
        <InlineFormula formula="Cashflow = Rent - (PropertyTax + HOA + Maintenance + PropertyManagementFee + Mortgage)" />
        <BlockFormula formula="InitialInvestment = Downpayment + ClosingCosts + InitialCosts" />
        <BlockFormula formula="CashflowROI = \frac{100* (noOfYears*Cashflow)}{InitialInvestment}" />
      </div>
    </div>
  );
}

export default CashFlowROITable;