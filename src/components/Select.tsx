import ReactSelect from "react-select";
import type { GenericOption } from "../types";

interface SelectProps {
  label: string;
  value: GenericOption | null;
  onChange: (value: GenericOption | null) => void;
  options: GenericOption[];
  error?: string;
}

const Select = ({ label, onChange, options, error, value }: SelectProps) => {
  return (
    <div className="space-y-2">
      <span className="block mb-1 text-sm font-medium">{label}</span>
      <div className="space-y-[2px]">
        <ReactSelect
          value={value}
          components={{ DropdownIndicator: null, IndicatorSeparator: null }}
          options={options}
          onChange={(value) => onChange(value)}
          classNames={{
            input() {
              return "border-none ring-offset-0 focus:ring-2 !shadow-none";
            },
            control() {
              return "border-none ring-offset-0 focus:ring-2 !shadow-none focus:!shadow-none focus:!border-none";
            },
            container() {
              const initialClassNames =
                "w-full px-4 py-3 outline-none ring-offset-0 focus:ring-2 focus:ring-lime-500 border focus:border-transparent border-[grey]/20 rounded-full";
              // let classNames = ["w-full px-4 py-3"]
              // if(.isFocused){
              //     classNames = classNames.concat()
              // }
              // return classNames.join(" ")
              return initialClassNames;
            },
            indicatorsContainer() {
              return "!p-0";
            },
          }}
        />
        {error && <span className="text-[red] bold text-[10px]">{error}</span>}
      </div>
    </div>
  );
};

export default Select;
