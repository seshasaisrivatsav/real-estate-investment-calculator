import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { calculateEverything } from "../utils/calculations";
import ExpensesBreakdownTable from "./tables/expensesBreakdownTable";
import InputFields from "./inputComponents/inputFields";
import CashFlowSummaryTable from "./tables/cashFlowSummaryTable";
import CashFlowROITable from "./tables/cashFlowROITable";
import EquityROITable from "./tables/equityROITable";
import "./calculator.css";

function Calculator() {
  const navigate = useNavigate();

  // Inputs state
  const [inputs, setInputs] = useState({
    homePrice: 500000,
    downpaymentPercentage: 60,
    interestRate: 7,
    loanTerm: 30,
    estimatedRent: 3000,
    hoa: 0,
    annualMaintenance: 7500,
    propertyTaxPercentage: 1.25,
    annualPropertyTax: (1.25 / 100) * 500000,
    propertyManagementFeePercentage: 10,
    closingCosts: 15000,
    initialRepairs: 4000,
  });

  // Calculations state
  const [amortizationData, setAmortizationData] = useState([]);
  const [propertyManagementFee, setPropertyManagementFee] = useState(0);
  const [propertyManagementFeeYearly, setPropertyManagementFeeYearly] = useState(0);
  const [loanAmount, setLoanAmount] = useState(0);
  const [monthlyCashFlow, setMonthlyCashFlow] = useState(0);
  const [monthlyCosts, setMonthlyCosts] = useState(0);
  const [equityROI, setEquityROI] = useState({});
  const [cashFlowROI, setCashFlowROI] = useState({});

  // Handle input changes
  const handleInputChange = (field, value) => {
    const newValue = Number(value);

    if (field === "propertyTaxPercentage") {
      const annualPropertyTax = inputs.homePrice * (newValue / 100);
      setInputs((prev) => ({
        ...prev,
        propertyTaxPercentage: newValue,
        annualPropertyTax: annualPropertyTax,
      }));
    } else if (field === "annualPropertyTax") {
      const propertyTaxPercentage = (newValue / inputs.homePrice) * 100;
      setInputs((prev) => ({
        ...prev,
        annualPropertyTax: newValue,
        propertyTaxPercentage: propertyTaxPercentage.toFixed(2),
      }));
    } else {
      setInputs((prev) => ({
        ...prev,
        [field]: newValue,
      }));
    }
  };

  // Calculate loan amount and property management fee
  useEffect(() => {
    const downpayment = inputs.homePrice * (inputs.downpaymentPercentage / 100);
    const loanAmount = inputs.homePrice - downpayment;
    setLoanAmount(loanAmount);

    const monthlyPropertyManagementFee = inputs.estimatedRent * (inputs.propertyManagementFeePercentage / 100);
    setPropertyManagementFee(monthlyPropertyManagementFee);
  }, [inputs]);

  // Calculate all data
  const calculateData = () => {
    const everyDetail = calculateEverything(inputs);
    console.log(everyDetail);

    setAmortizationData(everyDetail.amortization);
    setEquityROI(everyDetail.equityROI);
    setCashFlowROI(everyDetail.cashFlowROI);
    setPropertyManagementFee(everyDetail.operatingExpenses.monthly.propertyManagementFee);
    setPropertyManagementFeeYearly(everyDetail.operatingExpenses.yearly.propertyManagementFee);
    setMonthlyCosts(everyDetail.operatingExpenses.monthly.monthlyCosts);
    setMonthlyCashFlow(everyDetail.cashFlow.monthlyCashFlow);
  };

  // Navigate to Data Analysis page
  const goToDataAnalysis = () => {
    const everyDetail = calculateEverything(inputs); // Calculate everything
    navigate("/data-analysis", {
      state: {
        inputs,
        analytics: everyDetail, // Pass all analytics
      },
    });
  };

  // Memoized costs data
  const costsData = React.useMemo(
    () => [
      { item: "Rent", monthly: inputs.estimatedRent.toFixed(2), yearly: (inputs.estimatedRent * 12).toFixed(2) },
      { item: "Property Tax", monthly: ((inputs.homePrice * (inputs.propertyTaxPercentage / 100)) / 12).toFixed(2), yearly: (inputs.homePrice * (inputs.propertyTaxPercentage / 100)).toFixed(2) },
      { item: "HOA", monthly: inputs.hoa.toFixed(2), yearly: (inputs.hoa * 12).toFixed(2) },
      { item: "Maintenance", monthly: (inputs.annualMaintenance / 12).toFixed(2), yearly: inputs.annualMaintenance.toFixed(2) },
      { item: "Property Management Fee", monthly: propertyManagementFee.toFixed(2), yearly: propertyManagementFeeYearly.toFixed(2) },
      { item: "Mortgage (Principal + Interest)", monthly: amortizationData.length > 0 ? amortizationData[0]?.monthlyPayment.toFixed(2) : "0.00", yearly: amortizationData.length > 0 ? (amortizationData[0]?.monthlyPayment * 12).toFixed(2) : "0.00" },
    ],
    [inputs, propertyManagementFee, propertyManagementFeeYearly, amortizationData]
  );

  // Memoized breakdown data
  const breakdownData = React.useMemo(
    () => [
      { item: "Rent", monthly: inputs.estimatedRent.toFixed(2), yearly: (inputs.estimatedRent * 12).toFixed(2) },
      { item: "Expenses", monthly: monthlyCosts.toFixed(2), yearly: (monthlyCosts * 12).toFixed(2) },
      { item: "Cash Flow", monthly: monthlyCashFlow.toFixed(2), yearly: (monthlyCashFlow * 12).toFixed(2) },
    ],
    [inputs, monthlyCosts, monthlyCashFlow]
  );

  return (
    <div className="calculator-container">
      <h1>Real Estate Investment Calculator</h1>
      <InputFields inputs={inputs} handleInputChange={handleInputChange} loanAmount={loanAmount} />
      <button className="estimate-button" onClick={calculateData}>Estimate ROI & CashFlow</button>
      <button className="analysis-button" onClick={goToDataAnalysis}>Go to Data Analysis</button>
      <div className="tables-container">
        <div className="table-row">
          <ExpensesBreakdownTable data={costsData} />
          <CashFlowSummaryTable breakdownData={breakdownData} />
        </div>
        <div className="table-row">
          <CashFlowROITable cashFlowROI={cashFlowROI} />
          <EquityROITable equityROI={equityROI} />
        </div>
      </div>
    </div>
  );
}

export default Calculator;