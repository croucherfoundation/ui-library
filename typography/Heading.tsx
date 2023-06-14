import * as React from "react";
import { BaseTextType, HeaderContainerType, HeaderTextType } from "./types";
import { BaseContainer, toggleTextColor } from "./common";
import clsx from "clsx";



/** @description font-size: 46px, line-height: 46px, font-family: Marr Sans, font-weight: 600 */
export const HeadingOne: BaseTextType = ({ children, className, ...props }) => {
  return (
    <BaseContainer color={props?.color} textAlign={props?.textAlign}>
      <h1 className={clsx("text-[46px] leading-[46px] font-[600]", className)} {...props}>
        {children}
      </h1>{" "}
    </BaseContainer>
  );
};




/** @description font-size: 36px, line-height: 28px, font-family: Marr Sans, font-weight: 600 */
export const HeadingTwo: BaseTextType = ({ children, className, ...props }) => {
    return (
      <BaseContainer color={props?.color} textAlign={props?.textAlign}>
        <h2 className={clsx("text-[36px] leading-[28px] font-[600]", className)} {...props}>
          {children}
        </h2>{" "}
      </BaseContainer>
    );
  };






