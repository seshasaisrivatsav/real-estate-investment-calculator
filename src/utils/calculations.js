
const calculateEverything = ({
  homePrice,
  downpaymentPercentage,
  interestRate,
  loanTerm,
  estimatedRent,
  hoa,
  annualMaintenance,
  propertyTaxPercentage,
  propertyManagementFeePercentage,
  closingCosts,
  initialRepairs,
  vacancyRate = 5,
  customAppreciationRate = 3,
}) => {
  const downpayment = (homePrice * downpaymentPercentage) / 100;
  const loanPrincipal = homePrice * (1 - downpaymentPercentage / 100);

  const amortization = calculateAmortization(loanPrincipal, interestRate, loanTerm);
  const totalExpenses = calculateExpenses({
    estimatedRent,
    homePrice,
    hoa,
    propertyTaxPercentage,
    monthlyPayment: amortization[0].monthlyPayment,
    annualMaintenance,
    propertyManagementFeePercentage,
    vacancyRate,
  });
  const cashFlow = calculateCashFlow(totalExpenses);
  const initialCosts = closingCosts + initialRepairs + downpayment;
  const equityROI = calculateROI({ homePrice, annualCashFlow: cashFlow.yearlyCashFlow, initialCosts, customAppreciationRate });
  const cashFlowROI = calculateCashFlowROI({ initialCosts, annualCashFlow: cashFlow.yearlyCashFlow });
  const breakEvenMonths = cashFlow.monthlyCashFlow > 0
    ? Math.ceil(initialCosts / cashFlow.monthlyCashFlow)
    : null;

  return {
    amortization,
    operatingExpenses: totalExpenses,
    cashFlow,
    equityROI,
    cashFlowROI,
    breakEvenMonths,
    initialCosts,
    customAppreciationRate,
  };
};

const calculateAmortization = (loanAmount, interestRate, loanTerm) => {
  const result = [];
  const monthlyRate = interestRate / 100 / 12;
  const numberOfPayments = loanTerm * 12;

  let balance = loanAmount;
  let month = 0;
  let totalInterestPaid = 0;
  let totalPrincipalPaid = 0;

  const monthlyPayment =
    monthlyRate === 0
      ? loanAmount / numberOfPayments
      : (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -numberOfPayments));

  while (balance > 0 && month < numberOfPayments) {
    const interestPayment = balance * monthlyRate;
    const principalPayment = monthlyPayment - interestPayment;
    balance -= principalPayment;
    if (balance < 0) balance = 0;

    totalInterestPaid += interestPayment;
    totalPrincipalPaid += principalPayment;

    if ((month + 1) % 12 === 0 || balance === 0) {
      result.push({
        year: Math.floor(month / 12) + 1,
        interestPaid: totalInterestPaid,
        principalPaid: totalPrincipalPaid,
        monthlyPayment,
        remainingBalance: balance,
      });
      totalInterestPaid = 0;
      totalPrincipalPaid = 0;
    }
    month++;
  }

  return result;
};

const calculateExpenses = ({
  estimatedRent,
  homePrice,
  hoa,
  propertyTaxPercentage,
  monthlyPayment,
  annualMaintenance,
  propertyManagementFeePercentage,
  vacancyRate = 5,
}) => {
  const effectiveMonthlyRent = estimatedRent * (1 - vacancyRate / 100);
  const monthlyVacancyLoss = estimatedRent - effectiveMonthlyRent;
  const monthlyPropertyTax = (homePrice * propertyTaxPercentage) / 100 / 12;
  const monthlyHoa = hoa;
  const monthlyMaintenance = annualMaintenance / 12;
  const monthlyMgmtFee = effectiveMonthlyRent * (propertyManagementFeePercentage / 100);
  const monthlyMortgage = monthlyPayment;

  const monthlyCosts =
    monthlyMortgage + monthlyPropertyTax + monthlyHoa + monthlyMaintenance + monthlyMgmtFee;

  return {
    monthly: {
      rent: estimatedRent,
      effectiveRent: effectiveMonthlyRent,
      vacancyLoss: monthlyVacancyLoss,
      propertyTax: monthlyPropertyTax,
      hoa: monthlyHoa,
      maintenance: monthlyMaintenance,
      propertyManagementFee: monthlyMgmtFee,
      mortgage: monthlyMortgage,
      monthlyCosts,
    },
    yearly: {
      rent: estimatedRent * 12,
      effectiveRent: effectiveMonthlyRent * 12,
      vacancyLoss: monthlyVacancyLoss * 12,
      propertyTax: homePrice * (propertyTaxPercentage / 100),
      hoa: hoa * 12,
      maintenance: annualMaintenance,
      propertyManagementFee: monthlyMgmtFee * 12,
      mortgage: monthlyMortgage * 12,
      yearlyCosts: monthlyCosts * 12,
    },
  };
};

const calculateCashFlow = (totalExpenses) => {
  const monthlyCashFlow =
    totalExpenses.monthly.effectiveRent -
    (totalExpenses.monthly.propertyTax +
      totalExpenses.monthly.hoa +
      totalExpenses.monthly.maintenance +
      totalExpenses.monthly.propertyManagementFee +
      totalExpenses.monthly.mortgage);
  return {
    monthlyCashFlow,
    yearlyCashFlow: monthlyCashFlow * 12,
  };
};

const calculateROI = ({ homePrice, annualCashFlow, initialCosts, customAppreciationRate = 3 }) => {
  const rateEntries = [
    { key: '2Percent', rate: 0.02 },
    { key: '3Percent', rate: 0.03 },
    { key: '4Percent', rate: 0.04 },
    { key: 'customPercent', rate: customAppreciationRate / 100 },
  ];
  const yearsList = [5, 10, 15];

  const res = {};
  yearsList.forEach((years) => {
    res[years] = {};
    rateEntries.forEach(({ key, rate }) => {
      const salePrice = calculateAppreciation(homePrice, years, rate);
      const sellingCosts = salePrice * 0.06; // ~6% realtor + closing fees
      const capitalGain = salePrice - homePrice - sellingCosts;
      const totalCashFlow = years * annualCashFlow;
      const roi = ((totalCashFlow + capitalGain) * 100) / initialCosts;
      res[years][key] = roi.toFixed(2);
    });
  });

  return res;
};

const calculateCashFlowROI = ({ initialCosts, annualCashFlow }) => {
  return {
    5: (100 * 5 * annualCashFlow) / initialCosts,
    10: (100 * 10 * annualCashFlow) / initialCosts,
    15: (100 * 15 * annualCashFlow) / initialCosts,
  };
};

const calculateAppreciation = (initialValue, years, appreciationRate) =>
  initialValue * Math.pow(1 + appreciationRate, years);

export { calculateAmortization, calculateEverything };
