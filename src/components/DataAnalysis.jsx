import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer,
} from "recharts";
import "./DataAnalysis.css";

const fmt = (n) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n ?? 0);

const fmtPct = (n) => `${Number(n).toFixed(1)}%`;

const COLORS = ["#1d4ed8", "#16a34a", "#d97706", "#dc2626", "#7c3aed", "#0891b2"];

const CurrencyTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip-label">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} style={{ color: entry.color, margin: "3px 0" }}>
          <strong>{entry.name}:</strong> {fmt(entry.value)}
        </p>
      ))}
    </div>
  );
};

const PctTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip-label">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} style={{ color: entry.color, margin: "3px 0" }}>
          <strong>{entry.name}:</strong> {fmtPct(entry.value)}
        </p>
      ))}
    </div>
  );
};

const PieTooltip = ({ active, payload }) => {
  if (!active || !payload || !payload.length) return null;
  const d = payload[0];
  return (
    <div className="chart-tooltip">
      <p style={{ margin: 0, fontWeight: 600 }}>{d.name}</p>
      <p style={{ margin: "3px 0", color: d.payload.fill }}>{fmt(d.value)}</p>
      <p style={{ margin: 0, color: "var(--text-muted)", fontSize: 12 }}>{d.payload.percentage}</p>
    </div>
  );
};

const renderPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, name, percentage }) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 1.45;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="var(--text)" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central" fontSize={11}>
      {`${name} (${percentage})`}
    </text>
  );
};

const DataAnalysis = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { inputs, analytics } = location.state || {};

  if (!inputs || !analytics) {
    return (
      <div className="da-container">
        <div className="empty-state card" style={{ marginTop: 60 }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M3 3v18h18" /><path d="M18 17V9" /><path d="M13 17V5" /><path d="M8 17v-3" />
          </svg>
          <p style={{ marginBottom: 16 }}>No data to display. Run the calculator first.</p>
          <button className="btn btn-primary" onClick={() => navigate("/")}>
            Go to Calculator
          </button>
        </div>
      </div>
    );
  }

  const { yearly } = analytics.operatingExpenses;
  const customRate = analytics.customAppreciationRate ?? 3;

  const yearlyExpensesData = [
    {
      name: "Annual Totals",
      "Effective Rent": yearly.effectiveRent,
      "Property Tax": yearly.propertyTax,
      HOA: yearly.hoa,
      Maintenance: yearly.maintenance,
      "Mgmt Fee": yearly.propertyManagementFee,
      Mortgage: yearly.mortgage,
    },
  ];

  const cashFlowROIData = Object.entries(analytics.cashFlowROI).map(([year, roi]) => ({
    year: `${year} yrs`,
    "Cash-on-Cash Return": parseFloat(roi),
  }));

  const equityROIData = Object.entries(analytics.equityROI).map(([year, rates]) => {
    const y = parseInt(year);
    return {
      year: `${year} yrs`,
      "2% Appr.": parseFloat(rates["2Percent"]),
      "3% Appr.": parseFloat(rates["3Percent"]),
      "4% Appr.": parseFloat(rates["4Percent"]),
      [`${customRate}% Custom`]: parseFloat(rates["customPercent"]),
      "S&P 500 (8%)":  parseFloat(((Math.pow(1.08,  y) - 1) * 100).toFixed(1)),
      "S&P 500 (10%)": parseFloat(((Math.pow(1.10, y) - 1) * 100).toFixed(1)),
      "S&P 500 (12%)": parseFloat(((Math.pow(1.12, y) - 1) * 100).toFixed(1)),
    };
  });

  const pieData = [
    { name: "Property Tax", value: yearly.propertyTax },
    { name: "HOA", value: yearly.hoa },
    { name: "Maintenance", value: yearly.maintenance },
    { name: "Mgmt Fee", value: yearly.propertyManagementFee },
    { name: "Mortgage", value: yearly.mortgage },
  ].filter((d) => d.value > 0);

  const totalCosts = pieData.reduce((s, d) => s + d.value, 0);
  const pieDataWithPct = pieData.map((d) => ({
    ...d,
    percentage: totalCosts > 0 ? `${((d.value / totalCosts) * 100).toFixed(1)}%` : "0%",
  }));

  return (
    <div className="da-container">
      <div className="da-header">
        <div>
          <h1 className="calc-title">Data Analysis</h1>
          <p className="calc-subtitle">Visual breakdown of your investment performance</p>
        </div>
        <button className="btn btn-outline" onClick={() => navigate("/")}>
          ← Back to Calculator
        </button>
      </div>

      <div className="da-grid">
        {/* Bar chart */}
        <div className="da-chart-card">
          <h3 className="da-chart-title">Annual Income vs. Expenses</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={yearlyExpensesData} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" tick={{ fill: "var(--text-muted)", fontSize: 12 }} />
              <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} tick={{ fill: "var(--text-muted)", fontSize: 11 }} />
              <Tooltip content={<CurrencyTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="Effective Rent" fill="#1d4ed8" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Mortgage" fill="#dc2626" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Property Tax" fill="#d97706" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Maintenance" fill="#7c3aed" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Mgmt Fee" fill="#0891b2" radius={[4, 4, 0, 0]} />
              <Bar dataKey="HOA" fill="#16a34a" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart */}
        <div className="da-chart-card">
          <h3 className="da-chart-title">Annual Cost Breakdown</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={pieDataWithPct}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label={renderPieLabel}
                labelLine={false}
              >
                {pieDataWithPct.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<PieTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Cash-on-Cash line chart */}
        <div className="da-chart-card">
          <h3 className="da-chart-title">Cash-on-Cash Return Over Time</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={cashFlowROIData} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="year" tick={{ fill: "var(--text-muted)", fontSize: 12 }} />
              <YAxis tickFormatter={(v) => `${v.toFixed(0)}%`} tick={{ fill: "var(--text-muted)", fontSize: 11 }} />
              <Tooltip content={<PctTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line
                type="monotone"
                dataKey="Cash-on-Cash Return"
                stroke="#1d4ed8"
                strokeWidth={2.5}
                dot={{ r: 5, fill: "#1d4ed8" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Equity ROI line chart */}
        <div className="da-chart-card">
          <h3 className="da-chart-title">Equity ROI vs. S&amp;P 500</h3>
          <p className="da-chart-note">After ~6% selling costs; rent grows at your set rate each year</p>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={equityROIData} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="year" tick={{ fill: "var(--text-muted)", fontSize: 12 }} />
              <YAxis tickFormatter={(v) => `${v.toFixed(0)}%`} tick={{ fill: "var(--text-muted)", fontSize: 11 }} />
              <Tooltip content={<PctTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="2% Appr." stroke="#94a3b8" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="3% Appr." stroke="#1d4ed8" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="4% Appr." stroke="#16a34a" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey={`${customRate}% Custom`} stroke="#d97706" strokeWidth={2.5} strokeDasharray="6 3" dot={{ r: 5 }} />
              <Line type="monotone" dataKey="S&P 500 (8%)"  stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="3 3" dot={{ r: 3 }} />
              <Line type="monotone" dataKey="S&P 500 (10%)" stroke="#7c3aed" strokeWidth={2}   strokeDasharray="4 4" dot={{ r: 4 }} />
              <Line type="monotone" dataKey="S&P 500 (12%)" stroke="#ec4899" strokeWidth={1.5} strokeDasharray="3 3" dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DataAnalysis;
