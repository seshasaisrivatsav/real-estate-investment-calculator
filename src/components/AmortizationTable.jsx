import React from "react";

const fmt = (n) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format(n ?? 0);

function AmortizationTable({ data }) {
  if (!data || data.length === 0) return null;

  return (
    <div>
      <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 12 }}>
        Yearly summary of your mortgage — interest and principal paid each year, and remaining balance.
      </p>
      <div className="data-table-wrap" style={{ maxHeight: 340, overflowY: "auto" }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Year</th>
              <th>Monthly Payment</th>
              <th>Interest Paid</th>
              <th>Principal Paid</th>
              <th>Remaining Balance</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.year}>
                <td>{row.year}</td>
                <td>{fmt(row.monthlyPayment)}</td>
                <td style={{ color: "var(--danger)" }}>{fmt(row.interestPaid)}</td>
                <td style={{ color: "var(--success)" }}>{fmt(row.principalPaid)}</td>
                <td>{fmt(row.remainingBalance)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AmortizationTable;
