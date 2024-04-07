import React from 'react'

const DotText: React.FunctionComponent<{ color?: string, isBold?: boolean, children: React.ReactNode }> = ({ color = 'text-black', isBold = false, children }) => { 
  return (
    <span className={`inline-flex ${isBold ? 'font-medium' : 'font-normal'} ${color}`}>
      <span className='self-start shrink-0 mr-1'>
        <span className={`inline-flex p-[1px] border-[1px] border-current rounded-full`}>
          <span className={`inline-flex size-2 bg-current rounded-full`} />
        </span>
      </span>
      {children}
    </span>
  );
};

export default DotText