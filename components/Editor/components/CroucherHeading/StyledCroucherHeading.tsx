import styled from "styled-components";

const StyledComponentHeading = styled.p`
  position: relative;
  font-weight: 600;

  &::before {
    content: "";
    position: absolute;
    background-color: #ee3a43;
  }

  @media (min-width: 0px) {
    font-size: 28px;
    margin-left: 18px;
    &::before {
      height: calc(100% - 19px);
      left: -18px;
      top: 7px;
      width: 7px;
    }
  }

  @media (min-width: 425px) {
    font-size: 36px;
    &::before {
      height: calc(100% - 27px);
      width: 11px;
    }
  }

  @media (min-width: 768px) {
    font-size: 36px;
    margin-left: 23px;
    &::before {
      left: -23px;
      height: calc(100% - 26px);
      width: 11px;
      top: 10px;
    }
  }
`;

export default StyledComponentHeading;
