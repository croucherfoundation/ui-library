import clsx from "clsx";
import { HeadingOne } from "../typography/Heading";
import { ReactNode } from "react";

interface TitleProps {
  children: ReactNode | ReactNode[] | undefined;
  beforeTop?: string;
  beforeHeight?: string;
}

const Title: React.FC<TitleProps> = ({
  children,
  beforeTop = "-1.3px",
  beforeHeight = "2.3rem",
}) => {
  return (
    <div
      style={
        {
          "--before-height": beforeHeight,
          "--before-top": beforeTop,
        } as React.CSSProperties
      }
      className={clsx(
        "relative flex items-center before:absolute before:content-['*'] before:text-transparent before:w-[11px] before:bg-sym-public-red before:top-[--before-top] before:left-0 before:h-[--before-height]"
      )}
    >
      <div className={clsx("ml-[25px]")}>{children}</div>
    </div>
  );
};

export default Title;
