import React from 'react';
import InlineFormula from './utilComponents/inlineFormula';
import BlockFormula from './utilComponents/blockFormula';

function EquityROITable({ equityROI }) {
  return (
    <div className="output-container">
      <h2>Equity ROI</h2>
    
      <table className="output-table">
        <thead>
          <tr>
            <th>Years</th>
            <th>2%</th>
            <th>3%</th>
            <th>4%</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(equityROI).map((year) => (
            <tr key={year}>
              <td>{year} Years</td>
              <td>{equityROI[year]["2Percent"]}%</td>
              <td>{equityROI[year]["3Percent"]}%</td>
              <td>{equityROI[year]["4Percent"]}%</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>This table gives the equity value for 5, 10, 15 years if the property values rose by 2, 3 and 4%</p>
      <p>
        <strong>Equity ROI:</strong>
        <BlockFormula formula="\text{AppraisedHomeValue}_{\text{future}} = \text{HomeValue}_{\text{initial}} \times (1 + \text{AppreciationRate})^{\text{Years}}" />
        <BlockFormula formula="CapitalGain = AppraisedHomeValue  - HomePurchasePrice" />
        <BlockFormula formula="InitialInvestment = Downpayment + ClosingCosts + InitialCosts" />
        <BlockFormula formula="CapitalGainROI = \frac{(TotalCashFlow + CapitalGain) * 100}{InitialInvestment}" />
      </p>
    </div>
  );
}

export default EquityROITable;
