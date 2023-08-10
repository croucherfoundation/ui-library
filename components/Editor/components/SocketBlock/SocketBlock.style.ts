import styled from "styled-components";
import { SocketStyle} from "../../types/section.t";

const StyledSocketBlock = styled.div<{ style: SocketStyle }>`
  min-height: 50px;
  height: 100%;

  @media (min-width: 0px) {
    padding-left: ${(props) => props.style.padding.sm.paddingLeft}px;
    padding-right: ${(props) => props.style.padding.sm.paddingRight}px;
    padding-top: ${(props) => props.style.padding.sm.paddingTop}px;
    padding-bottom: ${(props) => props.style.padding.sm.paddingBottom}px;
  }

  @media (min-width: 425px) {
    padding-left: ${(props) => props.style.padding.md.paddingLeft}px;
    padding-right: ${(props) => props.style.padding.md.paddingRight}px;
    padding-top: ${(props) => props.style.padding.md.paddingTop}px;
    padding-bottom: ${(props) => props.style.padding.md.paddingBottom}px;
  }

  @media (min-width: 768px) {
    padding-left: ${(props) => props.style.padding.lg.paddingLeft}px;
    padding-right: ${(props) => props.style.padding.lg.paddingRight}px;
    padding-top: ${(props) => props.style.padding.lg.paddingTop}px;
    padding-bottom: ${(props) => props.style.padding.lg.paddingBottom}px;
  }

  
`;

export default StyledSocketBlock;
