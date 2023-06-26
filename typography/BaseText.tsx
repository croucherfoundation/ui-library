import clsx from "clsx";
import React from "react";
import { BaseTextContainer, BaseTextType } from "./types";
import {
  BaseContainer,
  mapTextAlignClass,
  toggleTextColor,
} from "./common";

/** @description font-size: 20px, line-height: 28px, font-family: Marr Sans, font-weight: 400 */
export const BaseMd: BaseTextType = ({ children, className, ...props }) => {
  return (
    <BaseContainer color={props?.color} textAlign={props?.textAlign}>
      {" "}
      <p
        className={clsx("text-[20px] leading-[28px] lg:text-base", className)}
        {...props}
      >
        {children}
      </p>{" "}
    </BaseContainer>
  );
};
