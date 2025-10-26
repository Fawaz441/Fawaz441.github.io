import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";

interface TakeProfit {
  price: number;
  halfPrice: number;
  fullProfit: number;
  halfPriceProfit: number;
}

interface TakeProfitDisplayProps {
  takeProfits: TakeProfit[];
}

const TakeProfitDisplay = ({ takeProfits }: TakeProfitDisplayProps) => {
  return (
    <TabGroup>
      <TabList>
        {takeProfits.map((_tp, index) => (
          <Tab
            key={index}
            className="text-[#00e1ff] font-bold cursor-pointer mr-4"
          >
            TP {index + 1}
          </Tab>
        ))}
      </TabList>
      <TabPanels>
        {takeProfits.map((tp, index) => (
          <TabPanel className="text-white font-bold space-y-4" key={index}>
            <div className="mt-2">
              <span className="text-sm text-white">Price: </span>
              <span className="text-base font-bold text-white">
                ${tp.price}{" "}
                <span className="text-[10px]">
                  (Profit : ${tp.fullProfit.toFixed(2)})
                </span>
              </span>
            </div>
            <div>
              <span className="text-sm text-white">50% Price: </span>
              <span className="text-base font-bold text-white">
                ${tp.halfPrice.toFixed(6)}{" "}
                <span className="text-[10px]">
                  (Profit : ${tp.halfPriceProfit.toFixed(2)})
                </span>
              </span>
            </div>
          </TabPanel>
        ))}
      </TabPanels>
    </TabGroup>
  );
};

export default TakeProfitDisplay;
