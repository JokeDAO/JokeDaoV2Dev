import { ChevronDownIcon } from "@heroicons/react/outline";
import { FC, useEffect, useRef, useState } from "react";
import CreateTextInput from "../TextInput";

export interface Option {
  value: string;
  label: string;
  disabled?: boolean;
}

interface CreateDropdownProps {
  value: string;
  options: Option[];
  searchEnabled?: boolean;
  className?: string;
  onChange?: (option: string) => void;
  onMenuStateChange?: (state: boolean) => void;
}

const CreateDropdown: FC<CreateDropdownProps> = ({
  value,
  options,
  searchEnabled = true,
  className,
  onChange,
  onMenuStateChange,
}) => {
  // Initial query state is set to the label of the option matching the value prop
  const [query, setQuery] = useState(options.find(option => option.value === value)?.label || value);
  const [showOptions, setShowOptions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    onMenuStateChange?.(showOptions);
  }, [showOptions, onMenuStateChange]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredOptions =
    !searchEnabled || query === ""
      ? options
      : options.filter(
          option =>
            option.label.toLowerCase().includes(query.toLowerCase()) ||
            option.value.toLowerCase().includes(query.toLowerCase()),
        );

  const handleInputChange = (value: string) => {
    if (searchEnabled) {
      setQuery(value);
      onChange?.(value);
      const matchingOptions = options.filter(option => option.value.toLowerCase().startsWith(value.toLowerCase()));
      if (value !== "" && matchingOptions.length > 0) {
        setShowOptions(true);
      } else {
        setShowOptions(false);
      }
    }
  };

  const handleOptionClick = (optionValue: string) => {
    const selectedOption = options.find(option => option.value === optionValue);
    if (selectedOption) {
      setQuery(selectedOption.label);
      setShowOptions(false);
      onChange?.(selectedOption.value);
    }
  };

  const handleDropdownMenu = () => {
    if (filteredOptions.length > 0) {
      setShowOptions(!showOptions);
    } else {
      setShowOptions(false);
    }
  };

  return (
    <div className="flex relative" ref={wrapperRef}>
      <CreateTextInput
        value={query}
        readOnly={!searchEnabled}
        className={className}
        onClick={handleDropdownMenu}
        onChange={value => handleInputChange(value)}
        placeholder="select an option or type your own"
      />
      <ChevronDownIcon className="w-5 cursor-pointer -ml-[35px]" onClick={handleDropdownMenu} />
      {showOptions && (
        <ul
          className={`flex flex-col absolute z-10 mt-14 list-none bg-true-black border border-neutral-11 rounded-[10px] overflow-x-clip animate-appear ${className}`}
        >
          {filteredOptions.map(option => (
            <li
              className={`pl-4 pt-2 pb-2 text-neutral-11 text-[18px] cursor-pointer 
              ${
                option.disabled
                  ? "opacity-50 pointer-events-none"
                  : "hover:bg-neutral-3 transition-colors duration-300 ease-in-out"
              }`}
              key={option.value}
              onClick={() => handleOptionClick(option.value)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CreateDropdown;
