import React from "react";
import "./inputFields.css";

const FIELDS = [
  {
    label: "Home Price",
    key: "homePrice",
    prefix: "$",
    hint: "Purchase price of the property",
    step: 1000,
  },
  {
    label: "Down Payment",
    key: "downpaymentPercentage",
    suffix: "%",
    hint: "Percentage of home price paid upfront (e.g. 20%)",
    step: 1,
    min: 0,
    max: 100,
  },
  {
    label: "Interest Rate",
    key: "interestRate",
    suffix: "% / yr",
    hint: "Annual mortgage interest rate",
    step: 0.125,
    min: 0,
    max: 30,
  },
  {
    label: "Loan Term",
    key: "loanTerm",
    suffix: "years",
    hint: "Length of mortgage (typically 15 or 30 years)",
    step: 1,
    min: 1,
    max: 50,
  },
  {
    label: "Estimated Rent",
    key: "estimatedRent",
    prefix: "$",
    suffix: "/ mo",
    hint: "Expected gross monthly rental income",
    step: 50,
  },
  {
    label: "Vacancy Rate",
    key: "vacancyRate",
    suffix: "%",
    hint: "% of time property sits vacant (typically 5–10%). Reduces effective rent.",
    step: 1,
    min: 0,
    max: 100,
  },
];

const FIELDS2 = [
  {
    label: "HOA",
    key: "hoa",
    prefix: "$",
    suffix: "/ mo",
    hint: "Monthly homeowners association fee",
    step: 10,
    min: 0,
  },
  {
    label: "Annual Maintenance",
    key: "annualMaintenance",
    prefix: "$",
    suffix: "/ yr",
    hint: "Yearly maintenance budget (~1–2% of home price is typical)",
    step: 100,
    min: 0,
  },
  {
    label: "Property Tax",
    key: "propertyTaxPercentage",
    suffix: "% / yr",
    hint: "Annual property tax as % of home price",
    step: 0.05,
    min: 0,
  },
  {
    label: "Annual Property Tax $",
    key: "annualPropertyTax",
    prefix: "$",
    suffix: "/ yr",
    hint: "Alternative: enter dollar amount directly (syncs with % above)",
    step: 100,
    min: 0,
  },
  {
    label: "Prop. Mgmt Fee",
    key: "propertyManagementFeePercentage",
    suffix: "% of rent",
    hint: "Property manager fee as % of effective rent (typically 8–12%)",
    step: 0.5,
    min: 0,
    max: 50,
  },
  {
    label: "Closing Costs",
    key: "closingCosts",
    prefix: "$",
    hint: "One-time costs to close the purchase (2–5% of price is typical)",
    step: 500,
    min: 0,
  },
  {
    label: "Initial Repairs",
    key: "initialRepairs",
    prefix: "$",
    hint: "Upfront repairs/renovations before renting",
    step: 500,
    min: 0,
  },
  {
    label: "Custom Appreciation",
    key: "customAppreciationRate",
    suffix: "% / yr",
    hint: "Your expected annual appreciation rate — adds a custom column to the Equity ROI table",
    step: 0.5,
    min: 0,
    max: 50,
  },
];

const Tooltip = ({ text }) => (
  <span className="tooltip-wrap">
    <span className="tooltip-icon">?</span>
    <span className="tooltip-box">{text}</span>
  </span>
);

const Field = ({ label, fieldKey, prefix, suffix, hint, step, min, max, value, onChange, error }) => (
  <div className={`input-field${error ? " input-error" : ""}`}>
    <label className="field-label">
      {label}
      {hint && <Tooltip text={hint} />}
    </label>
    <div className="field-input-wrap">
      {prefix && <span className="field-affix field-prefix">{prefix}</span>}
      <input
        type="number"
        value={value}
        step={step}
        min={min}
        max={max}
        onChange={(e) => onChange(fieldKey, e.target.value)}
        className={prefix ? "has-prefix" : ""}
      />
      {suffix && <span className="field-affix field-suffix">{suffix}</span>}
    </div>
    {error && <div className="field-error">{error}</div>}
  </div>
);

const InputFields = ({ inputs, handleInputChange, errors = {} }) => {
  return (
    <div className="input-fields">
      <div className="input-section-label">Property &amp; Loan Details</div>
      <div className="input-grid">
        {FIELDS.map((f) => (
          <Field
            key={f.key}
            {...f}
            fieldKey={f.key}
            value={inputs[f.key]}
            onChange={handleInputChange}
            error={errors[f.key]}
          />
        ))}
      </div>

      <div className="input-section-label" style={{ marginTop: 20 }}>Expenses &amp; Costs</div>
      <div className="input-grid">
        {FIELDS2.map((f) => (
          <Field
            key={f.key}
            {...f}
            fieldKey={f.key}
            value={inputs[f.key]}
            onChange={handleInputChange}
            error={errors[f.key]}
          />
        ))}
      </div>

      <div className="property-tax-note">
        💡 Enter <strong>Property Tax %</strong> <em>or</em> <strong>Annual Property Tax $</strong> — both sync automatically.
      </div>
    </div>
  );
};

export default InputFields;
