import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from 'recharts';

const DataAnalysis = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { inputs, analytics } = location.state || {};

  // Redirect to Calculator if state is missing
  if (!inputs || !analytics) {
    navigate("/"); // Redirect to the home page
    return null; // Render nothing while redirecting
  }

  // Data for yearly operating expenses (bar chart)
  const yearlyExpensesData = [
    {
      name: 'Yearly Expenses',
      Rent: analytics.operatingExpenses.yearly.rent,
      Costs:
        analytics.operatingExpenses.yearly.propertyTax +
        analytics.operatingExpenses.yearly.hoa +
        analytics.operatingExpenses.yearly.maintenance +
        analytics.operatingExpenses.yearly.propertyManagementFee +
        analytics.operatingExpenses.yearly.mortgage,
    },
  ];

  // Data for Cash Flow ROI (line chart)
  const cashFlowROIData = Object.entries(analytics.cashFlowROI).map(([year, roi]) => ({
    year: `${year} Years`,
    ROI: roi,
  }));

  // Data for Equity ROI (line chart)
  const equityROIData = Object.entries(analytics.equityROI).map(([year, rates]) => ({
    year: `${year} Years`,
    ...rates, // Spread the rates (2%, 3%, 4%)
    SP500: 8 * parseInt(year), // S&P 500 average ROI (8% per year)
  }));

  // Data for yearly expenses breakdown (pie chart)
  const yearlyExpensesBreakdown = [
    { name: 'Rent', value: analytics.operatingExpenses.yearly.rent },
    { name: 'Property Tax', value: analytics.operatingExpenses.yearly.propertyTax },
    { name: 'HOA', value: analytics.operatingExpenses.yearly.hoa },
    { name: 'Maintenance', value: analytics.operatingExpenses.yearly.maintenance },
    { name: 'Mgmt Fee', value: analytics.operatingExpenses.yearly.propertyManagementFee },
    { name: 'Mortgage', value: analytics.operatingExpenses.yearly.mortgage },
  ];

  // Calculate total yearly expenses
  const totalYearlyExpenses = yearlyExpensesBreakdown.reduce(
    (total, expense) => total + expense.value,
    0
  );

  // Add percentage to each expense
  const yearlyExpensesWithPercentage = yearlyExpensesBreakdown.map((expense) => ({
    ...expense,
    percentage: ((expense.value / totalYearlyExpenses) * 100).toFixed(2) + '%',
  }));

  // Colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF1919'];

  return (
    <div style={styles.container}>
      <h2>Data Analysis</h2>
      <button style={styles.backButton} onClick={() => navigate("/")}>
        Go Back to Calculator
      </button>

      {/* Row 1: Yearly Operating Expenses and Yearly Breakdown */}
      <div style={styles.row}>
        <div style={styles.chartContainer}>
          <h3>Yearly Operating Expenses</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={yearlyExpensesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Rent" fill="#8884d8" name="Rent" />
              <Bar dataKey="Costs" fill="#82ca9d" name="Costs" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={styles.chartContainer}>
          <h3>Yearly Expenses Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={yearlyExpensesWithPercentage}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label={({ name, value, percentage }) => `${name}: $${value} (${percentage})`}
              >
                {yearlyExpensesWithPercentage.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 2: Cash Flow ROI and Equity ROI */}
      <div style={styles.row}>
        <div style={styles.chartContainer}>
          <h3>Cash Flow ROI Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={cashFlowROIData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="ROI" stroke="#82ca9d" name="Cash Flow ROI (%)" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div style={styles.chartContainer}>
          <h3>Equity ROI Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={equityROIData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="2Percent" stroke="#8884d8" name="2% Appreciation" />
              <Line type="monotone" dataKey="3Percent" stroke="#82ca9d" name="3% Appreciation" />
              <Line type="monotone" dataKey="4Percent" stroke="#ff7300" name="4% Appreciation" />
              <Line type="monotone" dataKey="SP500" stroke="#000000" name="S&P 500 (8% ROI)" strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
    fontFamily: 'Arial, sans-serif',
  },
  backButton: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginBottom: '20px',
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '40px',
  },
  chartContainer: {
    flex: 1,
    margin: '0 10px',
  },
};

export default DataAnalysis;