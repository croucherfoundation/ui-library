import * as React from "react";
import { BaseTextType, HeaderContainerType, HeaderTextType } from "./types";
import { BaseContainer, toggleTextColor } from "./common";
import clsx from "clsx";








/** @description font-size: 20px, line-height: 28px, font-family: Marr Sans, font-weight: 400 */
export const BaseMd: BaseTextType = ({ children, className, ...props }) => {
    return (
      <BaseContainer color={props?.color} textAlign={props?.textAlign}>
        <h2 className={clsx("text-[36px] leading-[28px] font-[600]", className)} {...props}>
          {children}
        </h2>{" "}
      </BaseContainer>
    );
  };






