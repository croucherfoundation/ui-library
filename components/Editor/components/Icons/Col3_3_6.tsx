import { ColProps } from "../../types/croucher.t";

const Col3_3_6 = (props: ColProps) => {
  return (
    <svg
      width="150"
      height="39"
      viewBox="0 0 150 39"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={props?.className || ""}
    >
      <rect width="30" height="38.2653" rx="2" />
      <rect x="40" width="30" height="38.2653" rx="2" />
      <rect x="80" width="70" height="38" rx="2" />
    </svg>
  );
};

export default Col3_3_6;
