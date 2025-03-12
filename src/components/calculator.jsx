import React, { useState, useEffect } from 'react';
import { useTable } from 'react-table';
import { calculateEverything } from '../utils/calculations';
import CashFlowROITable from './cashFlowROITable';
import EquityROITable from './equityROITable';
import './calculator.css';

function Calculator() {
  // Inputs
  const [homePrice, setHomePrice] = useState(500000);
  const [downpaymentPercentage, setDownpaymentPercentage] = useState(60);
  const [interestRate, setInterestRate] = useState(7);
  const [loanTerm, setLoanTerm] = useState(30);
  const [annualMaintenance, setAnnualMaintenance] = useState(7500);
  const [estimatedRent, setEstimatedRent] = useState(3000);
  const [hoa, setHoa] = useState(0);
  const [propertyTaxPercentage, setPropertyTaxPercentage] = useState(1.25);
  const [propertyManagementFeePercentage, setPropertyManagementFeePercentage] = useState(10);
  
  // Calculations
  const [amortizationData, setAmortizationData] = useState([]);
  const [propertyManagementFee, setPropertyManagementFee] = useState(0);
  const [propertyManagementFeeYearly, setPropertyManagementFeeYearly] = useState(0);
  const [loanAmount, setLoanAmount] = useState(0);

  const [monthlyCashFlow, setMonthlyCashFlow] = useState(0);
  const [monthlyCosts, setMonthlyCosts] = useState(0);

  const [equityROI, setEquityROI] = useState({});
  const [cashFlowROI, setCashFlowROI] = useState({});

  useEffect(() => {
    const downpayment = homePrice * (downpaymentPercentage / 100);
    const loanAmount = homePrice - downpayment;
    setLoanAmount(loanAmount);
  }, [homePrice, downpaymentPercentage]);

  const calculateData = () => {

    const everyDetail = calculateEverything({
      homePrice, 
      downpaymentPercentage, 
      interestRate, 
      loanTerm, 
      estimatedRent, 
      hoa, 
      annualMaintenance, 
      propertyTaxPercentage, 
      propertyManagementFeePercentage
    });


    console.log( everyDetail);
    setAmortizationData(everyDetail.amortization);
    // Set ROI and Cashflow ROI

    setEquityROI(everyDetail.equityROI);

    setCashFlowROI(everyDetail.cashFlowROI);

    const monthlyMortgagePayment = everyDetail.amortization[0].monthlyPayment;

    const propertyTaxAmount = homePrice * (propertyTaxPercentage / 100);
    const monthlyPropertyTax = propertyTaxAmount / 12;
    
    const monthlyPropertyManagementFee = (estimatedRent * (propertyManagementFeePercentage / 100));
    const yearlyPropertyManagementFee = monthlyPropertyManagementFee * 12;
    
    const monthlyPropertyMaintenance = annualMaintenance / 12;

    setPropertyManagementFee(monthlyPropertyManagementFee);
    setPropertyManagementFeeYearly(yearlyPropertyManagementFee);


    const monthlyCosts = 
      monthlyMortgagePayment + 
      monthlyPropertyTax + 
      monthlyPropertyManagementFee + 
      monthlyPropertyMaintenance + 
      hoa;
    setMonthlyCosts(monthlyCosts);

    const cashFlow = estimatedRent - monthlyCosts;
    setMonthlyCashFlow(cashFlow);
  };

  const data = React.useMemo(
    () => [
      {
        item: 'Rent',
        monthly: estimatedRent.toFixed(2),
        yearly: (estimatedRent * 12).toFixed(2),
      },
      {
        item: 'Property Tax',
        monthly: (homePrice * (propertyTaxPercentage / 100) / 12).toFixed(2),
        yearly: (homePrice * (propertyTaxPercentage / 100)).toFixed(2),
      },
      {
        item: 'HOA',
        monthly: hoa.toFixed(2),
        yearly: (hoa * 12).toFixed(2),
      },
      {
        item: 'Maintenance',
        monthly: (annualMaintenance / 12).toFixed(2),
        yearly: annualMaintenance.toFixed(2),
      },
      {
        item: 'Property Management Fee',
        monthly: propertyManagementFee.toFixed(2),
        yearly: propertyManagementFeeYearly.toFixed(2),
      },
      {
        item: 'Mortgage (Principal + Interest)',
        monthly: amortizationData.length > 0 ? amortizationData[0]?.monthlyPayment.toFixed(2) : '0.00',
        yearly: amortizationData.length > 0 ? (amortizationData[0]?.monthlyPayment * 12).toFixed(2) : '0.00',
      },
    ],
    [estimatedRent, homePrice, propertyTaxPercentage, hoa, annualMaintenance, amortizationData, propertyManagementFee, propertyManagementFeeYearly]
  );

  const breakdownData = React.useMemo(() => [
    {
      item: 'Monthly Rent',
      monthly: estimatedRent.toFixed(2),
      yearly: (estimatedRent * 12).toFixed(2),
    },
    {
      item: 'Monthly Cost',
      monthly: (monthlyCosts).toFixed(2),
      yearly: (monthlyCosts*12).toFixed(2),
    },
    {
      item: 'Cash Flow',
      monthly: (monthlyCashFlow).toFixed(2),
      yearly: (monthlyCashFlow*12).toFixed(2),
    },
  ], [estimatedRent, monthlyCosts, monthlyCashFlow]);

  const columns = React.useMemo(
    () => [
      {
        Header: 'Item',
        accessor: 'item',
      },
      {
        Header: 'Monthly ($)',
        accessor: 'monthly',
      },
      {
        Header: 'Yearly ($)',
        accessor: 'yearly',
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data,
  });

  const breakdownTableProps = useTable({
    columns,
    data: breakdownData,
  });

  return (
    <div className="calculator-container">
      <h1>Real Estate Investment Calculator</h1>

      {/* Input Section */}
      <div className="input-container-row">
        <div className="input-container">
          <label>Home Price:</label>
          <input
            type="number"
            value={homePrice}
            onChange={(e) => setHomePrice(Number(e.target.value))}
          />
        </div>
        <div className="input-container">
          <label>Downpayment Percentage:</label>
          <input
            type="number"
            value={downpaymentPercentage}
            onChange={(e) => setDownpaymentPercentage(Number(e.target.value))}
          />
        </div>
        <div className="input-container">
          <label>Interest Rate (%):</label>
          <input
            type="number"
            value={interestRate}
            onChange={(e) => setInterestRate(Number(e.target.value))}
          />
        </div>
        <div className="input-container">
          <label>Loan Term (Years):</label>
          <input
            type="number"
            value={loanTerm}
            onChange={(e) => setLoanTerm(Number(e.target.value))}
          />
        </div>
      </div>

      <div className="input-container-row">
        <div className="input-container">
          <label>Estimated Rent ($):</label>
          <input
            type="number"
            value={estimatedRent}
            onChange={(e) => setEstimatedRent(Number(e.target.value))}
          />
        </div>
        <div className="input-container">
          <label>HOA ($):</label>
          <input
            type="number"
            value={hoa}
            onChange={(e) => setHoa(Number(e.target.value))}
          />
        </div>
        <div className="input-container">
          <label>Annual Maintenance ($):</label>
          <input
            type="number"
            value={annualMaintenance}
            onChange={(e) => setAnnualMaintenance(Number(e.target.value))}
          />
        </div>
        <div className="input-container">
          <label>Property Tax Percentage (%):</label>
          <input
            type="number"
            value={propertyTaxPercentage}
            onChange={(e) => setPropertyTaxPercentage(Number(e.target.value))}
          />
        </div>
      </div>

      <div className="input-container-row">
        <div className="input-container">
          <label>Property Management Fee Percentage (%):</label>
          <input
            type="number"
            value={propertyManagementFeePercentage}
            onChange={(e) => setPropertyManagementFeePercentage(Number(e.target.value))}
          />
        </div>
      </div>

      <div className="loan-amount-display">
        <h4>Loan Amount: ${loanAmount.toFixed(2)}</h4>
      </div>

      <button onClick={calculateData}>Estimate</button>

      {/* Monthly and Yearly Breakdown Table */}
      <div className="output-container">
        <h2>Monthly and Yearly Breakdown:</h2>
        <table {...getTableProps()} className="output-table">
          <thead key={1}>
            {headerGroups.map((headerGroup, index) => {
              <tr key={`header-group-${index}`} {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => {
                  const { key, ...columnProps } = column.getHeaderProps();
                  return (
                    <th key={key} {...columnProps}>
                      {column.render('Header')}
                    </th>
                  );
                })}
              </tr>
          })}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map(row => {
              prepareRow(row);
              return (
                <tr key={row} {...row.getRowProps()}>
                  {row.cells.map(cell => {
                    return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Breakdown Table (Rent, Costs, Cash Flow) */}
      <div className="output-container">
        <h2>Monthly and Yearly Breakdown (Rent, Costs, Cash Flow):</h2>
        <table {...breakdownTableProps.getTableProps()} className="output-table">
          <thead>
            {breakdownTableProps.headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => {
                  const { key, ...columnProps } = column.getHeaderProps();
                  return (
                    <th key={key} {...columnProps}>
                      {column.render('Header')}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody {...breakdownTableProps.getTableBodyProps()}>
            {breakdownTableProps.rows.map(row => {
              breakdownTableProps.prepareRow(row);
              return (
                <tr key={row} {...row.getRowProps()}>
                  {row.cells.map(cell => {
                    return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <CashFlowROITable cashFlowROI={cashFlowROI} />
      <EquityROITable equityROI={equityROI} />
    </div>
  );
}

export default Calculator;
