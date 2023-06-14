import clsx from "clsx";
import { ReactNode } from "react";

interface DefaultButtonProps {
  children: ReactNode | ReactNode[] | undefined;
  className?: string;
}

export const DefaultButton: React.FC<DefaultButtonProps> = ({
  children,
  className,
}) => {
  return (
    <button
      type="submit"
      className={clsx(
        "rounded-full border-[1px] border-black flex justify-center pt-[10px] h-[40px] text-center text-[18px] leading-[21.6px] font-[600] hover:bg-sym-public-red hover:border-transparent hover:text-white w-full",
        className
      )}
    >
      {children}
    </button>
  );
};
