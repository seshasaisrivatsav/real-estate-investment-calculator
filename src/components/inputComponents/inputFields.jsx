import React from "react";
import "./inputFields.css";

const InputFields = ({ inputs, handleInputChange, loanAmount }) => {
  return (
    <div className="input-fields">
      <div className="input-container-row">
        {[
          { label: "Home Price", key: "homePrice" },
          { label: "Downpayment %", key: "downpaymentPercentage" },
          { label: "Interest Rate (%)", key: "interestRate" },
          { label: "Loan Term (Years)", key: "loanTerm" },
          { label: "Estimated Rent ($)", key: "estimatedRent" },
        ].map(({ label, key }) => (
          <div className="input-container" key={key}>
            <label>{label}:</label>
            <input
              type="number"
              value={inputs[key]}
              onChange={(e) => handleInputChange(key, e.target.value)}
            />
          </div>
        ))}
      </div>

      <div className="input-container-row">
        {[
          { label: "HOA ($)", key: "hoa" },
          { label: "Annual Maintenance ($)", key: "annualMaintenance" },
          { label: "Property Tax (%)", key: "propertyTaxPercentage" },
          { label: "Annual Property Tax ($)", key: "annualPropertyTax" },
          { label: "Property Mgmt Fee (%)", key: "propertyManagementFeePercentage" },
          { label: "Closing Costs ($)", key: "closingCosts" },
          { label: "Initial Repairs ($)", key: "initialRepairs" },
        ].map(({ label, key }) => (
          <div className="input-container" key={key}>
            <label>{label}:</label>
            <input
              type="number"
              value={inputs[key]}
              onChange={(e) => handleInputChange(key, e.target.value)}
            />
          </div>
        ))}
      </div>

      <div className="loan-amount-display">
        <p>Enter Property Tax % <b>or</b> Annual Property Tax</p>
        <h4>
          Loan Amount: ${loanAmount.toFixed(2)} | Downpayment: $
          {(inputs.homePrice - loanAmount).toFixed(2)}
        </h4>
      </div>
    </div>
  );
};

export default InputFields;