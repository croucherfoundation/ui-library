import styled from "styled-components";
import { type Option } from "../../types/section.t";

export const StyledSection = styled.div<{ option: Option }>`
  border-radius: 5px;
  overflow: hidden;

  @media (min-width: 0px) {
    max-width: ${(props) =>
      `${props.option.maxWidth.sm}${props.option.unit.sm}`};
    margin-left: auto;
    margin-right: auto;
  }

  @media (min-width: 425px) {
    max-width: ${(props) =>
      `${props.option.maxWidth.md}${props.option.unit.md}`};
    margin-left: auto;
    margin-right: auto;
  }

  @media (min-width: 768px) {
    max-width: ${(props) =>
      `${props.option.maxWidth.lg}${props.option.unit.lg}`};
    margin-left: auto;
    margin-right: auto;
  }
`;
