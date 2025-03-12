
const calculateEverything = ({
  homePrice, 
  downpaymentPercentage, 
  interestRate, 
  loanTerm, 
  estimatedRent, 
  hoa, 
  annualMaintenance, 
  propertyTaxPercentage, 
  propertyManagementFeePercentage
}) => {

  const downpayment = (homePrice*downpaymentPercentage)/100;
  // STEP 1: [ { year: 1 , interestPaid: xx, principalPaid: xx, monthlyPayment: xx}]
  const amortization = calculateAmortization( (homePrice*(100-downpaymentPercentage)/100), interestRate, loanTerm );

  // STEP 2: { monthly: {rent, propertyTax, hoa, maintenance, propertyManagementFee, mortgage}, yearly }
  const totalExpenses = calculateExpenses({estimatedRent, homePrice, hoa, 
    propertyTaxPercentage, monthlyPayment: amortization[0].monthlyPayment, annualMaintenance, propertyManagementFeePercentage});

  // STEP 3: calculate cashflow { monthlyCashFlow: xx, yaerlyCashFlow: xx }
  const cashFlow = calculateCashFlow(totalExpenses);

  // STEP 4: calculate ROI
  const equityROI = calculateROI({ homePrice, annualCashFlow: cashFlow.yearlyCashFlow, downpayment });

  // STEP 5: calculate Cashflow ROI
  const cashFlowROI = calculateCashFlowROI({ downpayment, annualCashFlow: cashFlow.yearlyCashFlow });

  return {
    amortization,
    operatingExpenses: totalExpenses,
    cashFlow,
    equityROI, 
    cashFlowROI
  }

}


const calculateAmortization = (loanAmount, interestRate, loanTerm) => {
  const result = [];
  const monthlyRate = interestRate / 100 / 12;
  const numberOfPayments = loanTerm * 12;
  
  let balance = loanAmount;
  let month = 0;
  let totalInterestPaid = 0;
  let totalPrincipalPaid = 0;

  // Monthly payment (fixed)
  const monthlyPayment = loanAmount * monthlyRate / (1 - Math.pow(1 + monthlyRate, -numberOfPayments));

  while (balance > 0 && month < numberOfPayments) {
    const interestPayment = balance * monthlyRate;
    const principalPayment = monthlyPayment - interestPayment;
    balance -= principalPayment;

    if (balance < 0) {
      balance = 0; // Ensure balance does not go below zero
    }

    totalInterestPaid += interestPayment;
    totalPrincipalPaid += principalPayment;

    // Store data annually
    if ((month + 1) % 12 === 0 || balance === 0) {
      result.push({
        year: Math.floor(month / 12) + 1,
        interestPaid: totalInterestPaid,
        principalPaid: totalPrincipalPaid,
        monthlyPayment: monthlyPayment, // Add monthly payment to each object
      });

      // Reset totals for the next year
      totalInterestPaid = 0;
      totalPrincipalPaid = 0;
    }

    month++;
  }

  return result;
};

const calculateExpenses = ({estimatedRent, homePrice, hoa, 
  propertyTaxPercentage, monthlyPayment, annualMaintenance, propertyManagementFeePercentage}) => {

  const res = {};
  res.monthly = {
    rent: estimatedRent,
    propertyTax: (homePrice*propertyTaxPercentage/100)/12,
    hoa: hoa, 
    maintenance: annualMaintenance/12, 
    propertyManagementFee: estimatedRent*propertyManagementFeePercentage/100, 
    mortgage: monthlyPayment 
  }
  res.yearly = {
    rent: estimatedRent*12,
    propertyTax: (homePrice*propertyTaxPercentage/100),
    hoa: hoa*12, 
    maintenance: annualMaintenance, 
    propertyManagementFee: 12*(estimatedRent*propertyManagementFeePercentage/100), 
    mortgage: monthlyPayment*12 
  }

  return res;

}

const calculateCashFlow = (totalExpenses) => {
  const monthlyCashFlow = totalExpenses.monthly.rent - 
                            (totalExpenses.monthly.propertyTax + 
                              totalExpenses.monthly.hoa  + 
                              totalExpenses.monthly.maintenance + 
                              totalExpenses.monthly.propertyManagementFee + 
                              totalExpenses.monthly.mortgage );
  return {
    monthlyCashFlow: monthlyCashFlow,
    yearlyCashFlow: monthlyCashFlow*12
  };                              
}

/**

Total ROI = (totalProfit/totalInvestment) *100;
totalProfit = totalCashFlow+capitalGain
capitalGain = (futureHomeValue) - (purchasePrice)
totalInvestment = downPayment+closingCosts+InitialReparirs

 */
const calculateROI = ({ homePrice, annualCashFlow, downpayment }) => {
  const appreciationRates = [0.02, 0.03, 0.04];
  const yearsList = [5, 10, 15]; 
  
  let res = {};

  yearsList.forEach(years => {
    res[years] = {};

    appreciationRates.forEach(rate => {
      const salePrice = calculateAppreciation(homePrice, years, rate);
      const capitalGain = salePrice - homePrice;
      const totalCashFlow = years * annualCashFlow;
      const roi = ((totalCashFlow + capitalGain) * 100) / downpayment;

      res[years][`${(rate * 100).toFixed(0)}Percent`] = roi.toFixed(2);
    });
  });

  return res;
};

const calculateCashFlowROI = ({downpayment, annualCashFlow}) => {
  //  const initialCosts =  DownPayment+closingcosts+remodelling;
  // const cashFlow =  annualCashFlow/initialcosts;
  const res = {};
  res['5'] = 100*(5*annualCashFlow)/downpayment;
  res['10'] = 100*(10*annualCashFlow)/downpayment;
  res['15'] = 100*(15*annualCashFlow)/downpayment;

  return res;
}

/**
 FutureValue = InitialValue  * (1+AppreciatioRate)^Years
 */
const calculateAppreciation = (initialValue, years, appreciationRate) => {
  return initialValue*Math.pow(1+appreciationRate, years);
}
  
export { calculateAmortization, calculateEverything };
  