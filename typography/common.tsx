import clsx from "clsx";
import { BaseTextContainer, TextColor, textAlignment } from "./types";
import localFont from "next/font/local";

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

export const marrSans = localFont({
  src: [
    {
      path: "../fonts/MarrSans-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/MarrSans-Semibold.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../fonts/MarrSans-Semibold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../fonts/MarrSans-RegularItalic.otf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../fonts/MarrSans-SemiboldItalic.otf",
      weight: "600",
      style: "italic",
    },
    {
      path: "../fonts/MarrSans-BoldItalic.otf",
      weight: "700",
      style: "italic",
    },
  ],
});

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
        marrSans.className,
        mapTextAlignClass(textAlign),
        toggleTextColor(color)
      )}
      {...props}
    >
      {children}
    </div>
  );
};
