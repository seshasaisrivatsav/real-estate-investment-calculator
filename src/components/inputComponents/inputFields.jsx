import React from "react";
import "./inputFields.css";

const FIELDS = [
  {
    label: "Home Price",
    key: "homePrice",
    prefix: "$",
    hint: "Purchase price of the property",
    step: 5000,
    min: 50000,
    max: 3000000,
    sliderMin: 50000,
    sliderMax: 3000000,
    sliderStep: 5000,
  },
  {
    label: "Down Payment",
    key: "downpaymentPercentage",
    suffix: "%",
    hint: "Percentage of home price paid upfront (e.g. 20%)",
    step: 1,
    min: 0,
    max: 100,
    sliderMin: 0,
    sliderMax: 50,
    sliderStep: 1,
  },
  {
    label: "Interest Rate",
    key: "interestRate",
    suffix: "% / yr",
    hint: "Annual mortgage interest rate",
    step: 0.125,
    min: 0,
    max: 30,
    sliderMin: 2,
    sliderMax: 12,
    sliderStep: 0.125,
  },
  {
    label: "Loan Term",
    key: "loanTerm",
    suffix: "years",
    hint: "Length of mortgage (typically 15 or 30 years)",
    step: 1,
    min: 1,
    max: 50,
    sliderMin: 5,
    sliderMax: 30,
    sliderStep: 5,
  },
  {
    label: "Estimated Rent",
    key: "estimatedRent",
    prefix: "$",
    suffix: "/ mo",
    hint: "Expected gross monthly rental income",
    step: 50,
    min: 0,
    max: 20000,
    sliderMin: 500,
    sliderMax: 10000,
    sliderStep: 50,
  },
  {
    label: "Vacancy Rate",
    key: "vacancyRate",
    suffix: "%",
    hint: "% of time property sits vacant (typically 5–10%). Reduces effective rent.",
    step: 1,
    min: 0,
    max: 100,
    sliderMin: 0,
    sliderMax: 20,
    sliderStep: 1,
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
    max: 5000,
    sliderMin: 0,
    sliderMax: 1000,
    sliderStep: 10,
  },
  {
    label: "Annual Maintenance",
    key: "annualMaintenance",
    prefix: "$",
    suffix: "/ yr",
    hint: "Yearly maintenance budget (~1–2% of home price is typical)",
    step: 100,
    min: 0,
    max: 100000,
    sliderMin: 0,
    sliderMax: 25000,
    sliderStep: 100,
  },
  {
    label: "Property Tax",
    key: "propertyTaxPercentage",
    suffix: "% / yr",
    hint: "Annual property tax as % of home price",
    step: 0.05,
    min: 0,
    max: 5,
    sliderMin: 0,
    sliderMax: 3,
    sliderStep: 0.05,
  },
  {
    label: "Annual Property Tax $",
    key: "annualPropertyTax",
    prefix: "$",
    suffix: "/ yr",
    hint: "Alternative: enter dollar amount directly (syncs with % above)",
    step: 100,
    min: 0,
    max: 100000,
    sliderMin: 0,
    sliderMax: 30000,
    sliderStep: 100,
  },
  {
    label: "Prop. Mgmt Fee",
    key: "propertyManagementFeePercentage",
    suffix: "% of rent",
    hint: "Property manager fee as % of effective rent (typically 8–12%)",
    step: 0.5,
    min: 0,
    max: 50,
    sliderMin: 0,
    sliderMax: 20,
    sliderStep: 0.5,
  },
  {
    label: "Closing Costs",
    key: "closingCosts",
    prefix: "$",
    hint: "One-time costs to close the purchase (2–5% of price is typical)",
    step: 500,
    min: 0,
    max: 200000,
    sliderMin: 0,
    sliderMax: 50000,
    sliderStep: 500,
  },
  {
    label: "Initial Repairs",
    key: "initialRepairs",
    prefix: "$",
    hint: "Upfront repairs/renovations before renting",
    step: 500,
    min: 0,
    max: 200000,
    sliderMin: 0,
    sliderMax: 50000,
    sliderStep: 500,
  },
  {
    label: "Custom Appreciation",
    key: "customAppreciationRate",
    suffix: "% / yr",
    hint: "Your expected annual appreciation rate — adds a custom column to the Equity ROI table",
    step: 0.5,
    min: 0,
    max: 50,
    sliderMin: 0,
    sliderMax: 10,
    sliderStep: 0.5,
  },
];

const Tooltip = ({ text }) => (
  <span className="tooltip-wrap">
    <span className="tooltip-icon">?</span>
    <span className="tooltip-box">{text}</span>
  </span>
);

const Field = ({
  label, fieldKey, prefix, suffix, hint,
  step, min, max,
  sliderMin, sliderMax, sliderStep,
  value, onChange, error,
}) => {
  const pct = sliderMin !== undefined && sliderMax !== undefined
    ? Math.min(100, Math.max(0, ((value - sliderMin) / (sliderMax - sliderMin)) * 100))
    : 0;

  return (
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
      {sliderMin !== undefined && (
        <div className="field-slider-wrap">
          <input
            type="range"
            min={sliderMin}
            max={sliderMax}
            step={sliderStep}
            value={Math.min(sliderMax, Math.max(sliderMin, value))}
            onChange={(e) => onChange(fieldKey, e.target.value)}
            className="field-slider"
            style={{ "--pct": `${pct}%` }}
          />
          <div className="slider-bounds">
            <span>{prefix}{sliderMin.toLocaleString()}{suffix && suffix.replace("/ mo","").replace("/ yr","").replace("% / yr","").replace("% of rent","").trim()}</span>
            <span>{prefix}{sliderMax.toLocaleString()}{suffix && suffix.replace("/ mo","").replace("/ yr","").replace("% / yr","").replace("% of rent","").trim()}</span>
          </div>
        </div>
      )}
      {error && <div className="field-error">{error}</div>}
    </div>
  );
};

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

      <div className="input-section-label" style={{ marginTop: 24 }}>Expenses &amp; Costs</div>
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
