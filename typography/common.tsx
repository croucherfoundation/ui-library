import clsx from "clsx";
import { BaseTextContainer, TextColor, textAlignment } from "./types";
import { useContext } from "react";
import { FontContext } from "../providers/FontProvider";

export const mapTextAlignClass = (direction: textAlignment) => {
  switch (direction) {
    case "justify":
      return "text-justify";
    case "left":
      return "text-left";
    case "center":
      return "text-center";
    case "right":
      return "text-right";
    default:
      return "text-left";
  }
};

export function toggleTextColor(color: TextColor) {
  switch (color) {
    case "white":
      return "text-white";
    case "black":
      return "text-black";
    case "primary":
      return "text-sym-public-red";
    case "croucher-grey":
      return "text-croucher-grey";
  }
}





export const BaseContainer: React.FC<BaseTextContainer> = ({
  children,
  textAlign = "left",
  color = "black",
  ...props
}) => {

  return (
    <div
      className={clsx(
        `break-words font-normal  w-full`,
        // marrSans.className,
        mapTextAlignClass(textAlign),
        toggleTextColor(color)
      )}
      {...props}
    >
      {children}
    </div>
  );
};
