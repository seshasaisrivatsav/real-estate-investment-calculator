import React from 'react';

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
    </div>
  );
}

export default EquityROITable;
