import { JPY, XAU, XAG, USD, BTC } from "../data/currencies";

// All calculations assume that account currency is in USD

const twoDecimalCurrencies = [JPY, XAU, XAG];

export const shouldCalculateAsIs = (
  baseCurrency: string,
  quoteCurrency: string
) => {
  const currLower = [baseCurrency.toLowerCase(), quoteCurrency.toLowerCase()];
  if (
    currLower.includes("btc") ||
    currLower.some((curr) => curr.includes("volatility"))
  ) {
    return true;
  }
  return false;
};

export const calculatePipDifference = (
  price1: number,
  price2: number,
  pipSizeDecimalPlaces = 4
) => {
  const diff = price1 - price2;
  const absoluteDiff = Math.abs(diff);
  const multiplier = 10 ** pipSizeDecimalPlaces;
  const pipDiff = absoluteDiff * multiplier;
  return Number(pipDiff.toFixed(2));
};

export const getPipSizeInDecimalPlaces = (
  baseCurrency: string,
  quoteCurrency: string
) => {
  //   if (shouldCalculateAsIs(baseCurrency, quoteCurrency)) {
  //     return 0;
  //   }
  return [baseCurrency, quoteCurrency].some((currency) =>
    twoDecimalCurrencies.includes(currency)
  )
    ? 2
    : 4;
};

export const getStandardLotInUnits = (
  baseCurrency: string,
  quoteCurrency: string
) => {
  const currencyList = [baseCurrency, quoteCurrency];
  if (currencyList.includes(BTC)) {
    return 1;
  }
  if (currencyList.includes(XAU) || currencyList.includes(XAG)) {
    return 100;
  }
  return 100_000;
};

// Pip value is fixed = $10 per standard lot when USD is the quote currency
// Lot Size (in standard lots)=risk in dollars/(pips to SL * Pip Value Per standard lot)
// standard lot = 100,000 units = 1 lot on MT5

// pip Value in account currency = ((pip size(d.p) * lot size in units) * conversion rate to account currency) / quote currency to account currency
// Pip Size: usually 0.0001 for most pairs, 0.01 for JPY pairs

// Lot Size: e.g., 100,000

// Exchange Rate: current price of the pair

// Conversion Rate: if quote currency ≠ your account currency
// where exchange rate is the current price of the pair

export const pipValueCalculator = (
  baseCurrency: string,
  quoteCurrency: string,
  baseToQuoteExchangeRate: number
  //   accountCurrency: string = "USD"
) => {
  //  This function cannot work for pairs with no USD in them
  const pipSizeInDP = getPipSizeInDecimalPlaces(baseCurrency, quoteCurrency);
  const lotSizeInUnits = getStandardLotInUnits(baseCurrency, quoteCurrency);
  const decimalPlaces = 1 / 10 ** pipSizeInDP;
  if (quoteCurrency !== USD) {
    const result =
      (decimalPlaces * lotSizeInUnits * 1) / baseToQuoteExchangeRate;
    return result;
  } else {
    const result = decimalPlaces * lotSizeInUnits * 1;
    return result;
  }
};

export const calculateLotSize = (params: {
  baseCurrency: string;
  quoteCurrency: string;
  baseToQuoteExchangeRate: number;
  riskInUSD: number;
  pipsToSL: number;
}) => {
  // const currencyList = [baseCurrency, quoteCurrency]
  // if(currencyList.includes(BTC)){
  //     return riskInUSD/
  // }
  const {
    baseCurrency,
    quoteCurrency,
    baseToQuoteExchangeRate,
    riskInUSD,
    pipsToSL,
  } = params;
  const pipValue = pipValueCalculator(
    baseCurrency,
    quoteCurrency,
    baseToQuoteExchangeRate
  );
  const result = riskInUSD / (pipsToSL * pipValue);
  //   return Number(result.toFixed(2));
  return result;
};
