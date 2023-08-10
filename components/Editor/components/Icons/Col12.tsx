import { ColProps } from "../../types/croucher.t";

const Col12 = (props: ColProps) => {
  return (
    <svg
      className={props?.className || ""}
      width="150"
      height="38"
      viewBox="0 0 150 38"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="150" height="38" rx="2" />
    </svg>
  );
};

export default Col12;
