import React, { useEffect, useRef, useState } from 'react';
import { ArrowDownIcon } from '../icons';

export type DropdownOption = {
  label: string;
  value: string | number;
}

type DropdownProps = {
  label: string | null | undefined;
  options: DropdownOption[];
  className?: string;
  onSelect: (option: DropdownOption) => void;
}

const Dropdown: React.FC<DropdownProps> = ({ label, className = '', options, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option: DropdownOption) => {
    onSelect(option);
    setIsOpen(false);
  };

  // close dropdown if click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref]);

  return (
    <div ref={ref} className="relative w-full text-left">
      <button
        type="button"
        className={"relative z-[1] flex items-center justify-between w-full px-4 py-2 bg-gray-200 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-gray-500 " + className}

        onClick={toggleDropdown}
      >
        {label}
        <ArrowDownIcon className={`${isOpen ? 'rotate-180' : 'rotate-0'} transition-all`} />
      </button>

      {isOpen && (
        <div className="origin-top-right z-[2] absolute left-0 w-full">
          <div className="max-h-[188px] mt-2 mb-3 overflow-y-auto rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none">
            <div className="py-1">
              {options.map((option) => (
                <button
                  key={option.value}
                  className="flex w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 hover:text-gray-900"
                  onClick={() => handleOptionClick(option)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
