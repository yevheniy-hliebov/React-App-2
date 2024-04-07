import React, { useEffect, useRef, useState } from 'react';
import { MoreVertIcon } from './icons';

export type ContextMenuOption = {
  label: string;
  icon?: React.ReactNode;
}

interface ContextMenuProps {
  options: ContextMenuOption[];
  onSelect: (option: ContextMenuOption) => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({ options, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const refMenu = useRef<HTMLDivElement>(null);

  const toggleContextMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option: ContextMenuOption) => {
    onSelect(option);
    setIsOpen(false);
  };

  // close contextmenu if click outside
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
    <div ref={ref} className="context-menu relative w-full text-left">
      <div className="options flex">
        <button type='button' className="options" onClick={toggleContextMenu}>
          <MoreVertIcon />
        </button>
      </div>

      {isOpen && (
        <div ref={refMenu} className='origin-top-left right-0 absolute z-[10] mt-2 w-[205px] rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none'>
          <div className="py-[12px]">
            {options.map((option) => (
              <button
                key={option.label}
                className={`flex gap-[5px] items-center w-full px-[15px] py-[7px] text-[20px] ${option.label === 'Delete' ? "text-red-500" : "text-gray-700"} hover:bg-gray-200`}
                onClick={() => handleOptionClick(option)}>
                <div className={`${option.label === 'Delete' ? "text-red-500" : "text-gray-400"}`}>
                  {option.icon}
                </div>
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContextMenu;
