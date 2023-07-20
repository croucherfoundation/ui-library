import styled from "styled-components";
import { type Style } from "../../types/section.t";

interface StyledSectionProps {
  style: Style;
}

export const StyledSection = styled.div<StyledSectionProps>`
  background-color: ${(props) => props.style.background.normal.bgColor};

  @media (min-width: 0px) {
    padding-top: ${(props) => props?.style?.padding?.sm?.paddingTop}px;
    padding-right: ${(props) => props?.style?.padding?.sm?.paddingRight}px;
    padding-bottom: ${(props) => props?.style?.padding?.sm?.paddingBottom}px;
    padding-left: ${(props) => props?.style?.padding?.sm?.paddingLeft}px;
  }
  @media (min-width: 425px) {
    padding-top: ${(props) => props?.style?.padding?.md?.paddingTop}px;
    padding-right: ${(props) => props?.style?.padding?.md?.paddingRight}px;
    padding-bottom: ${(props) => props?.style?.padding?.md?.paddingBottom}px;
    padding-left: ${(props) => props?.style?.padding?.md?.paddingLeft}px;
  }
  @media (min-width: 768px) {
    padding-top: ${(props) => props?.style?.padding?.lg?.paddingTop}px;
    padding-right: ${(props) => props?.style?.padding?.lg?.paddingRight}px;
    padding-bottom: ${(props) => props?.style?.padding?.lg?.paddingBottom}px;
    padding-left: ${(props) => props?.style?.padding?.lg?.paddingLeft}px;
  }
`;
