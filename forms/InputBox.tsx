import { getErrorByName } from "../utils/form";
import clsx from "clsx";
import { ReactNode } from "react";
import { UseFormRegisterReturn, useFormContext } from "react-hook-form";

interface InputBoxProps {
  label: string | ReactNode | ReactNode[];
  name: string;
  defaultValue?: string;
  required?: boolean;
}

const defaultInputStyles =
  "bg-white border-none px-2 w-full card-rounded text-black card-rounded transition-all duration-[1s] ease-in-out h-[40px]";

const InputBox: React.FC<InputBoxProps> = ({
  label,
  name,
  defaultValue,
  required
}) => {

  const {
    register,
  } = useFormContext();
  const inputRegister = register(name, {
    required: {
      value: required ? required : false,
      message: "hello"
    }
  })
  return (
    <>
      <label className="relative w-full flex flex-col md:flex-row">{label}</label>
      <div className="relative w-full inline-block text-left">
        <input
          type="text"
          {...inputRegister}
          className={clsx(
            defaultInputStyles,
            // (label == "*Email" || label == "*Area code") && !noMargin && "mt-[24px]",
            ""
          )}
          defaultValue={defaultValue ? defaultValue : ""}
        />
      </div>
    </>
  );
};

export default InputBox;
