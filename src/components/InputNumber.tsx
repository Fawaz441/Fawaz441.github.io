import { NumericFormat } from "react-number-format";

type Value = number | null | undefined;

interface InputProps {
  label: string;
  onChange: (value: Value) => void;
  error?: string;
  value: Value;
}

const InputNumber = ({ label, onChange, error, value }: InputProps) => {
  return (
    <div className="space-y-2">
      <span className="block  mb-1 text-sm font-medium">{label}</span>
      <div className="space-y-[2px]">
        <NumericFormat
          value={value}
          onValueChange={(value) => onChange(value.floatValue)}
          thousandSeparator
          className="w-full px-4 py-3 outline-none ring-offset-0 focus:ring-2 focus:ring-lime-500 border focus:border-transparent border-[grey]/20 rounded-full"
        />
        {error && <span className="text-[red] bold text-[10px]">{error}</span>}
      </div>
    </div>
  );
};

export default InputNumber;
