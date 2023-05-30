import { ChevronDownIcon } from "@heroicons/react/outline";
import { FC, useEffect, useRef, useState } from "react";
import CreateTextInput from "../TextInput";

export interface Option {
  value: string;
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
  const [query, setQuery] = useState(value);
  const [showOptions, setShowOptions] = useState(false);
  const filteredOptions =
    !searchEnabled || query === ""
      ? options
      : options.filter(option => {
          return option.value.toLowerCase().includes(query.toLowerCase());
        });

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

  const handleOptionClick = (option: string) => {
    setQuery(option);
    setShowOptions(false);
    onChange?.(option);
  };

  const handleIconClick = () => {
    // Only toggle `showOptions` if there are matching options
    if (filteredOptions.length > 0) {
      setShowOptions(!showOptions);
    } else {
      // Ensure `showOptions` is false if there are no matching options
      setShowOptions(false);
    }
  };

  return (
    <div className="flex relative" ref={wrapperRef}>
      <CreateTextInput
        value={query}
        readOnly={!searchEnabled}
        className={className}
        onChange={value => handleInputChange(value)}
        placeholder="eg. “hackathon,” “bounty,” “election”"
      />
      <ChevronDownIcon className="w-5 cursor-pointer -ml-[20px]" onClick={handleIconClick} />
      {showOptions && (
        <ul
          className={`flex flex-col absolute z-10 mt-14 list-none bg-true-black  border border-primary-10 rounded-[10px] overflow-x-clip animate-appear ${className}`}
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
              {option.value}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CreateDropdown;
