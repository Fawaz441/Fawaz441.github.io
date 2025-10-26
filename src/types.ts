export type GenericOption = {
  label: string;
  value: string | number;
} & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

export type CurrencyPair = GenericOption & {
  baseCurrency: string;
  quoteCurrency: string;
};

export interface TakeProfitAnalysis {
  price: number;
  fullProfit: number;
  halfProfit: number;
  halfProfitPrice: number;
}

export type TradeActionType = "BUY" | "SELL";

export interface TradeAnalysis {
  tradeAction: TradeActionType;
  currency: string;
  entryPrice: number;
  riskAmount: number;
  stopLoss: number;
  takeProfitAnalyses: TakeProfitAnalysis[];
  recommendedLotSize: number;
}
