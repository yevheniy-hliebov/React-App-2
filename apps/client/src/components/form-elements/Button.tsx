import React from 'react'
import { SvgType } from '../icons';

type ButtonProps = {
  icon?: SvgType;
  variant?: 'fill' | 'border';
  type?: "submit" | "reset" | "button";
  className?: string;
  classNameIcon?: string;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void
  children?: React.ReactNode;
};

const className = 'shrink-0 flex gap-[7px] items-center justify-center rounded-[3px] active:translate-y-[0.5px] transition-all text-[20px] max-sm:text-[18px] leading-6 select-none'

const buttonStyles = {
  fill: className + ' bg-gray-500 px-[20px] py-[10px] hover:bg-gray-600 active:bg-gray-700 text-gray-50 max-sm:px-[10px] max-sm:py-[5px]',
  border: className + ' border-[1px] border-slate-200 px-[19px] py-[9px] hover:bg-gray-200 active:bg-gray-300 max-sm:px-[9px] max-sm:py-[4px]'
};

const Button: React.FunctionComponent<ButtonProps> = ({ icon: Icon, variant = 'fill', type = 'button', onClick, className = '', classNameIcon = '', children }) => {
  const buttonStyle = buttonStyles[variant];

  return (
    <button type={type} className={buttonStyle + ' ' + className} onClick={onClick}>
      {Icon && <Icon className={`fill-${variant === 'fill' ? 'gray-50' : 'zinc-800'} size-[28px] ${classNameIcon}`} />}
      {children}
    </button>
  )
}

export default Button