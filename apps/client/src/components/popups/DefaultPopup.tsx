import React, { useEffect, useState } from 'react'
import { CloseIcon } from '../icons';

type DefaultPopupProps = {
  title?: string,
  classNameWindow?: string,
  classNameBody?: string,
  children?: React.ReactNode;
  opened?: boolean;
  handleClose?: (isOpen: boolean) => void
};

function DefaultPopup({ title, classNameBody = '', classNameWindow = '', opened = false, handleClose, children }: DefaultPopupProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(opened);
  }, [opened])

  const handleClosePopup = () => {
    setIsOpen(false);
    handleClose!(false);
  }

  return (
    <div className={`fixed z-50 inset-0 bg-black bg-opacity-25 ${isOpen ? 'visible opacity-100 pointer-events-auto' : 'invisible opacity-0 pointer-events-none'} transition-all`}>
      <div className={`window mx-auto p-10 max-w-[1350px] h-full flex flex-col items-center ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'} transition-all max-xl:p-5`}>
        <div className={`window__wrapper max-h-full inline-flex flex-col rounded-[20px] ${classNameWindow}`}>
          <div className="window__app-row w-full h-[60px] flex items-center justify-between p-[15px] bg-gray-500 rounded-t-[20px]">
            <div className="window__app-row-title text-gray-50 text-[20px] select-none">
              {title}
            </div>
            <CloseIcon onClick={handleClosePopup} className='text-gray-300 size-[33px] cursor-pointer hover:text-gray-50 active:scale-[0.9] transition-all' />
          </div>
          <div className={"window__body bg-white rounded-b-[20px] " + classNameBody}>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DefaultPopup