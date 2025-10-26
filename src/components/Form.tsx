import { Controller, useForm } from "react-hook-form";
import type {
  CurrencyPair,
  TakeProfitAnalysis,
  TradeActionType,
} from "../types";
import Select from "./Select";
import InputNumber from "./InputNumber";
import instruments from "../data/pairs.ts";
import {
  calculateLotSize,
  calculatePipDifference,
  pipValueCalculator,
} from "../utils/calculations";
import { useState } from "react";
import { Result } from "./Result.tsx";
import type { TradeAnalysis } from "../types";

type Option = CurrencyPair | null;

interface FormValues {
  currency: Option;
  entryPrice: number;
  stopLoss: number;
  riskAmount: number;
  takeProfit: number;
  takeProfit2?: number;
  takeProfit3?: number;
}

const validators = {
  requiredOption: (value: Option) => {
    if (!value?.value) {
      return "Please provide an option";
    }
    return true;
  },
  requiredAmount: (value: number | null) => {
    if (!value) {
      return "Please provide value";
    }
    return true;
  },
};

const orderedInstruments = instruments.sort((a, b) =>
  a.label.localeCompare(b.label)
);

const Form = () => {
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [tradeAnalysis, setTradeAnalysis] = useState<TradeAnalysis | null>(
    null
  );
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const calculateTakeProfitAnalysis = (params: {
    baseCurrency: string;
    quoteCurrency: string;
    entryPrice: number;
    takeProfit: number;
    decimalPlaces: number;
    lotSize: number;
  }) => {
    const { baseCurrency, quoteCurrency, entryPrice, takeProfit } = params;
    const decimalPlaces = params.decimalPlaces;
    const halfWayPoint = (takeProfit + entryPrice) / 2;
    const fullTPPips = calculatePipDifference(
      takeProfit,
      entryPrice,
      decimalPlaces
    );
    const halfTPPips = calculatePipDifference(
      takeProfit,
      halfWayPoint,
      decimalPlaces
    );
    // assume buy
    return {
      halfWayPoint,
      halfWayProfit:
        pipValueCalculator(baseCurrency, quoteCurrency, entryPrice) *
        halfTPPips *
        params.lotSize,
      fullProfit:
        pipValueCalculator(baseCurrency, quoteCurrency, entryPrice) *
        fullTPPips *
        params.lotSize,
    };
  };

  const onSubmit = (values: FormValues) => {
    if (values.currency) {
      let pipsToSL = 0;
      const diff = values.entryPrice - values.stopLoss;
      let actionType: TradeActionType = "BUY";
      const decimalPlaces = values.currency!.decimalPlaces || 4;
      pipsToSL = calculatePipDifference(
        values.entryPrice,
        values.stopLoss,
        decimalPlaces
      );
      if (diff < 0) {
        actionType = "SELL";
      }
      const lotSize = calculateLotSize({
        baseCurrency: values.currency!.baseCurrency,
        quoteCurrency: values.currency!.quoteCurrency,
        riskInUSD: values.riskAmount,
        baseToQuoteExchangeRate: values.entryPrice,
        pipsToSL,
      });
      const tps = [
        values.takeProfit,
        values.takeProfit2,
        values.takeProfit3,
      ].filter(Boolean);
      const takeProfitAnalysis: TakeProfitAnalysis[] = tps.map((tp) => {
        const analysis = calculateTakeProfitAnalysis({
          baseCurrency: values.currency!.baseCurrency,
          quoteCurrency: values.currency!.quoteCurrency,
          entryPrice: values.entryPrice,
          takeProfit: tp!,
          decimalPlaces: values.currency!.decimalPlaces || 4,
          lotSize,
        });
        return {
          fullProfit: analysis.fullProfit,
          halfProfit: analysis.halfWayProfit,
          halfProfitPrice: analysis.halfWayPoint,
          price: tp!,
        };
      });

      setTradeAnalysis({
        tradeAction: actionType,
        currency: values.currency.label,
        entryPrice: values.entryPrice,
        riskAmount: values.riskAmount,
        stopLoss: values.stopLoss,
        takeProfitAnalyses: takeProfitAnalysis,
        recommendedLotSize: lotSize,
      });
      setShowAnalysis(true);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-8">
          {/* instrument */}
          <Controller
            control={control}
            name="currency"
            rules={{ validate: validators.requiredOption }}
            render={({ field }) => (
              <Select
                label="Instrument"
                options={orderedInstruments}
                onChange={field.onChange}
                error={errors.currency?.message?.toString()}
                value={field.value}
              />
            )}
          />

          {/* current price */}
          <Controller
            control={control}
            name="entryPrice"
            rules={{ validate: validators.requiredAmount }}
            render={({ field }) => (
              <InputNumber
                label="Entry Price"
                onChange={field.onChange}
                error={errors.entryPrice?.message}
                value={field.value}
              />
            )}
          />

          {/* stop loss */}
          <Controller
            control={control}
            rules={{ validate: validators.requiredAmount }}
            name="stopLoss"
            render={({ field }) => (
              <InputNumber
                label="Stop Loss"
                onChange={field.onChange}
                error={errors.stopLoss?.message}
                value={field.value}
              />
            )}
          />

          {/* risk amount */}
          <Controller
            control={control}
            rules={{ validate: validators.requiredAmount }}
            name="riskAmount"
            render={({ field }) => (
              <InputNumber
                label="Risk Amount ($)"
                onChange={field.onChange}
                error={errors.riskAmount?.message}
                value={field.value}
              />
            )}
          />

          {/* take profit 1 */}
          <Controller
            control={control}
            name="takeProfit"
            render={({ field }) => (
              <InputNumber
                label="Take Profit"
                onChange={field.onChange}
                error={errors.takeProfit?.message}
                value={field.value}
              />
            )}
          />

          {/* take profit 2 */}
          <Controller
            control={control}
            name="takeProfit2"
            render={({ field }) => (
              <InputNumber
                label="Take Profit 2"
                onChange={field.onChange}
                error={errors.takeProfit2?.message}
                value={field.value}
              />
            )}
          />

          {/* take profit 3 */}
          <Controller
            control={control}
            name="takeProfit3"
            render={({ field }) => (
              <InputNumber
                label="Take Profit 3"
                onChange={field.onChange}
                error={errors.takeProfit3?.message}
                value={field.value}
              />
            )}
          />

          <button
            type="submit"
            className="flex w-full py-3 px-5 items-center justify-center font-medium text-white hover:text-teal-900 border border-teal-900 hover:border-lime-500 bg-teal-900 hover:bg-lime-500 rounded-full transition duration-200"
          >
            <span className="mr-2">Submit</span>
            <svg
              width="21"
              height="20"
              viewBox="0 0 21 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5.25 10H15.75"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
              <path
                d="M10.5 4.75L15.75 10L10.5 15.25"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </svg>
          </button>
        </div>
      </form>
      <Result
        open={showAnalysis}
        onClose={() => setShowAnalysis(false)}
        data={tradeAnalysis}
      />
    </div>
  );
};

export default Form;
