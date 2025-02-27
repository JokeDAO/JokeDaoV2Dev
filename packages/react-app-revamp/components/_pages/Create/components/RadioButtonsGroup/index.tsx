import { Radio, RadioGroup } from "@headlessui/react";
import { ReactNode } from "react";
import { useMediaQuery } from "react-responsive";

export interface RadioOption {
  label: ReactNode;
  mobileLabel?: string;
  content?: ReactNode;
  value: any;
}

interface RadioButtonsGroupProps {
  options: RadioOption[];
  value: any;
  onChange: (value: any) => void;
  className?: string;
}

const CreateRadioButtonsGroup = ({ options, value, onChange, className = "" }: RadioButtonsGroupProps) => {
  const isMobile = useMediaQuery({ maxWidth: 768 });

  return (
    <RadioGroup value={value} onChange={onChange} className={className}>
      <div className="flex flex-col gap-4">
        {options.map((option, index) => (
          <Radio key={index} value={option.value}>
            {({ checked }) => (
              <div className={`transition-all duration-200 ${!checked ? "cursor-pointer" : ""}`}>
                <div className="flex gap-4 items-center">
                  <div
                    className={`relative flex items-center justify-center w-6 h-6 rounded-full transition-colors ${
                      checked ? "border-0" : "border border-neutral-9"
                    }`}
                  >
                    {checked && (
                      <>
                        <div className="absolute w-6 h-6 border-2 border-secondary-11 rounded-full"></div>
                        <div className="absolute w-4 h-4 bg-secondary-9 rounded-full"></div>
                      </>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <p className={`text-[20px] ${checked ? "text-neutral-11" : "text-neutral-9"}`}>
                      {isMobile && option.mobileLabel ? option.mobileLabel : option.label}
                    </p>
                  </div>
                </div>
                {option.content && (
                  <div
                    className={`mt-4 transition-opacity duration-200 ${
                      checked ? "opacity-100" : "opacity-20 pointer-events-none"
                    }`}
                  >
                    {option.content}
                  </div>
                )}
              </div>
            )}
          </Radio>
        ))}
      </div>
    </RadioGroup>
  );
};

export default CreateRadioButtonsGroup;
