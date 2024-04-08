import { BurgerIcon, CloseIcon } from "./icons";

const BurgerButton: React.FunctionComponent<{ isOpen: boolean, onClick: () => void, className?: string }> = ({ isOpen = false, onClick = () => { }, className = '' }) => {
  const toggleBurger = () => {
    onClick();
  };

  return (
    <button onClick={toggleBurger} className={"shrink-0 size-[30px] relative " + className}>
      <BurgerIcon className={`absolute inset-0 size-full ${isOpen ? 'opacity-0' : 'opacity-100'} transition-all`} />
      <CloseIcon className={`absolute inset-0 size-full ${!isOpen ? 'opacity-0' : 'opacity-100'} transition-all`} />
    </button>
  );
};

export default BurgerButton;
